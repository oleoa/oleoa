"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { uploadImage, deleteImage } from "@/lib/storage";

async function requireAuth() {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
}

function refreshPublic(slug: string | null | undefined) {
    revalidatePath("/");
    if (slug) revalidatePath(`/work/${slug}`);
}

// ---------- Projects ----------

export type ProjectInput = {
    name: string;
    description: string;
    link: string | null;
    source: string | null;
    slug: string | null;
    client: string | null;
    role: string | null;
    year: string | null;
    summary: string | null;
    problem: string | null;
    approach: string | null;
    outcome: string | null;
    featured: boolean;
    order: number | null;
};

export async function addProject(input: ProjectInput): Promise<{ id: string }> {
    await requireAuth();
    const rows = await sql`
        INSERT INTO projects (
            name, description, link, source, slug, client, role, year,
            summary, problem, approach, outcome, featured, display_order
        ) VALUES (
            ${input.name}, ${input.description}, ${input.link}, ${input.source},
            ${input.slug}, ${input.client}, ${input.role}, ${input.year},
            ${input.summary}, ${input.problem}, ${input.approach}, ${input.outcome},
            ${input.featured}, ${input.order}
        )
        RETURNING id
    `;
    refreshPublic(input.slug);
    return { id: rows[0].id as string };
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
    await requireAuth();
    await sql`
        UPDATE projects SET
            name = ${input.name},
            description = ${input.description},
            link = ${input.link},
            source = ${input.source},
            slug = ${input.slug},
            client = ${input.client},
            role = ${input.role},
            year = ${input.year},
            summary = ${input.summary},
            problem = ${input.problem},
            approach = ${input.approach},
            outcome = ${input.outcome},
            featured = ${input.featured},
            display_order = ${input.order}
        WHERE id = ${id}
    `;
    refreshPublic(input.slug);
}

export async function deleteProject(id: string): Promise<void> {
    await requireAuth();
    const rows = await sql`SELECT cover_url, slug FROM projects WHERE id = ${id}`;
    const cover = (rows[0]?.cover_url as string | null) ?? null;
    const slug = (rows[0]?.slug as string | null) ?? null;
    if (cover) await deleteImage(cover);
    await sql`DELETE FROM projects WHERE id = ${id}`;
    refreshPublic(slug);
}

export async function setProjectCover(projectId: string, formData: FormData): Promise<void> {
    await requireAuth();
    const file = formData.get("cover");
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("No file provided");
    }
    const rows = await sql`SELECT cover_url, slug, name FROM projects WHERE id = ${projectId}`;
    const oldCover = (rows[0]?.cover_url as string | null) ?? null;
    const slug = (rows[0]?.slug as string | null) ?? null;
    const nameHint = (rows[0]?.slug as string | null) ?? (rows[0]?.name as string | null) ?? "cover";

    const newUrl = await uploadImage(file, "covers", nameHint);
    await sql`UPDATE projects SET cover_url = ${newUrl} WHERE id = ${projectId}`;
    if (oldCover && oldCover !== newUrl) await deleteImage(oldCover);
    refreshPublic(slug);
}

export async function removeProjectCover(projectId: string): Promise<void> {
    await requireAuth();
    const rows = await sql`SELECT cover_url, slug FROM projects WHERE id = ${projectId}`;
    const oldCover = (rows[0]?.cover_url as string | null) ?? null;
    const slug = (rows[0]?.slug as string | null) ?? null;
    await sql`UPDATE projects SET cover_url = NULL WHERE id = ${projectId}`;
    if (oldCover) await deleteImage(oldCover);
    refreshPublic(slug);
}

export async function addStackToProject(projectId: string, stackId: string): Promise<void> {
    await requireAuth();
    const next = await sql`
        SELECT COALESCE(MAX(position) + 1, 0) AS next FROM project_stacks WHERE project_id = ${projectId}
    `;
    await sql`
        INSERT INTO project_stacks (project_id, stack_id, position)
        VALUES (${projectId}, ${stackId}, ${next[0].next as number})
        ON CONFLICT (project_id, stack_id) DO NOTHING
    `;
    const rows = await sql`SELECT slug FROM projects WHERE id = ${projectId}`;
    refreshPublic((rows[0]?.slug as string | null) ?? null);
}

export async function removeStackFromProject(projectId: string, stackId: string): Promise<void> {
    await requireAuth();
    await sql`
        DELETE FROM project_stacks WHERE project_id = ${projectId} AND stack_id = ${stackId}
    `;
    const rows = await sql`SELECT slug FROM projects WHERE id = ${projectId}`;
    refreshPublic((rows[0]?.slug as string | null) ?? null);
}

// ---------- Stacks ----------

export async function createStack(name: string, href: string): Promise<{ id: string }> {
    await requireAuth();
    const rows = await sql`
        INSERT INTO stacks (name, href) VALUES (${name}, ${href}) RETURNING id
    `;
    refreshPublic(null);
    return { id: rows[0].id as string };
}

export async function updateStack(
    id: string,
    name: string,
    href: string,
    formData: FormData | null
): Promise<void> {
    await requireAuth();
    let newImageUrl: string | null = null;
    let oldImageUrl: string | null = null;

    if (formData) {
        const file = formData.get("image");
        if (file instanceof File && file.size > 0) {
            const existing = await sql`SELECT image_url FROM stacks WHERE id = ${id}`;
            oldImageUrl = (existing[0]?.image_url as string | null) ?? null;
            newImageUrl = await uploadImage(file, "stacks", name);
        }
    }

    if (newImageUrl) {
        await sql`
            UPDATE stacks SET name = ${name}, href = ${href}, image_url = ${newImageUrl}
            WHERE id = ${id}
        `;
        if (oldImageUrl && oldImageUrl !== newImageUrl) await deleteImage(oldImageUrl);
    } else {
        await sql`UPDATE stacks SET name = ${name}, href = ${href} WHERE id = ${id}`;
    }
    refreshPublic(null);
}

export async function deleteStack(id: string): Promise<void> {
    await requireAuth();
    const rows = await sql`SELECT image_url FROM stacks WHERE id = ${id}`;
    const oldImage = (rows[0]?.image_url as string | null) ?? null;
    await sql`DELETE FROM stacks WHERE id = ${id}`;
    if (oldImage) await deleteImage(oldImage);
    refreshPublic(null);
}
