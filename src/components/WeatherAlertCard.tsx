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

const NIVEL_CONFIG = {
  ALTO: {
    cor: colors.vermelho,
    bg: colors.vermelhoBackground,
    label: "Perigo",
    icon: "flame-outline" as const,
  },
  MEDIO: {
    cor: colors.ambar,
    bg: colors.ambarBackground,
    label: "Atenção",
    icon: "warning-outline" as const,
  },
  BAIXO: {
    cor: colors.verde,
    bg: colors.verdeBackground,
    label: "Informativo",
    icon: "information-circle-outline" as const,
  },
}

const TIPO_LABEL: Record<string, string> = {
  RISCO_HIDRICO: "Risco Hídrico",
  FRENTE_FRIA: "Frente Fria",
  JANELA_PLANTIO: "Janela de Plantio",
  GEADA: "Geada",
  VENTO_FORTE: "Vento Forte",
}

type Props = {
  aviso: AlertItemData
}

export function WeatherAlertCard({ aviso }: Props) {
  const [modalVisivel, setModalVisivel] = useState(false)
  const cfg = NIVEL_CONFIG[aviso.nivel]

  return (
    <>
      {/* ─── Card ─── */}
      <TouchableOpacity
        onPress={() => setModalVisivel(true)}
        activeOpacity={0.7}
        className="flex-row bg-card rounded-xl mb-3 overflow-hidden border border-bordaSutil"
      >
        <View className="w-1" style={{ backgroundColor: cfg.cor }} />
        <View className="flex-1 p-3 gap-[6px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold text-textoPrimario flex-1 mr-2" numberOfLines={1}>
              {aviso.label ?? aviso.talhaoNome}
            </Text>
            <Text className="text-[11px] text-textoTerciario">{aviso.createdAt}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={11} color={colors.textoTerciario} />
            <Text className="text-[11px] text-textoSecundario flex-1" numberOfLines={1}>
              {aviso.talhaoNome}
            </Text>
            <View className="rounded px-[6px] py-[2px]" style={{ backgroundColor: cfg.bg }}>
              <Text className="text-[10px] font-semibold" style={{ color: cfg.cor }}>
                {cfg.label}
              </Text>
            </View>
          </View>
          <Text className="text-[12px] text-textoSecundario leading-[18px]" numberOfLines={2}>
            {aviso.descricao}
          </Text>
        </View>
      </TouchableOpacity>

      {/* ─── Modal ─── */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        {/* Overlay — toque fora fecha */}
        <TouchableWithoutFeedback onPress={() => setModalVisivel(false)}>
          <View className="flex-1 justify-end" style={{ backgroundColor: "#00000088" }}>
            {/* Conteúdo — toque dentro não propaga */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-card rounded-t-[24px] px-5 pt-5 pb-10">

                {/* Handle */}
                <View className="w-10 h-1 rounded-full bg-bordaVisivel self-center mb-5" />

                {/* Cabeçalho */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.cor }} />
                      <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario">
                        AVISO INMET
                      </Text>
                    </View>
                    <Text className="text-[20px] font-bold text-textoPrimario leading-[26px]">
                      {aviso.label ?? aviso.talhaoNome}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisivel(false)}
                    className="w-8 h-8 rounded-full bg-bordaSutil items-center justify-center"
                  >
                    <Ionicons name="close" size={16} color={colors.textoSecundario} />
                  </TouchableOpacity>
                </View>

                {/* Badge de severidade */}
                <View
                  className="self-start flex-row items-center gap-2 rounded-lg px-3 py-2 mb-5"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Ionicons name={cfg.icon} size={16} color={cfg.cor} />
                  <Text className="text-[13px] font-semibold" style={{ color: cfg.cor }}>
                    {cfg.label}
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
                      <Text className="text-[14px] text-textoPrimario">{aviso.talhaoNome}</Text>
                    </View>
                  </View>

                  {/* Horário */}
                  <View className="mb-4">
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      EMITIDO EM
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="time-outline" size={15} color={colors.textoSecundario} />
                      <Text className="text-[14px] text-textoPrimario">{aviso.createdAt}</Text>
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
                        {TIPO_LABEL[aviso.tipo] ?? aviso.tipo}
                      </Text>
                    </View>
                  </View>

                  {/* Riscos */}
                  <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.bg }}>
                    <Text className="text-[11px] font-semibold tracking-widest text-textoTerciario mb-2">
                      RISCOS ASSOCIADOS
                    </Text>
                    <Text className="text-[13px] text-textoSecundario leading-5">
                      {aviso.descricao}
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
