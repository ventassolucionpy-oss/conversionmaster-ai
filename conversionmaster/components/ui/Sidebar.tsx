'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { href: '/dashboard',      label: 'Dashboard',                sub: 'KPIs & Overview' },
      { href: '/producto',       label: 'Módulo A · Producto',      sub: 'Blue Ocean Stack' },
      { href: '/copy',           label: 'Módulo B · Copywriting',   sub: 'Schwartz + Halbert' },
      { href: '/calculadora',    label: 'Módulo C · Rentabilidad',  sub: 'ROI Calculator' },
    ],
  },
  {
    label: 'Estrategia',
    items: [
      { href: '/nichos',         label: 'Módulo D · Nichos',        sub: 'LATAM Radar' },
      { href: '/infoproducto',   label: 'Módulo E · Infoproductos', sub: 'Fábrica Interactiva' },
      { href: '/trust',          label: 'Módulo F · Trust',         sub: 'Lovable Blueprint' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-[220px] min-w-[220px] flex flex-col sticky top-0 h-screen overflow-y-auto"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="font-display font-extrabold text-[13px] tracking-widest uppercase" style={{ color: 'var(--accent-light)' }}>
          ConversionMaster
        </div>
        <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          AI · v2.0 · LATAM Edition
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <div
              className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2"
              style={{ color: 'var(--text-dim)', letterSpacing: '0.14em' }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex flex-col gap-0.5 px-3 py-2.5 rounded-lg mb-1 border transition-all duration-150',
                    active
                      ? 'nav-active border-[rgba(108,79,255,0.25)]'
                      : 'border-transparent hover:bg-white/5 hover:text-white'
                  )}
                  style={{ color: active ? 'var(--accent-light)' : 'var(--text-muted)' }}
                >
                  <span className="text-[12px] font-semibold leading-tight">{item.label}</span>
                  <span className="font-mono text-[9px] opacity-60">{item.sub}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer meta */}
      <div className="px-5 py-4 font-mono text-[10px]" style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border)' }}>
        <div>ROAS target: 4.2x</div>
        <div className="mt-1">MX · CO · AR · PY · CL</div>
      </div>
    </aside>
  )
}
