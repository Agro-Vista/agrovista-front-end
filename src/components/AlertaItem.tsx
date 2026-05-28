import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { TipoAlerta, NivelAlerta } from "@/types/alerta"

const NIVEL: Record<NivelAlerta, { cor: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  ALTO: { cor: colors.vermelho, bg: colors.vermelhoBackground, icon: "flame-outline" },
  MEDIO: { cor: colors.ambar, bg: colors.ambarBackground, icon: "warning-outline" },
  BAIXO: { cor: colors.verde, bg: colors.verdeBackground, icon: "leaf-outline" },
}

const TIPO_LABEL: Record<TipoAlerta, string> = {
  RISCO_HIDRICO: "Seca crítica",
  FRENTE_FRIA: "Frente fria",
  JANELA_PLANTIO: "Janela plantio",
  GEADA: "Geada",
  VENTO_FORTE: "Vento forte",
}

export type AlertaItemData = {
  tipo: TipoAlerta
  nivel: NivelAlerta
  talhaoNome: string
  createdAt: string
  descricao: string
  label?: string
}

type Props = {
  alerta: AlertaItemData
  onPress?: () => void
}

export function AlertaItem({ alerta, onPress }: Props) {
  const cfg = NIVEL[alerta.nivel]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.bordaSutil,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: cfg.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={cfg.icon} size={18} color={cfg.cor} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textoPrimario, flex: 1, marginRight: 8 }}>
            {alerta.label ?? TIPO_LABEL[alerta.tipo]} — {alerta.talhaoNome}
          </Text>
          <Text style={{ fontSize:  11, color: colors.textoTerciario }}>{alerta.createdAt}</Text>
        </View>
        <Text style={{ fontSize: 12, color: colors.textoSecundario, lineHeight: 18 }} numberOfLines={2}>
          {alerta.descricao}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
