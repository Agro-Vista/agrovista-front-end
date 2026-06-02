import { Text, TouchableOpacity, View } from "react-native"
import { colors } from "@/constants/Colors"

export const BASIC_CROPS = ["Soja", "Milho", "Algodão", "Café", "Cana"] as const
export type CropType = (typeof BASIC_CROPS)[number]

type Props = {
  value: string
  onChange: (crop: string) => void
}

export function CropChipSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text
        className="text-[#999999] uppercase mb-2 tracking-widest"
        style={{ fontSize: 11 }}
      >
        Cultura principal
      </Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {BASIC_CROPS.map((c) => {
          const active = c === value
          return (
            <TouchableOpacity
              key={c}
              onPress={() => onChange(c)}
              style={{
                backgroundColor: active ? colors.verdeBackground : colors.card,
                borderWidth: 1,
                borderColor: active ? `${colors.verde}99` : colors.bordaSutil,
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: active ? colors.verde : colors.textoSecundario,
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
