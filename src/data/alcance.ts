export interface Estado {
  id: string
  name: string
}

export const mapStyles = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const

export const mapFit = {
  padding: 72,
  maxZoom: 4.8,
}

// El mapa se dibuja en WebGL: los tokens CSS no aplican, por eso se replican aquí.
export const mapColors = {
  light: {
    fill: '#1d1b18',
    active: '#8a745b',
  },
  dark: {
    fill: '#e9dfd2',
    active: '#7f6d5d',
  },
} as const

// El id debe coincidir con properties.id de alcance-estados.json.
export const estados: Estado[] = [
  {
    id: 'ciudad-de-mexico',
    name: 'Ciudad de México',
  },
  {
    id: 'jalisco',
    name: 'Jalisco',
  },
  {
    id: 'nuevo-leon',
    name: 'Nuevo León',
  },
  {
    id: 'quintana-roo',
    name: 'Quintana Roo',
  },
]
