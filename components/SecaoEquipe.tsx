'use client'
import { useState } from 'react'
import { type Colaborador, type Nivel, PARAMS } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import Modal from './Modal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const NIVEIS: Nivel[] = ['Coordenador Geral', 'Líder', 'Técnico (Qualidade)', 'SR · referência operacional', 'Jr']
const CORES = ['#173a7a', '#7c3aed', '#2f6fc0', '#16a34a', '#5b9bd5', '#f59e0b', '#2563eb', '#dc2626']
const iniciaisDe = (nome: string) => nome.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()
const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13.5, marginTop: 4, outline: 'none' }

function emptyForm(): Colaborador {
  return { id: 'x' + Math.random().toString(36).slice(2, 7), nome: '', cargo: '', nivel: 'Jr', turno: 'Diurno', custoTotal: 0, liquido: 0, horaHomem: 0, bonus: 0, area: '', cor: '#5b9bd5', iniciais: '', responsabilidades: [], atuacaoProcesso: '', equipamentos: [] }
}

export default function SecaoEquipe({ metaSOP }: { metaSOP: boolean }) {
  const { data, can, addPessoa, updatePessoa, removePessoa, rhBase, rhComBonus } = useCaderno()
  const equipe = data.equipe
  const podeEditar = can('salarios') || can('processo')

  const [selected, setSelected] = useState<Colaborador | null>(null)
  const [form, setForm] = useState<Colaborador | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const find = (n: Nivel) => equipe.find(e => e.nivel === n)
  const coord = find('Coordenador Geral'), lider = find('Líder')
  const tecnico = find('Técnico (Qualidade)'), sr = find('SR · referência operacional')
  const jrs = equipe.filter(e => e.nivel === 'Jr')
  const rhTotal = metaSOP ? rhComBonus : rhBase

  const abrirNovo = () => { setForm(emptyForm()); setEditId(null) }
  const abrirEdicao = (c: Colaborador) => { setForm({ ...c }); setEditId(c.id) }
  const salvar = () => {
    if (!form) return
    const liquido = form.liquido || 0
    const custoTotal = form.naoAlocado ? null : Math.round(liquido * PARAMS.RATIO_ENCARGOS)
    const horaHomem = custoTotal ? +(custoTotal / PARAMS.HORAS).toFixed(2) : null
    const fixed: Colaborador = { ...form, iniciais: form.iniciais || iniciaisDe(form.nome), custoTotal, horaHomem }
    if (editId) updatePessoa(editId, fixed); else addPessoa(fixed)
    setForm(null); setEditId(null)
  }

  const OrgNode = ({ c }: { c?: Colaborador }) => c ? (
    <button onClick={() => setSelected(c)} className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all hover:shadow-md"
      style={{ borderColor: c.cor, background: '#fff', minWidth: 150, cursor: 'pointer' }}>
      <div className="rounded-full flex items-center justify-center font-bold text-white" style={{ width: 38, height: 38, background: c.cor, fontSize: 13 }}>{c.iniciais}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.cor }}>{c.nome.split(' ').slice(0, 2).join(' ')}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>{c.cargo}</div>
      {c.flutuante && <span className="badge badge-yellow" style={{ fontSize: 9 }}>Flutuante</span>}
    </button>
  ) : null

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">Equipe & Organograma</h2>
          <p className="section-sub">{equipe.length} colaboradores · clique para ver o perfil</p>
        </div>
        {podeEditar && (
          <button onClick={abrirNovo} className="no-print" style={{ padding: '8px 14px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            + Adicionar colaborador
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <div className="card-title mb-6">Organograma Hierárquico</div>
        <div className="flex flex-col items-center min-w-max mx-auto">
          <OrgNode c={coord} />
          <div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <OrgNode c={lider} />
          <div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <OrgNode c={tecnico} />
          <div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <OrgNode c={sr} />
          <div className="flow-line-v" style={{ width: 3, height: 26 }} />
          <div className="flex gap-4 flex-wrap justify-center">{jrs.map(jr => <OrgNode key={jr.id} c={jr} />)}</div>
        </div>
        <div className="mt-6 p-3 rounded-xl text-xs" style={{ background: '#f8fafc', color: '#64748b', lineHeight: 1.6 }}>
          <strong>Nota:</strong> Coordenador é geral da indústria; Líder atua em processos específicos; Técnico é o braço da Qualidade; Operador Sr é a referência operacional.
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="card-title">Colaboradores do Setor</div>
        <div className="flex items-center gap-2">
          <span className="label-xs">RH/mês:</span>
          <span className="font-head" style={{ fontWeight: 800, color: '#173a7a', fontSize: 15 }}>{brl(rhTotal)}</span>
          {metaSOP && <span className="badge badge-green">+ bônus</span>}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {equipe.map(c => (
          <div key={c.id} className="card clickable" style={{ borderTop: `4px solid ${c.cor}` }} onClick={() => setSelected(c)}>
            {podeEditar && (
              <div className="no-print" style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                <button onClick={e => { e.stopPropagation(); abrirEdicao(c) }} style={{ width: 24, height: 24, borderRadius: 7, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: 11 }}>✏️</button>
                <button onClick={e => { e.stopPropagation(); if (confirm(`Remover ${c.nome}?`)) removePessoa(c.id) }} style={{ width: 24, height: 24, borderRadius: 7, background: '#fee2e2', border: 'none', cursor: 'pointer', fontSize: 11 }}>🗑</button>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center rounded-full font-bold text-white" style={{ width: 44, height: 44, background: c.cor, fontSize: 14 }}>{c.iniciais}</div>
              <div>
                <div className="card-title">{c.nome}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.cargo}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge badge-blue">{c.nivel}</span>
              {c.flutuante && <span className="badge badge-yellow">Flutuante</span>}
              {c.naoAlocado && <span className="badge badge-gray">Não alocado</span>}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{c.area}</div>
            {c.custoTotal ? (
              <div className="mt-2 flex justify-between">
                <span className="label-xs">Custo total</span>
                <span className="font-head" style={{ fontSize: 13, fontWeight: 700, color: '#173a7a' }}>{brl(c.custoTotal)}</span>
              </div>
            ) : (
              <div className="mt-2"><span className="a-informar">Custo não alocado ao setor</span></div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{ width: 54, height: 54, background: selected.cor, fontSize: 17 }}>{selected.iniciais}</div>
            <div>
              <div className="font-head" style={{ fontSize: 18, fontWeight: 800, color: '#173a7a' }}>{selected.nome}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{selected.cargo} · {selected.nivel}</div>
            </div>
          </div>
          {selected.flutuante && (
            <div style={{ display: 'flex', gap: 10, padding: '13px 15px', borderRadius: 13, background: '#eff6ff', marginBottom: 16, borderLeft: '3px solid #2f6fc0' }}>
              <span style={{ fontSize: 18 }}>🛟</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e40af' }}>Função flutuante</div>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginTop: 2 }}>Não entra diretamente na linha — circula garantindo qualidade.</p>
              </div>
            </div>
          )}
          <div>
            {[
              { l: 'Turno', v: selected.turno },
              { l: 'Área de atuação', v: selected.area },
              { l: 'Custo total/mês', v: selected.custoTotal ? brl(selected.custoTotal) : 'Não alocado', hl: true },
              { l: 'Custo hora-homem', v: selected.horaHomem ? `R$ ${selected.horaHomem.toFixed(2).replace('.', ',')}` : '—' },
              { l: 'Líquido (ref.)', v: selected.liquido ? brl(selected.liquido) : '—' },
              { l: '% do RH do setor', v: selected.custoTotal ? `${((selected.custoTotal / (rhBase || 1)) * 100).toFixed(1)}%` : '—' },
              { l: 'Bônus meta S&OP', v: selected.bonus ? brl(selected.bonus) : '—' },
            ].map((r, i, arr) => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{r.l}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: r.hl ? '#173a7a' : '#1e293b' }}>{r.v}</span>
              </div>
            ))}
          </div>
          {selected.responsabilidades.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div className="label-xs" style={{ marginBottom: 6 }}>Responsabilidades</div>
              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.7 }}>{selected.atuacaoProcesso}</p>
              <ul style={{ fontSize: 12, color: '#64748b', lineHeight: 1.85, marginTop: 6 }}>
                {selected.responsabilidades.map(r => <li key={r}>• {r}</li>)}
              </ul>
            </div>
          )}
        </Modal>
      )}

      {form && (
        <Modal title={editId ? '✏️ Editar colaborador' : '+ Novo colaborador'} onClose={() => setForm(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Nome completo</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Cargo</label><input value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Nível</label><select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value as Nivel })} style={inp}>{NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
            <div><label className="label-xs">Turno</label><input value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Área</label><input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={inp} /></div>
            <div><label className="label-xs">Salário líquido (R$) {!can('salarios') && '🔒'}</label><input type="number" disabled={!can('salarios')} value={form.liquido || 0} onChange={e => setForm({ ...form, liquido: +e.target.value })} style={{ ...inp, opacity: can('salarios') ? 1 : .5 }} /></div>
            <div><label className="label-xs">Bônus S&OP (R$) {!can('salarios') && '🔒'}</label><input type="number" disabled={!can('salarios')} value={form.bonus || 0} onChange={e => setForm({ ...form, bonus: +e.target.value })} style={{ ...inp, opacity: can('salarios') ? 1 : .5 }} /></div>
            <div><label className="label-xs">Cor</label>
              <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                {CORES.map(cor => <button key={cor} onClick={() => setForm({ ...form, cor })} style={{ width: 22, height: 22, borderRadius: '50%', background: cor, border: form.cor === cor ? '2px solid #1e293b' : '2px solid #fff', cursor: 'pointer' }} />)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><input type="checkbox" checked={!!form.flutuante} onChange={e => setForm({ ...form, flutuante: e.target.checked })} /> Flutuante</label>
              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}><input type="checkbox" checked={!!form.naoAlocado} onChange={e => setForm({ ...form, naoAlocado: e.target.checked })} /> Não alocado</label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Atuação no processo {!can('processo') && '🔒'}</label><textarea disabled={!can('processo')} value={form.atuacaoProcesso} onChange={e => setForm({ ...form, atuacaoProcesso: e.target.value })} rows={2} style={{ ...inp, opacity: can('processo') ? 1 : .5, resize: 'vertical' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label className="label-xs">Responsabilidades (uma por linha) {!can('processo') && '🔒'}</label><textarea disabled={!can('processo')} value={form.responsabilidades.join('\n')} onChange={e => setForm({ ...form, responsabilidades: e.target.value.split('\n').filter(Boolean) })} rows={3} style={{ ...inp, opacity: can('processo') ? 1 : .5, resize: 'vertical' }} /></div>
          </div>
          {!form.naoAlocado && (
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, color: '#15803d', marginTop: 12 }}>
              Custo total estimado: <strong>{brl(Math.round((form.liquido || 0) * PARAMS.RATIO_ENCARGOS))}</strong> (líquido × 1,8108)
            </div>
          )}
          <button onClick={salvar} disabled={!form.nome} style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 12, background: form.nome ? '#16a34a' : '#cbd5e1', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: form.nome ? 'pointer' : 'not-allowed' }}>
            {editId ? 'Salvar alterações' : 'Adicionar colaborador'}
          </button>
        </Modal>
      )}
    </div>
  )
}
