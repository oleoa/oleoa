-- Schema for oleoa (Convex → Neon Postgres migration)
-- Idempotent: safe to re-run. Wraps everything in a single transaction.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text        NOT NULL,
    password_hash text        NOT NULL,
    name          text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key
    ON users (lower(email));

CREATE TABLE IF NOT EXISTS stacks (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    href        text        NOT NULL,
    image_url   text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          text        NOT NULL,
    description   text        NOT NULL,
    link          text,
    source        text,
    slug          text,
    client        text,
    role          text,
    year          text,
    cover_url     text,
    summary       text,
    problem       text,
    approach      text,
    outcome       text,
    featured      boolean     NOT NULL DEFAULT false,
    display_order int,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_stacks (
    project_id  uuid    NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stack_id    uuid    NOT NULL REFERENCES stacks(id)   ON DELETE CASCADE,
    position    int     NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, stack_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key
    ON projects (slug)
    WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS projects_featured_order_idx
    ON projects (featured DESC, display_order ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS project_stacks_project_position_idx
    ON project_stacks (project_id, position);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_set_updated_at ON projects;
CREATE TRIGGER projects_set_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMIT;
