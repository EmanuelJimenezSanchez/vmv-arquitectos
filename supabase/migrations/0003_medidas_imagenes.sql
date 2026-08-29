-- Medidas de las imágenes de un proyecto.
--
-- El panel las calcula al comprimir la imagen en el navegador y las guarda
-- aquí para poder escribir `width`/`height` en el markup: sin esos atributos
-- el navegador no sabe cuánto espacio reservar y la página salta mientras
-- cargan las fotos y los planos.
--
-- Son nullable a propósito: las filas que se cargaron antes de esta migración
-- no las tienen, y la vista omite los atributos cuando faltan.

alter table public.proyecto_fotos
  add column if not exists width integer,
  add column if not exists height integer;

alter table public.proyecto_documentos
  add column if not exists preview_width integer,
  add column if not exists preview_height integer;
