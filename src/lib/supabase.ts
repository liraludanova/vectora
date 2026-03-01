// src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

function mustEnv(name: string): string {
    const v = process.env[name];
    if (!v || v.trim().length < 5) {
        throw new Error(`Missing env: ${name}`);
    }
    return v;
}

/**
 * Server-side Supabase client.
 * Uses NEXT_PUBLIC_* values (works on server too).
 * For production security you normally use SERVICE_ROLE_KEY on server,
 * but you said you currently have only publishable key.
 */
export function supabaseServer(): SupabaseClient {
    if (cached) return cached;

    const url = mustEnv("NEXT_PUBLIC_SUPABASE_URL");
    const key = mustEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

    cached = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    return cached;
}
