import { Link, Stack } from "expo-router"
import { Text, View } from "react-native"

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View className="flex-1 items-center justify-center bg-[#111111]">
        <Text className="text-[#f5f5f5] text-lg">Página não encontrada.</Text>
        <Link href="/" className="mt-4 text-[#4ade80]">
          Voltar ao início
        </Link>
      </View>
    </>
  )
}
