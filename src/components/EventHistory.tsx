import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import type { EventoHistorico } from "@/types/history"
import { RESULTADO_CFG } from "@/data/history"

type Props = { event: EventoHistorico }

export function EventHistory({ event }: Props) {
  const [modalVisible, setModalVisible] = useState(false)
  const config = RESULTADO_CFG[event.resultado]

  return (
    <>
      {/* ─── Card ─── */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        className="bg-card rounded-2xl border border-bordaSutil p-4"
      >
        <View className="flex-row items-center gap-[10px] mb-[6px]">
          <View
            className="w-[8px] h-[8px] rounded-full shrink-0"
            style={{ backgroundColor: config.cor }}
          />
          <Text
            className="flex-1 text-[14px] font-bold text-textoPrimario"
            numberOfLines={1}
          >
            {event.titulo}{" "}
            <Text className="font-normal text-textoSecundario">
              — {event.talhaoNome}
            </Text>
          </Text>
          <Text className="text-[12px] text-textoSecundario mr-1">{event.data}</Text>
          <View
            className="rounded-full border px-[10px] py-[4px]"
            style={{ backgroundColor: config.bg, borderColor: config.cor + "50" }}
          >
            <Text className="text-[12px] font-semibold" style={{ color: config.cor }}>
              {config.label}
            </Text>
          </View>
        </View>
        <Text className="text-[12px] text-textoSecundario" style={{ paddingLeft: 18 }}>
          {event.descricao}
        </Text>
      </TouchableOpacity>

      {/* ─── Modal ─── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-end" style={{ backgroundColor: "#00000088" }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-card rounded-t-[24px] px-5 pt-5 pb-10">

                {/* Handle */}
                <View className="w-10 h-1 rounded-full bg-bordaVisivel self-center mb-5" />

                {/* Cabeçalho */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.cor }}
                      />
                      <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario">
                        EVENTO VALIDADO
                      </Text>
                    </View>
                    <Text className="text-[20px] font-bold text-textoPrimario leading-[26px]">
                      {event.titulo}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="w-8 h-8 rounded-full bg-bordaSutil items-center justify-center"
                  >
                    <Ionicons name="close" size={16} color={colors.textoSecundario} />
                  </TouchableOpacity>
                </View>

                {/* Badge de resultado */}
                <View
                  className="self-start flex-row items-center gap-2 rounded-lg px-3 py-2 mb-5"
                  style={{ backgroundColor: config.bg }}
                >
                  <Ionicons name={config.icon} size={16} color={config.cor} />
                  <Text className="text-[13px] font-semibold" style={{ color: config.cor }}>
                    {config.label}
                  </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Talhão */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      TALHÃO
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="location-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">{event.talhaoNome}</Text>
                    </View>
                  </View>

                  {/* Data */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      DATA DO EVENTO
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="calendar-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">{event.data}</Text>
                    </View>
                  </View>

                  {/* Descrição */}
                  <View
                    className="rounded-xl p-4 mb-4"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      O QUE ACONTECEU
                    </Text>
                    <Text className="text-[13px] text-textoSecundario leading-5">
                      {event.descricao}
                    </Text>
                  </View>
                </ScrollView>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}
