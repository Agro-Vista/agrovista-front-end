import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"

type Props = {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  value: string
  sub: string
  valueColor?: string
}

export function StatCard({ icon, title, value, sub, valueColor }: Props) {
  return (
    <View className="flex-1 min-w-[47%] bg-card rounded-xl border border-bordaSutil p-[14px]">
      <View className="flex-row items-center gap-[5px] mb-2">
        <Ionicons name={icon} size={13} color={colors.textoSecundario} />
        <Text className="text-[11px] text-textoSecundario">{title}</Text>
      </View>
      <Text
        className="text-[26px] font-bold mb-1 text-textoPrimario"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
      <Text className="text-[11px] text-textoTerciario">{sub}</Text>
    </View>
  )
}
