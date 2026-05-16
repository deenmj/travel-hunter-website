import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

// Server-side auth functions
export async function getCurrentUser() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error)
    return null
  }

  return user
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function isUserEditor(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'editor' || profile?.role === 'admin'
}

export async function isUserAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'admin'
}

// Server-side auth actions
export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
}

export async function signUp(
  email: string,
  password: string,
  fullName?: string,
) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        role: 'editor',
      },
    },
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function signIn(email: string, password: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

// Client-side auth context hook
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
