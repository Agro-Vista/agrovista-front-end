import { Image, Text, View } from "react-native"

type Props = {
  subtitle?: string
}

export function BrandHeader({ subtitle = "Bem-vindo de volta" }: Props) {
  return (
    <View className="items-center mb-10">
      <Image
        source={require("../../assets/images/light-logo.png")}
        style={{ width: 220, height: 65, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text className="text-textoSecundario text-[13px]">{subtitle}</Text>
    </View>
  )
}
