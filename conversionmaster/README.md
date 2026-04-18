# ConversionMaster AI — Ecosistema de Ventas LATAM

Hub de optimización de conversión para infoproductos digitales. Meta Ads Andromeda + TikTok UGC + Calculadora ROAS en tiempo real.

## Stack

- **Frontend**: Next.js 15 App Router + Tailwind CSS + Syne/Manrope/DM Mono fonts
- **AI Engine**: Anthropic Claude claude-sonnet-4-6 (copy + ebook prompts + Lovable blueprints)
- **Database**: Supabase (PostgreSQL + RLS + Edge Functions)
- **State**: Zustand (currency toggle, market config)
- **Deploy**: Vercel (región gru1 - São Paulo)

## Módulos

| Módulo | Función |
|--------|---------|
| A · Producto | Generador de stacks FE→OB→U1→DS con precios psicológicos |
| B · Copywriting | Motor Schwartz+Halbert · Meta Andromeda + TikTok UGC |
| C · Calculadora | ROI real post-comisiones · Break-even · LTV |
| D · Nichos | Radar LATAM 2024-2025 · CPC Meta/TikTok por país |
| E · Infoproductos | Master Prompt para ebooks interactivos con micro-learning |
| F · Trust | Lovable Blueprint · Guiones UGC · Landing High-Trust |

## Deploy en Vercel

### 1. Clonar y configurar

```bash
git clone <tu-repo>
cd conversionmaster
npm install
cp .env.local.example .env.local
# Editar .env.local con tus keys
```

### 2. Variables de entorno requeridas

```env
ANTHROPIC_API_KEY=sk-ant-...          # https://console.anthropic.com
NEXT_PUBLIC_SUPABASE_URL=https://...  # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=...         # Supabase service role (solo server)
```

### 3. Setup Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor**
3. Copiar y ejecutar el contenido de `lib/supabase.ts` (variable `SCHEMA_SQL`)
4. El schema crea las 6 tablas + seed de niche_matrix + RLS policies

### 4. Deploy en Vercel

```bash
# Opción A: CLI
npm i -g vercel
vercel --prod

# Opción B: GitHub
# 1. Push a GitHub
# 2. Importar en vercel.com
# 3. Agregar variables de entorno en Settings > Environment Variables
# 4. Deploy automático
```

### 5. Variables en Vercel Dashboard

En **Settings → Environment Variables**, agregar:

| Key | Entorno |
|-----|---------|
| `ANTHROPIC_API_KEY` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview |

## Desarrollo local

```bash
npm run dev
# → http://localhost:3000
```

## API Routes

| Endpoint | Método | Función |
|----------|--------|---------|
| `/api/generate-copy` | POST | Copy con framework o Claude AI |
| `/api/calculate-roi` | POST | Cálculo ROI completo |
| `/api/ebook-prompt` | POST | Master Prompt para ebooks |
| `/api/lovable-prompt` | POST | Blueprint para Lovable |

### Ejemplo: Generate Copy

```bash
curl -X POST http://localhost:3000/api/generate-copy \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Sistema 5 Fuentes",
    "result": "200.000 Gs/mes extra",
    "market": "py",
    "angle": "miedo",
    "platform": "meta",
    "price_usd": 47,
    "use_ai": true
  }'
```

## Precios Psicológicos LATAM

| Mercado | Regla | Ejemplo |
|---------|-------|---------|
| Paraguay (PYG) | round(usd×7420, 1000) − 1000 | $47 → 147.000 Gs |
| México (MXN) | round(usd×18, 50) − 3 | $47 → $847 MXN |
| Colombia (COP) | round(usd×4120, 5000) − 1000 | $47 → $194.000 COP |
| Argentina (ARS) | round(usd×980, 1000) − 100 | $47 → $45.900 ARS |

## Estructura de Archivos

```
conversionmaster/
├── app/
│   ├── api/
│   │   ├── generate-copy/route.ts
│   │   ├── calculate-roi/route.ts
│   │   ├── ebook-prompt/route.ts
│   │   └── lovable-prompt/route.ts
│   ├── dashboard/page.tsx
│   ├── producto/page.tsx
│   ├── copy/page.tsx
│   ├── calculadora/page.tsx
│   ├── nichos/page.tsx
│   ├── infoproducto/page.tsx
│   ├── trust/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── KpiCard.tsx
│   └── modules/
│       ├── DashboardClient.tsx
│       ├── ProductoClient.tsx
│       ├── CopyClient.tsx
│       ├── CalculadoraClient.tsx
│       ├── NichosClient.tsx
│       ├── InfoproductoClient.tsx
│       └── TrustClient.tsx
├── lib/
│   ├── store.ts      (Zustand: currency/market)
│   ├── supabase.ts   (client + schema SQL)
│   └── utils.ts      (ROI calc, copy frameworks, pricing)
├── types/index.ts
├── vercel.json
└── .env.local.example
```

## Copy Frameworks incluidos

- **Eugene Schwartz**: 5 niveles de awareness → copy adaptado por nivel
- **Gary Halbert**: Hook + Especificidad + Promesa + Tensión
- **Ángulos**: Miedo (loss aversion) · Beneficio · Lógica/ROI · Curiosidad
- **Plataformas**: Meta Ads (Andromeda 3 bloques) · TikTok UGC (3 actos 15-35seg)

## Licencia

Proyecto privado. Todos los derechos reservados.
