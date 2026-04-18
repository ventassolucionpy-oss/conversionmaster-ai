'use client'

import { Topbar } from '@/components/ui/Topbar'
import { scoreColor } from '@/lib/utils'

const NICHES = [
  {
    rank: 1, name: 'Finanzas Personales', sub: 'Ingresos extra · Ahorro · Inversión',
    cpc_meta: 0.48, cpc_tiktok: 0.21, volume: 94, score: 98, ltv: 285,
    color: '#F5A623',
    upsells: ['FE: Ebook Sistema de 5 Fuentes ($47)', 'OB: Planilla + Audio ($27)', 'U1: Workshop Inversión 48hrs ($197)', 'HT: Mastermind Libertad Financiera ($997)'],
    countries: { py: 98, mx: 96, co: 91, ar: 78, cl: 82 },
  },
  {
    rank: 2, name: 'Salud · Biohacking', sub: 'Pérdida de peso · Rendimiento · Energía',
    cpc_meta: 0.62, cpc_tiktok: 0.18, volume: 88, score: 92, ltv: 340,
    color: '#00D4A4',
    upsells: ['FE: Ebook Pérdida de Peso ($37)', 'OB: Plan Meal Prep 21 días ($27)', 'U1: Programa Transformación 8 semanas ($147)', 'HT: Coaching 1:1 Mensual ($497)'],
    countries: { py: 85, mx: 92, co: 88, ar: 90, cl: 87 },
  },
  {
    rank: 3, name: 'Habilidades Digitales · IA', sub: 'Freelance · Automatización · Agencias',
    cpc_meta: 0.35, cpc_tiktok: 0.14, volume: 82, score: 87, ltv: 412,
    color: '#9B7AFF',
    upsells: ['FE: Guía Freelance con IA ($47)', 'OB: Pack de Templates ($19)', 'U1: Curso Automatización Avanzada ($197)', 'HT: Agencia IA Llave en Mano ($1997)'],
    countries: { py: 82, mx: 87, co: 83, ar: 79, cl: 84 },
  },
  {
    rank: 4, name: 'Relaciones · Soft Skills', sub: 'Comunicación · Dating · Confianza',
    cpc_meta: 0.29, cpc_tiktok: 0.12, volume: 74, score: 74, ltv: 195,
    color: '#FF7A5C',
    upsells: ['FE: Ebook Comunicación Asertiva ($27)', 'OB: Audio Meditación Confianza ($17)', 'U1: Workshop Parejas Online ($97)', 'HT: Retiro Presencial ($2500)'],
    countries: { py: 70, mx: 78, co: 75, ar: 80, cl: 73 },
  },
  {
    rank: 5, name: 'Negocios · Ecommerce', sub: 'Dropshipping · Agencias · Consultoría',
    cpc_meta: 0.71, cpc_tiktok: 0.31, volume: 68, score: 68, ltv: 520,
    color: '#6B6A8A',
    upsells: ['FE: Mini-curso Ecommerce ($47)', 'OB: Guía Proveedores LATAM ($27)', 'U1: Mentoría Grupal 4 semanas ($397)', 'HT: Done-With-You 90 días ($2997)'],
    countries: { py: 60, mx: 72, co: 65, ar: 63, cl: 68 },
  },
]

export function NichosClient() {
  return (
    <div>
      <Topbar title="Módulo D · Radar de Nichos LATAM" subtitle="Matriz rentabilidad 2024-2025 · MX CO AR PY CL · Meta + TikTok CPCs" />

      <div className="p-7 animate-fade space-y-5">
        {/* Matrix Table */}
        <div className="card">
          <div className="font-display font-bold text-[13px] mb-1">Matriz de Rentabilidad</div>
          <div className="font-mono text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
            Volumen de búsqueda · CPC Meta/TikTok · LTV promedio · Score compuesto
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['#','Nicho + Upsell Stack','Volumen','CPC Meta','CPC TikTok','LTV avg','Score'].map(h => (
                    <th key={h} className="text-left pb-3 pr-5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NICHES.map(n => (
                  <tr key={n.rank} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                    <td className="py-4 pr-5">
                      <span className="font-mono font-bold text-[16px]" style={{ color: n.color }}>0{n.rank}</span>
                    </td>
                    <td className="py-4 pr-5">
                      <div className="font-bold text-[12px]" style={{ color: n.color }}>{n.name}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.sub}</div>
                    </td>
                    <td className="py-4 pr-5">
                      <div className="w-32 h-1.5 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${n.volume}%`, background: n.color }} />
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{n.volume}/100</span>
                    </td>
                    <td className="py-4 pr-5 font-mono" style={{ color: 'var(--gold)' }}>${n.cpc_meta}</td>
                    <td className="py-4 pr-5 font-mono" style={{ color: 'var(--teal)' }}>${n.cpc_tiktok}</td>
                    <td className="py-4 pr-5 font-mono font-bold" style={{ color: 'var(--gold-light)' }}>${n.ltv}</td>
                    <td className="py-4">
                      <span className="tag" style={{ background: `${n.color}18`, color: n.color, border: `1px solid ${n.color}30` }}>
                        {n.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Niche Detail Cards */}
        <div className="grid grid-cols-1 gap-4">
          {NICHES.map(n => (
            <div key={n.rank} className="card" style={{ borderLeft: `3px solid ${n.color}` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-bold text-[14px]" style={{ color: n.color }}>{n.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.sub}</div>
                </div>
                <div className="flex gap-3 text-right">
                  <div>
                    <div className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>LTV avg</div>
                    <div className="font-mono font-bold text-[14px]" style={{ color: 'var(--gold)' }}>${n.ltv}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-dim)' }}>Score</div>
                    <div className="font-mono font-bold text-[14px]" style={{ color: scoreColor(n.score) }}>{n.score}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Upsell Stack */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Estructura de Upsells</div>
                  {n.upsells.map((u, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5" style={{ background: `${n.color}18`, color: n.color }}>
                        {['FE','OB','U1','HT'][i]}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{u}</div>
                    </div>
                  ))}
                </div>

                {/* Country Scores */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Score por País</div>
                  {Object.entries(n.countries).map(([country, score]) => (
                    <div key={country} className="flex items-center gap-2 mb-2">
                      <div className="w-8 text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--text-muted)' }}>{country}</div>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor(score) }} />
                      </div>
                      <div className="w-6 text-[10px] font-mono text-right" style={{ color: scoreColor(score) }}>{score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
