import { colors } from "@/constants/Colors"
import type { ResultadoEvento, EventoHistorico } from "@/types/history"

export type { ResultadoEvento, EventoHistorico }

export const RESULTADO_CFG: Record<
  ResultadoEvento,
  { cor: string; bg: string; label: string }
> = {
  CORRETO:   { cor: colors.verde,    bg: colors.verdeBackground,    label: "Correto"   },
  PARCIAL:   { cor: colors.ambar,    bg: colors.ambarBackground,    label: "Parcial"   },
  INCORRETO: { cor: colors.vermelho, bg: colors.vermelhoBackground, label: "Incorreto" },
}

export const EVENTOS: EventoHistorico[] = [
  {
    id: 1,
    titulo: "Frente fria",
    talhaoNome: "Talhão Central",
    data: "12 mai",
    resultado: "CORRETO",
    descricao: "Alertou 4 dias antes. Plantio adiado com sucesso.",
  },
  {
    id: 2,
    titulo: "Janela ideal",
    talhaoNome: "Talhão Norte",
    data: "08 mai",
    resultado: "CORRETO",
    descricao: "72h ideais confirmadas. Germinação dentro do esperado.",
  },
  {
    id: 3,
    titulo: "Seca",
    talhaoNome: "Talhão Sul",
    data: "02 mai",
    resultado: "PARCIAL",
    descricao: "Chuva chegou 2 dias após o previsto. Impacto mínimo.",
  },
  {
    id: 4,
    titulo: "Frente fria",
    talhaoNome: "Talhão Leste",
    data: "28 abr",
    resultado: "CORRETO",
    descricao: "Alerta correto. Produtor adiou colheita.",
  },
  {
    id: 5,
    titulo: "Estresse hídrico",
    talhaoNome: "Talhão Central",
    data: "21 abr",
    resultado: "CORRETO",
    descricao: "Irrigação suplementar iniciada a tempo.",
  },
  {
    id: 6,
    titulo: "Geada",
    talhaoNome: "Talhão Norte",
    data: "14 abr",
    resultado: "PARCIAL",
    descricao: "Severidade superestimada. Dano real foi menor.",
  },
]

export const ALERTAS_EMITIDOS = 24
export const TAXA_ACERTO = 87
export const PERIODO_DIAS = 60
