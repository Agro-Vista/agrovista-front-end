import { Text, View } from "react-native"

type Props = {
  subtitle?: string
}

// Cabeçalho de marca reutilizado nas telas de login e cadastro
export function BrandHeader({ subtitle = "Bem-vindo de volta" }: Props) {
  return (
    <View className="items-center mb-10">
      <View
        className="w-16 h-16 rounded-xl justify-center items-center mb-4"
        style={{ backgroundColor: "#166534" }}
      >
        <Text className="text-white" style={{ fontSize: 20, fontWeight: "500" }}>
          av
        </Text>
      </View>
      <Text className="text-[#f5f5f5]" style={{ fontSize: 22 }}>
        AgroVista
      </Text>
      <Text className="text-[#999999]" style={{ fontSize: 13, marginTop: 4 }}>
        {subtitle}
      </Text>
    </View>
  )
}
