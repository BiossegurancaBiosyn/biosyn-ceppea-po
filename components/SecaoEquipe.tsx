'use client'
import { useState } from 'react'
import { type Colaborador, type Nivel, PARAMS, IMPACTO } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import Modal from './Modal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const NIVEIS: Nivel[] = ['Coordenador Geral', 'Líder', 'Técnico (Qualidade)', 'SR · referência operacional', 'Jr']
const CORES = ['#173a7a', '#7c3aed', '#2f6fc0', '#16a34a', '#5b9bd5', '#f59e0b', '#2563eb', '#dc2626']
const iniciaisDe = (n: string) => n.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()
const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13.5, marginTop: 4, outline: 'none' }
const empty = (): Colaborador => ({ id: 'x' + Math.random().toString(36).slice(2, 7), nome: '', cargo: '', nivel: 'Jr', turno: 'Diurno', custoTotal: 0, liquido: 0, horaHomem: 0, bonus: 0, area: '', cor: '#5b9bd5', iniciais: '', responsabilidades: [], atuacaoProcesso: '', equipamentos: [] })

export default function SecaoEquipe({ metaSOP }: { metaSOP: boolean }) {
  const { data, can, addPessoa, updatePessoa, removePessoa, rhBase, rhComBonus, verCustos, fmtCusto, sub, setSub, back } = useCaderno()
  const equipe = data.equipe
  const podeEditar = can('salarios') || can('processo')
  const [form, setForm] = useState<Colaborador | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const find = (n: Nivel) => equipe.find(e => e.nivel === n)
  const jrs = equipe.filter(e => e.nivel === 'Jr')
  const rhTotal = metaSOP ? rhComBonus : rhBase

  const abrirNovo = () => { setForm(empty()); setEditId(null) }
  const abrirEdicao = (c: Colaborador) => { setForm({ ...c }); setEditId(c.id) }
  const salvar = () => {
    if (!form) return
    const liq = form.liquido || 0
    const custoTotal = form.naoAlocado ? null : Math.round(liq * PARAMS.RATIO_ENCARGOS)
    const horaHomem = custoTotal ? +(custoTotal / PARAMS.HORAS).toFixed(2) : null
    const fixed = { ...form, iniciais: form.iniciais || iniciaisDe(form.nome), custoTotal, horaHomem }
    if (editId) updatePessoa(editId, fixed); else addPessoa(fixed)
    setForm(null); setEditId(null)
  }

  // ── DETALHE (planilha do colaborador) ──
  if (sub?.tipo === 'pessoa') {
    const c = equipe.find(e => e.id === sub.id)
    if (!c) { back(); return null }
    const imp = IMPACTO[c.id]
    return (
      <div className="space-y-4">
        <button onClick={back} className="no-print" style={{ background: 'none', border: 'none', color: '#2f6fc0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Voltar à equipe</button>
        <div className="card">
          <div className="flex items-center gap-4" style={{ marginBottom: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: c.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff' }}>{c.iniciais}</div>
            <div>
              <div className="font-head" style={{ fontSize: 20, fontWeight: 800, color: '#173a7a' }}>{c.nome}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>{c.cargo} · {c.nivel}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {c.flutuante && <span className="badge badge-yellow">👷 Flutuante</span>}
              {c.naoAlocado && <span className="badge badge-gray">Não alocado</span>}
            </div>
          </div>

          {/* Impacto produtivo (visível a todos) */}
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 18 }}>
            <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="label-xs">Capacidade produtiva</div>
              <div className="font-head" style={{ fontSize: 22, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{imp?.produz || '—'}</div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="label-xs">Papel no processo</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginTop: 4 }}>{imp?.papel || c.area}</div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="label-xs">Turno</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginTop: 4 }}>{c.turno}</div>
            </div>
          </div>

          {/* Planilha de processo */}
          <table className="tbl" style={{ marginBottom: 18 }}>
            <tbody>
              <tr><td style={{ fontWeight: 600, width: 200 }}>Área de atuação</td><td>{c.area}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>O que faz no processo</td><td>{imp?.detalhe || c.atuacaoProcesso}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Equipamentos que opera</td><td>{c.equipamentos.length ? c.equipamentos.join(', ') : '—'}</td></tr>
              <tr><td style={{ fontWeight: 600, verticalAlign: 'top' }}>Responsabilidades</td><td><ul style={{ paddingLeft: 4, lineHeight: 1.9 }}>{c.responsabilidades.map(r => <li key={r}>• {r}</li>)}</ul></td></tr>
            </tbody>
          </table>

          {/* Bloco de custos (somente Gestão) */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>💰 Custos {!verCustos && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>· restrito à Gestão</span>}</div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {[
                ['Custo total/mês', c.custoTotal == null ? 'Não alocado' : fmtCusto(c.custoTotal)],
                ['Líquido (ref.)', c.liquido == null ? '—' : fmtCusto(c.liquido)],
                ['Hora-homem', c.horaHomem && verCustos ? `R$ ${c.horaHomem.toFixed(2).replace('.', ',')}` : (verCustos ? '—' : '🔒')],
                ['Bônus S&OP', c.bonus ? fmtCusto(c.bonus) : '—'],
                ['% do RH', c.custoTotal && verCustos ? `${((c.custoTotal / (rhBase || 1)) * 100).toFixed(1)}%` : (verCustos ? '—' : '🔒')],
              ].map(r => (
                <div key={r[0]} style={{ padding: 12, borderRadius: 10, background: '#f8fafc' }}>
                  <div className="label-xs">{r[0]}</div>
                  <div className="font-head" style={{ fontSize: 15, fontWeight: 800, color: '#173a7a', marginTop: 3 }}>{r[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── GRID ──
  const Org = ({ c }: { c?: Colaborador }) => c ? (
    <button onClick={() => setSub({ tipo: 'pessoa', id: c.id })} className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 hover:shadow-md" style={{ borderColor: c.cor, background: '#fff', minWidth: 150, cursor: 'pointer' }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: c.cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{c.iniciais}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.cor }}>{c.nome.split(' ').slice(0, 2).join(' ')}</div>
      <div style={{ fontSize: 10, color: '#94a3b8' }}>{c.cargo}</div>
    </button>
  ) : null

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">Equipe & Organograma</h2>
          <p className="section-sub">{equipe.length} colaboradores · clique para abrir a ficha completa</p>
        </div>
        {podeEditar && <button onClick={abrirNovo} className="no-print" style={{ padding: '8px 14px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>+ Adicionar colaborador</button>}
      </div>

      <div className="card overflow-x-auto">
        <div className="card-title mb-6">Organograma Hierárquico</div>
        <div className="flex flex-col items-center min-w-max mx-auto">
          <Org c={find('Coordenador Geral')} /><div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <Org c={find('Líder')} /><div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <Org c={find('Técnico (Qualidade)')} /><div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <Org c={find('SR · referência operacional')} /><div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <div className="flex gap-4 flex-wrap justify-center">{jrs.map(j => <Org key={j.id} c={j} />)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="card-title">Colaboradores do Setor</div>
        {verCustos && <div className="flex items-center gap-2"><span className="label-xs">RH/mês:</span><span className="font-head" style={{ fontWeight: 800, color: '#173a7a', fontSize: 15 }}>{brl(rhTotal)}</span>{metaSOP && <span className="badge badge-green">+ bônus</span>}</div>}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {equipe.map(c => {
          const imp = IMPACTO[c.id]
          return (
            <div key={c.id} className="card clickable" style={{ borderTop: `4px solid ${c.cor}` }} onClick={() => setSub({ tipo: 'pessoa', id: c.id })}>
              {podeEditar && (
                <div className="no-print" style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                  <button onClick={e => { e.stopPropagation(); abrirEdicao(c) }} style={{ width: 24, height: 24, borderRadius: 7, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 11 }}>✏️</button>
                  <button onClick={e => { e.stopPropagation(); if (confirm(`Remover ${c.nome}?`)) removePessoa(c.id) }} style={{ width: 24, height: 24, borderRadius: 7, background: '#fee2e2', border: 'none', cursor: 'pointer', fontSize: 11 }}>🗑</button>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{c.iniciais}</div>
                <div><div className="card-title">{c.nome}</div><div style={{ fontSize: 11, color: '#94a3b8' }}>{c.cargo}</div></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3"><span className="badge badge-blue">{c.nivel}</span>{c.flutuante && <span className="badge badge-yellow">Flutuante</span>}</div>
              <div className="row" style={{ borderBottom: 'none', padding: '4px 0' }}><span className="label-xs">Produz</span><span style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>{imp?.produz || '—'}</span></div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{imp?.papel || c.area}</div>
            </div>
          )
        })}
      </div>

      {/* Form add/edit (modal de edição) */}
      {form && (
        <Modal title={editId ? '✏️ Editar colaborador' : '+ Novo colaborador'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Nome completo</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Cargo</label><input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Nível</label><select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value as Nivel })} style={inp}>{NIVEIS.map(n => <option key={n}>{n}</option>)}</select></div>
            <div><label className="label-xs">Turno</label><input value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Área</label><input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Líquido (R$) {!can('salarios') && '🔒'}</label><input type="number" disabled={!can('salarios')} value={form.liquido || 0} onChange={e => setForm({ ...form, liquido: +e.target.value })} style={{ ...inp, opacity: can('salarios') ? 1 : .5 }} /></div>
            <div><label className="label-xs">Bônus (R$) {!can('salarios') && '🔒'}</label><input type="number" disabled={!can('salarios')} value={form.bonus || 0} onChange={e => setForm({ ...form, bonus: +e.target.value })} style={{ ...inp, opacity: can('salarios') ? 1 : .5 }} /></div>
            <div><label className="label-xs">Cor</label><div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>{CORES.map(cor => <button key={cor} onClick={() => setForm({ ...form, cor })} style={{ width: 22, height: 22, borderRadius: '50%', background: cor, border: form.cor === cor ? '2px solid #1e293b' : '2px solid #fff', cursor: 'pointer' }} />)}</div></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}><label style={{ fontSize: 12, display: 'flex', gap: 5, cursor: 'pointer' }}><input type="checkbox" checked={!!form.flutuante} onChange={e => setForm({ ...form, flutuante: e.target.checked })} />Flutuante</label><label style={{ fontSize: 12, display: 'flex', gap: 5, cursor: 'pointer' }}><input type="checkbox" checked={!!form.naoAlocado} onChange={e => setForm({ ...form, naoAlocado: e.target.checked })} />Não alocado</label></div>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Atuação no processo {!can('processo') && '🔒'}</label><textarea disabled={!can('processo')} value={form.atuacaoProcesso} onChange={e => setForm({ ...form, atuacaoProcesso: e.target.value })} rows={2} style={{ ...inp, opacity: can('processo') ? 1 : .5, resize: 'vertical' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Responsabilidades (uma por linha) {!can('processo') && '🔒'}</label><textarea disabled={!can('processo')} value={form.responsabilidades.join('\n')} onChange={e => setForm({ ...form, responsabilidades: e.target.value.split('\n').filter(Boolean) })} rows={3} style={{ ...inp, opacity: can('processo') ? 1 : .5, resize: 'vertical' }} /></div>
          </div>
          <button onClick={salvar} disabled={!form.nome} style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 12, background: form.nome ? '#16a34a' : '#cbd5e1', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: form.nome ? 'pointer' : 'not-allowed' }}>{editId ? 'Salvar' : 'Adicionar'}</button>
        </Modal>
      )}
    </div>
  )
}
