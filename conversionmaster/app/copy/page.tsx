import { Sidebar } from '@/components/ui/Sidebar'
import { CopyClient } from '@/components/modules/CopyClient'
export default function CopyPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto"><CopyClient /></main>
    </div>
  )
}
