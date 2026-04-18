import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { niche, pages, avatar, product_name } = await req.json()

    const prompt = `Generá un Master Prompt profesional para crear un ebook interactivo de alta conversión.

ESPECIFICACIONES:
- Nicho: ${niche}
- Páginas objetivo: ${pages}
- Avatar: ${avatar}
- Nombre del producto: ${product_name || 'Ebook Premium'}

El Master Prompt debe incluir:
1. ROL del LLM que va a escribir el ebook
2. OBJETIVO específico y medible
3. ESTRUCTURA obligatoria con micro-learning cada 3 páginas
4. REGLAS de escritura (tono, párrafos, idioma LATAM)
5. SISTEMA anti-abandono (cliffhangers, progressión 20/60/20)
6. FORMATO de Action Items (tarea + tiempo + resultado esperado)
7. INSTRUCCIÓN de entrega (qué debe generar primero)

El prompt debe ser listo para pegar en Claude, GPT-4 o Gemini.
Escribilo en inglés técnico (los LLMs responden mejor en inglés para estructura).
Máximo 600 palabras. Directo, sin explicaciones extras.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ prompt: text })
  } catch (err) {
    console.error('Ebook prompt error:', err)
    return NextResponse.json({ error: 'Error generando prompt' }, { status: 500 })
  }
}
