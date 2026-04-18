import { Sidebar } from '@/components/ui/Sidebar'
import { DashboardClient } from '@/components/modules/DashboardClient'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardClient />
      </main>
    </div>
  )
}
