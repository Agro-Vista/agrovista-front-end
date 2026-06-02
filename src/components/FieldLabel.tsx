import { Text } from "react-native"

type Props = { children: string }

export function FieldLabel({ children }: Props) {
  return (
    <Text className="text-textoSecundario text-[11px] font-semibold tracking-wider mb-[6px]">
      {children}
    </Text>
  )
}
