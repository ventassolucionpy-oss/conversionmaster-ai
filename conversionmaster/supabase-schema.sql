-- ═══════════════════════════════════════════════════════
-- ConversionMaster AI · Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- 0. Extensions
create extension if not exists "pgcrypto";

-- ─── 1. PRODUCTS ──────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text check (type in ('ebook','curso','workshop','mastermind','template')) not null,
  niche       text check (niche in ('finanzas','salud','digital','relaciones','negocios')) not null,
  price_usd   numeric(10,2) check (price_usd > 0) not null,
  price_pyg   numeric(12,0) generated always as (
                floor(price_usd * 7420 / 1000) * 1000 - 1000
              ) stored,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ─── 2. OFFER STACKS ──────────────────────────────────────
create table if not exists offer_stacks (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid references products(id) on delete cascade not null,
  bump_product_id   uuid references products(id),
  upsell1_id        uuid references products(id),
  downsell_id       uuid references products(id),
  bump_uptake_pct   numeric(5,2) default 35,
  u1_uptake_pct     numeric(5,2) default 22,
  created_at        timestamptz default now()
);

-- View: AOV proyectado
create or replace view offer_stacks_with_aov as
select
  os.*,
  p_fe.price_usd                                            as fe_price,
  p_ob.price_usd                                            as ob_price,
  p_u1.price_usd                                            as u1_price,
  round(
    coalesce(p_fe.price_usd, 0)
    + coalesce(p_ob.price_usd, 0) * os.bump_uptake_pct / 100
    + coalesce(p_u1.price_usd, 0) * os.u1_uptake_pct  / 100
  , 2)                                                      as aov_projected,
  round(
    coalesce(p_fe.price_usd, 0)
    + coalesce(p_ob.price_usd, 0)
    + coalesce(p_u1.price_usd, 0)
  , 2)                                                      as aov_max
from offer_stacks os
left join products p_fe on p_fe.id = os.product_id
left join products p_ob on p_ob.id = os.bump_product_id
left join products p_u1 on p_u1.id = os.upsell1_id;

-- ─── 3. AD COPIES ─────────────────────────────────────────
create table if not exists ad_copies (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade not null,
  platform    text check (platform in ('meta','tiktok','youtube')) not null,
  angle       text check (angle in ('miedo','beneficio','logica','curiosidad')) not null,
  market      text check (market in ('py','mx','co','ar','cl','latam')) not null,
  hook        text not null,
  body        text not null,
  cta         text not null,
  ctr_actual  numeric(5,2),
  roas_copy   numeric(8,2),
  ab_score    numeric(5,2) generated always as (
                coalesce(ctr_actual,0) * 0.40
                + coalesce(roas_copy,0) * 0.60
              ) stored,
  is_winner   boolean default false,
  created_at  timestamptz default now()
);

-- ─── 4. CAMPAIGNS ─────────────────────────────────────────
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  stack_id        uuid references offer_stacks(id),
  copy_id         uuid references ad_copies(id),
  name            text not null,
  phase           int check (phase between 1 and 4) default 1,
  daily_budget    numeric(10,2) not null,
  spend_total     numeric(12,2) default 0,
  revenue_total   numeric(12,2) default 0,
  status          text check (status in ('active','paused','ended')) default 'active',
  created_at      timestamptz default now()
);

-- View: ROAS live
create or replace view campaigns_with_roas as
select
  c.*,
  case when c.spend_total > 0
    then round(c.revenue_total / c.spend_total, 2)
    else 0
  end as roas_actual
from campaigns c;

-- ─── 5. CONVERSIONS ───────────────────────────────────────
create table if not exists conversions (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid references campaigns(id),
  event_type      text check (event_type in ('lead','fe_sale','bump','upsell1','downsell')) not null,
  amount_usd      numeric(10,2) not null,
  amount_local    numeric(14,2),
  currency        char(3) default 'USD',
  gateway         text check (gateway in ('stripe','khipu','mercadopago','transferencia','bancard')),
  gateway_fee     numeric(8,2),
  net_amount      numeric(10,2) generated always as (
                    amount_usd - coalesce(gateway_fee, 0)
                  ) stored,
  created_at      timestamptz default now()
);

-- Trigger: update campaign revenue on new conversion
create or replace function update_campaign_revenue()
returns trigger language plpgsql as $$
begin
  if new.event_type in ('fe_sale','bump','upsell1','downsell') then
    update campaigns
    set revenue_total = revenue_total + new.net_amount,
        spend_total   = spend_total   -- not updated here, done via Meta webhook
    where id = new.campaign_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_update_campaign_revenue on conversions;
create trigger trg_update_campaign_revenue
  after insert on conversions
  for each row execute function update_campaign_revenue();

-- ─── 6. NICHE MATRIX ──────────────────────────────────────
create table if not exists niche_matrix (
  id              uuid primary key default gen_random_uuid(),
  niche           text not null,
  country         char(5) not null,
  cpc_meta        numeric(6,3),
  cpc_tiktok      numeric(6,3),
  search_volume   int,
  score           int check (score between 0 and 100),
  ltv_avg         numeric(8,2),
  upsell_stack    text[],
  updated_at      timestamptz default now(),
  unique(niche, country)
);

-- Seed: LATAM niche data
insert into niche_matrix (niche, country, cpc_meta, cpc_tiktok, search_volume, score, ltv_avg, upsell_stack) values
  ('Finanzas Personales', 'py',    0.22, 0.09,  45000,  98, 285, ARRAY['Ebook $47','Planilla $27','Workshop $197','Mastermind $997']),
  ('Finanzas Personales', 'mx',    0.48, 0.21, 380000,  96, 312, ARRAY['Ebook $47','Planilla $27','Workshop $197','Mastermind $997']),
  ('Finanzas Personales', 'co',    0.35, 0.15, 210000,  91, 268, ARRAY['Ebook $37','Audio $17','Taller $147','Coaching $497']),
  ('Finanzas Personales', 'ar',    0.28, 0.11, 190000,  85, 245, ARRAY['Ebook $27','Audio $17','Taller $97','Coaching $297']),
  ('Salud / Biohacking',  'py',    0.18, 0.08,  32000,  88, 340, ARRAY['Ebook $37','Meal Prep $27','Programa $147','Coaching $497']),
  ('Salud / Biohacking',  'mx',    0.62, 0.18, 290000,  85, 365, ARRAY['Ebook $37','Meal Prep $27','Programa $147','Coaching $497']),
  ('Salud / Biohacking',  'ar',    0.29, 0.12, 175000,  82, 310, ARRAY['Ebook $27','Guía $17','Programa $97','Coaching $297']),
  ('Habilidades Digitales','py',   0.15, 0.07,  28000,  87, 412, ARRAY['Guía $47','Templates $19','Curso $197','Agencia $1997']),
  ('Habilidades Digitales','mx',   0.35, 0.14, 240000,  84, 438, ARRAY['Guía $47','Templates $19','Curso $197','Agencia $1997']),
  ('Habilidades Digitales','latam',0.30, 0.13, 500000,  80, 450, ARRAY['Guía $47','Templates $19','Curso $197','Agencia $1997']),
  ('Relaciones / Soft Skills','latam',0.29,0.12,190000, 74, 195, ARRAY['Ebook $27','Audio $17','Workshop $97','Retiro $2500']),
  ('Negocios / Ecommerce','mx',    0.71, 0.31, 320000,  68, 520, ARRAY['Mini-curso $47','Guía $27','Mentoría $397','DWY $2997'])
on conflict (niche, country) do update set
  cpc_meta      = excluded.cpc_meta,
  cpc_tiktok    = excluded.cpc_tiktok,
  search_volume = excluded.search_volume,
  score         = excluded.score,
  ltv_avg       = excluded.ltv_avg,
  updated_at    = now();

-- ─── 7. ROW LEVEL SECURITY ────────────────────────────────
alter table products        enable row level security;
alter table offer_stacks    enable row level security;
alter table ad_copies       enable row level security;
alter table campaigns       enable row level security;
alter table conversions     enable row level security;
alter table niche_matrix    enable row level security;

-- Public: niche_matrix readable without auth (for dashboard)
drop policy if exists "Public niche read" on niche_matrix;
create policy "Public niche read" on niche_matrix
  for select using (true);

-- Authenticated: full CRUD on own data
drop policy if exists "Auth products" on products;
create policy "Auth products" on products
  for all using (auth.role() = 'authenticated');

drop policy if exists "Auth stacks" on offer_stacks;
create policy "Auth stacks" on offer_stacks
  for all using (auth.role() = 'authenticated');

drop policy if exists "Auth copies" on ad_copies;
create policy "Auth copies" on ad_copies
  for all using (auth.role() = 'authenticated');

drop policy if exists "Auth campaigns" on campaigns;
create policy "Auth campaigns" on campaigns
  for all using (auth.role() = 'authenticated');

drop policy if exists "Auth conversions" on conversions;
create policy "Auth conversions" on conversions
  for all using (auth.role() = 'authenticated');

-- ─── 8. UTILITY FUNCTIONS ─────────────────────────────────

-- Psychological PYG price from USD
create or replace function calc_pyg_price(usd_price numeric)
returns numeric language sql immutable as $$
  select floor(usd_price * 7420 / 1000) * 1000 - 1000;
$$;

-- Full ROI calculation
create or replace function calculate_roi(
  p_cpl           numeric,
  p_conv_rate     numeric,  -- percentage e.g. 3.8
  p_aov           numeric,
  p_bump_price    numeric,
  p_bump_uptake   numeric,  -- percentage e.g. 35
  p_u1_price      numeric,
  p_u1_uptake     numeric,  -- percentage e.g. 22
  p_gateway_pct   numeric,  -- percentage e.g. 3.9
  p_ad_spend      numeric
)
returns jsonb language plpgsql as $$
declare
  v_leads         numeric;
  v_sales         numeric;
  v_rev_fe        numeric;
  v_rev_bump      numeric;
  v_rev_u1        numeric;
  v_gross         numeric;
  v_gateway_fee   numeric;
  v_net           numeric;
  v_roas          numeric;
  v_ltv           numeric;
begin
  v_leads       := p_ad_spend / p_cpl;
  v_sales       := round(v_leads * (p_conv_rate / 100));
  v_rev_fe      := v_sales * p_aov;
  v_rev_bump    := v_sales * p_bump_price * (p_bump_uptake / 100);
  v_rev_u1      := v_sales * p_u1_price * (p_u1_uptake / 100);
  v_gross       := v_rev_fe + v_rev_bump + v_rev_u1;
  v_gateway_fee := v_gross * (p_gateway_pct / 100);
  v_net         := v_gross - v_gateway_fee - p_ad_spend;
  v_roas        := case when p_ad_spend > 0 then round(v_gross / p_ad_spend, 2) else 0 end;
  v_ltv         := case when v_sales > 0 then round(v_gross / v_sales, 2) else 0 end;

  return jsonb_build_object(
    'leads',          round(v_leads),
    'sales',          v_sales,
    'revenue_fe',     round(v_rev_fe, 2),
    'revenue_bump',   round(v_rev_bump, 2),
    'revenue_u1',     round(v_rev_u1, 2),
    'gross_revenue',  round(v_gross, 2),
    'gateway_fee',    round(v_gateway_fee, 2),
    'net_revenue',    round(v_net, 2),
    'roas',           v_roas,
    'ltv',            v_ltv
  );
end;
$$;

-- Example usage:
-- select calculate_roi(4.20, 3.8, 47, 27, 35, 197, 22, 3.9, 2000);

-- ─── 9. INDEXES ───────────────────────────────────────────
create index if not exists idx_ad_copies_product    on ad_copies(product_id);
create index if not exists idx_ad_copies_platform   on ad_copies(platform, angle, market);
create index if not exists idx_conversions_campaign on conversions(campaign_id);
create index if not exists idx_conversions_type     on conversions(event_type, created_at);
create index if not exists idx_campaigns_status     on campaigns(status);
create index if not exists idx_niche_country        on niche_matrix(country, score desc);

-- ═══════════════════════════════════════════════════════════
-- DONE. Schema ready. Verify with:
-- select table_name from information_schema.tables
-- where table_schema = 'public';
-- ═══════════════════════════════════════════════════════════
