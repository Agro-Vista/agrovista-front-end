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
import type { AlertItemData } from "@/types/alert"
import { LEVEL_CONFIG, TYPE_LABELS } from "@/data/alerts"

type Props = {
  alert: AlertItemData
}

export function WeatherAlertCard({ alert }: Props) {
  const [modalVisible, setModalVisible] = useState(false)
  const config = LEVEL_CONFIG[alert.nivel]

  return (
    <>
      {/* ─── Card ─── */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        className="flex-row bg-card rounded-xl mb-3 overflow-hidden border border-bordaSutil"
      >
        <View className="w-1" style={{ backgroundColor: config.color }} />
        <View className="flex-1 p-3 gap-[6px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold text-textoPrimario flex-1 mr-2" numberOfLines={1}>
              {alert.label ?? alert.talhaoNome}
            </Text>
            <Text className="text-[11px] text-textoTerciario">{alert.createdAt}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={11} color={colors.textoTerciario} />
            <Text className="text-[11px] text-textoSecundario flex-1" numberOfLines={1}>
              {alert.talhaoNome}
            </Text>
            <View className="rounded px-[6px] py-[2px]" style={{ backgroundColor: config.background }}>
              <Text className="text-[10px] font-semibold" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
          </View>
          <Text className="text-[12px] text-textoSecundario leading-[18px]" numberOfLines={2}>
            {alert.descricao}
          </Text>
        </View>
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
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                      <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario">
                        AVISO INMET
                      </Text>
                    </View>
                    <Text className="text-[20px] font-bold text-textoPrimario leading-[26px]">
                      {alert.label ?? alert.talhaoNome}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="w-8 h-8 rounded-full bg-bordaSutil items-center justify-center"
                  >
                    <Ionicons name="close" size={16} color={colors.textoSecundario} />
                  </TouchableOpacity>
                </View>

                {/* Badge de severidade */}
                <View
                  className="self-start flex-row items-center gap-2 rounded-lg px-3 py-2 mb-5"
                  style={{ backgroundColor: config.background }}
                >
                  <Ionicons name={config.icon} size={16} color={config.color} />
                  <Text className="text-[13px] font-semibold" style={{ color: config.color }}>
                    {config.label}
                  </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Região */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      REGIÃO AFETADA
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="map-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">{alert.talhaoNome}</Text>
                    </View>
                  </View>

                  {/* Horário */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      EMITIDO EM
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="time-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">{alert.createdAt}</Text>
                    </View>
                  </View>

                  {/* Classificação */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      CLASSIFICAÇÃO
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="layers-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">
                        {TYPE_LABELS[alert.tipo] ?? alert.tipo}
                      </Text>
                    </View>
                  </View>

                  {/* Riscos */}
                  <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.bg }}>
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      RISCOS ASSOCIADOS
                    </Text>
                    <Text className="text-[13px] text-textoSecundario leading-5">
                      {alert.descricao}
                    </Text>
                  </View>

                  {/* Fonte */}
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="cloud-outline" size={13} color={colors.textoTerciario} />
                    <Text className="text-[11px] text-textoTerciario">
                      Fonte: Instituto Nacional de Meteorologia (INMET)
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
