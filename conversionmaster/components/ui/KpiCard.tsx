'use client'

interface KpiCardProps {
  label: string
  value: string
  delta?: string
  deltaUp?: boolean
  accent?: 'purple' | 'gold' | 'teal' | 'red'
}

const ACCENT_MAP = {
  purple: { top: 'linear-gradient(90deg, #6C4FFF, #9B7AFF)', val: '#9B7AFF' },
  gold:   { top: 'linear-gradient(90deg, #F5A623, #FFD166)',  val: '#F5A623' },
  teal:   { top: '#00D4A4',                                   val: '#00D4A4' },
  red:    { top: '#FF4C6A',                                   val: '#FF4C6A' },
}

export function KpiCard({ label, value, delta, deltaUp, accent = 'purple' }: KpiCardProps) {
  const a = ACCENT_MAP[accent]

  return (
    <div
      className="rounded-[12px] p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[12px]"
        style={{ background: a.top }}
      />

      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="font-display font-extrabold text-[26px]" style={{ color: a.val }}>
        {value}
      </div>
      {delta && (
        <div className="text-[11px] mt-1" style={{ color: deltaUp ? 'var(--teal)' : 'var(--rose)' }}>
          {deltaUp ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  )
}
