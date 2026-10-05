import { useMemo, useRef, useState } from 'react'
import { actions } from 'astro:actions'
import {
  AspectHint,
  Banner,
  Bilingual,
  Button,
  Field,
  FileDrop,
  IMAGE_ACCEPT,
  inputClass,
  slugify,
} from './ui'
import { useUpload } from './useUpload'

interface Foto {
  id?: string
  src: string
  alt: string
  /** Vacío = el sitio usa el alt en español. */
  altEn: string
  ancha: boolean
  width: number | null
  height: number | null
}

interface Documento {
  id?: string
  titulo: string
  tituloEn: string
  descripcion: string
  descripcionEn: string
  preview_url: string | null
  preview_width: number | null
  preview_height: number | null
  archivo_url: string | null
}

interface Credito {
  id?: string
  rol: string
  rolEn: string
  /** Nombre propio: no se traduce. */
  nombre: string
}

export interface ProyectoRecord {
  id: string
  slug: string
  title: string
  title_en?: string
  tagline: string
  tagline_en?: string
  resumen: string
  resumen_en?: string
  descripcion: string
  descripcion_en?: string
  cover_url: string | null
  cover_alt: string
  cover_alt_en?: string
  firma: string
  tipologia: string
  tipologia_en?: string
  anio: number | null
  area: string
  area_en?: string
  ubicacion: string
  ubicacion_en?: string
  niveles: string
  niveles_en?: string
  orden: number
  publicado: boolean
  proyecto_fotos: (Omit<Foto, 'altEn'> & { alt_en?: string })[]
  proyecto_documentos: (Omit<Documento, 'tituloEn' | 'descripcionEn'> & {
    titulo_en?: string
    descripcion_en?: string
  })[]
  proyecto_creditos: (Omit<Credito, 'rolEn'> & { rol_en?: string })[]
}

interface Draft {
  id?: string
  slug: string
  title: string
  titleEn: string
  tagline: string
  taglineEn: string
  resumen: string
  resumenEn: string
  descripcion: string
  descripcionEn: string
  coverUrl: string | null
  coverAlt: string
  coverAltEn: string
  firma: string
  tipologia: string
  tipologiaEn: string
  anio: string
  area: string
  areaEn: string
  ubicacion: string
  ubicacionEn: string
  niveles: string
  nivelesEn: string
  publicado: boolean
  fotos: Foto[]
  documentos: Documento[]
  creditos: Credito[]
}

const emptyDraft = (): Draft => ({
  slug: '',
  title: '',
  titleEn: '',
  tagline: '',
  taglineEn: '',
  resumen: '',
  resumenEn: '',
  descripcion: '',
  descripcionEn: '',
  coverUrl: null,
  coverAlt: '',
  coverAltEn: '',
  firma: 'VMV Arquitectos',
  tipologia: '',
  tipologiaEn: '',
  anio: '',
  area: '',
  areaEn: '',
  ubicacion: '',
  ubicacionEn: '',
  niveles: '',
  nivelesEn: '',
  publicado: true,
  fotos: [],
  documentos: [],
  creditos: [],
})

const toDraft = (proyecto: ProyectoRecord): Draft => ({
  id: proyecto.id,
  slug: proyecto.slug,
  title: proyecto.title,
  titleEn: proyecto.title_en ?? '',
  tagline: proyecto.tagline,
  taglineEn: proyecto.tagline_en ?? '',
  resumen: proyecto.resumen,
  resumenEn: proyecto.resumen_en ?? '',
  descripcion: proyecto.descripcion,
  descripcionEn: proyecto.descripcion_en ?? '',
  coverUrl: proyecto.cover_url,
  coverAlt: proyecto.cover_alt,
  coverAltEn: proyecto.cover_alt_en ?? '',
  firma: proyecto.firma,
  tipologia: proyecto.tipologia,
  tipologiaEn: proyecto.tipologia_en ?? '',
  anio: proyecto.anio ? String(proyecto.anio) : '',
  area: proyecto.area,
  areaEn: proyecto.area_en ?? '',
  ubicacion: proyecto.ubicacion,
  ubicacionEn: proyecto.ubicacion_en ?? '',
  niveles: proyecto.niveles,
  nivelesEn: proyecto.niveles_en ?? '',
  publicado: proyecto.publicado,
  fotos: proyecto.proyecto_fotos.map((foto) => ({
    src: foto.src,
    alt: foto.alt,
    altEn: foto.alt_en ?? '',
    ancha: foto.ancha,
    width: foto.width,
    height: foto.height,
  })),
  documentos: proyecto.proyecto_documentos.map((doc) => ({
    titulo: doc.titulo,
    tituloEn: doc.titulo_en ?? '',
    descripcion: doc.descripcion,
    descripcionEn: doc.descripcion_en ?? '',
    preview_url: doc.preview_url,
    preview_width: doc.preview_width,
    preview_height: doc.preview_height,
    archivo_url: doc.archivo_url,
  })),
  creditos: proyecto.proyecto_creditos.map((credito) => ({
    rol: credito.rol,
    rolEn: credito.rol_en ?? '',
    nombre: credito.nombre,
  })),
})

/** Mueve un elemento de una lista sin mutarla; null si el destino no existe. */
const moved = <T,>(items: T[], from: number, to: number): T[] | null => {
  if (to < 0 || to >= items.length) return null
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function ProyectosManager({ initial }: { initial: ProyectoRecord[] }) {
  const [proyectos, setProyectos] = useState(initial)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const { upload, uploading, uploadError, clearUploadError } = useUpload()

  const slugTaken = useMemo(
    () => proyectos.some((p) => p.slug === draft?.slug && p.id !== draft?.id),
    [proyectos, draft],
  )

  const refresh = async () => {
    const { data } = await actions.proyectos.list({})
    if (data) {
      setProyectos(data as ProyectoRecord[])
    }
  }

  const patch = (values: Partial<Draft>) => setDraft((current) => ({ ...current!, ...values }))

  // El formulario ocupa su propia vista, así que al abrirlo o cerrarlo se
  // vuelve al inicio y se limpian los avisos de la vista anterior.
  const openDraft = (next: Draft) => {
    setError(null)
    setNotice(null)
    clearUploadError()
    setDraft(next)
    window.scrollTo({ top: 0 })
  }

  const closeDraft = () => {
    setError(null)
    clearUploadError()
    setDraft(null)
    window.scrollTo({ top: 0 })
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    setError(null)

    const { error: saveError } = await actions.proyectos.save({
      id: draft.id,
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      titleEn: draft.titleEn,
      tagline: draft.tagline,
      taglineEn: draft.taglineEn,
      resumen: draft.resumen,
      resumenEn: draft.resumenEn,
      descripcion: draft.descripcion,
      descripcionEn: draft.descripcionEn,
      coverUrl: draft.coverUrl,
      coverAlt: draft.coverAlt,
      coverAltEn: draft.coverAltEn,
      firma: draft.firma,
      tipologia: draft.tipologia,
      tipologiaEn: draft.tipologiaEn,
      anio: draft.anio ? Number(draft.anio) : null,
      area: draft.area,
      areaEn: draft.areaEn,
      ubicacion: draft.ubicacion,
      ubicacionEn: draft.ubicacionEn,
      niveles: draft.niveles,
      nivelesEn: draft.nivelesEn,
      publicado: draft.publicado,
      fotos: draft.fotos.map(({ src, alt, altEn, ancha, width, height }) => ({
        src,
        alt,
        altEn,
        ancha,
        width,
        height,
      })),
      documentos: draft.documentos.map((doc) => ({
        titulo: doc.titulo,
        tituloEn: doc.tituloEn,
        descripcion: doc.descripcion,
        descripcionEn: doc.descripcionEn,
        previewUrl: doc.preview_url,
        previewWidth: doc.preview_width,
        previewHeight: doc.preview_height,
        archivoUrl: doc.archivo_url,
      })),
      creditos: draft.creditos
        .filter((credito) => credito.rol.trim() && credito.nombre.trim())
        .map(({ rol, rolEn, nombre }) => ({
          rol: rol.trim(),
          rolEn: rolEn.trim(),
          nombre: nombre.trim(),
        })),
    })

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    await refresh()
    setDraft(null)
    setNotice('Proyecto guardado. Los cambios se ven en el sitio en menos de un minuto.')
    window.scrollTo({ top: 0 })
  }

  const handleDelete = async (proyecto: ProyectoRecord) => {
    const confirmed = window.confirm(
      `¿Eliminar «${proyecto.title}»? También se borrarán del bucket su portada, sus ${proyecto.proyecto_fotos.length} fotos y sus planos. Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const { error: deleteError } = await actions.proyectos.remove({ id: proyecto.id })
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await refresh()
    setNotice('Proyecto eliminado.')
  }

  const commitOrder = async (ordered: ProyectoRecord[]) => {
    setProyectos(ordered)
    const { error: reorderError } = await actions.proyectos.reorder({
      ids: ordered.map((p) => p.id),
    })
    if (reorderError) {
      setError(reorderError.message)
      await refresh()
    }
  }

  const handleDrop = (target: number) => {
    const source = dragIndex.current
    dragIndex.current = null
    if (source === null || source === target) return

    const ordered = moved(proyectos, source, target)
    if (ordered) void commitOrder(ordered)
  }

  const handleCoverUpload = async (file: File) => {
    const uploaded = await upload(file, 'proyectos')
    if (uploaded) patch({ coverUrl: uploaded.url })
  }

  const handleFotosUpload = async (files: File[]) => {
    const uploaded: Foto[] = []
    for (const file of files) {
      const result = await upload(file, 'proyectos')
      if (result) {
        uploaded.push({
          src: result.url,
          alt: '',
          altEn: '',
          ancha: false,
          width: result.width,
          height: result.height,
        })
      }
    }
    if (uploaded.length > 0) {
      setDraft((current) => ({ ...current!, fotos: [...current!.fotos, ...uploaded] }))
    }
  }

  const patchDocumento = (index: number, values: Partial<Documento>) => {
    if (!draft) return
    const documentos = [...draft.documentos]
    documentos[index] = { ...documentos[index], ...values }
    patch({ documentos })
  }

  const patchCredito = (index: number, values: Partial<Credito>) => {
    if (!draft) return
    const creditos = [...draft.creditos]
    creditos[index] = { ...creditos[index], ...values }
    patch({ creditos })
  }

  const banners = (
    <>
      {error && <Banner tone="error">{error}</Banner>}
      {uploadError && <Banner tone="error">{uploadError}</Banner>}
      {notice && !error && <Banner tone="ok">{notice}</Banner>}
    </>
  )

  if (draft) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="vmv-title-3">{draft.id ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
            <p className="vmv-body-3 text-vmv-muted-foreground">
              {draft.id ? draft.slug : 'Completa los datos y guarda para publicarlo.'}
            </p>
          </div>
          <Button onClick={closeDraft} disabled={saving}>
            ← Volver a proyectos
          </Button>
        </div>

        {banners}

        {/* ─── Datos generales ─────────────────────────── */}
        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Datos generales
            </h2>
            <label className="vmv-body-3 flex items-center gap-2 text-vmv-muted-foreground">
              <input
                type="checkbox"
                checked={draft.publicado}
                onChange={(event) => patch({ publicado: event.target.checked })}
              />
              Publicado
            </label>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <Bilingual
              label="Título"
              value={draft.title}
              valueEn={draft.titleEn}
              onChange={(title) => patch(draft.id ? { title } : { title, slug: slugify(title) })}
              onChangeEn={(titleEn) => patch({ titleEn })}
            />
            <Field
              label="Slug"
              hint={
                slugTaken ? 'Ya existe un proyecto con este slug.' : 'Aparece en la URL del sitio.'
              }
            >
              <input
                className={inputClass}
                value={draft.slug}
                onChange={(event) => patch({ slug: slugify(event.target.value) })}
              />
            </Field>
            <Bilingual
              label="Frase del hero"
              hint="Línea corta bajo el título en la portada."
              value={draft.tagline}
              valueEn={draft.taglineEn}
              onChange={(tagline) => patch({ tagline })}
              onChangeEn={(taglineEn) => patch({ taglineEn })}
            />
            <Bilingual
              label="Texto alternativo de la portada"
              value={draft.coverAlt}
              valueEn={draft.coverAltEn}
              onChange={(coverAlt) => patch({ coverAlt })}
              onChangeEn={(coverAltEn) => patch({ coverAltEn })}
            />
          </div>

          <Bilingual
            label="Entradilla"
            hint="El párrafo destacado que abre la descripción."
            rows={3}
            value={draft.resumen}
            valueEn={draft.resumenEn}
            onChange={(resumen) => patch({ resumen })}
            onChangeEn={(resumenEn) => patch({ resumenEn })}
          />

          <Bilingual
            label="Descripción"
            hint="Separa los párrafos con una línea en blanco: así se publican."
            rows={14}
            value={draft.descripcion}
            valueEn={draft.descripcionEn}
            onChange={(descripcion) => patch({ descripcion })}
            onChangeEn={(descripcionEn) => patch({ descripcionEn })}
          />

          <div className="flex flex-col gap-3">
            <span className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Portada
            </span>
            <AspectHint
              ratio={[16, 9]}
              label="Horizontal 16:9"
              note="Se recorta distinto en cada sitio (pantalla completa, listado 4:3, siguiente proyecto): deja lo importante al centro."
            />
            <div className="flex flex-wrap items-start gap-4">
              {draft.coverUrl ? (
                <img
                  src={draft.coverUrl}
                  alt=""
                  className="h-28 w-44 shrink-0 border border-vmv-border object-cover"
                />
              ) : (
                <div className="vmv-caption-1 flex h-28 w-44 shrink-0 items-center justify-center border border-dashed border-vmv-border text-vmv-muted-foreground">
                  Sin portada
                </div>
              )}
              <div className="flex min-w-[15rem] flex-1 flex-col gap-2">
                <FileDrop
                  accept={IMAGE_ACCEPT}
                  busy={uploading}
                  label={draft.coverUrl ? 'Arrastra otra portada aquí' : 'Arrastra la portada aquí'}
                  onFiles={(files) => void handleCoverUpload(files[0])}
                />
                {draft.coverUrl && (
                  <div className="flex justify-end">
                    <Button variant="ghost" onClick={() => patch({ coverUrl: null })}>
                      Quitar portada
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Ficha técnica ───────────────────────────── */}
        <section className="flex flex-col gap-5 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
            Ficha técnica
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Firma">
              <input
                className={inputClass}
                value={draft.firma}
                onChange={(event) => patch({ firma: event.target.value })}
              />
            </Field>
            <Bilingual
              label="Tipología"
              hint="Casa residencial, oficinas…"
              value={draft.tipologia}
              valueEn={draft.tipologiaEn}
              onChange={(tipologia) => patch({ tipologia })}
              onChangeEn={(tipologiaEn) => patch({ tipologiaEn })}
            />
            <Field label="Año de construcción">
              <input
                className={inputClass}
                inputMode="numeric"
                value={draft.anio}
                onChange={(event) => patch({ anio: event.target.value.replace(/[^0-9]/g, '') })}
              />
            </Field>
            <Bilingual
              label="Área útil"
              hint="Con unidad, por ejemplo «350 m²»."
              value={draft.area}
              valueEn={draft.areaEn}
              onChange={(area) => patch({ area })}
              onChangeEn={(areaEn) => patch({ areaEn })}
            />
            <Bilingual
              label="Localización"
              value={draft.ubicacion}
              valueEn={draft.ubicacionEn}
              onChange={(ubicacion) => patch({ ubicacion })}
              onChangeEn={(ubicacionEn) => patch({ ubicacionEn })}
            />
            <Bilingual
              label="Niveles"
              value={draft.niveles}
              valueEn={draft.nivelesEn}
              onChange={(niveles) => patch({ niveles })}
              onChangeEn={(nivelesEn) => patch({ nivelesEn })}
            />
          </div>
        </section>

        {/* ─── Galería ─────────────────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div>
            <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
              Galería ({draft.fotos.length})
            </h2>
            <p className="vmv-caption-1 text-vmv-muted-foreground">
              Se comprimen y reescalan al subirlas: puedes soltar los originales.
            </p>
          </div>

          {/* Las dos formas que puede tomar una foto en el mosaico; la de cada
              una se elige con la casilla «ocupa el ancho completo». */}
          <div className="grid gap-3 sm:grid-cols-2">
            <AspectHint
              ratio={[4, 3]}
              label="Horizontal 4:3"
              note="Foto normal: van de dos en dos por fila."
            />
            <AspectHint
              ratio={[16, 9]}
              label="Horizontal 16:9"
              note="Foto marcada como «ancho completo»."
            />
          </div>

          <FileDrop
            accept={IMAGE_ACCEPT}
            multiple
            busy={uploading}
            label="Arrastra aquí las fotos de la galería"
            hint="o haz clic para seleccionarlas; puedes soltar varias a la vez"
            onFiles={(files) => void handleFotosUpload(files)}
          />

          {draft.fotos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Aún no hay fotos. Súbelas para que aparezcan en la galería del proyecto.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {draft.fotos.map((foto, index) => (
                <li
                  key={`${foto.src}-${index}`}
                  className="flex gap-3 border border-vmv-border p-3"
                >
                  <img src={foto.src} alt="" className="h-20 w-20 shrink-0 object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <input
                      className={inputClass}
                      placeholder="Texto alternativo"
                      value={foto.alt}
                      onChange={(event) => {
                        const fotos = [...draft.fotos]
                        fotos[index] = { ...foto, alt: event.target.value }
                        patch({ fotos })
                      }}
                    />
                    <input
                      className={`${inputClass} border-dashed`}
                      placeholder="Alt en inglés (opcional)"
                      value={foto.altEn}
                      onChange={(event) => {
                        const fotos = [...draft.fotos]
                        fotos[index] = { ...foto, altEn: event.target.value }
                        patch({ fotos })
                      }}
                    />
                    <label className="vmv-caption-1 flex items-center gap-2 text-vmv-muted-foreground">
                      <input
                        type="checkbox"
                        checked={foto.ancha}
                        onChange={(event) => {
                          const fotos = [...draft.fotos]
                          fotos[index] = { ...foto, ancha: event.target.checked }
                          patch({ fotos })
                        }}
                      />
                      Ocupa el ancho completo
                      {/* Recuerda a qué proporción se recorta esta foto con
                          la casilla como está ahora mismo. */}
                      <span
                        className="ml-auto flex items-center gap-1.5 text-vmv-foreground"
                        title={`Se recorta a ${foto.ancha ? '16:9' : '4:3'}`}
                      >
                        <span
                          className="border border-vmv-sand-9/70 bg-vmv-sand-9/12"
                          style={foto.ancha ? { width: 24, height: 14 } : { width: 20, height: 15 }}
                          aria-hidden="true"
                        />
                        {foto.ancha ? '16:9' : '4:3'}
                      </span>
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const fotos = moved(draft.fotos, index, index - 1)
                          if (fotos) patch({ fotos })
                        }}
                        disabled={index === 0}
                        aria-label="Mover antes"
                      >
                        ←
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const fotos = moved(draft.fotos, index, index + 1)
                          if (fotos) patch({ fotos })
                        }}
                        disabled={index === draft.fotos.length - 1}
                        aria-label="Mover después"
                      >
                        →
                      </Button>
                      <Button
                        variant="danger"
                        className="ml-auto"
                        onClick={() => patch({ fotos: draft.fotos.filter((_, i) => i !== index) })}
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Documentos técnicos ─────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
                Documentos técnicos ({draft.documentos.length})
              </h2>
              <p className="vmv-caption-1 text-vmv-muted-foreground">
                Planos: una imagen para verlos en la página y, si quieres, el PDF para descargar.
              </p>
            </div>
            <Button
              onClick={() =>
                patch({
                  documentos: [
                    ...draft.documentos,
                    {
                      titulo: '',
                      tituloEn: '',
                      descripcion: '',
                      descripcionEn: '',
                      preview_url: null,
                      preview_width: null,
                      preview_height: null,
                      archivo_url: null,
                    },
                  ],
                })
              }
            >
              Añadir plano
            </Button>
          </div>

          <AspectHint
            label="Proporción libre"
            note="El plano se muestra completo, sin recorte: sube la imagen con la proporción que tenga."
          />

          {draft.documentos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Sin planos. La sección de documentos técnicos no aparecerá en la página.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {draft.documentos.map((doc, index) => (
                <li key={index} className="flex flex-col gap-4 border border-vmv-border p-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Bilingual
                      label="Título"
                      value={doc.titulo}
                      valueEn={doc.tituloEn}
                      onChange={(titulo) => patchDocumento(index, { titulo })}
                      onChangeEn={(tituloEn) => patchDocumento(index, { tituloEn })}
                    />
                    <Bilingual
                      label="Descripción"
                      value={doc.descripcion}
                      valueEn={doc.descripcionEn}
                      onChange={(descripcion) => patchDocumento(index, { descripcion })}
                      onChangeEn={(descripcionEn) => patchDocumento(index, { descripcionEn })}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {doc.preview_url ? (
                      <img
                        src={doc.preview_url}
                        alt=""
                        className="h-24 w-32 border border-vmv-border object-contain"
                      />
                    ) : (
                      <div className="vmv-caption-1 flex h-24 w-32 items-center justify-center border border-dashed border-vmv-border text-center text-vmv-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                    <div className="flex min-w-[15rem] flex-1 flex-col gap-2">
                      <FileDrop
                        accept={IMAGE_ACCEPT}
                        busy={uploading}
                        compact
                        label="Imagen del plano"
                        hint="arrástrala o haz clic para seleccionarla"
                        onFiles={async (files) => {
                          const uploaded = await upload(files[0], 'planos')
                          if (uploaded) {
                            patchDocumento(index, {
                              preview_url: uploaded.url,
                              preview_width: uploaded.width,
                              preview_height: uploaded.height,
                            })
                          }
                        }}
                      />
                      <FileDrop
                        accept="application/pdf,.pdf"
                        busy={uploading}
                        compact
                        label="PDF descargable (opcional)"
                        hint={
                          doc.archivo_url
                            ? 'PDF cargado: suelta otro para reemplazarlo'
                            : 'arrástralo o haz clic para seleccionarlo'
                        }
                        onFiles={async (files) => {
                          const uploaded = await upload(files[0], 'planos')
                          if (uploaded) patchDocumento(index, { archivo_url: uploaded.url })
                        }}
                      />
                      {doc.archivo_url && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            onClick={() => patchDocumento(index, { archivo_url: null })}
                          >
                            Quitar PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const documentos = moved(draft.documentos, index, index - 1)
                        if (documentos) patch({ documentos })
                      }}
                      disabled={index === 0}
                      aria-label="Mover antes"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const documentos = moved(draft.documentos, index, index + 1)
                        if (documentos) patch({ documentos })
                      }}
                      disabled={index === draft.documentos.length - 1}
                      aria-label="Mover después"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-auto"
                      onClick={() =>
                        patch({ documentos: draft.documentos.filter((_, i) => i !== index) })
                      }
                    >
                      Quitar plano
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Créditos ────────────────────────────────── */}
        <section className="flex flex-col gap-4 border border-vmv-border p-[clamp(1rem,3vw,1.75rem)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="vmv-caption-1 tracking-[0.18em] text-vmv-muted-foreground uppercase">
                Colaboradores ({draft.creditos.length})
              </h2>
              <p className="vmv-caption-1 text-vmv-muted-foreground">
                Se agrupan por rol en el orden en que los captures.
              </p>
            </div>
            <Button
              onClick={() =>
                patch({
                  creditos: [
                    ...draft.creditos,
                    {
                      // Repetir el rol anterior ahorra teclear al capturar
                      // varios nombres del mismo equipo.
                      rol: draft.creditos.at(-1)?.rol ?? 'Diseño arquitectónico',
                      rolEn: draft.creditos.at(-1)?.rolEn ?? '',
                      nombre: '',
                    },
                  ],
                })
              }
            >
              Añadir colaborador
            </Button>
          </div>

          {draft.creditos.length === 0 ? (
            <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-6 text-center text-vmv-muted-foreground">
              Sin colaboradores. El bloque de créditos no aparecerá en la página.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {draft.creditos.map((credito, index) => (
                <li
                  key={index}
                  className="grid gap-3 border border-vmv-border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <Bilingual
                    label="Rol"
                    value={credito.rol}
                    valueEn={credito.rolEn}
                    onChange={(rol) => patchCredito(index, { rol })}
                    onChangeEn={(rolEn) => patchCredito(index, { rolEn })}
                  />
                  <Field label="Nombre">
                    <input
                      className={inputClass}
                      value={credito.nombre}
                      onChange={(event) => patchCredito(index, { nombre: event.target.value })}
                    />
                  </Field>
                  <div className="flex items-end gap-1">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const creditos = moved(draft.creditos, index, index - 1)
                        if (creditos) patch({ creditos })
                      }}
                      disabled={index === 0}
                      aria-label="Mover antes"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const creditos = moved(draft.creditos, index, index + 1)
                        if (creditos) patch({ creditos })
                      }}
                      disabled={index === draft.creditos.length - 1}
                      aria-label="Mover después"
                    >
                      ↓
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        patch({ creditos: draft.creditos.filter((_, i) => i !== index) })
                      }
                    >
                      Quitar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="flex flex-wrap items-center gap-3">
          <Button
            variant="solid"
            onClick={handleSave}
            disabled={saving || uploading || !draft.title || slugTaken}
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
          <Button onClick={closeDraft} disabled={saving}>
            Cancelar
          </Button>
          {uploading && (
            <span className="vmv-caption-1 text-vmv-muted-foreground">Subiendo archivos…</span>
          )}
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="vmv-title-3">Proyectos</h1>
          <p className="vmv-body-3 text-vmv-muted-foreground">
            Arrastra las tarjetas para cambiar el orden del portafolio. Ese mismo orden decide cuál
            es el «siguiente proyecto» al final de cada ficha.
          </p>
        </div>
        <Button variant="solid" onClick={() => openDraft(emptyDraft())}>
          Nuevo proyecto
        </Button>
      </div>

      {banners}

      {proyectos.length === 0 ? (
        <p className="vmv-body-3 border border-dashed border-vmv-border px-4 py-10 text-center text-vmv-muted-foreground">
          Todavía no hay proyectos. Crea el primero para que aparezca el portafolio.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {proyectos.map((proyecto, index) => (
            <li
              key={proyecto.id}
              draggable
              onDragStart={() => {
                dragIndex.current = index
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="flex flex-wrap items-center gap-4 border border-vmv-border p-3"
            >
              <span
                className="vmv-caption-1 cursor-grab text-vmv-muted-foreground tabular-nums"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')} ⠿
              </span>
              {proyecto.cover_url && (
                <img
                  src={proyecto.cover_url}
                  alt=""
                  className="h-16 w-24 shrink-0 object-cover"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="vmv-body-2 truncate">
                  {proyecto.title}
                  {!proyecto.publicado && (
                    <span className="vmv-caption-1 ml-2 text-vmv-muted-foreground">(oculto)</span>
                  )}
                </p>
                <p className="vmv-caption-1 text-vmv-muted-foreground">
                  {proyecto.slug} · {proyecto.proyecto_fotos.length} fotos ·{' '}
                  {proyecto.proyecto_documentos.length} planos
                  {proyecto.anio ? ` · ${proyecto.anio}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/projects/${proyecto.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="vmv-body-3 border border-vmv-border px-3.5 py-2 transition-colors duration-200 hover:bg-vmv-muted"
                >
                  Ver
                </a>
                <Button onClick={() => openDraft(toDraft(proyecto))}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(proyecto)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
