import { colors } from "@/constants/Colors"
import type { ResultadoEvento, EventoHistorico, EventoPendente } from "@/types/history"

export type { ResultadoEvento, EventoHistorico, EventoPendente }

export const RESULTADO_CFG: Record<
  ResultadoEvento,
  { cor: string; bg: string; label: string; icon: "checkmark-circle-outline" | "remove-circle-outline" | "close-circle-outline" }
> = {
  CORRETO:   { cor: colors.verde,    bg: colors.verdeBackground,    label: "Correto",   icon: "checkmark-circle-outline" },
  PARCIAL:   { cor: colors.ambar,    bg: colors.ambarBackground,    label: "Parcial",   icon: "remove-circle-outline"    },
  INCORRETO: { cor: colors.vermelho, bg: colors.vermelhoBackground, label: "Incorreto", icon: "close-circle-outline"     },
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

export const EVENTOS_PENDENTES_MOCK: EventoPendente[] = [
  {
    id: 101,
    titulo: "Geada",
    talhaoNome: "Talhão Norte",
    data: "01 jun",
    descricao: "Temperatura abaixo de 0°C prevista para a madrugada. O alerta se confirmou na sua fazenda?",
  },
  {
    id: 102,
    titulo: "Seca crítica",
    talhaoNome: "Talhão Sul",
    data: "28 mai",
    descricao: "Déficit hídrico 43% abaixo da média previsto para 72h. Houve impacto real nas culturas?",
  },
  {
    id: 103,
    titulo: "Frente fria",
    talhaoNome: "Talhão Central",
    data: "25 mai",
    descricao: "Queda brusca de temperatura prevista. A frente chegou conforme o esperado?",
  },
]
