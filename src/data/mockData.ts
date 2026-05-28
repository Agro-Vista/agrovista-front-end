export const usuario = {
  id: 1,
  nome: "João Batista Ferreira",
  iniciais: "JB",
  email: "joao@fazenda.com.br",
  telefone: "(66) 99912-3456",
  fazenda: "Fazenda Santa Fé",
  municipio: "Sorriso",
  estado: "Mato Grosso",
  areaTotal: 590,
  culturas: ["Soja", "Milho"],
  plano: "Produtor",
  valorPlano: "R$ 299/mês",
}

export const dashboard = {
  satelitesAtivos: 14,
  regioesMonitoradas: 328,
  precisaoIA: 91,
  ultimaAtualizacao: "2h atrás",
  fonteDados: "NASA FIRMS + INPE",
  alertasAtivos: 3,
}

export const talhoes = [
  { id: 1, nome: "Talhão Norte", cultura: "Soja", areaHectares: 210, status: "OK" },
  { id: 2, nome: "Talhão Central", cultura: "Milho", areaHectares: 180, status: "ATENCAO" },
  { id: 3, nome: "Talhão Sul", cultura: "Milho safrinha", areaHectares: 200, status: "RISCO" },
  { id: 4, nome: "Talhão Leste", cultura: "Soja", areaHectares: 90, status: "OK" },
] as const

export const alertas = [
  {
    id: 1,
    talhaoId: 3,
    talhaoNome: "Talhão Sul",
    tipo: "RISCO_HIDRICO",
    nivel: "ALTO",
    ativo: true,
    createdAt: "Hoje, 06h12",
    descricao:
      "Déficit hídrico 43% abaixo da média. Risco alto de estresse no milho safrinha nas próximas 72h. Recomendação: adiar o plantio.",
  },
  {
    id: 2,
    talhaoId: 2,
    talhaoNome: "Talhão Central",
    tipo: "FRENTE_FRIA",
    nivel: "MEDIO",
    ativo: true,
    createdAt: "Hoje, 03h00",
    descricao:
      "Queda brusca de temperatura prevista para os próximos 3 dias. Ajuste o calendário de aplicação de fertilizante.",
  },
  {
    id: 3,
    talhaoId: 1,
    talhaoNome: "Talhão Norte",
    tipo: "JANELA_PLANTIO",
    nivel: "BAIXO",
    ativo: true,
    createdAt: "Hoje, 06h00",
    descricao:
      "Condições ideais para plantio de quinta a sábado. Umidade e temperatura dentro do esperado.",
  },
] as const

export const historico = [
  {
    id: 1,
    talhaoNome: "Talhão Central",
    tipo: "FRENTE_FRIA",
    data: "18/04/2026",
    resultado: "CORRETO",
    descricao: "Alertou 4 dias antes. Plantio adiado com sucesso.",
  },
  {
    id: 2,
    talhaoNome: "Talhão Norte",
    tipo: "JANELA_PLANTIO",
    data: "02/03/2026",
    resultado: "CORRETO",
    descricao: "72h ideais confirmadas. Germinação dentro do esperado.",
  },
  {
    id: 3,
    talhaoNome: "Talhão Sul",
    tipo: "RISCO_HIDRICO",
    data: "30/06/2025",
    resultado: "PARCIAL",
    descricao: "Chuva chegou 2 dias após o previsto. Impacto mínimo.",
  },
  {
    id: 4,
    talhaoNome: "Talhão Leste",
    tipo: "FRENTE_FRIA",
    data: "12/05/2025",
    resultado: "CORRETO",
    descricao: "Alerta correto. Produtor adiou colheita.",
  },
] as const

export const laudos = [
  {
    id: 1,
    evento: "Seca crítica",
    talhao: "Talhão Sul",
    data: "25/05/2026",
    tamanho: "2.3 MB",
    status: "GERADO",
  },
  {
    id: 2,
    evento: "Frente fria",
    talhao: "Talhão Central",
    data: "18/04/2026",
    tamanho: "1.8 MB",
    status: "ENVIADO_PROAGRO",
  },
  {
    id: 3,
    evento: "Déficit hídrico",
    talhao: "Talhão Norte",
    data: "02/03/2026",
    tamanho: "2.1 MB",
    status: "ENVIADO_PROAGRO",
  },
] as const

export const conversa = [
  {
    id: 1,
    tipo: "recv",
    texto:
      "Bom dia, João. Alerta para o Talhão Sul: umidade 38% abaixo do normal. Risco alto de estresse hídrico nas próximas 72h. Recomendação: adiar o plantio.",
    hora: "06h12",
  },
  {
    id: 2,
    tipo: "send",
    texto: "Ok, vou adiar. Consigo documentar isso pro seguro?",
    hora: "06h14",
  },
  {
    id: 3,
    tipo: "recv",
    texto:
      "Sim! O evento foi registrado automaticamente com fonte satelital, timestamp e coordenadas GPS do talhão. Gero o laudo agora.",
    hora: "06h14",
  },
  {
    id: 4,
    tipo: "arquivo",
    nome: "Laudo_TalhaoSul_2026-05-25.pdf",
    subtexto: "Documentação climática · Sentinel-2 · válido para Proagro",
    hora: "06h15",
  },
  {
    id: 5,
    tipo: "send",
    texto: "Perfeito, obrigado",
    hora: "06h15",
  },
  {
    id: 6,
    tipo: "recv",
    texto:
      "Qualquer atualização nas próximas 72h você recebe automaticamente. Boa safra, João.",
    hora: "06h15",
  },
] as const

export const planos = [
  {
    id: "free",
    nome: "Free",
    preco: 0,
    destaque: false,
    subtexto: "Para conhecer o produto",
    features: [
      { texto: "1 talhão monitorado", incluido: true },
      { texto: "Alertas semanais", incluido: true },
      { texto: "Alertas em tempo real", incluido: false },
      { texto: "Geração de laudos", incluido: false },
      { texto: "Integração WhatsApp", incluido: false },
    ],
  },
  {
    id: "produtor",
    nome: "Produtor",
    preco: 299,
    destaque: true,
    subtexto: "Para produtores independentes",
    features: [
      { texto: "Até 10 talhões monitorados", incluido: true },
      { texto: "Alertas em tempo real (72h)", incluido: true },
      { texto: "Geração de laudos para seguro", incluido: true },
      { texto: "Integração WhatsApp", incluido: true },
      { texto: "Score de risco por talhão", incluido: true },
      { texto: "Painel da cooperativa", incluido: false },
    ],
  },
  {
    id: "cooperativa",
    nome: "Cooperativa",
    preco: 8000,
    destaque: false,
    subtexto: "Para cooperativas e associações",
    features: [
      { texto: "Produtores ilimitados", incluido: true },
      { texto: "Painel administrativo", incluido: true },
      { texto: "Alertas regionais agregados", incluido: true },
      { texto: "Laudos em massa", incluido: true },
      { texto: "Suporte dedicado", incluido: true },
    ],
  },
] as const
