import { createClient } from '@/lib/supabase/server'
import type { Destination } from '@/lib/types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function fetchDestinationBySlug(slugOrId: string): Promise<Destination | null> {
  const supabase = await createClient()

  if (slugOrId) {
    const { data: bySlug } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slugOrId)
      .maybeSingle()

    if (bySlug) return bySlug as Destination
  }

  if (UUID_REGEX.test(slugOrId)) {
    const { data: byId } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', slugOrId)
      .maybeSingle()

    if (byId) return byId as Destination
  }

  return null
}

export async function fetchRelatedDestinations(
  category: string,
  excludeId: string,
  limit = 3,
): Promise<Destination[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(limit)
    .order('created_at', { ascending: false })

  return (data as Destination[]) || []
}
