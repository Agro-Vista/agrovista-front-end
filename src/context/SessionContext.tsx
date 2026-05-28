import { createContext, useContext, useState, ReactNode } from "react"

type SessionData = {
  usuarioId: number | null
  propriedadeId: number | null
  nome: string
}

type SessionContextType = {
  session: SessionData
  setSession: (data: SessionData) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

// Provedor de sessão que armazena usuário e propriedade autenticados
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData>({
    usuarioId: null,
    propriedadeId: null,
    nome: "",
  })

  const clearSession = () =>
    setSession({ usuarioId: null, propriedadeId: null, nome: "" })

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession deve ser usado dentro do SessionProvider")
  return ctx
}
