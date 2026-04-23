import { Pool, neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in environment");
}

export const sql = neon(process.env.DATABASE_URL);

let _pool: Pool | null = null;
export function pool(): Pool {
    if (!_pool) {
        _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    return _pool;
}
