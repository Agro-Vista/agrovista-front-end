import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { AlertType, AlertLevel, AlertItemData } from "@/types/alert"

const LEVEL_CFG: Record<AlertLevel, { cor: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  ALTO:  { cor: colors.vermelho, bg: colors.vermelhoBackground, icon: "flame-outline"   },
  MEDIO: { cor: colors.ambar,    bg: colors.ambarBackground,    icon: "warning-outline" },
  BAIXO: { cor: colors.verde,    bg: colors.verdeBackground,    icon: "leaf-outline"    },
}

const TYPE_LABEL: Record<AlertType, string> = {
  RISCO_HIDRICO:  "Seca crítica",
  FRENTE_FRIA:    "Frente fria",
  JANELA_PLANTIO: "Janela plantio",
  GEADA:          "Geada",
  VENTO_FORTE:    "Vento forte",
}

type Props = {
  alerta: AlertItemData
  onPress?: () => void
}

export function AlertItem({ alerta, onPress }: Props) {
  const cfg = LEVEL_CFG[alerta.nivel]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row gap-3 items-start bg-card rounded-xl p-[14px] mb-[10px] border border-bordaSutil"
    >
      <View
        className="w-9 h-9 rounded-[10px] items-center justify-center"
        style={{ backgroundColor: cfg.bg }}
      >
        <Ionicons name={cfg.icon} size={18} color={cfg.cor} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-[13px] font-semibold text-textoPrimario flex-1 mr-2">
            {alerta.label ?? TYPE_LABEL[alerta.tipo]} — {alerta.talhaoNome}
          </Text>
          <Text className="text-[11px] text-textoTerciario">{alerta.createdAt}</Text>
        </View>
        <Text className="text-[12px] text-textoSecundario leading-[18px]" numberOfLines={2}>
          {alerta.descricao}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
