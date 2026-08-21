-- Esquema de contenido editable del sitio (servicios y galería).
--
-- Modelo de permisos:
--   * Lectura pública (anon) de todo lo publicado -> el sitio SSR usa la anon key.
--   * Escritura solo para usuarios autenticados presentes en `dashboard_users`.
--     El dashboard usa la sesión del usuario, nunca la service role key.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Allowlist de administradores
-- ---------------------------------------------------------------------------

create table if not exists public.dashboard_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  nombre text,
  created_at timestamptz not null default now()
);

alter table public.dashboard_users enable row level security;

-- Cada admin puede ver su propia fila (sirve para validar acceso en el server).
create policy "dashboard_users_select_self"
  on public.dashboard_users
  for select
  using (auth.uid() = user_id);

create or replace function public.is_dashboard_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.dashboard_users du where du.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Servicios
-- ---------------------------------------------------------------------------

create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  details text not null default '',
  footer text not null default '',
  image_url text,
  image_alt text not null default '',
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists servicios_orden_idx on public.servicios (orden);

create table if not exists public.servicio_fotos (
  id uuid primary key default gen_random_uuid(),
  servicio_id uuid not null references public.servicios (id) on delete cascade,
  src text not null,
  alt text not null default '',
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists servicio_fotos_servicio_idx
  on public.servicio_fotos (servicio_id, orden);

-- ---------------------------------------------------------------------------
-- Galería
-- ---------------------------------------------------------------------------

create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  image_desktop text,
  image_mobile text,
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists galeria_orden_idx on public.galeria (orden);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists servicios_touch_updated_at on public.servicios;
create trigger servicios_touch_updated_at
  before update on public.servicios
  for each row execute function public.touch_updated_at();

drop trigger if exists galeria_touch_updated_at on public.galeria;
create trigger galeria_touch_updated_at
  before update on public.galeria
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.servicios enable row level security;
alter table public.servicio_fotos enable row level security;
alter table public.galeria enable row level security;

-- Lectura pública: solo lo publicado.
create policy "servicios_public_read"
  on public.servicios for select
  using (publicado = true or public.is_dashboard_user());

create policy "servicio_fotos_public_read"
  on public.servicio_fotos for select
  using (
    exists (
      select 1 from public.servicios s
      where s.id = servicio_id and (s.publicado = true or public.is_dashboard_user())
    )
  );

create policy "galeria_public_read"
  on public.galeria for select
  using (publicado = true or public.is_dashboard_user());

-- Escritura: solo administradores del dashboard.
create policy "servicios_admin_write"
  on public.servicios for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());

create policy "servicio_fotos_admin_write"
  on public.servicio_fotos for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());

create policy "galeria_admin_write"
  on public.galeria for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());
