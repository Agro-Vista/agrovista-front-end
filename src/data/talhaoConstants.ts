import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { Talhao } from "@/types/talhao"

export const STATUS_CFG: Record<
  Talhao["status"],
  { cor: string; bg: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  OK:      { cor: colors.verde,    bg: colors.verdeBackground,   label: "OK",      icon: "leaf-outline"         },
  ATENCAO: { cor: colors.ambar,    bg: colors.ambarBackground,   label: "Atenção", icon: "warning-outline"      },
  RISCO:   { cor: colors.vermelho, bg: colors.vermelhoBackground, label: "Risco",  icon: "alert-circle-outline" },
}

export const STATUS_DESCRICAO: Record<Talhao["status"], string> = {
  OK:      "Umidade do solo · 30d",
  ATENCAO: "Estresse hídrico subindo",
  RISCO:   "Déficit hídrico 43% < média",
}

export const TIPOS_SOLO = ["Argiloso", "Arenoso", "Misto", "Latossolo"] as const

export const CULTURAS = [
  { id: "Soja",    icon: "leaf-outline"      },
  { id: "Milho",   icon: "nutrition-outline" },
  { id: "Algodão", icon: "cloud-outline"     },
  { id: "Café",    icon: "cafe-outline"      },
  { id: "Cana",    icon: "flash-outline"     },
  { id: "Outro",   icon: "add-outline"       },
] as const

export const ALERTAS_TALHAO = [
  { id: "hidrico", titulo: "Risco hídrico",          sub: "Déficit ou excesso de água",     padrao: true  },
  { id: "fria",    titulo: "Frente fria",             sub: "Queda brusca de temperatura",    padrao: true  },
  { id: "janela",  titulo: "Janela ideal de plantio", sub: "Condições ideais por 72h",       padrao: true  },
  { id: "geada",   titulo: "Alerta de geada",         sub: "Risco de dano por congelamento", padrao: false },
  { id: "vento",   titulo: "Vento forte",             sub: "Rajadas acima de 60 km/h",       padrao: false },
] as const
