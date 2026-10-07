import type { Dictionary } from './es'

/**
 * Diccionario en inglés. El tipo `Dictionary` obliga a cubrir exactamente las
 * mismas claves que el español: si falta una, el build falla.
 */
export const en: Dictionary = {
  common: {
    brand: 'VMV Arquitectos',
  },

  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    projects: 'Projects',
    process: 'Process',
    contact: 'Contact',
    homeAria: 'VMV Arquitectos home',
    mainAria: 'Main navigation',
    openMenu: 'Open menu',
    writeToUs: 'Write to us',
    whatsappAria: 'Message us on WhatsApp',
  },

  language: {
    label: 'Language',
    switchAria: 'Change language',
  },

  theme: {
    toggleTitle: 'Change theme',
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
  },

  hero: {
    sectionAria: 'Main hero',
    title: 'Architecture, design and construction',
    phrases: [
      'More than 14 years of experience',
      'More than 500 projects',
      'Based in Guadalajara · Projects across Mexico',
    ],
    description: 'When you decide to build, what matters is feeling accompanied.',
  },

  about: {
    heading: 'ABOUT US',
    cta: 'Get to know us',
    reveal: 'Luxury lives in the details. We look after them for you.',
    imageLeftAlt: 'Architectural design by VMV Arquitectos',
    imageRightAlt: 'Luxury construction by VMV Arquitectos',
  },

  services: {
    sectionAria: 'Our services',
    overline: 'What we do',
    title: 'We are with you at every stage of your project',
    body: 'From concept to finished build, we look after the design, the schedule and every last finish.',
    cta: 'Tell us your idea',
    viewImages: 'View images',
    viewGalleryOf: 'View the {title} gallery',
    prev: 'Previous service',
    next: 'Next service',
    galleryClose: 'Close service gallery',
    galleryPrev: 'Previous photo',
    galleryNext: 'Next photo',
    galleryPhotos: 'Service photos',
    galleryFooter: 'Services',
  },

  coverage: {
    overline: 'Where we build',
    title: 'Coverage',
    body: 'We build and supervise work across Mexico.',
  },

  process: {
    sectionAria: 'How we work',
    overline: 'Our process',
    title: 'From the idea to the finished build',
    body: 'Five clear stages that guide your project from the first conversation to the final handover. Hover over each step for the details.',
    steps: [
      {
        title: 'Understanding your needs',
        description: 'An interview to assess the project and what it calls for.',
        imageAlt: 'Initial meeting to identify what the project needs',
      },
      {
        title: 'Preliminary design',
        description: 'We develop proposals that answer those needs.',
        imageAlt: 'Preliminary design proposals by VMV Arquitectos',
      },
      {
        title: 'Construction documents and 3D renders',
        description:
          'Once the proposal is approved, we produce all the massing and 3D work the project requires.',
        imageAlt: 'Massing and 3D renders from the construction documents',
      },
      {
        title: 'Quotation',
        description:
          'Every quote is built on unit prices: a line-by-line breakdown of all the work the project involves.',
        imageAlt: 'Unit-price breakdown of the quotation',
      },
      {
        title: 'Construction',
        description:
          'Architects and engineers supervise the work to guarantee the quality of every project.',
        imageAlt: 'Architects and engineers supervising construction',
      },
    ],
  },

  contact: {
    sectionAria: 'Contact form',
    overline: 'Contact',
    title: 'Let us talk about your project',
    body: 'Tell us a little about what you have in mind. We will get back to you on WhatsApp or by email to walk through the next steps.',
    modalClose: 'Close contact form',
  },

  form: {
    firstName: 'First name(s)',
    lastName: 'Last name(s)',
    email: 'Email',
    phone: 'Phone',
    consideringBuilding: 'Are you considering building?',
    hasLand: 'Do you already have a plot?',
    yes: 'Yes',
    no: 'No',
    message: 'Message',
    messagePlaceholder: 'Tell us about your project.',
    note: 'We will get in touch on WhatsApp or by email within the next few hours.',
    submit: 'Send',
    successTitle: 'Thank you for writing',
    successBody:
      'We have received your message. We will get in touch on WhatsApp or by email within the next few hours.',
    sendAnother: 'Send another message',
    sendError: 'We could not send your message. Write to us at ventas@vmvarquitectos.com.',
    privacyBefore: 'By sending you accept our ',
    privacyLink: 'privacy notice',
    privacyAfter: '.',
  },

  footer: {
    sectionAria: 'Footer',
    tagline:
      'We design and build functional, beautiful spaces, caring for every detail of the project through to the final handover.',
    backToTop: 'Back to top',
    navHeading: 'Navigation',
    navAria: 'Footer navigation',
    contactHeading: 'Contact',
    socialHeading: 'Follow us',
    paymentsIntro: 'Ask about our payment options.',
    paymentsHighlight: 'Interest-free monthly plans',
    paymentsAria: 'Payment methods',
    rights: '© {year} VMV Arquitectos. All rights reserved.',
    signature: 'Design and construction',
    privacy: 'Privacy notice',
    cookiePreferences: 'Cookie preferences',
  },

  cookies: {
    aria: 'Cookie notice',
    message:
      'We use cookies to measure visits and show VMV Arquitectos ads. You can reject them without affecting your browsing. Learn more in our',
    privacyLink: 'privacy notice',
    accept: 'Accept',
    reject: 'Reject',
  },

  loader: {
    aria: 'Loading VMV Arquitectos',
    phrases: ['Spaces made to be lived in', 'Spaces with intention'],
  },

  gallery: {
    sectionAria: 'Visual gallery of projects',
  },

  projects: {
    overline: 'Portfolio',
    title: 'Projects',
    body: 'Residential and commercial spaces where design, interiors and construction are resolved by a single team.',
    countLabel: '{count} projects',
    listOverline: 'Built work',
    listTitle: 'Selected works',
    viewProject: 'View project',
    viewProjectAria: 'View the {title} project',
    levels: '{count} levels',
    ctaOverline: 'Next project',
    ctaTitle: 'Shall we start yours?',
    ctaBody:
      'Tell us what you have in mind and we will walk with you from the first sketch to the handover.',
    ctaButton: 'Tell us your idea',
  },

  project: {
    counter: 'Project {index} / {total}',
    breadcrumbAria: 'Breadcrumb',
    allProjects: 'All projects',
    bodyHeading: 'The project',
    cta: 'Tell us your idea',
    viewAll: 'View all',
    galleryClose: 'Close gallery',
    galleryPrev: 'Previous',
    galleryNext: 'Next',
    galleryThumbs: 'Thumbnails',
    sheetHeading: 'Project data',
    collaborators: 'Collaborators',
    galleryOverline: 'Gallery',
    galleryHeading: 'Inside the project',
    plansOverline: 'Technical documents',
    plansHeading: 'Project drawings',
    photoLabel: 'Photograph {index}',
    zoomPlan: 'Enlarge the {title} drawing',
    planAlt: '{title} drawing from the {project} project',
    nextOverline: 'Explore the next project',
    closingOverline: 'Let us talk',
    closingTitle: 'Your project could be the next one',
    notFoundTitle: 'Project not found',
    notFoundCta: 'View all projects',
    notFoundBody: 'The requested identifier does not exist or is not published yet.',
    sheet: {
      firma: 'Firm',
      tipologia: 'Typology',
      anio: 'Year built',
      area: 'Usable area',
      ubicacion: 'Location',
      niveles: 'Levels',
    },
    heroData: {
      ubicacion: 'Location',
      anio: 'Year',
      area: 'Area',
    },
  },

  notFound: {
    overline: 'Error 404',
    title: 'This page does not exist',
    body: 'The link may have changed. Head back home or browse the project portfolio.',
    home: 'Go to home',
    projects: 'View projects',
  },

  seo: {
    homeTitle: 'VMV Arquitectos | Design and construction of spaces made to be lived in',
    homeDescription:
      'Architecture, interior design and construction studio. Residential and commercial spaces made to be lived in. Based in Guadalajara, with projects across Mexico.',
    projectsTitle: 'Architecture and interior design projects | VMV Arquitectos',
    projectsDescription:
      'VMV Arquitectos portfolio: built work in architecture, interior design and construction across residential and commercial projects in Guadalajara and throughout Mexico.',
    projectTitle: '{title} | Project | VMV Arquitectos',
    projectNotFoundTitle: 'Project not found | VMV Arquitectos',
    projectNotFoundDescription: 'The project you are looking for is not available.',
    projectFallbackDescription: '{title}: a {type} project by VMV Arquitectos{location}{year}.',
    projectFallbackType: 'architecture',
    projectFallbackLocation: ' in {location}',
    projectFallbackYear: ' ({year})',
    notFoundTitle: 'Page not found | VMV Arquitectos',
    notFoundDescription: 'The page you are looking for does not exist or has moved.',
    privacyTitle: 'Privacy notice | VMV Arquitectos',
    privacyDescription:
      'How VMV Arquitectos collects, uses and protects your personal data, which cookies the site uses and how to exercise your ARCO rights.',
    ogAlt: 'VMV Arquitectos — Design and construction of spaces made to be lived in',
    organizationDescription:
      'Architecture, interior design and construction studio. Residential and commercial spaces made to be lived in. Based in Guadalajara, with projects across Mexico.',
    country: 'Mexico',
    knowsAbout: [
      'Residential architecture',
      'Commercial architecture',
      'Interior design',
      'Construction',
      'Renovation',
    ],
    servicesCatalog: 'VMV Arquitectos services',
  },
}
