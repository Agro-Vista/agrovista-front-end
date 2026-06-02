import { colors } from "@/constants/Colors"

export type Aba = "Mapa" | "Alertas" | "Regiões" | "IA"

export const ABAS: Aba[] = ["Mapa", "Alertas", "Regiões", "IA"]

export const MARCADORES = [
  { label: "Alerta clim.", cor: colors.ambar,   top: 44,  left: "54%" as const },
  { label: "Seca crítica", cor: colors.vermelho, top: 78,  left: "18%" as const },
  { label: "Normal",       cor: colors.verde,    top: 108, left: "66%" as const },
]
