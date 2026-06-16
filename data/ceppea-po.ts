// ─── Parâmetros ────────────────────────────────────────────────────────────
export const PARAMS = {
  HORAS: 209,
  DIAS_UTEIS: 16,
  CX_MES: 4480,
  LOTES_MES: 112,
  META_SOP: 3000,
  BONUS_TOTAL: 4700,
  RATIO_ENCARGOS: 1.8108,
}

// ─── Equipe ────────────────────────────────────────────────────────────────
export type Nivel = 'Coordenador Geral' | 'Líder' | 'Técnico (Qualidade)' | 'SR · referência operacional' | 'Jr'

export interface Colaborador {
  id: string
  nome: string
  cargo: string
  nivel: Nivel
  turno: string
  custoTotal: number | null
  liquido: number | null
  horaHomem: number | null
  bonus: number | null
  area: string
  cor: string
  iniciais: string
  flutuante?: boolean
  naoAlocado?: boolean
  responsabilidades: string[]
  atuacaoProcesso: string
  equipamentos: string[]
}

export const EQUIPE: Colaborador[] = [
  {
    id: 'RS',
    nome: 'Rafael da Silva',
    cargo: 'Coordenador Industrial',
    nivel: 'Coordenador Geral',
    turno: 'Adm',
    custoTotal: null,
    liquido: null,
    horaHomem: null,
    bonus: null,
    area: 'Todos os setores da indústria',
    cor: '#173a7a',
    iniciais: 'RS',
    naoAlocado: true,
    responsabilidades: [
      'Coordenação geral de TODA a indústria',
      'Gestão dos setores: Pó, Pasta, Sachê, Premix, Microcaps',
      'Supervisão de Biossegurança e Manutenção',
    ],
    atuacaoProcesso: 'Não atua diretamente no processo produtivo.',
    equipamentos: [],
  },
  {
    id: 'LB',
    nome: 'Lúcia Maria Bisewski',
    cargo: 'Líder de Produção',
    nivel: 'Líder',
    turno: 'Adm',
    custoTotal: null,
    liquido: null,
    horaHomem: null,
    bonus: null,
    area: 'Pó, Pasta, Sachê, Premix',
    cor: '#7c3aed',
    iniciais: 'LB',
    naoAlocado: true,
    responsabilidades: [
      'Liderança de Pó, Pasta, Sachê e Premix',
      'Ponte Produção ↔ RH',
      'Ponte Produção ↔ demais áreas',
    ],
    atuacaoProcesso: 'Não entra diretamente no processo produtivo.',
    equipamentos: [],
  },
  {
    id: 'GP',
    nome: 'Gilson Pruença da Silva',
    cargo: 'Técnico de Produção Jr.',
    nivel: 'Técnico (Qualidade)',
    turno: 'Diurno',
    custoTotal: 6338,
    liquido: 3500,
    horaHomem: 30.33,
    bonus: 1200,
    area: 'Qualidade / Flutuante',
    cor: '#2f6fc0',
    iniciais: 'GP',
    flutuante: true,
    responsabilidades: [
      'Conferência de etiquetas, sacos, lote, validade e peso',
      'Controle de temperatura e umidade',
      'Aferição de balanças',
      'Elaboração de relatórios e cronograma',
      'Solicitação de OPs ao PCP',
    ],
    atuacaoProcesso:
      'Braço da QUALIDADE — função FLUTUANTE. Circula garantindo conformidade; entra na operação só quando necessário.',
    equipamentos: ['Balança 50 kg', 'Balança 100 kg', 'Termo-higrômetro'],
  },
  {
    id: 'WP',
    nome: 'Warlysson dos S. Pereira',
    cargo: 'Operador de Produção Sr.',
    nivel: 'SR · referência operacional',
    turno: 'Diurno',
    custoTotal: 5600,
    liquido: 3100,
    horaHomem: 26.79,
    bonus: 1100,
    area: 'Misturadores principais',
    cor: '#16a34a',
    iniciais: 'WP',
    responsabilidades: [
      'Referência operacional acima dos demais',
      'Operação dos misturadores principais',
      'Apoio na resolução de desvios operacionais',
    ],
    atuacaoProcesso: 'Responsável pelos Misturadores 1 e 2 (principal referência da linha).',
    equipamentos: ['Misturador 1 (500 kg)', 'Misturador 2 (500 kg)'],
  },
  {
    id: 'JC',
    nome: 'João Gabriel dos S. Camargo',
    cargo: 'Operador de Produção Jr.',
    nivel: 'Jr',
    turno: 'Diurno',
    custoTotal: 4000,
    liquido: 2200,
    horaHomem: 19.14,
    bonus: 800,
    area: 'Embalagem / Selagem',
    cor: '#5b9bd5',
    iniciais: 'JC',
    responsabilidades: ['Embalagem', 'Rotulagem', 'Selagem', 'Operação do elevador'],
    atuacaoProcesso: 'Embalagem, rotulagem, selagem e elevador de abastecimento.',
    equipamentos: ['Seladora', 'Elevador de abastecimento'],
  },
  {
    id: 'LM',
    nome: 'Lucas Eduardo Meyer',
    cargo: 'Operador de Produção Jr.',
    nivel: 'Jr',
    turno: 'Diurno',
    custoTotal: 4000,
    liquido: 2200,
    horaHomem: 19.14,
    bonus: 800,
    area: 'Misturador 3 / Envasadora',
    cor: '#5b9bd5',
    iniciais: 'LM',
    responsabilidades: ['Misturador 3', 'Envasadora de pós'],
    atuacaoProcesso: 'Operação do Misturador 3 e da envasadora de pós.',
    equipamentos: ['Misturador 3', 'Envasadora de Pós'],
  },
  {
    id: 'JR',
    nome: 'Juan Carlos Reinert',
    cargo: 'Operador de Produção Jr.',
    nivel: 'Jr',
    turno: 'Diurno',
    custoTotal: 4000,
    liquido: 2200,
    horaHomem: 19.14,
    bonus: 800,
    area: 'Personalize / Big Bag',
    cor: '#5b9bd5',
    iniciais: 'JR',
    responsabilidades: ['Envase e pesagem linha Personalize', 'Big Bag', 'Misturador Y'],
    atuacaoProcesso: 'Envase/pesagem Personalize, Big Bag e Misturador Y.',
    equipamentos: ['Misturador Y'],
  },
]

// ─── Custos consolidados ──────────────────────────────────────────────────
export const RH_BASE = 23938
export const RH_COM_BONUS = 28638
export const USE_MES = 930.49
export const MANUT_MES = 359.81

export function calcCustos(comBonus: boolean) {
  const rh = comBonus ? RH_COM_BONUS : RH_BASE
  const total = rh + USE_MES + MANUT_MES
  const porCx = total / PARAMS.CX_MES
  const porLote = total / PARAMS.LOTES_MES
  return { rh, total, porCx, porLote }
}

// ─── Equipamentos ─────────────────────────────────────────────────────────
export interface Equipamento {
  id: string
  nome: string
  tipo: string
  capacidade: string
  lotesDia: string
  status: 'ok' | 'atencao'
  area: string
  responsavel: string
  preventiva: string
}

export const EQUIPAMENTOS: Equipamento[] = [
  { id:'EQ-001', nome:'Misturador 1', tipo:'Horizontal', capacidade:'500 kg', lotesDia:'4 lotes/dia', status:'atencao', area:'Mistura', responsavel:'Warlysson', preventiva:'Mensal' },
  { id:'EQ-002', nome:'Misturador 2', tipo:'Horizontal', capacidade:'500 kg', lotesDia:'4 lotes/dia', status:'atencao', area:'Mistura', responsavel:'Warlysson', preventiva:'Mensal' },
  { id:'EQ-003', nome:'Misturador 3', tipo:'Horizontal', capacidade:'n/inf', lotesDia:'3 lotes/dia', status:'atencao', area:'Mistura', responsavel:'Lucas', preventiva:'Mensal' },
  { id:'EQ-004', nome:'Misturador Y', tipo:'Big Bag (Personalize)', capacidade:'—', lotesDia:'—', status:'ok', area:'Mistura', responsavel:'Juan', preventiva:'Mensal' },
  { id:'EQ-005', nome:'Envasadora de Pós', tipo:'Acima de 2 kg', capacidade:'—', lotesDia:'—', status:'ok', area:'Envase', responsavel:'Lucas', preventiva:'a informar' },
  { id:'EQ-006', nome:'Balança Digital 50 kg', tipo:'Digital', capacidade:'50 kg', lotesDia:'—', status:'ok', area:'Pesagem', responsavel:'Gilson', preventiva:'Calibração terceirizada' },
  { id:'EQ-007', nome:'Balança Digital 100 kg', tipo:'Digital', capacidade:'100 kg', lotesDia:'—', status:'ok', area:'Pesagem', responsavel:'Gilson', preventiva:'Calibração terceirizada' },
  { id:'EQ-008', nome:'Seladora', tipo:'Manual', capacidade:'—', lotesDia:'—', status:'ok', area:'Embalagem', responsavel:'João', preventiva:'a informar' },
  { id:'EQ-009', nome:'Emulsificador 200 L', tipo:'Emulsificador', capacidade:'200 L', lotesDia:'—', status:'ok', area:'Mistura', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-010', nome:'Micronizador', tipo:'Micronizador', capacidade:'—', lotesDia:'—', status:'ok', area:'Mistura', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-011', nome:'Peneira (Misturador)', tipo:'Peneira', capacidade:'—', lotesDia:'—', status:'ok', area:'Mistura', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-012', nome:'Imã (Misturador)', tipo:'Separador Magnético', capacidade:'—', lotesDia:'—', status:'ok', area:'Mistura', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-013', nome:'Elevador de Abastecimento', tipo:'Elevador', capacidade:'—', lotesDia:'—', status:'ok', area:'Abastecimento', responsavel:'João', preventiva:'a informar' },
  { id:'EQ-014', nome:'Empilhadeira Elétrica', tipo:'Movimentação', capacidade:'—', lotesDia:'—', status:'ok', area:'Logística', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-015', nome:'Transpaleteira', tipo:'Movimentação', capacidade:'—', lotesDia:'—', status:'ok', area:'Logística', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-016', nome:'Lavadora de Piso', tipo:'Limpeza', capacidade:'—', lotesDia:'—', status:'ok', area:'Limpeza', responsavel:'—', preventiva:'a informar' },
  { id:'EQ-017', nome:'Termo-higrômetro', tipo:'Monitoramento', capacidade:'—', lotesDia:'—', status:'ok', area:'Qualidade', responsavel:'Gilson', preventiva:'a informar' },
]

// ─── Produtos ─────────────────────────────────────────────────────────────
export const PRODUTOS = [
  { codigo:'624', nome:'MAN ACID PLUS', peso:'25 kg', vendidoCx: 2774, estimadoAnual: 154552 },
  { codigo:'605', nome:'AMA', peso:'20 kg', vendidoCx: 2638, estimadoAnual: 117580 },
  { codigo:'600', nome:'ADDLIFE ACQUA CV 002', peso:'20 kg', vendidoCx: 2257, estimadoAnual: 100598 },
]

// ─── Cronograma ───────────────────────────────────────────────────────────
export const CRONOGRAMA = [
  { hora:'08:00–08:30', titulo:'Organização Pré-Operacional', pessoas:['Toda a equipe'], equipamentos:[], detalhe:'Separação de materiais, EPI, briefing de produção.' },
  { hora:'08:00–08:30', titulo:'Liberação USE', pessoas:['USE'], equipamentos:['Swab ATP','Termo-higrômetro'], detalhe:'Swab ATP, liberação visual; NB-2 ativa.' },
  { hora:'08:00–08:30', titulo:'Liberação Manutenção', pessoas:['Manutenção'], equipamentos:[], detalhe:'Preventivas concluídas, áreas elétricas isoladas liberadas.' },
  { hora:'08:30–17:00', titulo:'Envase Misturador 1 — 4 lotes', pessoas:['Warlysson'], equipamentos:['Misturador 1 (500 kg)'], detalhe:'4 lotes de envase no Misturador 1.' },
  { hora:'08:30–17:00', titulo:'Envase Misturador 2 — 4 lotes', pessoas:['Warlysson'], equipamentos:['Misturador 2 (500 kg)'], detalhe:'4 lotes de envase no Misturador 2.' },
  { hora:'08:30–17:00', titulo:'Envase Misturador 3 — 3 lotes', pessoas:['Lucas'], equipamentos:['Misturador 3','Envasadora de Pós'], detalhe:'3 lotes de envase no Misturador 3.' },
  { hora:'08:30–17:00', titulo:'Envase Misturador Y (Personalize / Big Bag)', pessoas:['Juan'], equipamentos:['Misturador Y'], detalhe:'Linha Personalize / Big Bag.' },
  { hora:'08:30–17:00', titulo:'Embalagem — 3 a 5 lotes', pessoas:['João'], equipamentos:['Seladora','Elevador'], detalhe:'Rotulagem, selagem e paletização.' },
  { hora:'17:00–18:00', titulo:'Liberação para Estoque', pessoas:['Gilson (USE/CQ)'], equipamentos:[], detalhe:'Conferência final, aprovação PA, liberação ao almoxarifado.' },
  { hora:'17:30–17:50', titulo:'Limpeza e Organização', pessoas:['Toda a equipe'], equipamentos:['Lavadora de piso'], detalhe:'Limpeza final do setor conforme PLIM.01.00.' },
]

// ─── USE / Biossegurança ──────────────────────────────────────────────────
export const USE_MATERIAIS = [
  { item:'Álcool 70% 1L', qtd:'18 un', unitario:9.63, total:173.34 },
  { item:'Swab ATP', qtd:'15 un', unitario:14.99, total:224.85 },
  { item:'Perflex Azul', qtd:'1,5 un', unitario:96.50, total:144.75 },
  { item:'Saco lixo 150L', qtd:'100 un', unitario:0.57, total:57.00 },
  { item:'Saco lixo 60L', qtd:'100 un', unitario:0.32, total:32.00 },
  { item:'Vassoura', qtd:'1 un', unitario:30.98, total:30.98 },
  { item:'Rodo', qtd:'1 un', unitario:25.00, total:25.00 },
  { item:'Peróxido', qtd:'0,6 L', unitario:28.80, total:17.28 },
  { item:'Esponja', qtd:'9 un', unitario:1.00, total:9.00 },
  { item:'Hipoclorito', qtd:'0,6 L', unitario:9.60, total:5.76 },
]

// ─── Plano de Limpeza ─────────────────────────────────────────────────────
export type Periodicidade = 'Diário' | '3x/semana' | 'Semanal' | 'Mensal' | 'Eventual' | 'Anual'

export interface ItemLimpeza {
  item: string
  periodicidade: Periodicidade
  responsavel: string
  obs?: string
}

export const PLANO_LIMPEZA: ItemLimpeza[] = [
  { item:'Mesa Inox', periodicidade:'Diário', responsavel:'Operador' },
  { item:'Mesa MDF', periodicidade:'Diário', responsavel:'Operador' },
  { item:'Pia', periodicidade:'Diário', responsavel:'Operador' },
  { item:'Balança 50 kg', periodicidade:'3x/semana', responsavel:'Operador + USE' },
  { item:'Balança 100 kg', periodicidade:'3x/semana', responsavel:'Operador + USE' },
  { item:'Seladora', periodicidade:'3x/semana', responsavel:'Operador + USE' },
  { item:'Cadeira', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Empilhadeiras', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Transpaleteiras', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Baldes', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Painéis', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Elevador', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Termo-higrômetro', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Portas', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Piso', periodicidade:'Semanal', responsavel:'Operador' },
  { item:'Paredes Isopainel', periodicidade:'Mensal', responsavel:'Operador + USE' },
  { item:'Luz de Emergência', periodicidade:'Mensal', responsavel:'Operador + USE' },
  { item:'Escada', periodicidade:'Eventual', responsavel:'Operador', obs:'Em análise — consultar Michelly' },
  { item:'Misturadores/Micronizador', periodicidade:'Eventual', responsavel:'Operador', obs:'Em análise — consultar Michelly' },
  { item:'Paredes estruturais', periodicidade:'Anual', responsavel:'Terceirizado' },
]

// ─── Defaults editáveis (caderno) ──────────────────────────────────────────
export interface ProducaoMes {
  capacidadeDia: number
  diasUteis: number
  metaSOP: number
  mesAnteriorDesejado: number
  mesAnteriorRealizado: number
  obs: string
}

export const DEFAULT_PRODUCAO: ProducaoMes = {
  capacidadeDia: 280,
  diasUteis: 16,
  metaSOP: 3000,
  mesAnteriorDesejado: 3000,
  mesAnteriorRealizado: 2600,
  obs: 'Recorde histórico de 2.600 cx em nov/2025.',
}

export interface Creditos {
  elaboradoPor: string
  aprovadoPor: string
  mesRef: string
}

export const DEFAULT_CREDITOS: Creditos = {
  elaboradoPor: 'Gilson Pruença — Técnico do Setor Pó',
  aprovadoPor: 'Matheus Peixoto — Líder de Biossegurança',
  mesRef: 'Maio 2026',
}
