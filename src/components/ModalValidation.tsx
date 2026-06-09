import { View, Text, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { EventoPendente, ResultadoEvento } from "@/types/history"
import { VALIDATION_OPTIONS } from "@/data/validation"

type Props = {
  event: EventoPendente | null
  onValidate: (id: number, result: ResultadoEvento) => void
  onClose: () => void
}

export function ModalValidation({ event, onValidate, onClose }: Props) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={!!event}
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
              {event?.titulo}
            </Text>
            <Text className="text-[13px] text-textoSecundario mb-1">
              {event?.talhaoNome} · {event?.data}
            </Text>
            <Text className="text-[13px] text-textoSecundario leading-5 mb-6">
              {event?.descricao}
            </Text>

            <Text className="text-[12px] text-textoTerciario mb-3">
              O que aconteceu na realidade?
            </Text>

            <View className="gap-3">
              {VALIDATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.result}
                  onPress={() => event && onValidate(event.id, option.result)}
                  className="flex-row items-center gap-3 rounded-xl p-4 border"
                  style={{ backgroundColor: option.background, borderColor: option.color + "40" }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={option.icon} size={22} color={option.color} />
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold" style={{ color: option.color }}>
                      {option.label}
                    </Text>
                    <Text className="text-[12px] text-textoTerciario mt-[2px]">
                      {option.subtitle}
                    </Text>
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
