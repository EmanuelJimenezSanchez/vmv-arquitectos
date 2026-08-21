/// <reference types="astro/client" />

import type Lenis from 'lenis'
import type * as maplibre from 'maplibre-gl'
import type { SupabaseClient, User } from '@supabase/supabase-js'

declare global {
  interface ImportMetaEnv {
    readonly R2_BUCKET_URL: string
    readonly R2_ACCOUNT_ID: string
    readonly R2_ACCESS_KEY_ID: string
    readonly R2_SECRET_ACCESS_KEY: string
    readonly R2_BUCKET_NAME: string
    readonly PUBLIC_SUPABASE_URL: string
    readonly PUBLIC_SUPABASE_ANON_KEY: string
    readonly SUPABASE_SERVICE_ROLE_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  namespace App {
    interface Locals {
      supabase: SupabaseClient
      user: User | null
      isAdmin: boolean
    }
  }

  interface Window {
    lenis?: Lenis
    maplibregl?: typeof maplibre
  }
}
