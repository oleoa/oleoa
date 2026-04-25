"use server";

import { auth } from "@/auth";
import { supabase } from "@/db/client";
import { uploadImage, deleteImage } from "@/lib/storage";
import type {
    BudgetCurrency,
    BudgetStatus,
    ProjectLinkKind,
    ProjectStatus,
    ProjectType,
} from "@/db/types";

async function requireAuth() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
}

// ---------- Projects ----------

export type ProjectInput = {
    name: string;
    description: string;
    type: ProjectType;
    link: string | null;
    source: string | null;
    year: string | null;
    position: number | null;
    status: ProjectStatus;
    isPublic: boolean;
    budgetAmount: number | null;
    budgetCurrency: BudgetCurrency;
    budgetStatus: BudgetStatus;
    clientId: string | null;
};

function projectRow(input: ProjectInput) {
    return {
        name: input.name,
        description: input.description,
        type: input.type,
        link: input.link,
        source: input.source,
        year: input.year,
        position: input.position,
        status: input.status,
        is_public: input.isPublic,
        budget_amount: input.budgetAmount,
        budget_currency: input.budgetCurrency,
        budget_status: input.budgetStatus,
        client_id: input.clientId,
    };
}

export async function addProject(input: ProjectInput): Promise<{ id: string }> {
    await requireAuth();
    const sb = supabase();
    let position = input.position;
    if (position === null) {
        const { data: maxRow, error: maxErr } = await sb
            .from("projects")
            .select("position")
            .eq("type", input.type)
            .order("position", { ascending: false, nullsFirst: false })
            .limit(1)
            .maybeSingle();
        if (maxErr) throw maxErr;
        position = maxRow?.position != null ? (maxRow.position as number) + 1 : 0;
    }
    const { data, error } = await sb
        .from("projects")
        .insert(projectRow({ ...input, position }))
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id as string };
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
    await requireAuth();
    const { error } = await supabase().from("projects").update(projectRow(input)).eq("id", id);
    if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
    await requireAuth();
    const { error } = await supabase().from("projects").delete().eq("id", id);
    if (error) throw error;
}

export async function reorderPublicProjects(ids: string[]): Promise<void> {
    await requireAuth();
    if (ids.length === 0) return;
    const { error } = await supabase().rpc("reorder_projects", { ids });
    if (error) throw error;
}

export async function addStackToProject(projectId: string, stackId: string): Promise<void> {
    await requireAuth();
    const sb = supabase();
    const { data: maxRow, error: maxErr } = await sb
        .from("project_stacks")
        .select("position")
        .eq("project_id", projectId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (maxErr) throw maxErr;
    const nextPos = maxRow ? (maxRow.position as number) + 1 : 0;

    const { error } = await sb
        .from("project_stacks")
        .upsert(
            { project_id: projectId, stack_id: stackId, position: nextPos },
            { onConflict: "project_id,stack_id", ignoreDuplicates: true }
        );
    if (error) throw error;
}

export async function addStacksToProject(projectId: string, stackIds: string[]): Promise<void> {
    await requireAuth();
    if (stackIds.length === 0) return;
    const sb = supabase();
    const { data: maxRow, error: maxErr } = await sb
        .from("project_stacks")
        .select("position")
        .eq("project_id", projectId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (maxErr) throw maxErr;
    const nextPos = maxRow ? (maxRow.position as number) + 1 : 0;

    const rows = stackIds.map((stack_id, i) => ({
        project_id: projectId,
        stack_id,
        position: nextPos + i,
    }));

    const { error } = await sb
        .from("project_stacks")
        .upsert(rows, { onConflict: "project_id,stack_id", ignoreDuplicates: true });
    if (error) throw error;
}

export async function removeStackFromProject(projectId: string, stackId: string): Promise<void> {
    await requireAuth();
    const { error } = await supabase()
        .from("project_stacks")
        .delete()
        .eq("project_id", projectId)
        .eq("stack_id", stackId);
    if (error) throw error;
}

// ---------- Stacks ----------

export async function createStack(name: string, href: string): Promise<{ id: string }> {
    await requireAuth();
    const { data, error } = await supabase()
        .from("stacks")
        .insert({ name, href })
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id as string };
}

export async function updateStack(
    id: string,
    name: string,
    href: string,
    formData: FormData | null
): Promise<void> {
    await requireAuth();
    const sb = supabase();
    let newImageUrl: string | null = null;
    let oldImageUrl: string | null = null;

    if (formData) {
        const file = formData.get("image");
        if (file instanceof File && file.size > 0) {
            const { data: existing, error: exErr } = await sb
                .from("stacks")
                .select("image_url")
                .eq("id", id)
                .maybeSingle();
            if (exErr) throw exErr;
            oldImageUrl = (existing?.image_url as string | null) ?? null;
            newImageUrl = await uploadImage(file, "stacks", name);
        }
    }

    const patch: { name: string; href: string; image_url?: string } = { name, href };
    if (newImageUrl) patch.image_url = newImageUrl;

    const { error } = await sb.from("stacks").update(patch).eq("id", id);
    if (error) throw error;

    if (newImageUrl && oldImageUrl && oldImageUrl !== newImageUrl) {
        await deleteImage(oldImageUrl);
    }
}

export async function deleteStack(id: string): Promise<void> {
    await requireAuth();
    const sb = supabase();
    const { data: existing, error: exErr } = await sb
        .from("stacks")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();
    if (exErr) throw exErr;
    const oldImage = (existing?.image_url as string | null) ?? null;

    const { error } = await sb.from("stacks").delete().eq("id", id);
    if (error) throw error;

    if (oldImage) await deleteImage(oldImage);
}

// ---------- Clients ----------

export type ClientInput = {
    name: string;
    email: string | null;
    company: string | null;
    notes: string | null;
};

export async function createClient(input: ClientInput): Promise<{ id: string }> {
    await requireAuth();
    const { data, error } = await supabase()
        .from("clients")
        .insert({
            name: input.name,
            email: input.email,
            company: input.company,
            notes: input.notes,
        })
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id as string };
}

export async function updateClient(id: string, input: ClientInput): Promise<void> {
    await requireAuth();
    const { error } = await supabase()
        .from("clients")
        .update({
            name: input.name,
            email: input.email,
            company: input.company,
            notes: input.notes,
        })
        .eq("id", id);
    if (error) throw error;
}

export async function deleteClient(id: string): Promise<void> {
    await requireAuth();
    const sb = supabase();
    const { data: existing, error: exErr } = await sb
        .from("clients")
        .select("avatar_url")
        .eq("id", id)
        .maybeSingle();
    if (exErr) throw exErr;
    const avatar = (existing?.avatar_url as string | null) ?? null;

    const { error } = await sb.from("clients").delete().eq("id", id);
    if (error) throw error;

    if (avatar) await deleteImage(avatar);
}

export async function setClientAvatar(clientId: string, formData: FormData): Promise<void> {
    await requireAuth();
    const file = formData.get("avatar");
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("No file provided");
    }
    const sb = supabase();
    const { data: existing, error: exErr } = await sb
        .from("clients")
        .select("avatar_url, name")
        .eq("id", clientId)
        .maybeSingle();
    if (exErr) throw exErr;
    const oldAvatar = (existing?.avatar_url as string | null) ?? null;
    const nameHint = (existing?.name as string | null) ?? "client";

    const newUrl = await uploadImage(file, "clients", nameHint);
    const { error } = await sb.from("clients").update({ avatar_url: newUrl }).eq("id", clientId);
    if (error) throw error;

    if (oldAvatar && oldAvatar !== newUrl) await deleteImage(oldAvatar);
}

export async function removeClientAvatar(clientId: string): Promise<void> {
    await requireAuth();
    const sb = supabase();
    const { data: existing, error: exErr } = await sb
        .from("clients")
        .select("avatar_url")
        .eq("id", clientId)
        .maybeSingle();
    if (exErr) throw exErr;
    const oldAvatar = (existing?.avatar_url as string | null) ?? null;

    const { error } = await sb.from("clients").update({ avatar_url: null }).eq("id", clientId);
    if (error) throw error;

    if (oldAvatar) await deleteImage(oldAvatar);
}

// ---------- Project TODOs ----------

export async function addTodo(projectId: string, title: string): Promise<{ id: string }> {
    await requireAuth();
    const trimmed = title.trim();
    if (!trimmed) throw new Error("Title required");
    const sb = supabase();
    const { data: maxRow, error: maxErr } = await sb
        .from("project_todos")
        .select("position")
        .eq("project_id", projectId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (maxErr) throw maxErr;
    const nextPos = maxRow ? (maxRow.position as number) + 1 : 0;

    const { data, error } = await sb
        .from("project_todos")
        .insert({ project_id: projectId, title: trimmed, position: nextPos })
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id as string };
}

export async function updateTodo(
    id: string,
    patch: { title?: string; done?: boolean }
): Promise<void> {
    await requireAuth();
    const updates: { title?: string; done?: boolean } = {};
    if (patch.title !== undefined) updates.title = patch.title;
    if (patch.done !== undefined) updates.done = patch.done;
    if (Object.keys(updates).length === 0) return;
    const { error } = await supabase().from("project_todos").update(updates).eq("id", id);
    if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
    await requireAuth();
    const { error } = await supabase().from("project_todos").delete().eq("id", id);
    if (error) throw error;
}

export async function reorderTodos(projectId: string, ids: string[]): Promise<void> {
    await requireAuth();
    if (ids.length === 0) return;
    const { error } = await supabase().rpc("reorder_project_todos", {
        p_project_id: projectId,
        ids,
    });
    if (error) throw error;
}

// ---------- Project external links ----------

export type ProjectLinkInput = {
    label: string;
    url: string;
    kind: ProjectLinkKind | null;
};

export async function addProjectLink(
    projectId: string,
    input: ProjectLinkInput
): Promise<{ id: string }> {
    await requireAuth();
    const sb = supabase();
    const { data: maxRow, error: maxErr } = await sb
        .from("project_links")
        .select("position")
        .eq("project_id", projectId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (maxErr) throw maxErr;
    const nextPos = maxRow ? (maxRow.position as number) + 1 : 0;

    const { data, error } = await sb
        .from("project_links")
        .insert({
            project_id: projectId,
            label: input.label,
            url: input.url,
            kind: input.kind,
            position: nextPos,
        })
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id as string };
}

export async function updateProjectLink(id: string, input: ProjectLinkInput): Promise<void> {
    await requireAuth();
    const { error } = await supabase()
        .from("project_links")
        .update({ label: input.label, url: input.url, kind: input.kind })
        .eq("id", id);
    if (error) throw error;
}

export async function deleteProjectLink(id: string): Promise<void> {
    await requireAuth();
    const { error } = await supabase().from("project_links").delete().eq("id", id);
    if (error) throw error;
}
