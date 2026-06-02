import { Image, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "@/constants/Colors"

type Props = {
  alertasAtivos: number
  nome: string
}

export function PageHeader({ alertasAtivos, nome }: Props) {
  const insets = useSafeAreaInsets()

  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()

  return (
    <View style={{ paddingTop: insets.top }}>
      <View className="px-4 pb-3 pt-2 flex-row items-center justify-between">
        <Image
          source={require("../../assets/images/light-logo.png")}
          style={{ width: 220, height: 65, marginBottom: 12 }}
          resizeMode="contain"
        />
        <View className="flex-row items-center gap-[10px]">
          <TouchableOpacity
            className="flex-row items-center gap-[5px] bg-ambarBackground rounded-full px-[10px] py-[5px] border"
            style={{ borderColor: colors.ambar + "40" }}
          >
            <Ionicons name="notifications-outline" size={13} color={colors.ambar} />
            <Text className="text-[12px] text-ambar font-semibold">
              {alertasAtivos} alertas ativos
            </Text>
          </TouchableOpacity>
          <View
            className="w-[34px] h-[34px] rounded-full border-[1.5px] border-verde items-center justify-center"
            style={{ backgroundColor: colors.verde + "20" }}
          >
            <Text className="text-[12px] font-bold text-verde">{iniciais}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
