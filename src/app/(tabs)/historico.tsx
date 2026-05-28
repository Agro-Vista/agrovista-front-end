import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"

export default function HistoricoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="time-outline" size={40} color={colors.textoTerciario} />
      <Text style={{ color: colors.textoSecundario, fontSize: 15, fontWeight: "600", marginTop: 12 }}>
        Histórico
      </Text>
      <Text style={{ color: colors.textoTerciario, fontSize: 13, marginTop: 6 }}>
        Em breve
      </Text>
    </View>
  )
}
