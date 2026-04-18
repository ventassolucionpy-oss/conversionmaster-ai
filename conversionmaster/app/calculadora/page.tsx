import { Sidebar } from '@/components/ui/Sidebar'
import { CalculadoraClient } from '@/components/modules/CalculadoraClient'
export default function CalculadoraPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto"><CalculadoraClient /></main>
    </div>
  )
}
