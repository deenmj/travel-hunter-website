import { createServerClient } from '@supabase/ssr'

/**
 * Creates a Supabase admin client using the service role key.
 * This bypasses RLS and should only be used in server-side API routes
 * for admin operations (e.g., password resets, user management).
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No cookies needed for admin client
        },
      },
    },
  )
}
