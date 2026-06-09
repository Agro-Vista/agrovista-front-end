import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { ResultadoEvento } from "@/types/history"

export type ValidationOption = {
  result: ResultadoEvento
  label: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  background: string
}

export const VALIDATION_OPTIONS: ValidationOption[] = [
  {
    result: "CORRETO",
    label: "Correto",
    subtitle: "O alerta se confirmou como previsto",
    icon: "checkmark-circle-outline",
    color: colors.verde,
    background: colors.verdeBackground,
  },
  {
    result: "PARCIAL",
    label: "Parcial",
    subtitle: "Aconteceu, mas de forma diferente",
    icon: "remove-circle-outline",
    color: colors.ambar,
    background: colors.ambarBackground,
  },
  {
    result: "INCORRETO",
    label: "Incorreto",
    subtitle: "O evento não ocorreu na fazenda",
    icon: "close-circle-outline",
    color: colors.vermelho,
    background: colors.vermelhoBackground,
  },
]
