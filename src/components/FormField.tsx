import { ReactNode, useState } from "react"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { colors } from "@/constants/Colors"

type Props = TextInputProps & {
  label: string
  error?: string
  hint?: string
  trailing?: ReactNode
}

export function FormField({
  label,
  error,
  hint,
  trailing,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <View>
      <Text className="text-textoSecundario text-[11px] uppercase mb-2 tracking-widest">
        {label}
      </Text>
      <View
        className="bg-card rounded-xl flex-row items-center px-4"
        style={{
          borderWidth: 1,
          borderColor: error
            ? colors.vermelho
            : focused
            ? colors.verde
            : colors.bordaSutil,
        }}
      >
        <TextInput
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          placeholderTextColor={colors.textoTerciario}
          className="flex-1 text-textoPrimario text-[16px] py-[14px]"
          {...rest}
        />
        {trailing}
      </View>
      {hint && (
        <Text className="text-textoTerciario text-[11px] mt-1">{hint}</Text>
      )}
      {error && (
        <Text className="text-vermelho text-[13px] mt-1">{error}</Text>
      )}
    </View>
  )
}
