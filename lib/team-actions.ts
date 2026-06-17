'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { isUserAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getTeamMembers() {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    return { data: null, error: 'Unauthorized' }
  }

  const supabase = createAdminClient()
  
  // Get all users from auth.users via admin api
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  if (authError) return { data: null, error: authError.message }

  // Get profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'editor'])

  if (profileError) return { data: null, error: profileError.message }

  // Map to combine auth user with profile data
  const teamMembers = profiles.map(profile => {
    const authUser = authData.users.find(u => u.id === profile.id)
    return {
      id: profile.id,
      email: authUser?.email || profile.email,
      fullName: profile.full_name,
      role: profile.role,
      lastSignInAt: authUser?.last_sign_in_at,
      createdAt: authUser?.created_at,
    }
  })

  return { data: teamMembers, error: null }
}

export async function createTeamMember(formData: FormData) {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    return { error: 'Unauthorized' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string

  if (!email || !password || !role) {
    return { error: 'Email, password, and role are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const supabase = createAdminClient()

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the user since an admin created them
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user.' }
  }

  // 2. Insert into profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: role
    })

  if (profileError) {
    // If profile insert fails, we should ideally delete the auth user to rollback
    await supabase.auth.admin.deleteUser(authData.user.id)
    return { error: 'Failed to save user profile.' }
  }

  revalidatePath('/admin/team')
  return { success: true }
}

export async function deleteTeamMember(userId: string) {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    return { error: 'Unauthorized' }
  }

  const supabase = createAdminClient()

  // Delete from profiles
  await supabase.from('profiles').delete().eq('id', userId)

  // Delete from auth.users (this deletes the user entirely)
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/team')
  return { success: true }
}

export async function updateTeamMember(userId: string, formData: FormData) {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    return { error: 'Unauthorized' }
  }

  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string

  if (!fullName || !role) {
    return { error: 'Name and role are required.' }
  }

  const supabase = createAdminClient()

  // 1. Update the user metadata in Supabase Auth
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  // 2. Update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      role: role
    })
    .eq('id', userId)

  if (profileError) {
    return { error: 'Failed to update user profile.' }
  }

  revalidatePath('/admin/team')
  return { success: true }
}
