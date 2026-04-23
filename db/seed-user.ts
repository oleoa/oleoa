import { parseArgs } from "node:util";
import bcrypt from "bcryptjs";
import { sql } from "./client";

async function main() {
    const { values } = parseArgs({
        options: {
            email: { type: "string" },
            password: { type: "string" },
            name: { type: "string" },
        },
        strict: true,
        allowPositionals: false,
    });

    const email = values.email?.trim().toLowerCase();
    const password = values.password;
    const name = values.name ?? null;

    if (!email || !password) {
        console.error("Usage: npm run seed:user -- --email <email> --password <password> [--name <name>]");
        process.exit(1);
    }

    const password_hash = await bcrypt.hash(password, 12);

    const rows = (await sql`
        INSERT INTO users (email, password_hash, name)
        VALUES (${email}, ${password_hash}, ${name})
        ON CONFLICT (lower(email)) DO UPDATE
            SET password_hash = EXCLUDED.password_hash,
                name = COALESCE(EXCLUDED.name, users.name)
        RETURNING id, email, name
    `) as { id: string; email: string; name: string | null }[];

    const u = rows[0];
    console.log(`✓ user upserted: id=${u.id} email=${u.email}${u.name ? ` name=${u.name}` : ""}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
