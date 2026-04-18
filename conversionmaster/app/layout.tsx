import type { Metadata } from 'next'
import { DM_Mono, Syne, Manrope } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'ConversionMaster AI — Ecosistema de Ventas LATAM',
  description: 'Hub de optimización de conversión para infoproductos digitales en LATAM. Meta Ads Andromeda + TikTok UGC + Calculadora ROAS.',
  keywords: ['conversión', 'ROAS', 'infoproductos', 'LATAM', 'Meta Ads', 'TikTok'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${manrope.variable} ${dmMono.variable}`}>
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111120',
              color: '#F0EEF8',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
