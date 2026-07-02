/**
 * Strips HTML tags from a string and trims surrounding whitespace.
 * Call this in every Server Action before saving user-generated text to the database.
 *
 * @example
 *   const title = stripHtml(formData.get('title'))
 */
export function stripHtml(value: FormDataEntryValue | string | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = typeof value === 'string' ? value : value.toString()
  return str.trim().replace(/<[^>]*>/g, '')
}
