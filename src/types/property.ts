export type PropertyInput = {
  userId: number
  nomeFazenda: string
  municipio: string
  estado: string
  areaHectares: number
}

export type PropertyResponse = PropertyInput & { id: number }
