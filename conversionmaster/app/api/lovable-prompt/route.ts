import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { calcPsychPrice } from '@/lib/utils'
import { MarketType } from '@/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { product, market, style, price_usd, trust_elements } = await req.json()

    const localPrice = calcPsychPrice(price_usd, market as MarketType)
    const anchorPrice = calcPsychPrice(price_usd * 1.4, market as MarketType)

    const prompt = `Generate a detailed Lovable.dev prompt for a high-converting sales landing page.

PRODUCT: ${product}
MARKET: ${market.toUpperCase()} — Price: ${localPrice} (crossed-out anchor: ${anchorPrice})
AESTHETIC: ${style}
TRUST ELEMENTS: ${trust_elements}

The prompt must specify:
1. VISUAL STYLE: exact colors, typography (use Syne for headlines, Manrope for body), dark/light mode
2. HERO SECTION: video UGC placeholder left 60% + checkout form right 40%
3. TRUST SECTION: security badges SVG, guarantee wording, social proof layout
4. SCARCITY: real countdown timer (midnight) + dynamic slot counter (Supabase)
5. SOCIAL PROOF: 3 testimonial cards with avatar, name, city, result
6. TECH STACK: Next.js 14 App Router + Tailwind + Supabase + Stripe/Khipu
7. PERFORMANCE TARGETS: LCP < 2.5s, CLS < 0.1, mobile-first
8. CONVERSION ELEMENTS: sticky CTA bar on mobile, exit intent, WhatsApp widget

Include exact copy for: headline, subheadline, CTA button text, guarantee text.
Use prices: ${localPrice} primary, crossed-out ${anchorPrice}

Output: Ready-to-paste Lovable prompt, technical and specific, ~400 words.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ blueprint: text, local_price: localPrice, anchor_price: anchorPrice })
  } catch (err) {
    console.error('Lovable blueprint error:', err)
    return NextResponse.json({ error: 'Error generando blueprint' }, { status: 500 })
  }
}
