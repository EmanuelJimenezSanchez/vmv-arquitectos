import type { Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/seo'

/**
 * Aviso de privacidad integral (LFPDPPP, DOF 20/03/2025).
 *
 * Los textos se escriben aquí a mano y se pintan con `set:html`, por eso
 * pueden llevar enlaces. Nada de lo que entra aquí viene del visitante.
 *
 * Cualquier cambio en lo que el sitio recaba (un campo nuevo en el formulario,
 * otra herramienta de medición, otro proveedor) debe reflejarse en este texto
 * y actualizar `PRIVACY_UPDATED_AT`.
 */

/** TODO: datos legales del responsable; deben coincidir con su constancia fiscal. */
const RAZON_SOCIAL = '[RAZÓN SOCIAL O NOMBRE DEL TITULAR]'
const DOMICILIO = '[CALLE, NÚMERO, COLONIA, C.P., GUADALAJARA, JALISCO, MÉXICO]'

export const PRIVACY_UPDATED_AT = '2026-10-05'

export interface PrivacySection {
  id: string
  heading: string
  /** Párrafos o listas, en orden de aparición. */
  blocks: (string | { list: string[] })[]
}

export interface PrivacyContent {
  overline: string
  title: string
  updatedLabel: string
  intro: string
  sections: PrivacySection[]
}

const email = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`
const site = `<a href="${SITE_URL}">${SITE_URL.replace('https://', '')}</a>`

const es: PrivacyContent = {
  overline: 'Legal',
  title: 'Aviso de privacidad',
  updatedLabel: 'Última actualización',
  intro: `En ${SITE_NAME} cuidamos los datos personales que nos compartes. Este aviso explica qué datos recabamos a través de ${site}, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
  sections: [
    {
      id: 'responsable',
      heading: '1. Responsable del tratamiento',
      blocks: [
        `${RAZON_SOCIAL}, que opera comercialmente como ${SITE_NAME}, con domicilio en ${DOMICILIO}, es responsable del tratamiento de tus datos personales.`,
        `Para cualquier asunto relacionado con este aviso o con tus datos puedes escribirnos a ${email}.`,
      ],
    },
    {
      id: 'datos',
      heading: '2. Datos personales que recabamos',
      blocks: [
        'Cuando llenas el formulario de contacto del sitio recabamos:',
        {
          list: [
            'Nombre(s) y apellido(s).',
            'Correo electrónico.',
            'Número de teléfono.',
            'Tus respuestas a «¿Estás considerando construir?» y «¿Ya cuentas con un terreno?».',
            'El mensaje que nos escribas sobre tu proyecto.',
            'El idioma de la página desde la que nos escribes.',
          ],
        },
        'Si nos contactas por WhatsApp, correo electrónico o teléfono, tratamos los datos que tú mismo nos compartas por ese medio.',
        'Mientras navegas, de forma automática se obtienen datos técnicos como dirección IP, tipo de navegador y dispositivo, páginas visitadas, proyectos consultados y acciones dentro del sitio (por ejemplo, abrir o enviar el formulario de contacto). La sección 4 explica cómo se obtienen.',
        '<strong>No solicitamos datos personales sensibles.</strong> Te pedimos no incluirlos en tu mensaje (por ejemplo, datos de salud, creencias o información financiera).',
      ],
    },
    {
      id: 'finalidades',
      heading: '3. Para qué usamos tus datos',
      blocks: [
        '<strong>Finalidades primarias</strong>, necesarias para atender tu solicitud:',
        {
          list: [
            'Responder tu mensaje y contactarte por WhatsApp, correo electrónico o teléfono.',
            'Entender tu proyecto y preparar propuestas, presupuestos o cotizaciones.',
            'Dar seguimiento a la relación profesional si decides contratar nuestros servicios.',
          ],
        },
        '<strong>Finalidades secundarias</strong>, que no son necesarias para atenderte pero nos ayudan a mejorar:',
        {
          list: [
            'Medir y analizar el uso del sitio para mejorar su contenido y funcionamiento.',
            'Medir el desempeño de nuestros anuncios y mostrar publicidad de VMV Arquitectos en plataformas de Meta (Facebook e Instagram) a personas que visitaron el sitio.',
          ],
        },
        `Si no deseas que tus datos se usen para las finalidades secundarias, escríbenos a ${email} con el asunto «Finalidades secundarias», o desactiva las tecnologías de rastreo como se indica en la sección 4. Tu negativa no afectará la atención de tu solicitud.`,
      ],
    },
    {
      id: 'cookies',
      heading: '4. Cookies y tecnologías de rastreo',
      blocks: [
        'El sitio utiliza las siguientes tecnologías:',
        {
          list: [
            '<strong>Pixel de Meta</strong> (Meta Platforms, Inc.): instala cookies como <code>_fbp</code> para registrar las páginas que visitas, los proyectos que consultas, si abres o envías el formulario de contacto y si haces clic en nuestros enlaces de WhatsApp, correo o teléfono. <strong>Al Pixel no se le envían tu nombre, correo, teléfono ni el contenido de tu mensaje</strong>; solo las respuestas de calificación del formulario y el idioma. Se usa para las finalidades secundarias.',
            '<strong>Vercel Web Analytics</strong> (Vercel Inc.): estadísticas agregadas de visitas sin uso de cookies ni identificadores personales.',
            '<strong>Almacenamiento local del navegador</strong>: guarda tus preferencias de visualización, como el tema claro u oscuro, y tu elección sobre las cookies. No contiene datos personales y no sale de tu dispositivo.',
          ],
        },
        'Puedes deshabilitar estas tecnologías en cualquier momento:',
        {
          list: [
            'Con el botón «Rechazar» del aviso de cookies que aparece en tu primera visita, o en cualquier momento desde «Preferencias de cookies» al pie del sitio. Al rechazar, el Pixel de Meta deja de cargarse y se borran sus cookies.',
            'Bloqueando o eliminando cookies desde la configuración de tu navegador, o navegando en modo privado.',
            'Usando extensiones que bloquean rastreadores.',
            'Desde tu cuenta de Meta, en <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">Preferencias de anuncios</a> y en «Tu actividad fuera de las tecnologías de Meta».',
          ],
        },
        'Deshabilitarlas no impide navegar el sitio ni enviarnos el formulario.',
      ],
    },
    {
      id: 'transferencias',
      heading: '5. Con quién compartimos tus datos',
      blocks: [
        'Para operar el sitio nos apoyamos en proveedores que tratan datos por cuenta nuestra y bajo nuestras instrucciones, sin usarlos para fines propios:',
        {
          list: [
            'Vercel Inc. (Estados Unidos): alojamiento del sitio y estadísticas de visitas.',
            'Resend (Estados Unidos): envío a nuestro equipo de los mensajes que llegan por el formulario.',
            'Nuestro proveedor de correo electrónico, donde recibimos y respondemos tus mensajes.',
          ],
        },
        'Los datos de navegación que recaba el Pixel de Meta son tratados también por Meta Platforms, Inc. conforme a su propia <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">política de privacidad</a>, para medir y mostrar anuncios. Puedes oponerte como se explica en las secciones 3 y 4.',
        'No vendemos ni compartimos tus datos con terceros para otros fines, salvo cuando lo exija una ley o una autoridad competente.',
      ],
    },
    {
      id: 'arco',
      heading: '6. Derechos ARCO',
      blocks: [
        'Tienes derecho a <strong>Acceder</strong> a tus datos, <strong>Rectificarlos</strong> si son inexactos, <strong>Cancelarlos</strong> cuando consideres que no se requieren y <strong>Oponerte</strong> a su uso para fines específicos.',
        `Para ejercerlos, envía una solicitud a ${email} que incluya:`,
        {
          list: [
            'Tu nombre y un medio para comunicarte la respuesta.',
            'Una copia de tu identificación oficial o, en su caso, la de tu representante legal y el documento que acredite la representación.',
            'Una descripción clara de los datos y del derecho que deseas ejercer.',
            'En caso de rectificación, el dato correcto y, si aplica, documentación que lo respalde.',
          ],
        },
        'Te responderemos en un plazo máximo de 20 días hábiles desde que recibamos tu solicitud completa y, si resulta procedente, la haremos efectiva dentro de los 15 días hábiles siguientes.',
      ],
    },
    {
      id: 'revocacion',
      heading: '7. Revocación del consentimiento y límites de uso',
      blocks: [
        `Puedes revocar el consentimiento que nos diste o pedirnos limitar el uso o divulgación de tus datos escribiendo a ${email}, siguiendo el mismo procedimiento de la sección 6. Ten en cuenta que, si revocas tu consentimiento para las finalidades primarias, es posible que no podamos seguir atendiendo tu solicitud.`,
      ],
    },
    {
      id: 'conservacion',
      heading: '8. Conservación',
      blocks: [
        'Conservamos tus datos solo durante el tiempo necesario para cumplir las finalidades de este aviso y las obligaciones legales aplicables. Después se bloquean y se eliminan de forma segura.',
      ],
    },
    {
      id: 'menores',
      heading: '9. Menores de edad',
      blocks: [
        'El sitio y nuestros servicios están dirigidos a personas mayores de 18 años. No recabamos intencionalmente datos de menores de edad.',
      ],
    },
    {
      id: 'cambios',
      heading: '10. Cambios a este aviso',
      blocks: [
        'Podemos actualizar este aviso por cambios legales, en nuestros servicios o en las herramientas del sitio. Cualquier cambio se publicará en esta misma página con su fecha de actualización.',
      ],
    },
    {
      id: 'autoridad',
      heading: '11. Autoridad',
      blocks: [
        'Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad encargada de vigilar el cumplimiento de la ley.',
      ],
    },
  ],
}

const en: PrivacyContent = {
  overline: 'Legal',
  title: 'Privacy notice',
  updatedLabel: 'Last updated',
  intro: `At ${SITE_NAME} we take care of the personal data you share with us. This notice explains what data we collect through ${site}, what we use it for, who we share it with and how you can exercise your rights, under Mexico's Federal Law on the Protection of Personal Data Held by Private Parties. If there is any discrepancy with the Spanish version, the Spanish version prevails.`,
  sections: [
    {
      id: 'responsable',
      heading: '1. Data controller',
      blocks: [
        `${RAZON_SOCIAL}, doing business as ${SITE_NAME}, located at ${DOMICILIO}, is responsible for the processing of your personal data.`,
        `For any matter related to this notice or your data, write to us at ${email}.`,
      ],
    },
    {
      id: 'datos',
      heading: '2. Personal data we collect',
      blocks: [
        'When you fill out the contact form on the site we collect:',
        {
          list: [
            'First and last name.',
            'Email address.',
            'Phone number.',
            'Your answers to “Are you considering building?” and “Do you already have land?”.',
            'The message you write about your project.',
            'The language of the page you write from.',
          ],
        },
        'If you contact us by WhatsApp, email or phone, we process the data you choose to share through that channel.',
        'While you browse, technical data is collected automatically, such as IP address, browser and device type, pages visited, projects viewed and actions on the site (for example, opening or submitting the contact form). Section 4 explains how.',
        '<strong>We do not request sensitive personal data.</strong> Please do not include it in your message (for example, health data, beliefs or financial information).',
      ],
    },
    {
      id: 'finalidades',
      heading: '3. How we use your data',
      blocks: [
        '<strong>Primary purposes</strong>, required to handle your request:',
        {
          list: [
            'Replying to your message and contacting you by WhatsApp, email or phone.',
            'Understanding your project and preparing proposals, budgets or quotes.',
            'Following up on the professional relationship if you hire our services.',
          ],
        },
        '<strong>Secondary purposes</strong>, not required to serve you but helpful to improve:',
        {
          list: [
            'Measuring and analyzing site usage to improve its content and performance.',
            'Measuring the performance of our ads and showing VMV Arquitectos ads on Meta platforms (Facebook and Instagram) to people who visited the site.',
          ],
        },
        `If you do not want your data used for secondary purposes, email ${email} with the subject “Secondary purposes”, or disable tracking technologies as described in section 4. Your refusal will not affect how we handle your request.`,
      ],
    },
    {
      id: 'cookies',
      heading: '4. Cookies and tracking technologies',
      blocks: [
        'The site uses the following technologies:',
        {
          list: [
            '<strong>Meta Pixel</strong> (Meta Platforms, Inc.): sets cookies such as <code>_fbp</code> to record the pages you visit, the projects you view, whether you open or submit the contact form and whether you click our WhatsApp, email or phone links. <strong>Your name, email, phone number and message are never sent to the Pixel</strong>; only the form’s qualifying answers and the language. Used for secondary purposes.',
            '<strong>Vercel Web Analytics</strong> (Vercel Inc.): aggregated visit statistics with no cookies or personal identifiers.',
            '<strong>Browser local storage</strong>: stores your display preferences, such as light or dark theme, and your cookie choice. It contains no personal data and never leaves your device.',
          ],
        },
        'You can disable these technologies at any time:',
        {
          list: [
            'With the “Reject” button in the cookie notice shown on your first visit, or at any time from “Cookie preferences” in the site footer. Once rejected, the Meta Pixel stops loading and its cookies are deleted.',
            'By blocking or deleting cookies in your browser settings, or browsing in private mode.',
            'By using tracker-blocking extensions.',
            'From your Meta account, under <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">Ad preferences</a> and “Your activity off Meta technologies”.',
          ],
        },
        'Disabling them does not prevent you from browsing the site or submitting the form.',
      ],
    },
    {
      id: 'transferencias',
      heading: '5. Who we share your data with',
      blocks: [
        'To run the site we rely on providers that process data on our behalf and under our instructions, without using it for their own purposes:',
        {
          list: [
            'Vercel Inc. (United States): site hosting and visit statistics.',
            'Resend (United States): delivering form messages to our team.',
            'Our email provider, where we receive and answer your messages.',
          ],
        },
        'Browsing data collected by the Meta Pixel is also processed by Meta Platforms, Inc. under its own <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">privacy policy</a>, to measure and show ads. You can object as explained in sections 3 and 4.',
        'We do not sell or share your data with third parties for other purposes, except when required by law or a competent authority.',
      ],
    },
    {
      id: 'arco',
      heading: '6. ARCO rights',
      blocks: [
        'You have the right to <strong>Access</strong> your data, <strong>Rectify</strong> it if inaccurate, <strong>Cancel</strong> it when you believe it is no longer needed and <strong>Object</strong> to its use for specific purposes.',
        `To exercise them, send a request to ${email} including:`,
        {
          list: [
            'Your name and a way to send you our answer.',
            'A copy of your official ID or, where applicable, that of your legal representative and proof of representation.',
            'A clear description of the data and the right you wish to exercise.',
            'For rectification, the correct data and, if applicable, supporting documents.',
          ],
        },
        'We will answer within 20 business days of receiving your complete request and, if it is granted, we will carry it out within the following 15 business days.',
      ],
    },
    {
      id: 'revocacion',
      heading: '7. Withdrawing consent and limiting use',
      blocks: [
        `You can withdraw your consent or ask us to limit the use or disclosure of your data by writing to ${email}, following the same procedure as in section 6. Please note that if you withdraw consent for the primary purposes, we may not be able to continue handling your request.`,
      ],
    },
    {
      id: 'conservacion',
      heading: '8. Retention',
      blocks: [
        'We keep your data only as long as needed to fulfill the purposes in this notice and applicable legal obligations. After that it is blocked and securely deleted.',
      ],
    },
    {
      id: 'menores',
      heading: '9. Minors',
      blocks: [
        'The site and our services are intended for people over 18. We do not knowingly collect data from minors.',
      ],
    },
    {
      id: 'cambios',
      heading: '10. Changes to this notice',
      blocks: [
        'We may update this notice due to legal changes or changes in our services or site tools. Any change will be published on this page with its update date.',
      ],
    },
    {
      id: 'autoridad',
      heading: '11. Authority',
      blocks: [
        'If you believe your right to personal data protection has been violated, you may contact the Secretaría Anticorrupción y Buen Gobierno, the Mexican authority in charge of enforcing the law.',
      ],
    },
  ],
}

export const privacyContent: Record<Locale, PrivacyContent> = { es, en }
