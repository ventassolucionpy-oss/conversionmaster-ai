import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── SQL Schema (run in Supabase SQL Editor) ───────────────
export const SCHEMA_SQL = `
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('ebook','curso','workshop','mastermind','template')) not null,
  niche text check (niche in ('finanzas','salud','digital','relaciones','negocios')) not null,
  price_usd numeric(10,2) check (price_usd > 0) not null,
  price_pyg numeric(12,0) generated always as (
    floor(price_usd * 7420 / 1000) * 1000 - 1000
  ) stored,
  active boolean default true,
  created_at timestamptz default now()
);

-- Offer stacks (funnel structures)
create table if not exists offer_stacks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  bump_product_id uuid references products(id),
  upsell1_id uuid references products(id),
  downsell_id uuid references products(id),
  bump_uptake_pct numeric(5,2) default 35,
  u1_uptake_pct numeric(5,2) default 22,
  created_at timestamptz default now()
);

-- Ad copies
create table if not exists ad_copies (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  platform text check (platform in ('meta','tiktok','youtube')) not null,
  angle text check (angle in ('miedo','beneficio','logica','curiosidad')) not null,
  market text check (market in ('py','mx','co','ar','cl','latam')) not null,
  hook text not null,
  body text not null,
  cta text not null,
  ctr_actual numeric(5,2),
  roas_copy numeric(8,2),
  ab_score numeric(5,2),
  is_winner boolean default false,
  created_at timestamptz default now()
);

-- Campaigns
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  stack_id uuid references offer_stacks(id),
  copy_id uuid references ad_copies(id),
  name text not null,
  phase int check (phase between 1 and 4) default 1,
  daily_budget numeric(10,2) not null,
  spend_total numeric(12,2) default 0,
  revenue_total numeric(12,2) default 0,
  roas_actual numeric(8,2) generated always as (
    case when spend_total > 0 then revenue_total / spend_total else 0 end
  ) stored,
  status text check (status in ('active','paused','ended')) default 'active',
  created_at timestamptz default now()
);

-- Conversions / events
create table if not exists conversions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id),
  event_type text check (event_type in ('lead','fe_sale','bump','upsell1','downsell')) not null,
  amount_usd numeric(10,2) not null,
  amount_local numeric(14,2),
  currency char(3) default 'USD',
  gateway text check (gateway in ('stripe','khipu','mercadopago','transferencia')),
  gateway_fee numeric(8,2),
  created_at timestamptz default now()
);

-- Niche matrix (LATAM radar)
create table if not exists niche_matrix (
  id uuid primary key default gen_random_uuid(),
  niche text not null,
  country char(2) not null,
  cpc_meta numeric(6,3),
  cpc_tiktok numeric(6,3),
  search_volume int,
  score int check (score between 0 and 100),
  ltv_avg numeric(8,2),
  updated_at timestamptz default now(),
  unique(niche, country)
);

-- Seed niche matrix with LATAM data
insert into niche_matrix (niche, country, cpc_meta, cpc_tiktok, search_volume, score, ltv_avg) values
  ('Finanzas Personales', 'py', 0.22, 0.09, 45000, 98, 285),
  ('Finanzas Personales', 'mx', 0.48, 0.21, 380000, 96, 312),
  ('Finanzas Personales', 'co', 0.35, 0.15, 210000, 91, 268),
  ('Salud / Biohacking', 'py', 0.18, 0.08, 32000, 88, 340),
  ('Salud / Biohacking', 'mx', 0.62, 0.18, 290000, 85, 365),
  ('Salud / Biohacking', 'ar', 0.29, 0.12, 175000, 82, 310),
  ('Habilidades Digitales', 'py', 0.15, 0.07, 28000, 87, 412),
  ('Habilidades Digitales', 'mx', 0.35, 0.14, 240000, 84, 438),
  ('Relaciones / Soft Skills', 'latam', 0.29, 0.12, 190000, 74, 195),
  ('Negocios / Ecommerce', 'mx', 0.71, 0.31, 320000, 68, 520)
on conflict (niche, country) do nothing;

-- Row Level Security
alter table products enable row level security;
alter table offer_stacks enable row level security;
alter table ad_copies enable row level security;
alter table campaigns enable row level security;
alter table conversions enable row level security;
alter table niche_matrix enable row level security;

-- Public read for niche_matrix
create policy "Public niche read" on niche_matrix for select using (true);

-- Authenticated CRUD for rest
create policy "Auth full access products" on products for all using (auth.role() = 'authenticated');
create policy "Auth full access stacks" on offer_stacks for all using (auth.role() = 'authenticated');
create policy "Auth full access copies" on ad_copies for all using (auth.role() = 'authenticated');
create policy "Auth full access campaigns" on campaigns for all using (auth.role() = 'authenticated');
create policy "Auth full access conversions" on conversions for all using (auth.role() = 'authenticated');
`
