import { ActivityIndicator, View } from "react-native"
import { colors } from "@/constants/Colors"

// Indicador de carregamento padrão para chamadas de API
export function LoadingIndicator() {
  return (
    <View className="flex-1 justify-center items-center bg-[#111111]">
      <ActivityIndicator color={colors.verde} size={32} />
    </View>
  )
}