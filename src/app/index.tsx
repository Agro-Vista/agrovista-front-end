import { Redirect } from "expo-router"
import { useSession } from "@/context/SessionContext"

// Ponto de entrada: redireciona conforme estado de autenticação
export default function Index() {
  const { session } = useSession()

  if (session.usuarioId) {
    return <Redirect href="/(tabs)/home" />
  }

  return <Redirect href="/login" />
}
