import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        console.warn('Supabase env vars missing, using mock client')
        // Mock client to prevent crashes in UI-only mode
        return {
            from: (table: string) => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null }),
                        order: async () => ({ data: [], error: null }),
                        limit: async () => ({ data: [], error: null }),
                    }),
                    order: async () => ({ data: [], error: null }),
                }),
                upsert: async () => ({ error: null }),
                insert: async () => ({ error: null }),
                update: async () => ({ error: null }),
            }),
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
            }
        } as any
    }

    return createBrowserClient(url, key)
}
