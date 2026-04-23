export type Stack = {
    _id: string;
    name: string;
    href: string;
    image: string | null;
};

export type Project = {
    _id: string;
    name: string;
    description: string;
    link: string | null;
    source: string | null;
    slug: string | null;
    client: string | null;
    role: string | null;
    year: string | null;
    cover: string | null;
    summary: string | null;
    problem: string | null;
    approach: string | null;
    outcome: string | null;
    featured: boolean;
    order: number | null;
    stacks: Stack[];
};

export type ProjectNavEntry = {
    _id: string;
    name: string;
    slug: string;
    order: number | null;
};

export type User = {
    id: string;
    email: string;
    name: string | null;
    password_hash: string;
};
