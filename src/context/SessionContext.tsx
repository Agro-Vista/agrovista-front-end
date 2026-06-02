import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { storage, STORAGE_KEYS } from "@/lib/storage"

type SessionData = {
  usuarioId: number | null
  propriedadeId: number | null
  nome: string
}

type SessionContextType = {
  session: SessionData
  sessionCarregada: boolean
  setSession: (data: SessionData) => Promise<void>
  clearSession: () => Promise<void>
}

const SESSAO_VAZIA: SessionData = { usuarioId: null, propriedadeId: null, nome: "" }

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionData>(SESSAO_VAZIA)
  const [sessionCarregada, setSessionCarregada] = useState(false)

  useEffect(() => {
    storage.get<SessionData>(STORAGE_KEYS.SESSION).then((salva) => {
      if (salva) setSessionState(salva)
      setSessionCarregada(true)
    })
  }, [])

  const setSession = async (data: SessionData): Promise<void> => {
    await storage.set(STORAGE_KEYS.SESSION, data)
    setSessionState(data)
  }

  const clearSession = async (): Promise<void> => {
    await storage.remove(STORAGE_KEYS.SESSION)
    setSessionState(SESSAO_VAZIA)
  }

  return (
    <SessionContext.Provider value={{ session, sessionCarregada, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession deve ser usado dentro do SessionProvider")
  return ctx
}
