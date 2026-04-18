'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Topbar } from '@/components/ui/Topbar'

const NICHES = ['Finanzas Personales · Ingresos Extra','Salud · Pérdida de Peso','Habilidades Digitales · IA','Relaciones · Comunicación','Negocios · Ecommerce']

export function InfoproductoClient() {
  const [niche, setNiche]     = useState(NICHES[0])
  const [pages, setPages]     = useState(60)
  const [avatar, setAvatar]   = useState('Profesional 28-42 años, salario fijo, desea ingresos extra sin renunciar, tiempo limitado.')
  const [prodName, setProd]   = useState('El Método de las 5 Fuentes')
  const [prompt, setPrompt]   = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ebook-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, pages, avatar, product_name: prodName }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPrompt(data.prompt)
      toast.success('Master Prompt generado con Claude AI ✦')
    } catch {
      toast.error('Error. Verificá tu ANTHROPIC_API_KEY')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Topbar title="Módulo E · Fábrica de Infoproductos" subtitle="Master Prompt · Micro-learning · Storytelling · Action Items" />

      <div className="p-7 animate-fade">
        <div className="grid grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div className="font-display font-bold text-[13px] mb-1">Configuración del Ebook</div>
            <div>
              <label className="label">Nicho</label>
              <select className="input" value={niche} onChange={e => setNiche(e.target.value)}>
                {NICHES.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nombre del Producto</label>
              <input className="input" value={prodName} onChange={e => setProd(e.target.value)} />
            </div>
            <div>
              <label className="label">Páginas objetivo: {pages}</label>
              <input type="range" min={20} max={200} step={5} value={pages} onChange={e => setPages(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="label">Perfil Avatar</label>
              <textarea className="input resize-none" rows={4} value={avatar} onChange={e => setAvatar(e.target.value)} />
            </div>
            <button onClick={generate} disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? 'Generando con Claude AI…' : 'Generar Master Prompt ✦'}
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-bold text-[13px]">Master Prompt Generado</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Listo para Claude · GPT-4 · Gemini</div>
              </div>
              {prompt && (
                <button onClick={() => { navigator.clipboard.writeText(prompt); toast.success('Copiado') }} className="btn btn-ghost" style={{ padding:'5px 12px', fontSize:'11px' }}>
                  Copiar
                </button>
              )}
            </div>

            {prompt ? (
              <div className="code-block text-[11px] max-h-[500px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {prompt}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
                <div className="text-4xl mb-3 opacity-30">✦</div>
                <div className="text-[12px]">Configurá el ebook y generá el prompt</div>
              </div>
            )}
          </div>
        </div>

        {/* Structure reference */}
        <div className="card mt-5">
          <div className="font-display font-bold text-[13px] mb-4">Estructura de Micro-learning · Referencia</div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { phase: '20%', label: 'Victorias Rápidas', desc: 'Caps 1-3: historia de transformación + primera acción de impacto inmediato. El lector debe ganar confianza.', color: 'var(--teal)' },
              { phase: '60%', label: 'Sistema Core',       desc: 'Caps 4-10: el método completo. Cada capítulo = 1 resultado. Action Item cada 3 páginas. Cliffhanger al final.', color: 'var(--accent-light)' },
              { phase: '20%', label: 'Nivel Avanzado',     desc: 'Caps 11+: multiplicadores y escala. Prepara al lector para el Upsell 1 de forma natural.', color: 'var(--gold)' },
              { phase: 'OB+', label: 'Checklist + Audio',  desc: 'Complemento inmediato: Checklist de implementación + audio walkthrough. Visible en el checkout como Order Bump.', color: 'var(--rose)' },
            ].map(item => (
              <div key={item.phase} className="p-4 rounded-[10px]" style={{ background: `${item.color}0d`, border: `1px solid ${item.color}25` }}>
                <div className="font-mono font-bold text-[20px] mb-1" style={{ color: item.color }}>{item.phase}</div>
                <div className="font-bold text-[11px] mb-2" style={{ color: item.color }}>{item.label}</div>
                <div className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
