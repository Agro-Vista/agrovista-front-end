export type Talhao = {
  id: number
  propriedadeId: number
  nome: string
  apelido?: string
  municipio?: string
  cultura: string
  areaHectares: number
  tipoSolo?: string
  dataInicioPlantio?: string
  dataFimPlantio?: string
  produtividadeEsperada?: string
  alertas?: Record<string, boolean>
  alertaForaJanela?: boolean
  status: "OK" | "ATENCAO" | "RISCO"
}
