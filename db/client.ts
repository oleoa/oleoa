import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

let _client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
    if (!_client) {
        _client = createClient(url!, serviceRoleKey!, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return _client;
}
