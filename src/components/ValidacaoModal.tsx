import { View, Text, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { EventoPendente, ResultadoEvento } from "@/types/history"

type Props = {
  evento: EventoPendente | null
  onValidar: (id: number, resultado: ResultadoEvento) => void
  onClose: () => void
}

const OPCOES: {
  resultado: ResultadoEvento
  label: string
  sub: string
  icon: keyof typeof Ionicons.glyphMap
  cor: string
  bg: string
}[] = [
  {
    resultado: "CORRETO",
    label: "Correto",
    sub: "O alerta se confirmou como previsto",
    icon: "checkmark-circle-outline",
    cor: colors.verde,
    bg: colors.verdeBackground,
  },
  {
    resultado: "PARCIAL",
    label: "Parcial",
    sub: "Aconteceu, mas de forma diferente",
    icon: "remove-circle-outline",
    cor: colors.ambar,
    bg: colors.ambarBackground,
  },
  {
    resultado: "INCORRETO",
    label: "Incorreto",
    sub: "O evento não ocorreu na fazenda",
    icon: "close-circle-outline",
    cor: colors.vermelho,
    bg: colors.vermelhoBackground,
  },
]

export function ValidacaoModal({ evento, onValidar, onClose }: Props) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!evento}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 justify-end"
        activeOpacity={1}
        onPress={onClose}
        style={{ backgroundColor: "#00000088" }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="bg-card rounded-t-[24px] px-5 pt-5 pb-10">
            <View className="w-10 h-1 rounded-full bg-bordaVisivel self-center mb-5" />

            <Text className="text-[11px] font-bold text-textoTerciario tracking-widest mb-2">
              VALIDAR ALERTA
            </Text>
            <Text className="text-[20px] font-bold text-textoPrimario mb-1">
              {evento?.titulo}
            </Text>
            <Text className="text-[13px] text-textoSecundario mb-1">
              {evento?.talhaoNome} · {evento?.data}
            </Text>
            <Text className="text-[13px] text-textoSecundario leading-5 mb-6">
              {evento?.descricao}
            </Text>

            <Text className="text-[12px] text-textoTerciario mb-3">
              O que aconteceu na realidade?
            </Text>

            <View className="gap-3">
              {OPCOES.map((op) => (
                <TouchableOpacity
                  key={op.resultado}
                  onPress={() => evento && onValidar(evento.id, op.resultado)}
                  className="flex-row items-center gap-3 rounded-xl p-4 border"
                  style={{ backgroundColor: op.bg, borderColor: op.cor + "40" }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={op.icon} size={22} color={op.cor} />
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold" style={{ color: op.cor }}>
                      {op.label}
                    </Text>
                    <Text className="text-[12px] text-textoTerciario mt-[2px]">{op.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}
