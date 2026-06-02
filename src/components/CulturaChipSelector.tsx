import { Text, TouchableOpacity, View } from "react-native"
import { colors } from "@/constants/Colors"

export const CULTURAS_BASICAS = ["Soja", "Milho", "Algodão", "Café", "Cana"] as const
export type CulturaBasica = (typeof CULTURAS_BASICAS)[number]

type Props = {
  value: string
  onChange: (cultura: string) => void
}

export function CulturaChipSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text
        className="text-[#999999] uppercase mb-2 tracking-widest"
        style={{ fontSize: 11 }}
      >
        Cultura principal
      </Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {CULTURAS_BASICAS.map((c) => {
          const ativa = c === value
          return (
            <TouchableOpacity
              key={c}
              onPress={() => onChange(c)}
              style={{
                backgroundColor: ativa ? colors.verdeBackground : colors.card,
                borderWidth: 1,
                borderColor: ativa ? `${colors.verde}99` : colors.bordaSutil,
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: ativa ? colors.verde : colors.textoSecundario,
                }}
              >
                {c}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
