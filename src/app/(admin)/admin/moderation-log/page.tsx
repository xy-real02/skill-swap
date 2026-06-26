import { getModerationLogs } from '@/features/admin/queries/getModerationLogs'
import { ModerationLogTable } from '@/features/admin/components/ModerationLogTable'
import { Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminModerationLogPage() {
  const logs = await getModerationLogs()

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface font-headline-md tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Moderation Audit Log
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Complete, immutable chronological record of all administrative and moderation enforcement actions.
          </p>
        </div>
      </div>

      <ModerationLogTable logs={logs} />
    </div>
  )
}
