'use client'
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import {
  EQUIPE as EQUIPE_DEFAULT, type Colaborador,
  DEFAULT_PRODUCAO, type ProducaoMes,
  DEFAULT_CREDITOS, type Creditos,
  USE_MES, MANUT_MES, PARAMS,
} from '@/data/ceppea-po'

// ════════════════════════════════════════════════════════════════════════
//  ÁREAS DE EDIÇÃO E SENHAS POR FUNÇÃO
//  ⚠️ Para alterar os códigos, edite a lista EDITORES abaixo.
//  Cada função só consegue editar as áreas atribuídas a ela.
// ════════════════════════════════════════════════════════════════════════
export type Area = 'processo' | 'salarios' | 'biosseguranca' | 'manutencao'

interface Editor { nome: string; funcao: string; pin: string; areas: Area[] }

const EDITORES: Editor[] = [
  // Matheus — idealizador / aprovador / Líder de Biossegurança → edita TUDO
  { nome: 'Matheus Peixoto', funcao: 'Líder de Biossegurança (aprovador)', pin: 'biosseg2026', areas: ['processo', 'salarios', 'biosseguranca', 'manutencao'] },
  // Técnico do setor → informações de processo (produção, equipamentos, responsabilidades)
  { nome: 'Técnico do Setor', funcao: 'Técnico de linha', pin: 'tecnico2026', areas: ['processo'] },
  // Lúcia — Líder de Produção → salários/encargos + processo
  { nome: 'Lúcia Maria Bisewski', funcao: 'Líder de Produção', pin: 'producao2026', areas: ['salarios', 'processo'] },
  // PCM / Manutenção → informações de manutenção
  { nome: 'Responsável PCM', funcao: 'Planejamento e Controle de Manutenção', pin: 'manut2026', areas: ['manutencao'] },
]

// ── Estado persistente ──────────────────────────────────────────────────
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
  // edição
  editorNome: string | null
  areas: Area[]
  can: (a: Area) => boolean
  unlock: (pin: string) => { ok: boolean; nome?: string; funcao?: string }
  lock: () => void
  // mutações
  setProducao: (p: Partial<ProducaoMes>) => void
  addPessoa: (c: Colaborador) => void
  updatePessoa: (id: string, patch: Partial<Colaborador>) => void
  removePessoa: (id: string) => void
  setUseMes: (v: number) => void
  setManutMes: (v: number) => void
  setCreditos: (c: Partial<Creditos>) => void
  // utilidades
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

  // Carregar do localStorage após montar (evita mismatch de hidratação)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setData({ ...DEFAULTS, ...parsed, producao: { ...DEFAULTS.producao, ...parsed.producao }, creditos: { ...DEFAULTS.creditos, ...parsed.creditos } })
      }
    } catch { /* ignora */ }
  }, [])

  const persist = useCallback((d: CadernoData) => {
    setData(d)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) } catch { /* ignora */ }
  }, [])

  // ── Edição ──
  const can = useCallback((a: Area) => areas.includes(a), [areas])
  const unlock = useCallback((pin: string) => {
    const e = EDITORES.find(x => x.pin === pin.trim())
    if (!e) return { ok: false }
    setAreas(e.areas)
    setEditorNome(e.nome)
    return { ok: true, nome: e.nome, funcao: e.funcao }
  }, [])
  const lock = useCallback(() => { setAreas([]); setEditorNome(null) }, [])

  // ── Mutações ──
  const setProducao = (p: Partial<ProducaoMes>) => persist({ ...data, producao: { ...data.producao, ...p } })
  const addPessoa = (c: Colaborador) => persist({ ...data, equipe: [...data.equipe, c] })
  const updatePessoa = (id: string, patch: Partial<Colaborador>) =>
    persist({ ...data, equipe: data.equipe.map(c => c.id === id ? { ...c, ...patch } : c) })
  const removePessoa = (id: string) => persist({ ...data, equipe: data.equipe.filter(c => c.id !== id) })
  const setUseMes = (v: number) => persist({ ...data, useMes: v })
  const setManutMes = (v: number) => persist({ ...data, manutMes: v })
  const setCreditos = (c: Partial<Creditos>) => persist({ ...data, creditos: { ...data.creditos, ...c } })

  // ── Utilidades ──
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `caderno-po-${data.creditos.mesRef.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const importJSON = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      persist({ ...DEFAULTS, ...parsed, producao: { ...DEFAULTS.producao, ...parsed.producao }, creditos: { ...DEFAULTS.creditos, ...parsed.creditos } })
      return true
    } catch { return false }
  }
  const resetAll = () => { try { localStorage.removeItem(STORAGE_KEY) } catch {}; setData(DEFAULTS) }

  // ── Derivados ──
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
      data, editorNome, areas, can, unlock, lock,
      setProducao, addPessoa, updatePessoa, removePessoa, setUseMes, setManutMes, setCreditos,
      exportJSON, importJSON, resetAll,
      rhBase, bonusTotal, rhComBonus, capacidadeMes, custos,
    }}>
      {children}
    </CadernoContext.Provider>
  )
}

export function useCaderno() {
  const ctx = useContext(CadernoContext)
  if (!ctx) throw new Error('useCaderno deve ser usado dentro de CadernoProvider')
  return ctx
}
