'use client'

import { useState, useEffect } from 'react'
import { Topbar } from '@/components/ui/Topbar'
import { calculateROI, fmtUSD, fmtPct, roasColor } from '@/lib/utils'
import { ROIInputs, ROIOutput } from '@/types'

const DEFAULT_INPUTS: ROIInputs = {
  cpl: 4.20, conv_rate: 3.8, aov: 47,
  bump_price: 27, bump_uptake: 35,
  u1_price: 197, u1_uptake: 22,
  gateway_pct: 3.9, ad_spend: 2000,
}

type FieldDef = { key: keyof ROIInputs; label: string; step: number; min: number; max: number; prefix?: string; suffix?: string }

const FIELDS: FieldDef[] = [
  { key:'cpl',         label:'Costo por Lead (CPL)',            step:0.1,  min:0.5, max:50,   prefix:'$' },
  { key:'conv_rate',   label:'Tasa Conversión Landing (%)',     step:0.1,  min:0.1, max:20,   suffix:'%' },
  { key:'aov',         label:'Valor Carrito FE (AOV)',          step:1,    min:5,   max:2000, prefix:'$' },
  { key:'bump_price',  label:'Precio Order Bump',               step:1,    min:5,   max:500,  prefix:'$' },
  { key:'bump_uptake', label:'Uptake Order Bump (%)',           step:1,    min:1,   max:80,   suffix:'%' },
  { key:'u1_price',    label:'Precio Upsell 1',                 step:1,    min:10,  max:5000, prefix:'$' },
  { key:'u1_uptake',   label:'Uptake Upsell 1 (%)',             step:1,    min:1,   max:60,   suffix:'%' },
  { key:'gateway_pct', label:'Comisión Gateway (%)',            step:0.1,  min:1,   max:10,   suffix:'%' },
  { key:'ad_spend',    label:'Ad Spend Mensual',                step:100,  min:100, max:50000,prefix:'$' },
]

export function CalculadoraClient() {
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_INPUTS)
  const [result, setResult] = useState<ROIOutput>(calculateROI(DEFAULT_INPUTS))

  useEffect(() => {
    setResult(calculateROI(inputs))
  }, [inputs])

  const update = (key: keyof ROIInputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }))
  }

  const rColor = roasColor(result.roas)
  const beProgress = Math.min(100, Math.round((inputs.conv_rate / result.breakeven_conv) * 100))

  return (
    <div>
      <Topbar title="Módulo C · Calculadora de Rentabilidad" subtitle="ROI real post-comisiones · Break-even · LTV proyectado" />

      <div className="p-7 animate-fade">
        <div className="grid grid-cols-2 gap-6">

          {/* Inputs */}
          <div className="card">
            <div className="font-display font-bold text-[13px] mb-1">Variables del Ecosistema</div>
            <div className="font-mono text-[10px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Modificá cualquier variable — recálculo en tiempo real
            </div>

            <div className="space-y-4">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="label mb-0">{f.label}</label>
                    <div className="font-mono text-[12px] font-bold" style={{ color: 'var(--gold)' }}>
                      {f.prefix || ''}{inputs[f.key]}{f.suffix || ''}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={f.min} max={f.max} step={f.step}
                    value={inputs[f.key]}
                    onChange={e => update(f.key, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[9px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    <span>{f.prefix}{f.min}{f.suffix}</span>
                    <span>{f.prefix}{f.max}{f.suffix}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="btn btn-ghost w-full justify-center mt-4"
              style={{ fontSize: '11px', padding: '7px' }}
            >
              Restaurar valores base
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main ROAS Card */}
            <div
              className="p-5 rounded-[14px]"
              style={{ background: 'linear-gradient(135deg,rgba(108,79,255,0.15),rgba(0,212,164,0.08))', border: '1px solid rgba(108,79,255,0.3)' }}
            >
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>ROAS Real</div>
                  <div className="font-display font-extrabold text-[36px]" style={{ color: rColor }}>{result.roas}x</div>
                  <div className="text-[11px] mt-1" style={{ color: result.roas >= 3 ? 'var(--teal)' : result.roas >= 1.5 ? 'var(--gold)' : 'var(--rose)' }}>
                    {result.roas >= 3 ? '↑ Escalar agresivamente' : result.roas >= 1.5 ? '→ Optimizar y escalar' : '↓ Pausar y revisar'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Ganancia Neta</div>
                  <div className="font-display font-extrabold text-[36px]" style={{ color: result.net_revenue >= 0 ? 'var(--teal)' : 'var(--rose)' }}>
                    {result.net_revenue >= 0 ? '+' : ''}{fmtUSD(result.net_revenue)}
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>post gateway + ad spend</div>
                </div>
              </div>

              {/* Break-even bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>Break-even en {fmtPct(result.breakeven_conv)} conv.</span>
                  <span>Actual: {fmtPct(inputs.conv_rate)}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(beProgress, 100)}%`,
                      background: beProgress >= 100 ? 'var(--teal)' : beProgress >= 60 ? 'linear-gradient(90deg,var(--gold),var(--teal))' : 'linear-gradient(90deg,var(--rose),var(--gold))',
                    }}
                  />
                </div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {beProgress >= 100 ? '✓ Sobre el break-even' : `Necesitás +${fmtPct(result.breakeven_conv - inputs.conv_rate)} conv. rate`}
                </div>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="card">
              <div className="font-display font-bold text-[13px] mb-4">Desglose Detallado</div>
              <div>
                {[
                  { label: 'Leads generados/mes',      val: result.leads.toLocaleString(),          color: 'var(--text-primary)' },
                  { label: 'Ventas Front-End',          val: result.sales.toLocaleString(),          color: 'var(--gold)' },
                  { label: 'Revenue FE',                val: fmtUSD(result.revenue_fe),             color: 'var(--gold)' },
                  { label: 'Revenue Order Bump',        val: fmtUSD(result.revenue_bump),           color: 'var(--teal)' },
                  { label: 'Revenue Upsell 1',          val: fmtUSD(result.revenue_u1),             color: 'var(--accent-light)' },
                  { label: 'Revenue Bruto Total',       val: fmtUSD(result.gross_revenue),          color: 'var(--gold)', bold: true },
                  { label: `(-) Gateway (${inputs.gateway_pct}%)`, val: `-${fmtUSD(result.gateway_fee)}`, color: 'var(--rose)' },
                  { label: '(-) Ad Spend',              val: `-${fmtUSD(inputs.ad_spend)}`,        color: 'var(--rose)' },
                  { label: 'Ganancia Neta',             val: fmtUSD(result.net_revenue),            color: result.net_revenue >= 0 ? 'var(--teal)' : 'var(--rose)', bold: true },
                ].map(row => (
                  <div key={row.label} className="result-row">
                    <span className="result-label">{row.label}</span>
                    <span className="result-value" style={{ color: row.color, fontWeight: row.bold ? 700 : 400, fontSize: row.bold ? '14px' : '13px' }}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LTV & secondary metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'LTV por cliente', val: fmtUSD(result.ltv), color: 'var(--gold)' },
                { label: 'LTV/CAC ratio',   val: `${(result.ltv / inputs.cpl).toFixed(1)}x`, color: 'var(--teal)' },
                { label: 'Payback period',  val: `${result.payback_days}d`, color: 'var(--accent-light)' },
              ].map(m => (
                <div key={m.label} className="p-3 rounded-[10px] text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
                  <div className="font-display font-bold text-[20px]" style={{ color: m.color }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
