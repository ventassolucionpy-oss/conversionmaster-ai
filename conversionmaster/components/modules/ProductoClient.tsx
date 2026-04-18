'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Topbar } from '@/components/ui/Topbar'
import { useAppStore } from '@/lib/store'
import { generateOfferStack, calcPsychPrice, fmtUSD } from '@/lib/utils'
import { ProductType, MarketType, GeneratedOffer } from '@/types'

const PRODUCT_TYPES: { value: ProductType; label: string; badge: string }[] = [
  { value: 'ebook',      label: 'Ebook / PDF Premium',      badge: 'Ebook' },
  { value: 'mastermind', label: 'Mastermind / Coaching',    badge: 'Mastermind' },
  { value: 'curso',      label: 'Curso Online (LMS)',        badge: 'Curso' },
  { value: 'workshop',   label: 'Workshop / Intensivo',     badge: 'Workshop' },
  { value: 'template',   label: 'Pack de Templates / SOP',  badge: 'Templates' },
]

const NICHES = [
  'Finanzas Personales · Ingresos Extra',
  'Salud · Pérdida de Peso / Biohacking',
  'Relaciones · Soft Skills / Dating',
  'Habilidades Digitales · Freelance / IA',
  'Negocios · Agencias / Ecommerce',
]

const MARKETS: { value: MarketType; label: string }[] = [
  { value: 'py',    label: 'Paraguay · Guaraníes' },
  { value: 'mx',    label: 'México · MXN' },
  { value: 'co',    label: 'Colombia · COP' },
  { value: 'ar',    label: 'Argentina · ARS' },
  { value: 'latam', label: 'Pan-LATAM · USD' },
]

const STACK_ITEMS = [
  { key: 'fe', badge: 'FE', badgeBg: 'rgba(245,166,35,0.15)', badgeColor: '#F5A623', label: 'Front-End', uptake: '—' },
  { key: 'ob', badge: 'OB', badgeBg: 'rgba(0,212,164,0.1)',  badgeColor: '#00D4A4', label: 'Order Bump', uptake: '35%' },
  { key: 'u1', badge: 'U1', badgeBg: 'rgba(108,79,255,0.15)', badgeColor: '#9B7AFF', label: 'Upsell 1',  uptake: '22%' },
  { key: 'ds', badge: 'DS', badgeBg: 'rgba(255,76,106,0.08)', badgeColor: '#FF4C6A', label: 'Downsell',  uptake: '—' },
]

export function ProductoClient() {
  const { formatPrice } = useAppStore()
  const [productType, setProductType] = useState<ProductType>('ebook')
  const [market, setMarket]           = useState<MarketType>('py')
  const [pain, setPain]               = useState('No logran ahorrar + llegan a fin de mes sin dinero + no saben generar ingresos extra')
  const [basePrice, setBasePrice]     = useState(47)
  const [offer, setOffer]             = useState<GeneratedOffer | null>(null)
  const [loading, setLoading]         = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      const result = generateOfferStack(productType, pain, basePrice, market)
      setOffer(result)
      setLoading(false)
      toast.success('Stack generado con éxito')
    }, 600)
  }

  const copyStack = () => {
    if (!offer) return
    const text = `OFFER STACK\n\nFE: ${offer.fe.name} — ${offer.fe.price_local}\nOB: ${offer.ob.name} — ${offer.ob.price_local}\nU1: ${offer.u1.name} — ${offer.u1.price_local}\nDS: ${offer.ds.name} — ${offer.ds.price_local}\n\nAOV proyectado: ${fmtUSD(offer.aov_projected)}\nAOV máximo: ${fmtUSD(offer.aov_max)}`
    navigator.clipboard.writeText(text)
    toast.success('Stack copiado al portapapeles')
  }

  return (
    <div>
      <Topbar title="Módulo A · Arquitecto de Producto" subtitle="Blue Ocean Strategy · Stack de Ofertas Irresistibles" />

      <div className="p-7 animate-fade">
        <div className="grid grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="card">
            <div className="font-display font-bold text-[13px] mb-1">Configuración del Stack</div>
            <div className="font-mono text-[10px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Definí el núcleo de tu oferta irresistible
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Tipo de Producto Core</label>
                <select className="input" value={productType} onChange={(e) => setProductType(e.target.value as ProductType)}>
                  {PRODUCT_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Nicho Principal</label>
                <select className="input">
                  {NICHES.map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Mercado Objetivo</label>
                <select className="input" value={market} onChange={(e) => setMarket(e.target.value as MarketType)}>
                  {MARKETS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Pain Point Principal (separar con +)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={pain}
                  onChange={(e) => setPain(e.target.value)}
                  placeholder="Ej: No ahorra + llega a fin de mes sin dinero + no sabe generar ingresos..."
                />
              </div>

              <div>
                <label className="label">Precio Base Front-End (USD)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number" className="input" value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    min={7} max={997}
                  />
                  <div className="text-[11px] font-mono whitespace-nowrap" style={{ color: 'var(--gold)' }}>
                    = {calcPsychPrice(basePrice, market)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn btn-primary w-full justify-center"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Generando stack…' : 'Generar Stack de Oferta ▶'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="card">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-display font-bold text-[13px]">Stack Generado</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Blue Ocean · Pain Point → Solución
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="tag tag-gold">{PRODUCT_TYPES.find(p => p.value === productType)?.badge}</span>
                {offer && (
                  <button onClick={copyStack} className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: '11px' }}>
                    Copiar
                  </button>
                )}
              </div>
            </div>

            {!offer ? (
              <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
                <div className="text-4xl mb-3 opacity-30">◈</div>
                <div className="text-[12px]">Configurá el stack y hacé clic en Generar</div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {STACK_ITEMS.map((item) => {
                    const data = offer[item.key as keyof GeneratedOffer] as typeof offer.fe
                    return (
                      <div
                        key={item.key}
                        className="flex items-center gap-3 p-3 rounded-[10px] border transition-all hover:border-white/10"
                        style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
                          style={{ background: item.badgeBg, color: item.badgeColor }}
                        >
                          <span>{item.badge}</span>
                          {item.uptake !== '—' && (
                            <span className="text-[8px] opacity-70">{item.uptake}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold truncate">{data.name}</div>
                          <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{data.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[12px] font-bold" style={{ color: item.badgeColor }}>
                            {data.price_local}
                          </div>
                          <div className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            ${data.price_usd} USD
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* AOV Summary */}
                <div
                  className="mt-4 p-4 rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg,rgba(108,79,255,0.1),rgba(0,212,164,0.07))', border: '1px solid rgba(108,79,255,0.25)' }}
                >
                  <div className="result-row">
                    <span className="result-label">AOV proyectado (35% bump + 22% U1)</span>
                    <span className="result-value" style={{ color: 'var(--gold)' }}>{fmtUSD(offer.aov_projected)}</span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">AOV máximo (100% uptake)</span>
                    <span className="result-value" style={{ color: 'var(--accent-light)' }}>{fmtUSD(offer.aov_max)}</span>
                  </div>
                  <div className="result-row">
                    <span className="result-label">Multiplicador vs precio base</span>
                    <span className="result-value" style={{ color: 'var(--teal)' }}>
                      {(offer.aov_projected / basePrice).toFixed(2)}x
                    </span>
                  </div>
                </div>

                {/* Pricing across markets */}
                <div className="mt-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Precio FE en todos los mercados
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {(['py','mx','co','ar','latam'] as MarketType[]).map((m) => (
                      <div key={m} className="text-center">
                        <div className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>{m.toUpperCase()}</div>
                        <div className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--gold-light)' }}>
                          {calcPsychPrice(basePrice, m)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing Logic Explanation */}
        <div className="card mt-5">
          <div className="font-display font-bold text-[13px] mb-3">Lógica de Precios Psicológicos · LATAM</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { market: 'Paraguay (PYG)', rule: 'Múltiplo de 1000 − 1000', example: '$47 USD → 147.000 Gs', note: 'Nunca 150.000 Gs' },
              { market: 'México (MXN)',   rule: 'Múltiplo de 50 − 3',      example: '$47 USD → $847 MXN',   note: 'Nunca $850 MXN' },
              { market: 'Colombia (COP)', rule: 'Múltiplo de 5000 − 1000', example: '$47 USD → $194.000 COP', note: 'Nunca $195.000 COP' },
            ].map((item) => (
              <div
                key={item.market}
                className="p-3 rounded-[10px]"
                style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
              >
                <div className="text-[11px] font-bold mb-1" style={{ color: 'var(--gold)' }}>{item.market}</div>
                <div className="font-mono text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Regla: {item.rule}</div>
                <div className="font-mono text-[12px]" style={{ color: 'var(--gold-light)' }}>{item.example}</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
