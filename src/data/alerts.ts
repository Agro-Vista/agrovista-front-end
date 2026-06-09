import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { AlertLevel, AlertType } from "@/types/alert"

export const LEVEL_CONFIG: Record<
  AlertLevel,
  { color: string; background: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  ALTO:  { color: colors.vermelho, background: colors.vermelhoBackground, label: "Perigo",      icon: "flame-outline"              },
  MEDIO: { color: colors.ambar,    background: colors.ambarBackground,    label: "Atenção",     icon: "warning-outline"            },
  BAIXO: { color: colors.verde,    background: colors.verdeBackground,    label: "Informativo", icon: "information-circle-outline" },
}

export const TYPE_LABELS: Record<AlertType, string> = {
  RISCO_HIDRICO:  "Risco Hídrico",
  FRENTE_FRIA:    "Frente Fria",
  JANELA_PLANTIO: "Janela de Plantio",
  GEADA:          "Geada",
  VENTO_FORTE:    "Vento Forte",
}
