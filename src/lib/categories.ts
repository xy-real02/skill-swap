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
