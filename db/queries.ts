import { sql } from "./client";
import type { Project, ProjectNavEntry, Stack, User } from "./types";

export async function listStacks(): Promise<Stack[]> {
    const rows = await sql`
        SELECT id AS "_id", name, href, image_url AS image
        FROM stacks
        ORDER BY name ASC
    `;
    return rows as Stack[];
}

export async function listProjects(): Promise<Project[]> {
    const rows = await sql`
        SELECT
            p.id          AS "_id",
            p.name        AS "name",
            p.description AS "description",
            p.link        AS "link",
            p.source      AS "source",
            p.slug        AS "slug",
            p.client      AS "client",
            p.role        AS "role",
            p.year        AS "year",
            p.cover_url   AS "cover",
            p.summary     AS "summary",
            p.problem     AS "problem",
            p.approach    AS "approach",
            p.outcome     AS "outcome",
            p.featured    AS "featured",
            p.display_order AS "order",
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            '_id', s.id,
                            'name', s.name,
                            'href', s.href,
                            'image', s.image_url
                        )
                        ORDER BY ps.position, s.name
                    )
                    FROM project_stacks ps
                    JOIN stacks s ON s.id = ps.stack_id
                    WHERE ps.project_id = p.id
                ),
                '[]'::json
            ) AS "stacks"
        FROM projects p
        ORDER BY p.featured DESC, p.display_order ASC NULLS LAST, p.created_at ASC
    `;
    return rows as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const rows = await sql`
        SELECT
            p.id          AS "_id",
            p.name        AS "name",
            p.description AS "description",
            p.link        AS "link",
            p.source      AS "source",
            p.slug        AS "slug",
            p.client      AS "client",
            p.role        AS "role",
            p.year        AS "year",
            p.cover_url   AS "cover",
            p.summary     AS "summary",
            p.problem     AS "problem",
            p.approach    AS "approach",
            p.outcome     AS "outcome",
            p.featured    AS "featured",
            p.display_order AS "order",
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object(
                            '_id', s.id,
                            'name', s.name,
                            'href', s.href,
                            'image', s.image_url
                        )
                        ORDER BY ps.position, s.name
                    )
                    FROM project_stacks ps
                    JOIN stacks s ON s.id = ps.stack_id
                    WHERE ps.project_id = p.id
                ),
                '[]'::json
            ) AS "stacks"
        FROM projects p
        WHERE p.slug = ${slug}
        LIMIT 1
    `;
    if (rows.length === 0) return null;
    return rows[0] as Project;
}

export async function getUserById(id: string): Promise<User | null> {
    const rows = (await sql`
        SELECT id, email, name, password_hash
        FROM users
        WHERE id = ${id}
        LIMIT 1
    `) as User[];
    return rows[0] ?? null;
}

export async function listFeaturedNav(): Promise<ProjectNavEntry[]> {
    const rows = await sql`
        SELECT id AS "_id", name, slug, display_order AS "order"
        FROM projects
        WHERE featured = true AND slug IS NOT NULL
        ORDER BY display_order ASC NULLS LAST, created_at ASC
    `;
    return rows as ProjectNavEntry[];
}
