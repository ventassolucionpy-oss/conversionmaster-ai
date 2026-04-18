import { create } from 'zustand'
import { AppStore, CurrencyType, MarketType } from '@/types'

const MARKET_RATES: Record<string, { rate: number; symbol: string; code: CurrencyType }> = {
  py:    { rate: 7420,  symbol: 'Gs',   code: 'PYG' },
  mx:    { rate: 18,    symbol: '$',    code: 'MXN' },
  co:    { rate: 4120,  symbol: '$',    code: 'COP' },
  ar:    { rate: 980,   symbol: '$',    code: 'ARS' },
  cl:    { rate: 940,   symbol: '$',    code: 'COP' }, // CLP approx
  latam: { rate: 1,     symbol: '$',    code: 'USD' },
}

export const usePsychPrice = (usd: number, market: MarketType): string => {
  if (market === 'latam') return `$${usd}`
  const { rate, symbol, code } = MARKET_RATES[market]
  const raw = usd * rate

  if (code === 'PYG') {
    const rounded = Math.round(raw / 1000) * 1000
    const psych = rounded - 1000
    return `${psych.toLocaleString('es-PY')} Gs`
  }
  if (code === 'MXN') {
    const rounded = Math.round(raw / 50) * 50
    return `${symbol}${(rounded - 3).toLocaleString('es-MX')} MXN`
  }
  if (code === 'COP') {
    const rounded = Math.round(raw / 5000) * 5000
    return `${symbol}${(rounded - 1000).toLocaleString('es-CO')} COP`
  }
  if (code === 'ARS') {
    const rounded = Math.round(raw / 1000) * 1000
    return `${symbol}${(rounded - 100).toLocaleString('es-AR')} ARS`
  }
  return `$${usd}`
}

export const useAppStore = create<AppStore>((set, get) => ({
  currency: 'USD',
  market: 'py',
  pygRate: 7420,
  setCurrency: (currency) => set({ currency }),
  setMarket: (market) => set({ market }),
  setPygRate: (pygRate) => set({ pygRate }),
  formatPrice: (usd: number) => {
    const { currency, pygRate } = get()
    if (currency === 'USD') return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
    const raw = usd * pygRate
    const rounded = Math.round(raw / 1000) * 1000
    const psych = rounded - 1000
    return `${psych.toLocaleString('es-PY')} Gs`
  },
}))
