import { createClient as createBrowserClient } from '@/lib/supabase/client'

export function useAuth() {
  const supabase = createBrowserClient()

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signUpClient = async (
    email: string,
    password: string,
    fullName?: string,
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: 'editor',
        },
      },
    })
  }

  const signInClient = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  return {
    supabase,
    signOut,
    signUp: signUpClient,
    signIn: signInClient,
  }
}
