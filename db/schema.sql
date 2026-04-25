-- Schema for oleoa (Supabase Postgres)

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'currencies'
    ) THEN
        CREATE TYPE currencies AS ENUM ('BRL', 'USD', 'EUR');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS users (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text        NOT NULL UNIQUE,
    password_hash text        NOT NULL,
    name          text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_key
    ON users (lower(email));

CREATE TABLE IF NOT EXISTS stacks (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    href        text        NOT NULL,
    image_url   text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    avatar_url  text,
    email       text,
    company     text,
    notes       text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            text        NOT NULL,
    description     text        NOT NULL,
    position        int,
    type            text        NOT NULL DEFAULT 'personal' CHECK (type IN ('personal', 'commercial')),
    status          text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'complete', 'paused')),
    is_public       boolean     NOT NULL DEFAULT true,
    link            text,
    source          text,
    client_id       uuid        REFERENCES clients(id) ON DELETE SET NULL,
    budget_amount   numeric(12,2),
    budget_currency currencies  NOT NULL DEFAULT 'BRL',
    budget_status   text        NOT NULL DEFAULT 'pending' CHECK (budget_status IN ('pending','partial','paid','none')),
    year            text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_stacks (
    project_id  uuid    NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    stack_id    uuid    NOT NULL REFERENCES stacks(id)   ON DELETE CASCADE,
    position    int     NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, stack_id)
);

CREATE TABLE IF NOT EXISTS project_todos (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       text        NOT NULL,
    done        boolean     NOT NULL DEFAULT false,
    position    int         NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_links (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    label       text        NOT NULL,
    url         text        NOT NULL,
    kind        text,
    position    int         NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_public_position_idx
    ON projects (is_public, position ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS project_stacks_project_position_idx
    ON project_stacks (project_id, position);

CREATE INDEX IF NOT EXISTS project_todos_project_position_idx
    ON project_todos (project_id, position);

CREATE INDEX IF NOT EXISTS project_links_project_position_idx
    ON project_links (project_id, position);

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

DROP TRIGGER IF EXISTS clients_set_updated_at ON clients;
CREATE TRIGGER clients_set_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS project_todos_set_updated_at ON project_todos;
CREATE TRIGGER project_todos_set_updated_at
    BEFORE UPDATE ON project_todos
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Atomic reorder helpers. Called from server actions via supabase.rpc().
-- The function body runs inside a single implicit transaction.
CREATE OR REPLACE FUNCTION reorder_projects(ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    FOR i IN 1..coalesce(array_length(ids, 1), 0) LOOP
        UPDATE projects SET position = i - 1 WHERE id = ids[i];
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION reorder_project_todos(p_project_id uuid, ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    FOR i IN 1..coalesce(array_length(ids, 1), 0) LOOP
        UPDATE project_todos
           SET position = i - 1
         WHERE id = ids[i] AND project_id = p_project_id;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION reorder_project_links(p_project_id uuid, ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    FOR i IN 1..coalesce(array_length(ids, 1), 0) LOOP
        UPDATE project_links
           SET position = i - 1
         WHERE id = ids[i] AND project_id = p_project_id;
    END LOOP;
END;
$$;

-- RLS enabled on every public table with no policies. All app access goes
-- through the service role (server-only), which bypasses RLS. This guarantees
-- that if an anon/authenticated key ever leaks client-side, nothing is readable.
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stacks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_todos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links  ENABLE ROW LEVEL SECURITY;

COMMIT;
