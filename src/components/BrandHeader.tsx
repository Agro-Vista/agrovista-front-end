import { Image, Text, View } from "react-native"

type Props = {
  subtitle?: string
}

// Cabeçalho de marca reutilizado nas telas de login e cadastro
export function BrandHeader({ subtitle = "Bem-vindo de volta" }: Props) {
  return (
    <View className="items-center mb-10">
      <Image
        source={require("../../assets/images/light-logo.png")}
        style={{ width: 220, height: 65, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text className="text-[#999999]" style={{ fontSize: 13 }}>
        {subtitle}
      </Text>
    </View>
  )
}
