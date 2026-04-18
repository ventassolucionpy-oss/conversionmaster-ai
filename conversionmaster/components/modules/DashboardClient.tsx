'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/ui/Topbar'
import { KpiCard } from '@/components/ui/KpiCard'
import { useAppStore } from '@/lib/store'
import { calculateROI, fmtUSD, roasColor } from '@/lib/utils'

const SCENARIOS = [
  { name: 'Conservador', conv: 2.0, spend: 1000 },
  { name: 'Base',        conv: 3.8, spend: 2000 },
  { name: 'Optimizado',  conv: 5.0, spend: 3500 },
  { name: 'Escala',      conv: 5.5, spend: 7000 },
  { name: 'Agresivo',    conv: 6.5, spend: 12000 },
]

const FUNNEL_STEPS = [
  { label: 'Impresiones',  key: 'impr',   color: 'rgba(108,79,255,0.5)' },
  { label: 'Clics (CTR)',  key: 'clicks', color: 'rgba(108,79,255,0.65)' },
  { label: 'Leads',        key: 'leads',  color: 'rgba(108,79,255,0.8)' },
  { label: 'Ventas FE',    key: 'sales',  color: '#F5A623' },
  { label: 'Order Bump',   key: 'bumps',  color: '#00D4A4' },
  { label: 'Upsell 1',     key: 'ups',    color: '#FF7A5C' },
]

export function DashboardClient() {
  const { formatPrice } = useAppStore()
  const [spend, setSpend] = useState(2000)

  const roi = calculateROI({
    cpl: 4.20, conv_rate: 3.8, aov: 47,
    bump_price: 27, bump_uptake: 35,
    u1_price: 197, u1_uptake: 22,
    gateway_pct: 3.9, ad_spend: spend,
  })

  const funnel = {
    impr:   Math.round(spend / 8.5 * 1000),
    clicks: Math.round(spend / 8.5 * 1000 * 0.032),
    leads:  roi.leads,
    sales:  roi.sales,
    bumps:  Math.round(roi.sales * 0.35),
    ups:    Math.round(roi.sales * 0.22),
  }
  const funnelMax = funnel.impr

  return (
    <div>
      <Topbar title="Dashboard General" subtitle="Ciclo Q2-2025 · Andromeda Stack activo" />

      <div className="p-7 animate-fade">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <KpiCard label="ROAS Real" value={`${roi.roas}x`} delta="+0.4x vs meta" deltaUp accent="purple" />
          <KpiCard label="AOV Proyectado" value={formatPrice(roi.ltv)} delta={`Bump: ${formatPrice(27)} avg`} deltaUp accent="gold" />
          <KpiCard label="Conv. Rate" value="3.8%" delta="LP optimizada" deltaUp accent="teal" />
          <KpiCard label="CPL Actual" value={formatPrice(4.20)} delta="$0.60 vs sem. ant." deltaUp={false} accent="red" />
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Funnel */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-bold text-[13px]">Funnel de Conversión</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Meta Ads → Lead → Venta → Upsell</div>
              </div>
              <span className="tag tag-purple">Andromeda</span>
            </div>

            <div className="space-y-2.5">
              {FUNNEL_STEPS.map((step) => {
                const val = funnel[step.key as keyof typeof funnel]
                const pct = Math.round((val / funnelMax) * 100)
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className="w-28 text-right text-[11px]" style={{ color: 'var(--text-muted)' }}>{step.label}</div>
                    <div className="flex-1 funnel-bar">
                      <div
                        className="funnel-fill"
                        style={{ width: `${Math.max(pct, 3)}%`, background: step.color }}
                      >
                        {pct > 15 ? `${pct}%` : ''}
                      </div>
                    </div>
                    <div className="w-16 text-right font-mono text-[11px]" style={{ color: 'var(--text-primary)' }}>
                      {val.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4">
              <label className="label">Ad Spend mensual</label>
              <input
                type="range" min={500} max={15000} step={100} value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>$500</span>
                <span className="font-mono" style={{ color: 'var(--gold)' }}>{fmtUSD(spend)}</span>
                <span>$15k</span>
              </div>
            </div>
          </div>

          {/* Offer Stack */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-bold text-[13px]">Stack de Conversión</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>FE → OB → U1 → DS</div>
              </div>
              <span className="tag tag-gold">High-Ticket</span>
            </div>

            {[
              { badge: 'FE', label: 'Front-End Product',   desc: 'Ebook / Mini-curso · Entrada de confianza', price: 47,  color: 'var(--gold)',         bg: 'rgba(245,166,35,0.12)' },
              { badge: 'OB', label: 'Order Bump',          desc: 'Checklist + Audio · Máxima velocidad',      price: 27,  color: 'var(--teal)',         bg: 'rgba(0,212,164,0.09)' },
              { badge: 'U1', label: 'Upsell 1',            desc: 'Workshop · Acelerador de resultados',       price: 197, color: 'var(--accent-light)', bg: 'rgba(108,79,255,0.12)' },
              { badge: 'DS', label: 'Downsell',            desc: 'Plan de pagos · Versión democrática',       price: 57,  color: 'var(--rose)',         bg: 'rgba(255,76,106,0.08)' },
            ].map((item) => (
              <div
                key={item.badge}
                className="flex items-center gap-3 p-3 rounded-[10px] mb-2 border transition-all hover:border-white/10"
                style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.badge}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold">{item.label}</div>
                  <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <div className="font-mono text-[12px] font-medium" style={{ color: item.color }}>
                  {formatPrice(item.price)}
                </div>
              </div>
            ))}

            {/* AOV Summary */}
            <div
              className="mt-3 p-3 rounded-[10px]"
              style={{ background: 'linear-gradient(135deg,rgba(108,79,255,0.1),rgba(0,212,164,0.06))', border: '1px solid rgba(108,79,255,0.2)' }}
            >
              <div className="flex justify-between text-[11px]">
                <span style={{ color: 'var(--text-muted)' }}>AOV proyectado (35%+22% uptake)</span>
                <span className="font-mono font-bold" style={{ color: 'var(--gold)' }}>{formatPrice(81.45)}</span>
              </div>
              <div className="flex justify-between text-[11px] mt-1">
                <span style={{ color: 'var(--text-muted)' }}>LTV/CAC ratio</span>
                <span className="font-mono font-bold" style={{ color: 'var(--teal)' }}>
                  {(81.45 / 4.20).toFixed(1)}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="card">
          <div className="font-display font-bold text-[13px] mb-4">Escenarios de Rentabilidad · Break-even Analysis</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Escenario','Conv. Rate','Ad Spend','Revenue Bruto','ROAS','Ganancia Neta','Estado'].map((h) => (
                    <th key={h} className="text-left pb-3 pr-4 font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCENARIOS.map((s) => {
                  const r = calculateROI({ cpl:4.20, conv_rate:s.conv, aov:47, bump_price:27, bump_uptake:35, u1_price:197, u1_uptake:22, gateway_pct:3.9, ad_spend:s.spend })
                  const status = r.roas >= 3 ? { label:'Escalar', cls:'tag-teal' } : r.roas >= 1.5 ? { label:'Optimizar', cls:'tag-gold' } : { label:'Pausar', cls:'tag-red' }
                  return (
                    <tr key={s.name} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
                      <td className="py-3 pr-4 font-semibold">{s.name}</td>
                      <td className="py-3 pr-4 font-mono">{s.conv}%</td>
                      <td className="py-3 pr-4 font-mono">{fmtUSD(s.spend)}</td>
                      <td className="py-3 pr-4 font-mono" style={{ color: 'var(--gold)' }}>{fmtUSD(r.gross_revenue)}</td>
                      <td className="py-3 pr-4 font-mono font-bold" style={{ color: roasColor(r.roas) }}>{r.roas}x</td>
                      <td className="py-3 pr-4 font-mono" style={{ color: r.net_revenue >= 0 ? 'var(--teal)' : 'var(--rose)' }}>
                        {r.net_revenue >= 0 ? '+' : ''}{fmtUSD(r.net_revenue)}
                      </td>
                      <td className="py-3"><span className={`tag ${status.cls}`}>{status.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
