// Infoproducto page
import { Sidebar } from '@/components/ui/Sidebar'
import { InfoproductoClient } from '@/components/modules/InfoproductoClient'
export default function InfoproductoPage() {
  return <div className="flex min-h-screen"><Sidebar /><main className="flex-1 overflow-y-auto"><InfoproductoClient /></main></div>
}
