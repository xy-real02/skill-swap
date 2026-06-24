import { getUserExchanges } from '@/features/exchanges/queries/getUserExchanges'
import { ExchangeDashboard } from '@/features/exchanges/components/ExchangeDashboard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ExchangesPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  
  if (!authData.user) {
    redirect('/login')
  }

  const exchanges = await getUserExchanges()

  return (
    <div className="pt-6 px-margin-mobile md:px-lg w-full flex-1">
      <ExchangeDashboard exchanges={exchanges} currentUserId={authData.user.id} />
    </div>
  )
}
