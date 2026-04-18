'use client'

import { useAppStore } from '@/lib/store'
import { CurrencyType } from '@/types'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const { currency, setCurrency } = useAppStore()

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-7 py-4"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
    >
      <div>
        <h1 className="font-display font-bold text-[16px] text-white">{title}</h1>
        {subtitle && (
          <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Currency Toggle */}
        <div
          className="flex overflow-hidden rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-strong)' }}
        >
          {(['USD', 'PYG'] as CurrencyType[]).map((cur) => (
            <button
              key={cur}
              onClick={() => setCurrency(cur)}
              className={`px-4 py-1.5 text-[11px] font-bold font-mono transition-all ${
                currency === cur ? 'text-white' : ''
              }`}
              style={{
                background: currency === cur ? 'var(--accent)' : 'transparent',
                color: currency === cur ? '#fff' : 'var(--text-muted)',
              }}
            >
              {cur}
            </button>
          ))}
        </div>

        {/* Live indicator */}
        <span
          className="tag tag-teal flex items-center gap-1.5 text-[10px]"
          style={{ color: 'var(--teal)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
            style={{ background: 'var(--teal)' }}
          />
          Live
        </span>
      </div>
    </div>
  )
}
