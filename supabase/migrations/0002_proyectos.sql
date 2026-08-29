-- Portafolio de proyectos: ficha, galería, planos y créditos.
--
-- Mismo modelo de permisos que `0001_contenido.sql`:
--   * Lectura pública (anon) de lo publicado -> el sitio SSR usa la anon key.
--   * Escritura solo para usuarios presentes en `dashboard_users`.

-- ---------------------------------------------------------------------------
-- Proyectos
-- ---------------------------------------------------------------------------

create table if not exists public.proyectos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  -- Frase corta bajo el título en el hero.
  tagline text not null default '',
  -- Entradilla del bloque editorial (el párrafo grande a la izquierda).
  resumen text not null default '',
  -- Cuerpo largo. Se guarda tal cual y se separa en párrafos por línea en
  -- blanco al leerlo, para que el panel sea un simple textarea.
  descripcion text not null default '',
  cover_url text,
  cover_alt text not null default '',
  -- Ficha técnica. Son los campos que trae la descripción que manda el
  -- despacho a las publicaciones (firma, tipología, año, área, etc.).
  firma text not null default 'VMV Arquitectos',
  tipologia text not null default '',
  anio integer,
  area text not null default '',
  ubicacion text not null default '',
  niveles text not null default '',
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proyectos_orden_idx on public.proyectos (orden);

-- ---------------------------------------------------------------------------
-- Galería de imágenes
-- ---------------------------------------------------------------------------

create table if not exists public.proyecto_fotos (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos (id) on delete cascade,
  src text not null,
  alt text not null default '',
  -- Las fotos anchas ocupan la fila completa; el resto van de dos en dos.
  -- Es lo único que necesita el mosaico para no verse uniforme.
  ancha boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists proyecto_fotos_proyecto_idx
  on public.proyecto_fotos (proyecto_id, orden);

-- ---------------------------------------------------------------------------
-- Documentos técnicos (planos)
-- ---------------------------------------------------------------------------

create table if not exists public.proyecto_documentos (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos (id) on delete cascade,
  titulo text not null,
  descripcion text not null default '',
  -- Imagen que se muestra en la página (el plano rasterizado).
  preview_url text,
  -- Archivo descargable opcional: el PDF del plano.
  archivo_url text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists proyecto_documentos_proyecto_idx
  on public.proyecto_documentos (proyecto_id, orden);

-- ---------------------------------------------------------------------------
-- Créditos / colaboradores
-- ---------------------------------------------------------------------------

create table if not exists public.proyecto_creditos (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos (id) on delete cascade,
  -- Agrupador: "Diseño arquitectónico", "Fotografías", "Construcción"…
  rol text not null,
  nombre text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists proyecto_creditos_proyecto_idx
  on public.proyecto_creditos (proyecto_id, orden);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------

drop trigger if exists proyectos_touch_updated_at on public.proyectos;
create trigger proyectos_touch_updated_at
  before update on public.proyectos
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.proyectos enable row level security;
alter table public.proyecto_fotos enable row level security;
alter table public.proyecto_documentos enable row level security;
alter table public.proyecto_creditos enable row level security;

create policy "proyectos_public_read"
  on public.proyectos for select
  using (publicado = true or public.is_dashboard_user());

create policy "proyecto_fotos_public_read"
  on public.proyecto_fotos for select
  using (
    exists (
      select 1 from public.proyectos p
      where p.id = proyecto_id and (p.publicado = true or public.is_dashboard_user())
    )
  );

create policy "proyecto_documentos_public_read"
  on public.proyecto_documentos for select
  using (
    exists (
      select 1 from public.proyectos p
      where p.id = proyecto_id and (p.publicado = true or public.is_dashboard_user())
    )
  );

create policy "proyecto_creditos_public_read"
  on public.proyecto_creditos for select
  using (
    exists (
      select 1 from public.proyectos p
      where p.id = proyecto_id and (p.publicado = true or public.is_dashboard_user())
    )
  );

create policy "proyectos_admin_write"
  on public.proyectos for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());

create policy "proyecto_fotos_admin_write"
  on public.proyecto_fotos for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());

create policy "proyecto_documentos_admin_write"
  on public.proyecto_documentos for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());

create policy "proyecto_creditos_admin_write"
  on public.proyecto_creditos for all
  using (public.is_dashboard_user())
  with check (public.is_dashboard_user());
