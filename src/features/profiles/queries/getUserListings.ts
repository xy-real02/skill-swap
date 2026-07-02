/**
 * Re-exports getUserListings from the canonical listings domain.
 *
 * The profiles domain displays listings that belong to a user on their public
 * profile page. Rather than duplicating the query, we delegate to the single
 * source of truth in features/listings/queries/getUserListings.ts.
 */
export { getUserListings } from '@/features/listings/queries/getUserListings'
