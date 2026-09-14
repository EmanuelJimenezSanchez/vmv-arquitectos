/**
 * Envío de correo con dos proveedores: Mailtrap para pruebas y Resend en
 * producción. Ambos exponen una API HTTP equivalente, así que se usan con
 * `fetch` en lugar de sus SDK para no añadir dependencias al bundle serverless.
 */

const PROVIDER = import.meta.env.EMAIL_PROVIDER
const MAILTRAP_TOKEN = import.meta.env.MAILTRAP_TOKEN
const MAILTRAP_INBOX_ID = import.meta.env.MAILTRAP_INBOX_ID
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY

/** Remitente. En Resend el dominio tiene que estar verificado. */
const FROM = import.meta.env.EMAIL_FROM ?? 'VMV Arquitectos <web@vmvarquitectos.com>'

export type EmailProvider = 'mailtrap' | 'resend'

export interface SendEmailInput {
  to: string[]
  subject: string
  html: string
  text: string
  /** Responder al correo lleva directo al contacto, no al buzón del sitio. */
  replyTo?: string
}

/**
 * `EMAIL_PROVIDER` manda sobre el modo de build para poder probar Resend en
 * local antes de desplegar.
 */
export const resolveProvider = (): EmailProvider => {
  if (PROVIDER === 'mailtrap' || PROVIDER === 'resend') {
    return PROVIDER
  }
  return import.meta.env.PROD ? 'resend' : 'mailtrap'
}

const parseAddress = (value: string) => {
  const match = value.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/)
  return match ? { name: match[1], email: match[2] } : { name: '', email: value.trim() }
}

const sendWithMailtrap = async ({ to, subject, html, text, replyTo }: SendEmailInput) => {
  if (!MAILTRAP_TOKEN || !MAILTRAP_INBOX_ID) {
    throw new Error('Faltan credenciales de Mailtrap (MAILTRAP_TOKEN, MAILTRAP_INBOX_ID).')
  }

  const response = await fetch(`https://sandbox.api.mailtrap.io/api/send/${MAILTRAP_INBOX_ID}`, {
    method: 'POST',
    headers: {
      'Api-Token': MAILTRAP_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: parseAddress(FROM),
      to: to.map((email) => ({ email })),
      subject,
      html,
      text,
      ...(replyTo ? { headers: { 'Reply-To': replyTo } } : {}),
    }),
  })

  if (!response.ok) {
    throw new Error(`Mailtrap respondió ${response.status}: ${await response.text()}`)
  }
}

const sendWithResend = async ({ to, subject, html, text, replyTo }: SendEmailInput) => {
  if (!RESEND_API_KEY) {
    throw new Error('Falta RESEND_API_KEY.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend respondió ${response.status}: ${await response.text()}`)
  }
}

export const sendEmail = async (input: SendEmailInput) => {
  if (input.to.length === 0) {
    throw new Error('No hay destinatarios configurados (EMAIL_TO).')
  }

  if (resolveProvider() === 'resend') {
    await sendWithResend(input)
    return
  }

  await sendWithMailtrap(input)
}

/** Destinatarios de los avisos del formulario de contacto. */
export const contactRecipients = (): string[] =>
  (import.meta.env.EMAIL_TO ?? 'ventas@vmvarquitectos.com')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
