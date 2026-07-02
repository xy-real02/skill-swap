// ─── Platform Categories ────────────────────────────────────────────────────
// Single source of truth. Never hardcode category names elsewhere in the app.

export interface CategoryItem {
  name: string
  icon: string
}

export const PLATFORM_CATEGORIES: CategoryItem[] = [
  { name: 'Home & Repairs', icon: 'handyman' },
  { name: 'Technology', icon: 'computer' },
  { name: 'Transport & Errands', icon: 'directions_car' },
  { name: 'Education & Tutoring', icon: 'school' },
  { name: 'Creative Arts', icon: 'palette' },
  { name: 'Childcare & Eldercare', icon: 'family_restroom' },
  { name: 'Food & Cooking', icon: 'restaurant' },
  { name: 'Admin & Legal', icon: 'gavel' },
  { name: 'Health & Wellness', icon: 'fitness_center' },
  { name: 'Other', icon: 'auto_awesome' },
]

export const CATEGORY_NAMES = PLATFORM_CATEGORIES.map((c) => c.name)

// ─── Listing Limits ──────────────────────────────────────────────────────────
/** Maximum number of non-archived listings a user can have at once. */
export const MAX_LISTINGS_PER_USER = 5

// ─── Review Window ───────────────────────────────────────────────────────────
/** Number of days after exchange completion during which a review can be submitted. */
export const REVIEW_WINDOW_DAYS = 7

// ─── Request Expiry ──────────────────────────────────────────────────────────
/** Number of days before a skill request automatically expires. */
export const REQUEST_EXPIRY_DAYS = 30

// ─── Default Community Zones ─────────────────────────────────────────────────
/** Fallback zone list when community_settings has no zones configured. */
export const DEFAULT_COMMUNITY_ZONES = [
  'Northside Hub',
  'South Market',
  'East Village',
  'West End',
]
