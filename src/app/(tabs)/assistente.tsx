import { useEffect, useRef, useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { colors } from "@/constants/Colors"
import { conversa, usuario } from "@/data/mockData"
import { SUGESTOES } from "@/data/assistente"
import { horaAgora, gerarResposta } from "@/lib/assistente"
import type { MsgTexto, Mensagem } from "@/types/message"
import { useSession } from "@/context/SessionContext"

export default function AssistenteScreen() {
  const { session } = useSession()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const inputRef = useRef<TextInput>(null)
  const proximoId = useRef(conversa.length + 1)

  const [texto, setTexto] = useState("")
  const [digitando, setDigitando] = useState(false)

  const primeiroNome = (session.nome || usuario.nome).split(" ")[0]

  const [mensagens, setMensagens] = useState<Mensagem[]>(() =>
    conversa.map((m): Mensagem => {
      if (m.tipo === "arquivo") {
        return { id: m.id, tipo: "arquivo", nome: m.nome, subtexto: m.subtexto, hora: m.hora }
      }
      return {
        id: m.id,
        tipo: m.tipo as "recv" | "send",
        texto: m.tipo === "recv" ? m.texto.replace(/João/g, primeiroNome) : m.texto,
        hora: m.hora,
      }
    })
  )

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 80)
  }, [])

  function scrollFim(animado = true) {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: animado }), 50)
  }

  async function enviar(textoEnviado?: string) {
    const msg = (textoEnviado ?? texto).trim()
    if (!msg || digitando) return

    setTexto("")
    inputRef.current?.focus()

    const enviada: MsgTexto = { id: proximoId.current++, tipo: "send", texto: msg, hora: horaAgora() }
    setMensagens((prev) => [...prev, enviada])
    scrollFim()

    setDigitando(true)
    scrollFim()

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800))

    const resposta: MsgTexto = {
      id: proximoId.current++,
      tipo: "recv",
      texto: gerarResposta(msg, primeiroNome),
      hora: horaAgora(),
    }
    setMensagens((prev) => [...prev, resposta])
    setDigitando(false)
    scrollFim()
  }

  function enviarSugestao(s: string) {
    setTexto("")
    void enviar(s)
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.bordaSutil,
        }}
      >
        <View className="px-4 pb-3 pt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View>
              <View
                className="w-[42px] h-[42px] rounded-full items-center justify-center"
                style={{ backgroundColor: colors.verde + "25" }}
              >
                <Text className="text-verde text-[14px] font-bold">AV</Text>
              </View>
              <View
                className="absolute w-[11px] h-[11px] rounded-full bg-verde"
                style={{ bottom: 0, right: 0, borderWidth: 2, borderColor: colors.card }}
              />
            </View>
            <View>
              <Text className="text-textoPrimario text-[16px] font-bold">AgroVista</Text>
              <Text className="text-[12px]" style={{ color: colors.verde }}>
                {digitando ? "digitando..." : "Assistente agrícola · online"}
              </Text>
            </View>
          </View>
          <Ionicons name="wifi" size={20} color={colors.textoTerciario} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Lista de mensagens */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Separador de data */}
          <View className="items-center mb-5">
            <View
              className="rounded-full px-4 py-[5px] border border-bordaSutil"
              style={{ backgroundColor: colors.card }}
            >
              <Text className="text-textoTerciario text-[12px]">
                Hoje · 25 mai 2026
              </Text>
            </View>
          </View>

          {mensagens.map((msg) => {
            if (msg.tipo === "arquivo") {
              return (
                <View key={msg.id} className="mb-3">
                  <View
                    className="rounded-2xl border p-3 flex-row items-center gap-3"
                    style={{
                      backgroundColor: colors.cardElevado,
                      borderColor: colors.bordaVisivel,
                      maxWidth: "84%",
                    }}
                  >
                    <View
                      className="w-[44px] h-[44px] rounded-xl items-center justify-center"
                      style={{ backgroundColor: colors.roxo + "20" }}
                    >
                      <Ionicons name="document-text-outline" size={20} color={colors.roxo} />
                      <Text
                        className="text-[8px] font-bold"
                        style={{ color: colors.roxo, marginTop: 1 }}
                      >
                        PDF
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        className="text-textoPrimario text-[13px] font-semibold"
                        numberOfLines={1}
                      >
                        {msg.nome}
                      </Text>
                      <Text
                        className="text-textoTerciario text-[11px] mt-[2px]"
                        numberOfLines={2}
                      >
                        {msg.subtexto}
                      </Text>
                      <Text className="text-textoTerciario text-[11px] mt-[2px]">218 KB</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Ionicons name="cloud-download-outline" size={22} color={colors.textoSecundario} />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-textoTerciario text-[11px] ml-2 mt-[3px]">
                    {msg.hora}
                  </Text>
                </View>
              )
            }

            const enviada = msg.tipo === "send"
            return (
              <View
                key={msg.id}
                className={`mb-[6px] ${enviada ? "items-end" : "items-start"}`}
              >
                <View
                  className="rounded-2xl px-[14px] py-[9px]"
                  style={{
                    maxWidth: "82%",
                    backgroundColor: enviada ? colors.whatsapp : colors.cardElevado,
                  }}
                >
                  <Text
                    className="text-[14px] leading-[20px]"
                    style={{ color: enviada ? "#ffffff" : colors.textoPrimario }}
                  >
                    {msg.texto}
                  </Text>
                  <View className="flex-row items-center justify-end gap-[3px] mt-[3px]">
                    <Text
                      className="text-[11px]"
                      style={{ color: enviada ? "rgba(255,255,255,0.55)" : colors.textoTerciario }}
                    >
                      {msg.hora}
                    </Text>
                    {enviada && (
                      <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.55)" />
                    )}
                  </View>
                </View>
              </View>
            )
          })}

          {/* Indicador de digitação */}
          {digitando && (
            <View className="items-start mb-[6px]">
              <View
                className="rounded-2xl px-[14px] py-[12px] flex-row items-center gap-[5px]"
                style={{ backgroundColor: colors.cardElevado }}
              >
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ backgroundColor: colors.textoTerciario, opacity: 0.7 + i * 0.15 }}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Rodapé: sugestões + input */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.bordaSutil,
            backgroundColor: colors.card,
          }}
        >
          {/* Chips de sugestão rápida */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 10 }}
          >
            {SUGESTOES.map((s) => (
              <TouchableOpacity
                key={s}
                activeOpacity={0.7}
                onPress={() => enviarSugestao(s)}
                className="rounded-full border border-bordaVisivel px-4 py-[7px]"
                style={{ backgroundColor: colors.cardElevado }}
              >
                <Text className="text-textoSecundario text-[13px]">{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Campo de mensagem */}
          <View
            className="flex-row items-end px-3 gap-2"
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              className="w-[38px] h-[38px] rounded-full items-center justify-center border border-bordaVisivel"
              style={{ backgroundColor: colors.cardElevado, marginBottom: 1 }}
            >
              <Ionicons name="add" size={22} color={colors.textoSecundario} />
            </TouchableOpacity>

            <View
              className="flex-1 flex-row items-end rounded-2xl border border-bordaVisivel px-4"
              style={{ backgroundColor: colors.cardElevado }}
            >
              <TextInput
                ref={inputRef}
                className="flex-1 text-textoPrimario text-[14px]"
                style={{ paddingVertical: 10 }}
                placeholder="Mensagem"
                placeholderTextColor={colors.textoTerciario}
                value={texto}
                onChangeText={setTexto}
                onSubmitEditing={() => void enviar()}
                submitBehavior="submit"
                multiline
                maxLength={500}
              />
              {!texto && (
                <View style={{ paddingBottom: 11 }}>
                  <Ionicons name="mic-outline" size={20} color={colors.textoTerciario} />
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => void enviar()}
              className="w-[38px] h-[38px] rounded-full items-center justify-center"
              style={{
                backgroundColor: texto ? colors.verde : colors.cardElevado,
                borderWidth: texto ? 0 : 1,
                borderColor: colors.bordaVisivel,
                marginBottom: 1,
              }}
            >
              <Ionicons
                name="send-outline"
                size={16}
                color={texto ? colors.bg : colors.textoTerciario}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
