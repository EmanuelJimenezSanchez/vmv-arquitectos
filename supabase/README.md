# Panel de contenido — puesta en marcha

El contenido de **Servicios** y **Galería** vive en Supabase; las imágenes, en el
bucket de Cloudflare R2. El panel está en `/dashboard`.

## 1. Supabase

1. Crea el proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega y ejecuta `migrations/0001_contenido.sql`.
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
`src/data/servicios.ts` y `src/data/galeria.ts` (esos archivos ya se eliminaron;
el contenido original quedó en `supabase/seed.mjs`). Es idempotente: hace upsert
por `slug`.

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

## Cómo se refleja un cambio en el sitio

Las páginas públicas se sirven con `s-maxage=60, stale-while-revalidate=300` y
hay un cache en memoria de 60 s por instancia. Un cambio guardado en el panel se
ve en el sitio en menos de un minuto sin redeploy.
