import api from "./api"

type PropertyInput = {
  userId: number
  nomeFazenda: string
  municipio: string
  estado: string
  areaHectares: number
}

type PropertyResponse = PropertyInput & { id: number }

export const propertyService = {
  criar: (data: PropertyInput) => api.post<PropertyResponse>("/propriedades", data),
  buscar: (id: number) => api.get<PropertyResponse>(`/propriedades/${id}`),
}
