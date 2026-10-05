# Panel de contenido — puesta en marcha

El contenido de **Proyectos**, **Servicios** y **Galería** vive en Supabase; las
imágenes y los planos, en el bucket de Cloudflare R2. El panel está en
`/dashboard`.

## 1. Supabase

1. Crea el proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta las migraciones en orden:
   `migrations/0001_contenido.sql`, `migrations/0002_proyectos.sql`,
   `migrations/0003_medidas_imagenes.sql` y `migrations/0004_i18n.sql`.
3. En **Settings → API** copia `Project URL`, `anon public` y `service_role`
   hacia tu `.env` (ver `.env.example`).

## 2. Cloudflare R2

1. En **R2 → Manage API tokens**, crea un token con permiso de
   *Object Read & Write* sobre el bucket.
2. Copia `Access Key ID`, `Secret Access Key`, el `Account ID` y el nombre del
   bucket al `.env`.
3. El bucket debe tener acceso público (dominio `r2.dev` o dominio propio) y ese
   valor va en `R2_BUCKET_URL`.
4. **CORS**: el navegador sube los archivos directo a R2, así que el bucket
   necesita esta regla en **R2 → Settings → CORS Policy**:

   ```json
   [
     {
       "AllowedOrigins": ["https://www.vmv-arquitectos.com", "http://localhost:4321"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["content-type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

## 3. Cargar el contenido actual

```bash
npm run seed
```

Migra a Supabase los servicios y la galería que antes estaban en
`src/data/servicios.ts` y `src/data/galeria.ts`, y carga la ficha de los
proyectos que ya tienen texto (esos archivos ya se eliminaron; el contenido
original quedó en `supabase/seed.mjs`). Es idempotente: hace upsert por `slug`.

Las imágenes de un proyecto —portada, galería y planos— no se siembran: se
suben desde `/dashboard/proyectos`.

## 4. Crear un administrador

```bash
npm run create-admin -- correo@vmv.com "contraseña-larga" "Nombre"
```

Solo los correos presentes en la tabla `dashboard_users` pueden entrar al panel
y escribir; el resto ve el sitio en modo lectura. Si el usuario ya existe, el
script le actualiza la contraseña.

## 5. Variables en Vercel

Copia al proyecto de Vercel todas las variables del `.env` **excepto**
`SUPABASE_SERVICE_ROLE_KEY`, que solo se usa en los scripts locales de este
directorio.

## Contenido en inglés

La migración `0004_i18n.sql` agrega una columna `_en` por cada campo de texto
(`title_en`, `descripcion_en`, `alt_en`…). En el panel, cada campo traducible
muestra dos recuadros: **ES** arriba y **EN** abajo, este último con borde
punteado.

El inglés es opcional campo por campo. Si un recuadro EN queda vacío, la versión
en `/en` muestra el texto en español de ese campo y el resto de la ficha sigue
en inglés. Así el portafolio se puede traducir poco a poco sin dejar huecos.

No se traducen el `slug` (la URL es la misma en ambos idiomas, de modo que el
selector de idioma lleva a la misma ficha), la firma, el año ni los nombres
propios de los créditos.

El código tolera que la migración todavía no se haya ejecutado: las consultas
piden `*`, así que una base sin las columnas `_en` sirve todo el sitio en
español. El orden entre desplegar y migrar no importa.

## Cómo se refleja un cambio en el sitio

Las páginas públicas se sirven con `s-maxage=60, stale-while-revalidate=300` y
hay un cache en memoria de 60 s por instancia. Un cambio guardado en el panel se
ve en el sitio en menos de un minuto sin redeploy.
