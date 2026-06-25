import { redirect } from 'next/navigation'

export default async function ListingDetailsRedirect() {
  redirect('/listings')
}
