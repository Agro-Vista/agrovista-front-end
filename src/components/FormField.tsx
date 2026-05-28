import { ReactNode, useState } from "react"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { colors } from "@/constants/Colors"

type Props = TextInputProps & {
  label: string
  error?: string
  hint?: string
  trailing?: ReactNode
}

// Campo de formulário padrão com label, estado de foco, hint e mensagem de erro
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
      <Text
        className="text-[#999999] uppercase mb-2 tracking-widest"
        style={{ fontSize: 11 }}
      >
        {label}
      </Text>
      <View
        className="bg-[#191919] rounded-xl flex-row items-center px-4"
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
          className="flex-1 text-[#f5f5f5]"
          style={{ fontSize: 16, paddingVertical: 14 }}
          {...rest}
        />
        {trailing}
      </View>
      {hint && (
        <Text className="text-[#555555] mt-1" style={{ fontSize: 11 }}>
          {hint}
        </Text>
      )}
      {error && (
        <Text className="text-[#ef4444] mt-1" style={{ fontSize: 13 }}>
          {error}
        </Text>
      )}
    </View>
  )
}
