export interface INMETAviso {
  id: number
  descricao: string
  aviso_cor: string
  id_severidade: number
  severidade: string
  estados: string
  regioes: string
  mesorregioes: string
  riscos: string[]
  inicio: string
}

export interface INMETResponse {
  hoje: INMETAviso[]
  futuro: INMETAviso[]
}
