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
      <Text className="text-textoSecundario text-[11px] uppercase mb-2 tracking-widest">
        Cultura principal
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {BASIC_CROPS.map((c) => {
          const active = c === value
          return (
            <TouchableOpacity
              key={c}
              onPress={() => onChange(c)}
              className="rounded-full px-4 py-2 border"
              style={{
                backgroundColor: active ? colors.verdeBackground : colors.card,
                borderColor: active ? `${colors.verde}99` : colors.bordaSutil,
              }}
            >
              <Text
                className="text-[13px] font-medium"
                style={{ color: active ? colors.verde : colors.textoSecundario }}
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
