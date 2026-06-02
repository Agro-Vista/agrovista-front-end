import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"

export default function PlanosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="star-outline" size={40} color={colors.textoTerciario} />
      <Text style={{ color: colors.textoSecundario, fontSize: 15, fontWeight: "600", marginTop: 12 }}>
        Planos
      </Text>
      <Text style={{ color: colors.textoTerciario, fontSize: 13, marginTop: 6 }}>
        Em breve
      </Text>
    </View>
  )
}
