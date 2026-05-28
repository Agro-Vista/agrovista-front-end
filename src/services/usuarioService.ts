import api from "./api"
import { User } from "@/types/user"

// Serviço responsável pelo CRUD de usuários
export const usuarioService = {
  criar: (data: Omit<User, "id">) => api.post<User>("/usuarios", data),
  buscar: (id: number) => api.get<User>(`/usuarios/${id}`),
  atualizar: (id: number, data: Partial<User>) => api.put<User>(`/usuarios/${id}`, data),
  deletar: (id: number) => api.delete(`/usuarios/${id}`),
}
