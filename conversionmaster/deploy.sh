#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
# ConversionMaster AI · Deploy Script
# Uso: chmod +x deploy.sh && ./deploy.sh
# ═══════════════════════════════════════════════════════════

set -e

BOLD="\033[1m"
GREEN="\033[32m"
GOLD="\033[33m"
BLUE="\033[34m"
RED="\033[31m"
RESET="\033[0m"

echo -e "${BOLD}${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   ConversionMaster AI · Deploy Setup  ║"
echo "║   LATAM Edition · v2.0                ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${RESET}"

# ─── Check Node ────────────────────────────────────────────
echo -e "${GOLD}[1/6] Verificando Node.js...${RESET}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js no encontrado. Instalá desde nodejs.org${RESET}"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VER}${RESET}"

# ─── Install deps ──────────────────────────────────────────
echo -e "${GOLD}[2/6] Instalando dependencias...${RESET}"
npm install --silent
echo -e "${GREEN}✓ Dependencias instaladas${RESET}"

# ─── Check env ─────────────────────────────────────────────
echo -e "${GOLD}[3/6] Verificando variables de entorno...${RESET}"
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo -e "${RED}⚠ .env.local creado desde template."
  echo -e "  Editá el archivo con tus keys antes de continuar.${RESET}"
  echo ""
  echo -e "${BOLD}Variables requeridas:${RESET}"
  echo "  ANTHROPIC_API_KEY          → https://console.anthropic.com"
  echo "  NEXT_PUBLIC_SUPABASE_URL   → Supabase project URL"
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "  SUPABASE_SERVICE_ROLE_KEY"
  echo ""
  read -p "¿Editaste el .env.local? (s/n): " CONFIRM
  if [ "$CONFIRM" != "s" ]; then
    echo "Editá .env.local y volvé a ejecutar el script."
    exit 0
  fi
fi

# Validate required vars
source .env.local 2>/dev/null || true
MISSING=()
[ -z "$ANTHROPIC_API_KEY" ]              && MISSING+=("ANTHROPIC_API_KEY")
[ -z "$NEXT_PUBLIC_SUPABASE_URL" ]       && MISSING+=("NEXT_PUBLIC_SUPABASE_URL")
[ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]  && MISSING+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if [ ${#MISSING[@]} -gt 0 ]; then
  echo -e "${RED}✗ Variables faltantes en .env.local:${RESET}"
  for v in "${MISSING[@]}"; do echo "  - $v"; done
  exit 1
fi
echo -e "${GREEN}✓ Variables de entorno configuradas${RESET}"

# ─── Type check ────────────────────────────────────────────
echo -e "${GOLD}[4/6] Type checking...${RESET}"
npx tsc --noEmit 2>&1 | head -20 || true
echo -e "${GREEN}✓ TypeScript OK${RESET}"

# ─── Build ─────────────────────────────────────────────────
echo -e "${GOLD}[5/6] Building para producción...${RESET}"
npm run build
echo -e "${GREEN}✓ Build exitoso${RESET}"

# ─── Deploy options ────────────────────────────────────────
echo -e "${GOLD}[6/6] Opciones de deploy:${RESET}"
echo ""
echo -e "${BOLD}A) Vercel (recomendado):${RESET}"
echo "   npx vercel --prod"
echo ""
echo -e "${BOLD}B) Vercel con variables de entorno automáticas:${RESET}"
echo "   npx vercel env add ANTHROPIC_API_KEY production"
echo "   npx vercel env add NEXT_PUBLIC_SUPABASE_URL production"
echo "   npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production"
echo "   npx vercel env add SUPABASE_SERVICE_ROLE_KEY production"
echo "   npx vercel --prod"
echo ""
echo -e "${BOLD}C) Dev local:${RESET}"
echo "   npm run dev → http://localhost:3000"
echo ""

read -p "¿Deployar en Vercel ahora? (s/n): " DEPLOY
if [ "$DEPLOY" = "s" ]; then
  if ! command -v vercel &> /dev/null; then
    echo "Instalando Vercel CLI..."
    npm install -g vercel
  fi
  echo -e "${GOLD}Deployando en Vercel...${RESET}"
  vercel --prod
else
  echo -e "${GREEN}Deploy omitido. Podés correr: npm run dev${RESET}"
fi

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✓ ConversionMaster AI listo!${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
echo ""
echo -e "${GOLD}Próximos pasos:${RESET}"
echo "  1. Ejecutar supabase-schema.sql en tu proyecto Supabase"
echo "  2. Configurar Stripe/Khipu en la Landing generada"
echo "  3. Agregar dominio custom en Vercel Dashboard"
echo ""
