export type ResultadoEvento = "CORRETO" | "PARCIAL" | "INCORRETO"

export type EventoHistorico = {
  id: number
  titulo: string
  talhaoNome: string
  data: string
  resultado: ResultadoEvento
  descricao: string
}

export type EventoPendente = {
  id: number
  titulo: string
  talhaoNome: string
  data: string
  descricao: string
}
