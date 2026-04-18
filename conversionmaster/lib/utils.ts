import { ROIInputs, ROIOutput, CopyAngle, MarketType, ProductType, GeneratedOffer } from '@/types'

// ─── Psychological Pricing ─────────────────────────────────
export const MARKET_CONFIG: Record<MarketType, {
  currency: string; symbol: string; rate: number;
  roundTo: number; subtract: number; locale: string
}> = {
  py:    { currency: 'PYG', symbol: 'Gs',  rate: 7420, roundTo: 1000, subtract: 1000, locale: 'es-PY' },
  mx:    { currency: 'MXN', symbol: '$',   rate: 18,   roundTo: 50,   subtract: 3,    locale: 'es-MX' },
  co:    { currency: 'COP', symbol: '$',   rate: 4120, roundTo: 5000, subtract: 1000, locale: 'es-CO' },
  ar:    { currency: 'ARS', symbol: '$',   rate: 980,  roundTo: 1000, subtract: 100,  locale: 'es-AR' },
  cl:    { currency: 'CLP', symbol: '$',   rate: 940,  roundTo: 1000, subtract: 100,  locale: 'es-CL' },
  latam: { currency: 'USD', symbol: '$',   rate: 1,    roundTo: 1,    subtract: 0,    locale: 'en-US' },
}

export function calcPsychPrice(usd: number, market: MarketType): string {
  const cfg = MARKET_CONFIG[market]
  if (market === 'latam') return `$${usd}`
  const raw = usd * cfg.rate
  const rounded = Math.round(raw / cfg.roundTo) * cfg.roundTo
  const psych = rounded - cfg.subtract
  if (cfg.currency === 'PYG') return `${psych.toLocaleString(cfg.locale)} Gs`
  return `${cfg.symbol}${psych.toLocaleString(cfg.locale)} ${cfg.currency}`
}

export function calcAnchorPrice(usd: number, market: MarketType): string {
  const anchored = usd * 1.4
  return calcPsychPrice(anchored, market)
}

// ─── ROI Calculator ────────────────────────────────────────
export function calculateROI(inputs: ROIInputs): ROIOutput {
  const {
    cpl, conv_rate, aov, bump_price, bump_uptake,
    u1_price, u1_uptake, gateway_pct, ad_spend
  } = inputs

  const leads      = ad_spend / cpl
  const sales      = Math.round(leads * (conv_rate / 100))
  const revenue_fe = sales * aov
  const revenue_bump = sales * bump_price * (bump_uptake / 100)
  const revenue_u1   = sales * u1_price * (u1_uptake / 100)
  const gross_revenue = revenue_fe + revenue_bump + revenue_u1
  const gateway_fee   = gross_revenue * (gateway_pct / 100)
  const net_revenue   = gross_revenue - gateway_fee - ad_spend
  const roas          = gross_revenue / ad_spend
  const ltv           = sales > 0 ? gross_revenue / sales : 0
  const breakeven_leads = ad_spend / cpl
  const breakeven_sales = (ad_spend * (1 + gateway_pct / 100)) /
    (aov + bump_price * bump_uptake / 100 + u1_price * u1_uptake / 100)
  const breakeven_conv = breakeven_leads > 0
    ? (breakeven_sales / breakeven_leads) * 100 : 0
  const payback_days = ltv > 0 ? Math.ceil(cpl / (ltv / 30)) : 999

  return {
    leads: Math.round(leads),
    sales,
    revenue_fe: Math.round(revenue_fe * 100) / 100,
    revenue_bump: Math.round(revenue_bump * 100) / 100,
    revenue_u1: Math.round(revenue_u1 * 100) / 100,
    gross_revenue: Math.round(gross_revenue * 100) / 100,
    gateway_fee: Math.round(gateway_fee * 100) / 100,
    net_revenue: Math.round(net_revenue * 100) / 100,
    roas: Math.round(roas * 100) / 100,
    breakeven_conv: Math.round(breakeven_conv * 100) / 100,
    ltv: Math.round(ltv * 100) / 100,
    payback_days,
  }
}

// ─── Offer Stack Generator ─────────────────────────────────
const PRODUCT_TEMPLATES: Record<ProductType, {
  badge: string
  fe_prefix: string
  ob_name: string
  u1_name: string
  ds_name: string
  fe_ratio: 1
  ob_ratio: number
  u1_ratio: number
  ds_installments: number
}> = {
  ebook:       { badge:'Ebook PDF',   fe_prefix:'Ebook:',         ob_name:'Checklist + Audio Guía (30min)', u1_name:'Workshop en Vivo 48hrs',    ds_name:'Plan Cuotas · Método Base',    fe_ratio:1, ob_ratio:0.55, u1_ratio:4.1, ds_installments:3 },
  mastermind:  { badge:'Mastermind',  fe_prefix:'Masterclass:',   ob_name:'Sesión Estratégica 1:1 (45min)', u1_name:'Mastermind 4 Semanas',      ds_name:'Mentoría Grupal Mensual',      fe_ratio:1, ob_ratio:0.3,  u1_ratio:8,   ds_installments:6 },
  curso:       { badge:'Curso Online',fe_prefix:'Curso:',         ob_name:'Pack Templates Descargables',    u1_name:'Mentoría Grupal 30 días',   ds_name:'Acceso Solo Módulo 1',         fe_ratio:1, ob_ratio:0.4,  u1_ratio:5,   ds_installments:3 },
  workshop:    { badge:'Workshop',    fe_prefix:'Workshop:',      ob_name:'Workbook + Grabación HD',        u1_name:'Seguimiento + Feedback 30d', ds_name:'Acceso Solo Grabación',        fe_ratio:1, ob_ratio:0.35, u1_ratio:3.5, ds_installments:2 },
  template:    { badge:'Templates',   fe_prefix:'Pack Templates:', ob_name:'Video-Walkthrough Exclusivo',   u1_name:'Sesión Implementación 1:1',  ds_name:'Pack Básico (3 templates)',    fe_ratio:1, ob_ratio:0.45, u1_ratio:4,   ds_installments:3 },
}

export function generateOfferStack(
  productType: ProductType,
  painPoint: string,
  basePriceUSD: number,
  market: MarketType
): GeneratedOffer {
  const t = PRODUCT_TEMPLATES[productType]
  const fePrice  = basePriceUSD
  const obPrice  = Math.round(basePriceUSD * t.ob_ratio)
  const u1Price  = Math.round(basePriceUSD * t.u1_ratio)
  const dsPrice  = Math.round(basePriceUSD * 0.4)
  const shortPain = painPoint.split('+')[0]?.trim().substring(0, 45) || 'Tu Transformación'

  return {
    fe: {
      name: `${t.fe_prefix} ${shortPain}`,
      price_usd: fePrice,
      price_local: calcPsychPrice(fePrice, market),
      description: 'Producto principal · Entrada de confianza · Solución inmediata',
    },
    ob: {
      name: t.ob_name,
      price_usd: obPrice,
      price_local: calcPsychPrice(obPrice, market),
      description: 'One-click add · Visible en checkout · Resistencia mínima',
    },
    u1: {
      name: t.u1_name,
      price_usd: u1Price,
      price_local: calcPsychPrice(u1Price, market),
      description: 'Acelerador de resultados · Acceso vitalicio a grabación',
    },
    ds: {
      name: t.ds_name,
      price_usd: dsPrice,
      price_local: `${t.ds_installments}x ${calcPsychPrice(dsPrice, market)}`,
      description: 'Versión democrática · Elimina barrera de precio',
    },
    aov_projected: Math.round((fePrice + obPrice * 0.35 + u1Price * 0.22) * 100) / 100,
    aov_max: fePrice + obPrice + u1Price,
  }
}

// ─── Copy Frameworks (Schwartz + Halbert) ─────────────────
export const COPY_FRAMEWORKS: Record<CopyAngle, {
  hooks: string[]
  body_template: string
  cta_template: string
  awareness_level: string
}> = {
  miedo: {
    awareness_level: 'Level 2-3 · Problem-Aware',
    hooks: [
      '¿Cuántos fines de mes más vas a llegar sin saber cómo pagar las cuentas?',
      'Si llegás a fin de mes sin dinero, esto puede cambiarte la vida — aunque solo tengas 2 horas libres.',
      'El 87% de los profesionales en LATAM nunca generó un peso extra. ¿Vas a seguir siendo del otro grupo?',
      'Lo que nadie te dice: cada mes que no actuás, el costo de oportunidad crece.',
    ],
    body_template: `El problema no es tu sueldo. Es que nadie te enseñó las 5 formas de multiplicarlo usando lo que ya sabés.

Mientras seguís cambiando tiempo por plata, otros profesionales en {MARKET} ya generan {RESULT} extras por mes — sin horario fijo, sin jefe nuevo.

No necesitás capital. No necesitás un título. Solo el sistema correcto.

{PRODUCT} es exactamente eso: el mapa que ojalá alguien me hubiera dado antes.`,
    cta_template: '▶ Accedé al {PRODUCT} por solo {PRICE} — oferta válida hasta medianoche. Empezá hoy.',
  },
  beneficio: {
    awareness_level: 'Level 3-4 · Solution-Aware',
    hooks: [
      'Imaginate tener {RESULT} extras en tu cuenta — sin tocar tus ahorros ni trabajar de más.',
      'Esto es lo que pasa cuando finalmente tenés un sistema para generar dinero extra.',
      'Profesionales como vos ya están generando {RESULT} extras/mes usando esto.',
      '¿Qué harías con {RESULT} extras cada mes? Empieza por contestar eso.',
    ],
    body_template: `Lo que vas a descubrir en {PRODUCT} no es teoría. Es el sistema exacto que usaron más de 800 personas para generar ingresos extra sin dejar su trabajo actual.

El resultado más común en las primeras 2 semanas: {RESULT} en ingresos adicionales.

✓ Sin capital inicial
✓ Sin dejar tu trabajo actual  
✓ Sin conocimientos técnicos previos

El primer paso lo podés implementar hoy mismo, en menos de 2 horas.`,
    cta_template: '▶ Sí, quiero el sistema por {PRICE} y empezar a generar {RESULT} extras. Entrar ahora →',
  },
  logica: {
    awareness_level: 'Level 4 · Product-Aware (ROI-driven)',
    hooks: [
      'Matemática simple: {PRICE} de inversión ÷ {RESULT} de retorno = ROI del 400%. Calculá vos.',
      'Si invertís {PRICE} y generás {RESULT}/mes, ¿en cuántos días recuperás? (spoiler: menos de 7).',
      'El ROI promedio de este sistema en los primeros 30 días: 847%. Los datos están abajo.',
      'Antes de decidir: {PRICE} ÷ {RESULT} al mes = 0.23 días de trabajo para recuperar la inversión.',
    ],
    body_template: `Analicemos los números juntos:

→ Inversión: {PRICE}
→ Tiempo de implementación: 2 horas
→ Resultado promedio mes 1: {RESULT}
→ ROI calculado: +400-800%

No son promesas vagas. Son resultados documentados de 800+ usuarios con el mismo perfil que el tuyo — profesionales con tiempo limitado y sin capital inicial.

{PRODUCT} incluye calculadora de ROI personalizada para que verifiques tus propios números antes de empezar.`,
    cta_template: '▶ Calculadora de ROI incluida. Accedé por {PRICE} con garantía de 7 días. Ver el sistema →',
  },
  curiosidad: {
    awareness_level: 'Level 1-2 · Unaware to Problem-Aware',
    hooks: [
      'La razón por la que nunca te enseñaron esto en el colegio va a molestarte.',
      'Descubrí por qué personas con el mismo sueldo que vos generan el doble.',
      'Existe un método de 5 pasos para generar ingresos extra que el 96% desconoce.',
      '"No sabía que esto era posible hasta que lo hice." — Esta es la historia de cómo empezó.',
    ],
    body_template: `En {PRODUCT} vas a descubrir:

✓ El "hack mental" que tienen los que sí generan ingresos extra (y que bloquea a todos los demás)
✓ Las 5 fuentes que funcionan en {MARKET} (testeadas, no teoría)
✓ El error #1 que sabotea tus primeros intentos — y cómo evitarlo en 5 minutos
✓ El sistema exacto para tus primeros {RESULT} sin necesitar capital

Todo esto en un sistema de 5 pasos que cualquier persona puede implementar en 2 horas.`,
    cta_template: '▶ Revelá el sistema por {PRICE}. Acceso inmediato + garantía 7 días →',
  },
}

export function buildCopy(
  angle: CopyAngle,
  product: string,
  result: string,
  market: MarketType,
  priceUSD: number
): { hook: string; body: string; cta: string } {
  const fw = COPY_FRAMEWORKS[angle]
  const price = calcPsychPrice(priceUSD, market)
  const marketNames: Record<MarketType, string> = {
    py: 'Paraguay', mx: 'México', co: 'Colombia',
    ar: 'Argentina', cl: 'Chile', latam: 'LATAM'
  }
  const mktName = marketNames[market]
  const hooks = fw.hooks
  const hook = hooks[Math.floor(Math.random() * hooks.length)]
    .replace(/{RESULT}/g, result).replace(/{PRICE}/g, price).replace(/{PRODUCT}/g, product).replace(/{MARKET}/g, mktName)
  const body = fw.body_template
    .replace(/{RESULT}/g, result).replace(/{PRICE}/g, price).replace(/{PRODUCT}/g, product).replace(/{MARKET}/g, mktName)
  const cta = fw.cta_template
    .replace(/{RESULT}/g, result).replace(/{PRICE}/g, price).replace(/{PRODUCT}/g, product).replace(/{MARKET}/g, mktName)
  return { hook, body, cta }
}

// ─── Andromeda Phase Calculator ────────────────────────────
export function calcAndromedaPhases(config: {
  cpm: number; ctr: number; lpConv: number;
  chkConv: number; aov: number; budget1: number; multiplier: number
}) {
  const phases = [
    { name: 'Fase 1 · Test',        days: 7,  multiplier: 1,                    color: '#6B6A8A', desc: 'Validar CPL y creativos. Mín 3 ángulos A/B simultáneos.' },
    { name: 'Fase 2 · Validación',  days: 7,  multiplier: config.multiplier,    color: '#6C4FFF', desc: 'Escalar ganadores. Matar creativos con CTR < 2%.' },
    { name: 'Fase 3 · Escala 1',    days: 14, multiplier: config.multiplier**2, color: '#F5A623', desc: 'CBO activado. Lookalike 1-3%. Expandir creativos UGC.' },
    { name: 'Fase 4 · Escala 2',    days: 14, multiplier: config.multiplier**3, color: '#00D4A4', desc: 'Broad + Retargeting stack. Nuevos creativos + testimonios.' },
  ]

  return phases.map(p => {
    const dailyBudget = config.budget1 * p.multiplier
    const totalSpend  = dailyBudget * p.days
    const impressions = (totalSpend / config.cpm) * 1000
    const clicks      = impressions * (config.ctr / 100)
    const leads       = clicks * (config.lpConv / 100)
    const sales       = Math.round(leads * (config.chkConv / 100))
    const revenue     = sales * config.aov
    const roas        = totalSpend > 0 ? revenue / totalSpend : 0

    return {
      ...p,
      dailyBudget: Math.round(dailyBudget),
      totalSpend: Math.round(totalSpend),
      impressions: Math.round(impressions),
      clicks: Math.round(clicks),
      leads: Math.round(leads),
      sales,
      revenue: Math.round(revenue),
      roas: Math.round(roas * 100) / 100,
    }
  })
}

// ─── Niche Score Color ─────────────────────────────────────
export function scoreColor(score: number): string {
  if (score >= 90) return '#00D4A4'
  if (score >= 75) return '#F5A623'
  if (score >= 60) return '#6C4FFF'
  return '#FF4C6A'
}

export function roasColor(roas: number): string {
  if (roas >= 3) return '#00D4A4'
  if (roas >= 1.5) return '#F5A623'
  return '#FF4C6A'
}

export function fmtUSD(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function fmtPct(n: number, decimals = 1): string {
  return n.toFixed(decimals) + '%'
}
