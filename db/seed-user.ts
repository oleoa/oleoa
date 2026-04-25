import { parseArgs } from "node:util";
import bcrypt from "bcryptjs";
import { supabase } from "./client";

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

    const { data, error } = await supabase()
        .from("users")
        .upsert(
            { email, password_hash, name },
            { onConflict: "email" }
        )
        .select("id, email, name")
        .single();
    if (error) throw error;

    console.log(`✓ user upserted: id=${data.id} email=${data.email}${data.name ? ` name=${data.name}` : ""}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
