// app/nichos/page.tsx
import { Sidebar } from '@/components/ui/Sidebar'
import { NichosClient } from '@/components/modules/NichosClient'
export default function NichosPage() {
  return <div className="flex min-h-screen"><Sidebar /><main className="flex-1 overflow-y-auto"><NichosClient /></main></div>
}
