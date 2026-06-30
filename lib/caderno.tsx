'use client'
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  EQUIPE as EQUIPE_DEFAULT, type Colaborador,
  DEFAULT_PRODUCAO, type ProducaoMes,
  DEFAULT_CREDITOS, type Creditos,
  USE_MES, MANUT_MES, PARAMS,
} from '@/data/ceppea-po'

const brl = (v: number | null | undefined) =>
  v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// ════════════════════════════════════════════════════════════════════════
//  EDIÇÃO — senhas por função (edita as áreas atribuídas)
// ════════════════════════════════════════════════════════════════════════
export type Area = 'processo' | 'salarios' | 'biosseguranca' | 'manutencao'
interface Editor { nome: string; funcao: string; pin: string; areas: Area[] }
const EDITORES: Editor[] = [
  { nome: 'Matheus Peixoto', funcao: 'Líder de Biossegurança (aprovador)', pin: 'biosseg2026', areas: ['processo', 'salarios', 'biosseguranca', 'manutencao'] },
  { nome: 'Técnico do Setor', funcao: 'Técnico de linha', pin: 'tecnico2026', areas: ['processo'] },
  { nome: 'Lúcia Maria Bisewski', funcao: 'Líder de Produção', pin: 'producao2026', areas: ['salarios', 'processo'] },
  { nome: 'Responsável PCM', funcao: 'Planejamento e Controle de Manutenção', pin: 'manut2026', areas: ['manutencao'] },
]

// ════════════════════════════════════════════════════════════════════════
//  VISÃO DE GESTÃO — senhas que liberam ver CUSTOS (R$)
//  Sem esse acesso, o caderno abre em "modo Fábrica" (sem valores).
// ════════════════════════════════════════════════════════════════════════
interface Gestor { nome: string; pin: string }
const GESTORES: Gestor[] = [
  { nome: 'Gestão / Diretoria', pin: 'gestao2026' },
  { nome: 'Comitê', pin: 'comite2026' },
]

export type SecId =
  | 'visao-geral' | 'mapa' | 'equipe' | 'cronograma' | 'producao' | 'custos'
  | 'equipamentos' | 'limpeza' | 'biosseguranca' | 'risco' | 'manutencao' | 'fluxograma'

export interface CadernoData {
  producao: ProducaoMes
  equipe: Colaborador[]
  useMes: number
  manutMes: number
  creditos: Creditos
}
const DEFAULTS: CadernoData = {
  producao: { ...DEFAULT_PRODUCAO },
  equipe: EQUIPE_DEFAULT.map(c => ({ ...c })),
  useMes: USE_MES,
  manutMes: MANUT_MES,
  creditos: { ...DEFAULT_CREDITOS },
}
const STORAGE_KEY = 'biosyn-caderno-po-v1'

interface Ctx {
  data: CadernoData
  // navegação interna (sem pop-ups)
  sec: SecId
  sub: { tipo: string; id: string } | null
  goTo: (s: SecId, sub?: { tipo: string; id: string } | null) => void
  setSub: (sub: { tipo: string; id: string } | null) => void
  back: () => void
  // mês de referência
  mesRef: string
  setMesRef: (m: string) => void
  // edição
  editorNome: string | null
  areas: Area[]
  can: (a: Area) => boolean
  unlock: (pin: string) => { ok: boolean; nome?: string; funcao?: string }
  lock: () => void
  // visão de custos
  verCustos: boolean
  gestaoNome: string | null
  unlockGestao: (pin: string) => { ok: boolean; nome?: string }
  lockGestao: () => void
  fmtCusto: (v: number | null | undefined) => string
  // mutações
  setProducao: (p: Partial<ProducaoMes>) => void
  addPessoa: (c: Colaborador) => void
  updatePessoa: (id: string, patch: Partial<Colaborador>) => void
  removePessoa: (id: string) => void
  setUseMes: (v: number) => void
  setManutMes: (v: number) => void
  setCreditos: (c: Partial<Creditos>) => void
  exportJSON: () => void
  importJSON: (file: File) => Promise<boolean>
  resetAll: () => void
  // derivados
  rhBase: number
  bonusTotal: number
  rhComBonus: number
  capacidadeMes: number
  custos: (comBonus: boolean) => { rh: number; total: number; porCx: number; porLote: number }
}

const CadernoContext = createContext<Ctx | null>(null)

export function CadernoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CadernoData>(DEFAULTS)
  const [areas, setAreas] = useState<Area[]>([])
  const [editorNome, setEditorNome] = useState<string | null>(null)
  const [gestaoNome, setGestaoNome] = useState<string | null>(null)
  const [sec, setSec] = useState<SecId>('visao-geral')
  const [sub, setSubState] = useState<{ tipo: string; id: string } | null>(null)
  const [mesRef, setMesRefState] = useState<string>(DEFAULTS.creditos.mesRef)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const p = JSON.parse(raw)
        setData({ ...DEFAULTS, ...p, producao: { ...DEFAULTS.producao, ...p.producao }, creditos: { ...DEFAULTS.creditos, ...p.creditos } })
        if (p.creditos?.mesRef) setMesRefState(p.creditos.mesRef)
      }
    } catch { /* ignora */ }
  }, [])

  const persist = useCallback((d: CadernoData) => {
    setData(d)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch { /* ignora */ }
  }, [])

  // navegação
  const goTo = useCallback((s: SecId, su: { tipo: string; id: string } | null = null) => { setSec(s); setSubState(su); window.scrollTo(0, 0) }, [])
  const setSub = useCallback((su: { tipo: string; id: string } | null) => { setSubState(su); window.scrollTo(0, 0) }, [])
  const back = useCallback(() => setSubState(null), [])
  const setMesRef = useCallback((m: string) => setMesRefState(m), [])

  // edição
  const can = useCallback((a: Area) => areas.includes(a), [areas])
  const unlock = useCallback((pin: string) => {
    const e = EDITORES.find(x => x.pin === pin.trim())
    if (!e) return { ok: false }
    setAreas(e.areas); setEditorNome(e.nome)
    if (e.areas.includes('salarios')) setGestaoNome(g => g || e.nome) // quem vê salário vê custos
    return { ok: true, nome: e.nome, funcao: e.funcao }
  }, [])
  const lock = useCallback(() => { setAreas([]); setEditorNome(null) }, [])

  // gestão (custos)
  const unlockGestao = useCallback((pin: string) => {
    const g = GESTORES.find(x => x.pin === pin.trim())
    if (!g) return { ok: false }
    setGestaoNome(g.nome)
    return { ok: true, nome: g.nome }
  }, [])
  const lockGestao = useCallback(() => setGestaoNome(null), [])

  const verCustos = gestaoNome != null || areas.includes('salarios')
  const fmtCusto = (v: number | null | undefined) => verCustos ? brl(v) : '🔒'

  // mutações
  const setProducao = (p: Partial<ProducaoMes>) => persist({ ...data, producao: { ...data.producao, ...p } })
  const addPessoa = (c: Colaborador) => persist({ ...data, equipe: [...data.equipe, c] })
  const updatePessoa = (id: string, patch: Partial<Colaborador>) => persist({ ...data, equipe: data.equipe.map(c => c.id === id ? { ...c, ...patch } : c) })
  const removePessoa = (id: string) => persist({ ...data, equipe: data.equipe.filter(c => c.id !== id) })
  const setUseMes = (v: number) => persist({ ...data, useMes: v })
  const setManutMes = (v: number) => persist({ ...data, manutMes: v })
  const setCreditos = (c: Partial<Creditos>) => persist({ ...data, creditos: { ...data.creditos, ...c } })

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `caderno-po-${data.creditos.mesRef.replace(/\s+/g, '-').toLowerCase()}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const importJSON = async (file: File) => {
    try { const p = JSON.parse(await file.text()); persist({ ...DEFAULTS, ...p, producao: { ...DEFAULTS.producao, ...p.producao }, creditos: { ...DEFAULTS.creditos, ...p.creditos } }); return true } catch { return false }
  }
  const resetAll = () => { try { localStorage.removeItem(STORAGE_KEY) } catch {}; setData(DEFAULTS) }

  // derivados
  const alocados = data.equipe.filter(c => !c.naoAlocado && c.custoTotal)
  const rhBase = alocados.reduce((s, c) => s + (c.custoTotal || 0), 0)
  const bonusTotal = alocados.reduce((s, c) => s + (c.bonus || 0), 0)
  const rhComBonus = rhBase + bonusTotal
  const capacidadeMes = data.producao.capacidadeDia * data.producao.diasUteis
  const custos = (comBonus: boolean) => {
    const rh = comBonus ? rhComBonus : rhBase
    const total = rh + data.useMes + data.manutMes
    return { rh, total, porCx: total / (capacidadeMes || 1), porLote: total / PARAMS.LOTES_MES }
  }

  return (
    <CadernoContext.Provider value={{
      data, sec, sub, goTo, setSub, back, mesRef, setMesRef,
      editorNome, areas, can, unlock, lock,
      verCustos, gestaoNome, unlockGestao, lockGestao, fmtCusto,
      setProducao, addPessoa, updatePessoa, removePessoa, setUseMes, setManutMes, setCreditos,
      exportJSON, importJSON, resetAll,
      rhBase, bonusTotal, rhComBonus, capacidadeMes, custos,
    }}>{children}</CadernoContext.Provider>
  )
}

export function useCaderno() {
  const ctx = useContext(CadernoContext)
  if (!ctx) throw new Error('useCaderno deve ser usado dentro de CadernoProvider')
  return ctx
}
