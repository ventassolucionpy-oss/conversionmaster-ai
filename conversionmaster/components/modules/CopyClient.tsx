'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Topbar } from '@/components/ui/Topbar'
import { calcPsychPrice, calcAnchorPrice } from '@/lib/utils'
import { CopyAngle, MarketType, PlatformType } from '@/types'

const ANGLES: { value: CopyAngle; label: string; desc: string; color: string }[] = [
  { value: 'miedo',      label: 'Miedo / Dolor',   desc: 'Loss aversion · Amenaza real',        color: 'var(--rose)' },
  { value: 'beneficio',  label: 'Beneficio',        desc: 'Transformación · Aspiracional',       color: 'var(--teal)' },
  { value: 'logica',     label: 'Lógica / ROI',     desc: 'Números · Datos duros · Calculable',  color: 'var(--accent-light)' },
  { value: 'curiosidad', label: 'Curiosidad',        desc: 'Information gap · FOMO · Secreto',   color: 'var(--gold)' },
]

const MARKETS: { value: MarketType; label: string }[] = [
  { value: 'py',    label: '🇵🇾 Paraguay' },
  { value: 'mx',    label: '🇲🇽 México' },
  { value: 'co',    label: '🇨🇴 Colombia' },
  { value: 'ar',    label: '🇦🇷 Argentina' },
  { value: 'latam', label: '🌎 Pan-LATAM (USD)' },
]

interface CopyOutput { hook: string; body: string; cta: string; ai_generated?: boolean }

export function CopyClient() {
  const [platform, setPlatform] = useState<PlatformType>('meta')
  const [angle, setAngle]       = useState<CopyAngle>('miedo')
  const [market, setMarket]     = useState<MarketType>('py')
  const [product, setProduct]   = useState('Sistema de 5 Fuentes de Ingreso')
  const [result, setResult]     = useState('200.000 Gs/mes extra sin dejar tu trabajo')
  const [priceUSD, setPriceUSD] = useState(47)
  const [useAI, setUseAI]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [copy, setCopy]         = useState<CopyOutput | null>(null)
  const [history, setHistory]   = useState<CopyOutput[]>([])

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, result, market, angle, platform, price_usd: priceUSD, use_ai: useAI }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCopy(data)
      setHistory(prev => [data, ...prev].slice(0, 5))
      toast.success(useAI ? '✦ Copy generado con Claude AI' : 'Copy generado con framework')
    } catch (err) {
      toast.error('Error generando copy. Revisá tu API key.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles')
  }

  const localPrice  = calcPsychPrice(priceUSD, market)
  const anchorPrice = calcAnchorPrice(priceUSD, market)

  return (
    <div>
      <Topbar title="Módulo B · Motor de Copywriting Psicográfico" subtitle="Eugene Schwartz · Gary Halbert · Meta Andromeda + TikTok UGC" />

      <div className="p-7 animate-fade">
        <div className="grid grid-cols-2 gap-6">

          {/* Input */}
          <div className="space-y-5">
            {/* Platform Toggle */}
            <div className="card">
              <div className="font-display font-bold text-[13px] mb-3">Plataforma</div>
              <div className="flex gap-2">
                {[
                  { v: 'meta' as PlatformType,   label: '▶ META ADS', sub: 'Andromeda Hook+Body+CTA' },
                  { v: 'tiktok' as PlatformType, label: '◆ TIKTOK UGC', sub: '3 actos · 15-30 seg' },
                ].map(p => (
                  <button
                    key={p.v}
                    onClick={() => setPlatform(p.v)}
                    className="flex-1 p-3 rounded-[10px] border text-left transition-all"
                    style={{
                      border: platform === p.v ? '1px solid rgba(245,166,35,0.4)' : '1px solid var(--border)',
                      background: platform === p.v ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="text-[11px] font-bold" style={{ color: platform === p.v ? 'var(--gold)' : 'var(--text-muted)' }}>
                      {p.label}
                    </div>
                    <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--text-dim)' }}>{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Selector */}
            <div className="card">
              <div className="font-display font-bold text-[13px] mb-3">Ángulo Psicográfico</div>
              <div className="grid grid-cols-2 gap-2">
                {ANGLES.map(a => (
                  <button
                    key={a.value}
                    onClick={() => setAngle(a.value)}
                    className="p-3 rounded-[10px] border text-left transition-all"
                    style={{
                      border: angle === a.value ? `1px solid ${a.color}40` : '1px solid var(--border)',
                      background: angle === a.value ? `${a.color}12` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="text-[11px] font-bold" style={{ color: angle === a.value ? a.color : 'var(--text-muted)' }}>
                      {a.label}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="card space-y-3">
              <div>
                <label className="label">Producto / Sistema</label>
                <input className="input" value={product} onChange={e => setProduct(e.target.value)} />
              </div>
              <div>
                <label className="label">Resultado Específico (con número)</label>
                <input className="input" value={result} onChange={e => setResult(e.target.value)} placeholder="Ej: 200.000 Gs/mes extra..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Mercado</label>
                  <select className="input" value={market} onChange={e => setMarket(e.target.value as MarketType)}>
                    {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Precio (USD)</label>
                  <input type="number" className="input" value={priceUSD} onChange={e => setPriceUSD(Number(e.target.value))} />
                </div>
              </div>

              {/* Price preview */}
              <div className="flex gap-3 p-3 rounded-[8px]" style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.12)' }}>
                <div>
                  <div className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Precio local</div>
                  <div className="font-mono text-[13px] font-bold" style={{ color: 'var(--gold)' }}>{localPrice}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Ancla tachada</div>
                  <div className="font-mono text-[13px]" style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{anchorPrice}</div>
                </div>
              </div>

              {/* AI Toggle */}
              <div className="flex items-center justify-between p-3 rounded-[8px]" style={{ background: 'rgba(108,79,255,0.06)', border: '1px solid rgba(108,79,255,0.15)' }}>
                <div>
                  <div className="text-[11px] font-bold" style={{ color: 'var(--accent-light)' }}>✦ Usar Claude AI</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Copy único vs framework base</div>
                </div>
                <button
                  onClick={() => setUseAI(!useAI)}
                  className="w-11 h-6 rounded-full transition-all relative"
                  style={{ background: useAI ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: useAI ? '24px' : '4px' }}
                  />
                </button>
              </div>

              <button onClick={generate} disabled={loading} className="btn btn-primary w-full justify-center">
                {loading ? 'Generando…' : `Generar Copy ${useAI ? 'con AI ✦' : '▶'}`}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {copy ? (
              <>
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-display font-bold text-[13px]">
                        {platform === 'meta' ? 'Meta Ads' : 'TikTok UGC'} · Ángulo {angle.charAt(0).toUpperCase() + angle.slice(1)}
                      </div>
                      <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {copy.ai_generated ? '✦ Claude AI · claude-sonnet-4-6' : 'Framework Schwartz+Halbert'}
                      </div>
                    </div>
                    <button onClick={() => copyToClipboard(`${copy.hook}\n\n${copy.body}\n\n${copy.cta}`)} className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'11px' }}>
                      Copiar todo
                    </button>
                  </div>

                  {[
                    { label: platform === 'meta' ? 'Hook (Para el scroll · 0-3 seg)' : 'Hook 0-3 seg · Retención máxima', text: copy.hook, cls: 'copy-hook' },
                    { label: platform === 'meta' ? 'Cuerpo de Valor (Awareness Level 3)' : 'Desarrollo 3-20 seg · Prueba de resultado', text: copy.body, cls: 'copy-body' },
                    { label: platform === 'meta' ? 'CTA Directo (Escasez real)' : 'CTA 20-30 seg · Objeción + precio', text: copy.cta, cls: 'copy-cta' },
                  ].map((block) => (
                    <div key={block.label} className="copy-block">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[9px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--accent-light)' }}>
                          {block.label}
                        </div>
                        <button onClick={() => copyToClipboard(block.text)} className="text-[9px]" style={{ color: 'var(--text-dim)' }}>copiar</button>
                      </div>
                      <div className={`text-[12px] leading-relaxed whitespace-pre-line ${block.cls}`}>{block.text}</div>
                    </div>
                  ))}
                </div>

                {/* Prices across markets */}
                <div className="card">
                  <div className="font-display font-bold text-[12px] mb-3">Versiones de Precio · Multi-mercado</div>
                  <div className="grid grid-cols-5 gap-2">
                    {(['py','mx','co','ar','latam'] as MarketType[]).map(m => (
                      <div key={m} className="text-center p-2 rounded-[8px]" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                        <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'var(--text-dim)' }}>{m.toUpperCase()}</div>
                        <div className="font-mono text-[10px]" style={{ color: 'var(--gold-light)' }}>{calcPsychPrice(priceUSD, m)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="text-5xl mb-4 opacity-20">✦</div>
                <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Configurá el ángulo y generá tu copy</div>
                <div className="text-[11px] mt-1 font-mono" style={{ color: 'var(--text-dim)' }}>Schwartz · Halbert · Framework LATAM</div>
              </div>
            )}

            {/* History */}
            {history.length > 1 && (
              <div className="card">
                <div className="font-display font-bold text-[12px] mb-3">Historial · Últimas versiones</div>
                {history.slice(1).map((h, i) => (
                  <div key={i} className="p-2 rounded-[8px] mb-2 cursor-pointer hover:opacity-80" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }} onClick={() => setCopy(h)}>
                    <div className="text-[11px] truncate copy-hook">{h.hook}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
