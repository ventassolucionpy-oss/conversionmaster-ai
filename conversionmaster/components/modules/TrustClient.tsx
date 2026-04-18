'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Topbar } from '@/components/ui/Topbar'
import { calcPsychPrice } from '@/lib/utils'
import { MarketType } from '@/types'

const MARKETS: { value: MarketType; label: string }[] = [
  { value: 'py', label: '🇵🇾 Paraguay · Guaraníes' },
  { value: 'mx', label: '🇲🇽 México · MXN' },
  { value: 'latam', label: '🌎 Pan-LATAM · USD' },
]

const UGC_SCRIPTS = [
  {
    type: 'Hook Curiosidad',
    duration: '0-4 seg',
    color: 'var(--gold)',
    scripts: [
      '"Esto me generó 200K Gs en mi primera semana... y lo aprendí en 2 horas."',
      '"Nadie me enseñó esto en el colegio. Y cuando lo aprendí, todo cambió."',
      '"Estaba revisando mis cuentas cuando me di cuenta de que estaba dejando pasar $X cada mes."',
    ],
  },
  {
    type: 'Prueba de Resultado',
    duration: '4-22 seg',
    color: 'var(--teal)',
    scripts: [
      '[Mostrar pantalla] "Acá está el comprobante. Empecé sin capital, solo con mi celi y este sistema de 5 pasos. El primero lo implementé el lunes. Para el viernes ya tenía mi primer pago."',
      '[Mostrar antes/después] "Hace 60 días así estaban mis finanzas. Hoy, después de seguir este método exacto, genero esto extra cada mes."',
      '[Cámara directa] "No soy influencer. No tengo miles de seguidores. Soy [profesión] y en mis ratos libres apliqué esto."',
    ],
  },
  {
    type: 'Eliminación de Objeción + CTA',
    duration: '22-35 seg',
    color: 'var(--rose)',
    scripts: [
      '"¿Y si no funciona? Garantía de 7 días completos. ¿El precio? Menos que un fin de semana. Link en bio, solo hoy."',
      '"¿Necesitás experiencia? No. ¿Capital? No. ¿Tiempo? 2 horas para arrancar. Link en bio."',
      '"La garantía cubre todo. Si en 7 días no ves resultados, te devuelvo cada guaraní. Link en bio ahora."',
    ],
  },
]

export function TrustClient() {
  const [product, setProduct] = useState('Sistema de 5 Fuentes de Ingreso')
  const [market, setMarket]   = useState<MarketType>('py')
  const [style, setStyle]     = useState('dark')
  const [priceUSD, setPrice]  = useState(47)
  const [blueprint, setBlueprint] = useState('')
  const [loading, setLoading] = useState(false)

  const localPrice  = calcPsychPrice(priceUSD, market)
  const anchorPrice = calcPsychPrice(priceUSD * 1.4, market)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lovable-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product, market, style, price_usd: priceUSD,
          trust_elements: 'Garantía 7 días + Contador escasez real + Social Proof dinámico + Badges SSL',
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setBlueprint(data.blueprint)
      toast.success('Lovable Blueprint generado ✦')
    } catch {
      toast.error('Error. Verificá tu ANTHROPIC_API_KEY')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Topbar title="Módulo F · Trust & Conversion" subtitle="Lovable Blueprint · Guiones UGC · Elementos de Confianza" />

      <div className="p-7 animate-fade space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Config */}
          <div className="card space-y-4">
            <div className="font-display font-bold text-[13px] mb-1">Generador · Lovable Blueprint</div>
            <div>
              <label className="label">Producto</label>
              <input className="input" value={product} onChange={e => setProduct(e.target.value)} />
            </div>
            <div>
              <label className="label">Mercado</label>
              <select className="input" value={market} onChange={e => setMarket(e.target.value as MarketType)}>
                {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estética Visual</label>
              <select className="input" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="dark">Dark Premium (negro · dorado)</option>
                <option value="light">Light Professional (blanco · navy)</option>
                <option value="bold">Bold Contrast (negro · neón verde)</option>
              </select>
            </div>
            <div>
              <label className="label">Precio USD → Local</label>
              <div className="flex items-center gap-3">
                <input type="number" className="input" value={priceUSD} onChange={e => setPrice(Number(e.target.value))} />
                <div className="text-right">
                  <div className="font-mono text-[13px] font-bold" style={{ color: 'var(--gold)' }}>{localPrice}</div>
                  <div className="font-mono text-[10px] line-through" style={{ color: 'var(--text-muted)' }}>{anchorPrice}</div>
                </div>
              </div>
            </div>

            {/* Trust elements checklist */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Elementos de confianza incluidos</div>
              {['Garantía 7 días (SVG escudo)','Timer cuenta regresiva real (JS)','Contador de cupos desde Supabase','3 testimonios con avatar y ciudad','Badges SSL + Pagos seguros','WhatsApp widget flotante','Sticky CTA bar (mobile)'].map(item => (
                <div key={item} className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[9px]" style={{ background: 'rgba(0,212,164,0.15)', color: 'var(--teal)' }}>✓</div>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>

            <button onClick={generate} disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? 'Generando Blueprint…' : 'Generar Lovable Blueprint ✦'}
            </button>
          </div>

          {/* Blueprint output */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-bold text-[13px]">Blueprint · Pegar en Lovable</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Prompt técnico listo para usar</div>
              </div>
              {blueprint && (
                <button onClick={() => { navigator.clipboard.writeText(blueprint); toast.success('Copiado') }} className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'11px' }}>
                  Copiar
                </button>
              )}
            </div>
            {blueprint ? (
              <div className="code-block text-[11px] max-h-[480px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {blueprint}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
                <div className="text-4xl mb-3 opacity-30">◈</div>
                <div className="text-[12px]">Configurá la landing y generá el blueprint</div>
              </div>
            )}
          </div>
        </div>

        {/* UGC Scripts */}
        <div className="card">
          <div className="font-display font-bold text-[13px] mb-1">Guiones UGC · 15-35 segundos</div>
          <div className="font-mono text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
            3 actos · Hook Curiosidad → Prueba Resultado → Objeción + CTA
          </div>
          <div className="grid grid-cols-3 gap-4">
            {UGC_SCRIPTS.map(section => (
              <div key={section.type} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold" style={{ color: section.color }}>{section.type}</span>
                  <span className="tag" style={{ background: `${section.color}12`, color: section.color, border: `1px solid ${section.color}25`, fontSize:'9px', padding:'2px 7px' }}>
                    {section.duration}
                  </span>
                </div>
                {section.scripts.map((script, i) => (
                  <div key={i} className="copy-block cursor-pointer hover:opacity-90" onClick={() => { navigator.clipboard.writeText(script); toast.success('Guión copiado') }}>
                    <div className="text-[10px] mb-1.5 font-mono" style={{ color: 'var(--text-dim)' }}>Variante {i+1} · clic para copiar</div>
                    <div className="text-[11px] leading-relaxed" style={{ color: section.color === 'var(--gold)' ? 'var(--gold-light)' : section.color === 'var(--teal)' ? '#b0f0e0' : '#ffb0be' }}>
                      {script}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stack Técnico Landing */}
        <div className="card">
          <div className="font-display font-bold text-[13px] mb-4">Stack Técnico · Landing Page High-Trust</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { layer:'Frontend', tech:'Next.js 14 App Router', detail:'SSR + Edge Runtime · LCP < 2.5s', color:'var(--accent-light)' },
              { layer:'Estilos',  tech:'Tailwind CSS',          detail:'Mobile-first · Dark mode nativo', color:'var(--teal)' },
              { layer:'DB/API',   tech:'Supabase',              detail:'Contador dinámico · RLS policies', color:'var(--gold)' },
              { layer:'Pagos PY', tech:'Khipu + Bancard',       detail:'Guaraníes nativos · 0% fraude', color:'var(--rose)' },
            ].map(item => (
              <div key={item.layer} className="p-3 rounded-[10px]" style={{ background: `${item.color}0d`, border: `1px solid ${item.color}22` }}>
                <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'var(--text-dim)' }}>{item.layer}</div>
                <div className="font-bold text-[11px] mb-1" style={{ color: item.color }}>{item.tech}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
