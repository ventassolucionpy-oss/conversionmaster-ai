import { Sidebar } from '@/components/ui/Sidebar'
import { ProductoClient } from '@/components/modules/ProductoClient'

export default function ProductoPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <ProductoClient />
      </main>
    </div>
  )
}
