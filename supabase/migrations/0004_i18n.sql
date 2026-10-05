-- Contenido bilingüe (español / inglés).
--
-- El español se queda en las columnas que ya existían: es el idioma por defecto
-- del sitio y la columna que el panel siempre exige. El inglés vive en columnas
-- `_en` paralelas, con default '' para que las filas actuales sigan siendo
-- válidas sin tocar nada.
--
-- La vista pública lee la columna `_en` y cae a la española cuando está vacía
-- (ver `traducir()` en `src/lib/content.ts`). Eso permite publicar el inglés
-- poco a poco: un proyecto sin traducir se muestra en español dentro de /en en
-- vez de aparecer en blanco.
--
-- No se traducen: `slug` (la URL es la misma en ambos idiomas, así el enlace
-- entre versiones es directo), `firma`, `anio`, ni `nombre` de los créditos,
-- que son nombres propios.

-- ---------------------------------------------------------------------------
-- Servicios
-- ---------------------------------------------------------------------------

alter table public.servicios
  add column if not exists title_en text not null default '',
  add column if not exists description_en text not null default '',
  add column if not exists details_en text not null default '',
  add column if not exists footer_en text not null default '',
  add column if not exists image_alt_en text not null default '';

alter table public.servicio_fotos
  add column if not exists alt_en text not null default '';

-- ---------------------------------------------------------------------------
-- Galería
-- ---------------------------------------------------------------------------

alter table public.galeria
  add column if not exists title_en text not null default '',
  add column if not exists description_en text not null default '';

-- ---------------------------------------------------------------------------
-- Proyectos
-- ---------------------------------------------------------------------------

alter table public.proyectos
  add column if not exists title_en text not null default '',
  add column if not exists tagline_en text not null default '',
  add column if not exists resumen_en text not null default '',
  add column if not exists descripcion_en text not null default '',
  add column if not exists cover_alt_en text not null default '',
  add column if not exists tipologia_en text not null default '',
  add column if not exists area_en text not null default '',
  add column if not exists ubicacion_en text not null default '',
  add column if not exists niveles_en text not null default '';

alter table public.proyecto_fotos
  add column if not exists alt_en text not null default '';

alter table public.proyecto_documentos
  add column if not exists titulo_en text not null default '',
  add column if not exists descripcion_en text not null default '';

alter table public.proyecto_creditos
  add column if not exists rol_en text not null default '';
