export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ensureSlug(slug: string | undefined, name: string): string {
  const trimmed = slug?.trim()
  if (trimmed) return trimmed
  return generateSlug(name) || 'destination'
}
