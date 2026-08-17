export interface Ubicacion {
  id: string
  name: string
  coordinates: [number, number]
}

export const mapStyles = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const

export const mapFit = {
  padding: 72,
  maxZoom: 4.8,
}


export const ubicaciones: Ubicacion[] = [
  {
    id: 'ciudad-de-mexico',
    name: 'Ciudad de México',
    coordinates: [-99.1332, 19.4326],
  },
  {
    id: 'puerto-vallarta',
    name: 'Puerto Vallarta',
    coordinates: [-105.2426, 20.6171],
  },
  {
    id: 'guadalajara',
    name: 'Guadalajara',
    coordinates: [-103.3496, 20.6597],
  },
  {
    id: 'monterrey',
    name: 'Monterrey',
    coordinates: [-100.3161, 25.6866],
  },
  {
    id: 'riviera-maya',
    name: 'Riviera Maya',
    coordinates: [-87.0739, 20.6296],
  },
]
