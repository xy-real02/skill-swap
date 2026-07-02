/**
 * Merges class name strings, filtering out falsy values.
 * Zero-dependency alternative to clsx + tailwind-merge.
 *
 * For conflict resolution (e.g. two bg-* classes), add `clsx` and
 * `tailwind-merge` packages and swap in the commented implementation below.
 *
 * @example
 *   cn('px-4 py-2', isActive && 'bg-primary', undefined, 'text-sm')
 *   // => 'px-4 py-2 bg-primary text-sm'
 */
export function cn(...inputs: (string | boolean | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}

/*
 * Full implementation (requires: npm install clsx tailwind-merge):
 *
 * import { clsx, type ClassValue } from 'clsx'
 * import { twMerge } from 'tailwind-merge'
 *
 * export function cn(...inputs: ClassValue[]) {
 *   return twMerge(clsx(inputs))
 * }
 */
