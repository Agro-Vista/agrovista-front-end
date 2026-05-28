import api from "./api"
import { Talhao } from "@/types/talhao"

// Serviço responsável pelo CRUD de talhões
export const talhaoService = {
  criar: (data: Omit<Talhao, "id">) => api.post<Talhao>("/talhoes", data),
  listar: (propriedadeId: number) => api.get<Talhao[]>(`/talhoes/propriedade/${propriedadeId}`),
  atualizar: (id: number, data: Partial<Talhao>) => api.put<Talhao>(`/talhoes/${id}`, data),
  deletar: (id: number) => api.delete(`/talhoes/${id}`),
}
