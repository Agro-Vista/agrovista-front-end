import { ActivityIndicator, View } from "react-native"
import { Redirect } from "expo-router"
import { useSession } from "@/context/SessionContext"
import { colors } from "@/constants/Colors"

export default function Index() {
  const { session, sessionCarregada } = useSession()

  if (!sessionCarregada) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.verde} size={32} />
      </View>
    )
  }

  if (session.usuarioId) {
    return <Redirect href="/(tabs)/home" />
  }

  return <Redirect href="/login" />
}
