import api from "./api"
import type { PropertyInput, PropertyResponse } from "@/types/property"

export const propertyService = {
  criar: (data: PropertyInput) => api.post<PropertyResponse>("/propriedades", data),
  buscar: (id: number) => api.get<PropertyResponse>(`/propriedades/${id}`),
}
