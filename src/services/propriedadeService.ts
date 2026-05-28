import api from "./api"

type PropriedadeInput = {
  usuarioId: number
  nomeFazenda: string
  municipio: string
  estado: string
  areaHectares: number
}

type PropriedadeResponse = PropriedadeInput & { id: number }

// Serviço responsável pelo cadastro de propriedades rurais
export const propriedadeService = {
  criar: (data: PropriedadeInput) => api.post<PropriedadeResponse>("/propriedades", data),
  buscar: (id: number) => api.get<PropriedadeResponse>(`/propriedades/${id}`),
}
