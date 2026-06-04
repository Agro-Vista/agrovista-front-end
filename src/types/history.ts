export type ResultadoEvento = "CORRETO" | "PARCIAL" | "INCORRETO"

export type EventoHistorico = {
  id: number
  titulo: string
  talhaoNome: string
  data: string
  resultado: ResultadoEvento
  descricao: string
}
