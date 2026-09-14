/**
 * Plantillas de correo. Los clientes de correo no soportan flexbox, grid ni
 * hojas de estilo externas, así que el maquetado va con tablas y estilos
 * inline, y la paleta se escribe en hexadecimal en lugar de usar los tokens
 * de `global.css`.
 */

const SAND_1 = '#fcfaf6'
const SAND_2 = '#f8f4ec'
const SAND_3 = '#f1eadf'
const SAND_4 = '#e8dfcf'
const SAND_9 = '#8a745b'
const GRAY_10 = '#605a52'
const GRAY_12 = '#1d1b18'

const FONT_STACK = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] as string,
  )

export interface ContactoEmailData {
  nombres: string
  apellidos: string
  email: string
  telefono: string
  mensaje: string
  considerandoConstruir: string
  tieneTerreno: string
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Mexico_City',
  }).format(date)

/** Fila etiqueta/valor del bloque de datos. */
const row = (label: string, value: string, isLast = false) => `
  <tr>
    <td style="padding:14px 0;${isLast ? '' : `border-bottom:1px solid ${SAND_4};`}font-family:${FONT_STACK};font-size:11px;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:${SAND_9};white-space:nowrap;vertical-align:top;width:40%;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:14px 0;${isLast ? '' : `border-bottom:1px solid ${SAND_4};`}font-family:${FONT_STACK};font-size:15px;line-height:1.5;color:${GRAY_12};vertical-align:top;">
      ${value}
    </td>
  </tr>`

const button = (href: string, label: string, filled: boolean) => `
  <td style="padding-right:10px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;border:1px solid ${GRAY_12};${
      filled
        ? `background-color:${GRAY_12};color:${SAND_1};`
        : `background-color:transparent;color:${GRAY_12};`
    }">
      ${escapeHtml(label)}
    </a>
  </td>`

export const renderContactoEmail = (data: ContactoEmailData, now = new Date()) => {
  const nombre = `${data.nombres} ${data.apellidos}`.trim()
  const whatsapp = data.telefono.replace(/\D/g, '')

  const fields: [string, string][] = [
    ['Nombre', escapeHtml(nombre)],
    [
      'E-mail',
      `<a href="mailto:${escapeHtml(data.email)}" style="color:${GRAY_12};text-decoration:underline;">${escapeHtml(data.email)}</a>`,
    ],
    [
      'Teléfono',
      whatsapp
        ? `<a href="tel:${escapeHtml(whatsapp)}" style="color:${GRAY_12};text-decoration:underline;">${escapeHtml(data.telefono)}</a>`
        : escapeHtml(data.telefono),
    ],
    ['¿Considera construir?', escapeHtml(data.considerandoConstruir || '—')],
    ['¿Ya tiene terreno?', escapeHtml(data.tieneTerreno || '—')],
  ]

  const text = [
    'Nuevo contacto desde la web',
    '',
    `Nombre: ${nombre}`,
    `E-mail: ${data.email}`,
    `Teléfono: ${data.telefono}`,
    `¿Considera construir?: ${data.considerandoConstruir || '—'}`,
    `¿Ya tiene terreno?: ${data.tieneTerreno || '—'}`,
    '',
    'Mensaje:',
    data.mensaje,
    '',
    `Recibido el ${formatDate(now)}`,
  ].join('\n')

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nuevo contacto desde la web</title>
</head>
<body style="margin:0;padding:0;background-color:${SAND_3};">
  <!-- Texto de vista previa: lo muestra la bandeja junto al asunto. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(nombre)} · ${escapeHtml(data.telefono)} · ${escapeHtml(data.mensaje.slice(0, 90))}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${SAND_3};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${SAND_1};border:1px solid ${SAND_4};">

          <tr>
            <td style="padding:28px 32px;background-color:${GRAY_12};">
              <p style="margin:0;font-family:${FONT_STACK};font-size:16px;line-height:1;letter-spacing:0.34em;color:${SAND_1};">
                VMV
              </p>
              <p style="margin:8px 0 0;font-family:${FONT_STACK};font-size:10px;line-height:1;letter-spacing:0.22em;text-transform:uppercase;color:#8d8880;">
                Arquitectos
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 0;">
              <p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:10px;line-height:1;letter-spacing:0.22em;text-transform:uppercase;color:${SAND_9};">
                Nuevo contacto
              </p>
              <h1 style="margin:0;font-family:${FONT_STACK};font-size:26px;line-height:1.25;font-weight:400;color:${GRAY_12};">
                ${escapeHtml(nombre)}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${fields.map(([label, value], index) => row(label, value, index === fields.length - 1)).join('')}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${SAND_2};border-left:2px solid ${SAND_9};">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:10px;line-height:1;letter-spacing:0.22em;text-transform:uppercase;color:${SAND_9};">
                      Mensaje
                    </p>
                    <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:${GRAY_12};white-space:pre-wrap;">${escapeHtml(data.mensaje)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${button(`mailto:${data.email}`, 'Responder', true)}
                  ${whatsapp ? button(`https://wa.me/${whatsapp}`, 'WhatsApp', false) : ''}
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 32px;">
              <p style="margin:0;padding-top:20px;border-top:1px solid ${SAND_4};font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${GRAY_10};">
                Recibido el ${escapeHtml(formatDate(now))} desde el formulario de vmvarquitectos.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject: `Nuevo contacto desde la web - ${nombre}`, html, text }
}
