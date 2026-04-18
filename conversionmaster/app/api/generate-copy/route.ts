import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildCopy, calcPsychPrice, calcAnchorPrice, COPY_FRAMEWORKS } from '@/lib/utils'
import { CopyAngle, MarketType, PlatformType } from '@/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product, result, market, angle, platform, price_usd, use_ai } = body as {
      product: string
      result: string
      market: MarketType
      angle: CopyAngle
      platform: PlatformType
      price_usd: number
      use_ai?: boolean
    }

    const price = calcPsychPrice(price_usd, market)
    const anchor = calcAnchorPrice(price_usd, market)
    const fw = COPY_FRAMEWORKS[angle]

    // If use_ai, call Claude for enhanced copy
    if (use_ai) {
      const systemPrompt = `Sos un copywriter de respuesta directa experto en LATAM, especializado en infoproductos digitales.
Aplicás las técnicas de Eugene Schwartz (niveles de awareness) y Gary Halbert (conversación directa, especificidad).
Escribís siempre en español neutro con modismos del mercado objetivo.
Tu copy es directo, específico, sin palabras de relleno, y orientado a la conversión inmediata.
Nivel de awareness objetivo para ángulo "${angle}": ${fw.awareness_level}`

      const userPrompt = `Generá un copy de alta conversión con estas especificaciones:

PRODUCTO: ${product}
RESULTADO PROMETIDO: ${result}
ÁNGULO PSICOGRÁFICO: ${angle}
PLATAFORMA: ${platform === 'meta' ? 'Meta Ads (Andromeda)' : 'TikTok UGC 15-30 segundos'}
MERCADO: ${market.toUpperCase()} — Precio: ${price} (ancla tachada: ${anchor})
PRECIO USD: $${price_usd}

${platform === 'meta' ? `
Estructura Meta Ads:
1. HOOK (1 línea que para el scroll, máx 15 palabras, usa el ángulo ${angle})
2. CUERPO (3-4 párrafos cortos, máx 3 líneas c/u, aplica técnica Schwartz awareness level 3)
3. CTA (1 línea directa con el precio ${price})
` : `
Estructura TikTok UGC:
1. HOOK 0-3seg (texto para leer en pantalla, máx 10 palabras, detiene el scroll)
2. DESARROLLO 3-20seg (hablar a cámara, incluir prueba de resultado, mencionar ${result})
3. CTA 20-30seg (eliminar 1 objeción + precio ${price} + garantía 7 días)
`}

Respondé SOLO con el copy estructurado, sin explicaciones ni preamble.
Usá emojis estratégicamente (máx 3).
El precio siempre en moneda local: ${price}`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''

      // Parse AI response into sections
      const lines = text.split('\n').filter(Boolean)
      const hookIdx = lines.findIndex(l => /hook|0-3|gancho/i.test(l))
      const bodyIdx = lines.findIndex(l => /cuerpo|desarrollo|3-20/i.test(l))
      const ctaIdx  = lines.findIndex(l => /cta|20-30|llamada/i.test(l))

      const hook = hookIdx >= 0 ? lines.slice(hookIdx + 1, bodyIdx > hookIdx ? bodyIdx : hookIdx + 3).join(' ').trim() : lines[0] || ''
      const body = bodyIdx >= 0 ? lines.slice(bodyIdx + 1, ctaIdx > bodyIdx ? ctaIdx : bodyIdx + 6).join('\n').trim() : lines.slice(1, -2).join('\n')
      const cta  = ctaIdx >= 0  ? lines.slice(ctaIdx + 1).join(' ').trim() : lines[lines.length - 1] || ''

      return NextResponse.json({
        hook: hook || text.substring(0, 120),
        body: body || text.substring(120, 600),
        cta:  cta  || text.substring(600),
        prices: {
          usd: `$${price_usd}`,
          local: price,
          anchor_price: anchor,
          local_currency: market === 'py' ? 'PYG' : market === 'mx' ? 'MXN' : market === 'co' ? 'COP' : 'USD',
          psychological_note: `Precio psicológico aplicado: ${price} (no ${anchor})`,
        },
        model: 'claude-sonnet-4-6',
        ai_generated: true,
      })
    }

    // Fallback: framework-based copy (no API cost)
    const copy = buildCopy(angle, product, result, market, price_usd)
    return NextResponse.json({
      ...copy,
      prices: {
        usd: `$${price_usd}`,
        local: price,
        anchor_price: anchor,
        local_currency: market === 'py' ? 'PYG' : 'USD',
        psychological_note: `Precio psicológico: ${price}`,
      },
      ai_generated: false,
    })
  } catch (err) {
    console.error('Copy generation error:', err)
    return NextResponse.json({ error: 'Error generando copy' }, { status: 500 })
  }
}
