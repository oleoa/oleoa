import { supabase } from "./client";
import type {
    BudgetCurrency,
    BudgetStatus,
    Client,
    Project,
    ProjectDetail,
    ProjectLink,
    ProjectLinkKind,
    ProjectStatus,
    ProjectTodo,
    ProjectType,
    Stack,
    User,
} from "./types";

const PROJECT_COLUMNS =
    "id, name, description, type, position, link, source, year, status, is_public, budget_amount, budget_currency, budget_status, client_id, updated_at";

const PROJECT_WITH_RELATIONS =
    `${PROJECT_COLUMNS}, project_stacks(position, stacks(id, name, href, image_url))`;

const PROJECT_WITH_DASHBOARD =
    `${PROJECT_COLUMNS}, clients(id, name, avatar_url, email, company, notes), project_stacks(position, stacks(id, name, href, image_url)), project_todos(done)`;

type StackRow = {
    id: string;
    name: string;
    href: string;
    image_url: string | null;
};

type ClientRow = {
    id: string;
    name: string;
    avatar_url: string | null;
    email: string | null;
    company: string | null;
    notes: string | null;
};

type ProjectStackRow = {
    position: number;
    stacks: StackRow;
};

type TodoRow = {
    id: string;
    project_id: string;
    title: string;
    done: boolean;
    position: number;
};

type LinkRow = {
    id: string;
    project_id: string;
    label: string;
    url: string;
    kind: string | null;
    position: number;
};

type ProjectRow = {
    id: string;
    name: string;
    description: string;
    type: ProjectType;
    position: number | null;
    link: string | null;
    source: string | null;
    year: string | null;
    status: ProjectStatus;
    is_public: boolean;
    budget_amount: string | number | null;
    budget_currency: BudgetCurrency;
    budget_status: BudgetStatus;
    client_id: string | null;
    project_stacks?: ProjectStackRow[];
    clients?: ClientRow | null;
    project_todos?: { done: boolean }[];
};

function toStack(s: StackRow): Stack {
    return { _id: s.id, name: s.name, href: s.href, image: s.image_url };
}

function toClient(c: ClientRow): Client {
    return {
        _id: c.id,
        name: c.name,
        avatar: c.avatar_url,
        email: c.email,
        company: c.company,
        notes: c.notes,
    };
}

function mapProject(row: ProjectRow): Project {
    const stacks = (row.project_stacks ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((ps) => toStack(ps.stacks));
    const clientRef = row.clients ? toClient(row.clients) : null;
    const todos = row.project_todos ?? [];
    const budgetAmount =
        row.budget_amount === null || row.budget_amount === undefined
            ? null
            : typeof row.budget_amount === "string"
              ? Number(row.budget_amount)
              : row.budget_amount;
    return {
        _id: row.id,
        name: row.name,
        description: row.description,
        type: row.type,
        position: row.position,
        link: row.link,
        source: row.source,
        year: row.year,
        stacks,
        status: row.status,
        isPublic: row.is_public,
        budgetAmount,
        budgetCurrency: row.budget_currency,
        budgetStatus: row.budget_status,
        clientId: row.client_id,
        clientRef,
        todosDone: todos.filter((t) => t.done).length,
        todosTotal: todos.length,
    };
}

function toTodo(t: TodoRow): ProjectTodo {
    return {
        _id: t.id,
        projectId: t.project_id,
        title: t.title,
        done: t.done,
        position: t.position,
    };
}

function toLink(l: LinkRow): ProjectLink {
    return {
        _id: l.id,
        projectId: l.project_id,
        label: l.label,
        url: l.url,
        kind: (l.kind as ProjectLinkKind | null) ?? null,
        position: l.position,
    };
}

// ---------- Stacks ----------

export async function listStacks(): Promise<Stack[]> {
    const { data, error } = await supabase()
        .from("stacks")
        .select("id, name, href, image_url")
        .order("name", { ascending: true });
    if (error) throw error;
    return (data as StackRow[]).map(toStack);
}

// ---------- Projects ----------

/** Public landing feed — only `is_public` projects, ordered by position. */
export async function listProjects(): Promise<Project[]> {
    const { data, error } = await supabase()
        .from("projects")
        .select(PROJECT_WITH_RELATIONS)
        .eq("is_public", true)
        .order("position", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as unknown as ProjectRow[]).map(mapProject);
}

/** Dashboard overview — every project, embedded client + todo-count source. */
export async function listProjectsForDashboard(): Promise<Project[]> {
    const { data, error } = await supabase()
        .from("projects")
        .select(PROJECT_WITH_DASHBOARD)
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProjectRow[]).map(mapProject);
}

export async function listProjectsByClientId(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase()
        .from("projects")
        .select(PROJECT_WITH_DASHBOARD)
        .eq("client_id", clientId)
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProjectRow[]).map(mapProject);
}

export async function getProjectById(id: string): Promise<ProjectDetail | null> {
    const { data, error } = await supabase()
        .from("projects")
        .select(
            `${PROJECT_COLUMNS},
             clients(id, name, avatar_url, email, company, notes),
             project_stacks(position, stacks(id, name, href, image_url)),
             project_todos(id, project_id, title, done, position),
             project_links(id, project_id, label, url, kind, position)`
        )
        .eq("id", id)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const row = data as unknown as Omit<ProjectRow, "project_todos"> & {
        project_todos?: TodoRow[];
        project_links?: LinkRow[];
    };

    const todosFull = (row.project_todos ?? [])
        .slice()
        .sort((a, b) => a.position - b.position);
    const linksFull = (row.project_links ?? [])
        .slice()
        .sort((a, b) => a.position - b.position);

    // Hand mapProject a row with the todo-count shape it expects.
    const project = mapProject({
        ...row,
        project_todos: todosFull.map((t) => ({ done: t.done })),
    });

    return {
        ...project,
        todos: todosFull.map(toTodo),
        links: linksFull.map(toLink),
    };
}

// ---------- Clients ----------

export async function listClients(): Promise<Client[]> {
    const { data, error } = await supabase()
        .from("clients")
        .select("id, name, avatar_url, email, company, notes")
        .order("name", { ascending: true });
    if (error) throw error;
    return (data as ClientRow[]).map(toClient);
}

export async function getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase()
        .from("clients")
        .select("id, name, avatar_url, email, company, notes")
        .eq("id", id)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return toClient(data as ClientRow);
}

// ---------- Users ----------

export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase()
        .from("users")
        .select("id, email, name, password_hash")
        .eq("id", id)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return data as User;
}
