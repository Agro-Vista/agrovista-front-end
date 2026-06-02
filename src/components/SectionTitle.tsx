import { Text } from "react-native"

type Props = { children: string }

export function SectionTitle({ children }: Props) {
  return (
    <Text className="text-textoTerciario text-[11px] font-bold tracking-widest mt-6 mb-3">
      {children}
    </Text>
  )
}
