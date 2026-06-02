export type AntecedenciaOpcao = "24h" | "48h" | "72h"

export const EDIT_FORM_INITIAL = {
  nome: "", email: "", telefone: "",
  fazenda: "", municipio: "", estado: "", area: "", cultura: "Soja",
  cooperativa: "",
}

export const PREFS_INITIAL = {
  alertaWhatsApp: true,
  alertaPush: true,
  relatorioEmail: false,
  antecedencia: "72h" as AntecedenciaOpcao,
}

export const SENHA_FORM_INITIAL = {
  aberto: false, atual: "", nova: "", confirma: "",
  salvando: false, erro: null as string | null, sucesso: false,
}
