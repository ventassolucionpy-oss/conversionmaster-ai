// app/trust/page.tsx
import { Sidebar } from '@/components/ui/Sidebar'
import { TrustClient } from '@/components/modules/TrustClient'
export default function TrustPage() {
  return <div className="flex min-h-screen"><Sidebar /><main className="flex-1 overflow-y-auto"><TrustClient /></main></div>
}
