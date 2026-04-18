// ─── Product Types ────────────────────────────────────────
export type ProductType = 'ebook' | 'curso' | 'workshop' | 'mastermind' | 'template'
export type NicheType = 'finanzas' | 'salud' | 'digital' | 'relaciones' | 'negocios'
export type MarketType = 'py' | 'mx' | 'co' | 'ar' | 'cl' | 'latam'
export type CurrencyType = 'USD' | 'PYG' | 'MXN' | 'COP' | 'ARS'
export type PlatformType = 'meta' | 'tiktok' | 'youtube'
export type CopyAngle = 'miedo' | 'beneficio' | 'logica' | 'curiosidad'

export interface Product {
  id: string
  name: string
  type: ProductType
  niche: NicheType
  price_usd: number
  price_pyg: number
  active: boolean
  created_at: string
}

export interface OfferStack {
  id: string
  product_id: string
  bump_product_id?: string
  upsell1_id?: string
  downsell_id?: string
  bump_uptake_pct: number
  u1_uptake_pct: number
  aov_projected: number
  // Populated via join
  product?: Product
  bump?: Product
  upsell1?: Product
  downsell?: Product
}

export interface GeneratedOffer {
  fe: { name: string; price_usd: number; price_local: string; description: string }
  ob: { name: string; price_usd: number; price_local: string; description: string }
  u1: { name: string; price_usd: number; price_local: string; description: string }
  ds: { name: string; price_usd: number; price_local: string; description: string }
  aov_projected: number
  aov_max: number
}

// ─── Copy Types ────────────────────────────────────────────
export interface CopyRequest {
  product: string
  result: string
  market: MarketType
  angle: CopyAngle
  platform: PlatformType
  price_usd: number
}

export interface GeneratedCopy {
  hook: string
  body: string
  cta: string
  platform: PlatformType
  angle: CopyAngle
  market: MarketType
  prices: PriceDisplay
}

export interface PriceDisplay {
  usd: string
  local: string
  local_currency: CurrencyType
  anchor_price: string
  psychological_note: string
}

// ─── Calculator Types ──────────────────────────────────────
export interface ROIInputs {
  cpl: number
  conv_rate: number
  aov: number
  bump_price: number
  bump_uptake: number
  u1_price: number
  u1_uptake: number
  gateway_pct: number
  ad_spend: number
}

export interface ROIOutput {
  leads: number
  sales: number
  revenue_fe: number
  revenue_bump: number
  revenue_u1: number
  gross_revenue: number
  gateway_fee: number
  net_revenue: number
  roas: number
  breakeven_conv: number
  ltv: number
  payback_days: number
}

// ─── Niche Types ───────────────────────────────────────────
export interface NicheData {
  niche: string
  country: MarketType
  cpc_meta: number
  cpc_tiktok: number
  search_volume: number
  score: number
  ltv_avg: number
  upsell_structure: string[]
}

// ─── Campaign / Andromeda Types ────────────────────────────
export interface AndromedaPhase {
  name: string
  days: number
  daily_budget: number
  description: string
  expected_leads: number
  expected_sales: number
  expected_revenue: number
  roas: number
}

export interface AndromedaConfig {
  cpm: number
  ctr: number
  lp_conv: number
  checkout_conv: number
  aov: number
  initial_budget: number
  scale_multiplier: number
}

// ─── Store Types ───────────────────────────────────────────
export interface AppStore {
  currency: CurrencyType
  market: MarketType
  pygRate: number
  setCurrency: (c: CurrencyType) => void
  setMarket: (m: MarketType) => void
  setPygRate: (r: number) => void
  formatPrice: (usd: number) => string
}
