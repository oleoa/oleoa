export type Stack = {
    _id: string;
    name: string;
    href: string;
    image: string | null;
};

export type Client = {
    _id: string;
    name: string;
    avatar: string | null;
    email: string | null;
    company: string | null;
    notes: string | null;
};

export type ClientProjectSummary = {
    _id: string;
    name: string;
    status: ProjectStatus;
    type: ProjectType;
    year: string | null;
};

export type ClientWithProjects = Client & {
    projects: ClientProjectSummary[];
};

export type ProjectTodo = {
    _id: string;
    projectId: string;
    title: string;
    done: boolean;
    position: number;
};

export type ProjectLinkKind =
    | "vercel"
    | "neon"
    | "github"
    | "docs"
    | "other";

export type ProjectLink = {
    _id: string;
    projectId: string;
    label: string;
    url: string;
    kind: ProjectLinkKind | null;
    position: number;
};

export type ProjectStatus = "active" | "complete" | "paused";
export type ProjectType = "personal" | "commercial";
export type BudgetStatus = "pending" | "partial" | "paid" | "none";
export type BudgetCurrency = "BRL" | "USD" | "EUR";

export type Project = {
    _id: string;
    name: string;
    description: string;
    type: ProjectType;
    position: number | null;
    link: string | null;
    source: string | null;
    year: string | null;
    stacks: Stack[];
    status: ProjectStatus;
    isPublic: boolean;
    budgetAmount: number | null;
    budgetCurrency: BudgetCurrency;
    budgetStatus: BudgetStatus;
    clientId: string | null;
    clientRef: Client | null;
    todosDone: number;
    todosTotal: number;
};

export type ProjectDetail = Project & {
    todos: ProjectTodo[];
    links: ProjectLink[];
};

export type User = {
    id: string;
    email: string;
    name: string | null;
    password_hash: string;
};
