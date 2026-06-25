'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    
    const name = formData.get('name')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const phone = formData.get('phone')?.toString() || ''
    const business = formData.get('business')?.toString() || ''
    const message = formData.get('message')?.toString() || ''

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' }
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          business,
          message,
        }
      ])

    if (error) {
      console.error('Error submitting contact message:', error)
      return { success: false, error: 'Failed to send message. Please try again later.' }
    }

    return { success: true, message: 'Thanks for reaching out! I will get back to you soon.' }
  } catch (error) {
    console.error('Exception in submitContactMessage:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
