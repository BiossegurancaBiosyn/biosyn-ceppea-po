'use client'
import { useState } from 'react'
import { USE_MATERIAIS } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function SecaoBiosseguranca() {
  const { data, can, setUseMes, verCustos } = useCaderno()
  const [editando, setEditando] = useState(false)
  const [val, setVal] = useState(data.useMes)
  const pieData = [
    { name: 'Mão de obra', value: 210.53, fill: '#2f6fc0' },
    { name: 'Materiais', value: 719.96, fill: '#5b9bd5' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <h2 className="section-title">Biossegurança (USE) · NB-2</h2>
        {can('biosseguranca') && (
          <button onClick={() => { setVal(data.useMes); setEditando(true) }} className="no-print" style={{ padding: '7px 13px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ Editar custo USE</button>
        )}
      </div>
      <div className="badge badge-purple mb-4">Nível de Biossegurança 2 (NB-2)</div>

      {verCustos ? (
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {[
            { l: 'Mão de obra/mês', v: 'R$ 210,53', cor: '#2f6fc0' },
            { l: 'Materiais/mês', v: 'R$ 719,96', cor: '#5b9bd5' },
            { l: 'Total USE/mês', v: brl(data.useMes), cor: '#173a7a' },
            { l: 'Custo/caixa', v: 'R$ 0,21', cor: '#16a34a' },
          ].map(k => (
            <div key={k.l} className="card">
              <div className="label-xs">{k.l}</div>
              <div className="font-head" style={{ fontSize: 21, fontWeight: 800, color: k.cor, marginTop: 4, letterSpacing: '-.025em' }}>{k.v}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card mb-4" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc' }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ fontSize: 12.5, color: '#64748b' }}>Custos da USE (R$) visíveis apenas na Visão Gestão. Materiais e checklist abaixo são abertos a todos.</span>
        </div>
      )}

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {/* Tabela materiais */}
        <div className="card">
          <div className="card-title mb-4">Materiais de Biossegurança</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#eef2f7' }}>
                {(verCustos ? ['Item','Qtd.','Unit.','Total'] : ['Item','Qtd.']).map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USE_MATERIAIS.map((m, i) => (
                <tr key={i} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '7px 10px' }}>{m.item}</td>
                  <td style={{ padding: '7px 10px', color: '#64748b' }}>{m.qtd}</td>
                  {verCustos && <td style={{ padding: '7px 10px', color: '#64748b' }}>{brl(m.unitario)}</td>}
                  {verCustos && <td style={{ padding: '7px 10px', fontWeight: 700, color: '#173a7a' }}>{brl(m.total)}</td>}
                </tr>
              ))}
              {verCustos && (
                <tr style={{ background: '#eef2f7', fontWeight: 700 }}>
                  <td colSpan={3} style={{ padding: '8px 10px' }}>Total materiais</td>
                  <td style={{ padding: '8px 10px', color: '#173a7a' }}>R$ 719,96</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 8 }}>
            * 100 sacos lixo, 600 mL peróxido/hipoclorito = defaults estimados
          </div>
        </div>

        {/* Gráfico + checklist */}
        <div className="flex flex-col gap-4">
          {verCustos && (
          <div className="card">
            <div className="card-title mb-3">Composição de Custos USE</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value">
                  {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => brl(v)} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          )}

          <div className="card">
            <div className="card-title mb-3">Checklist Diário USE</div>
            <div className="space-y-2">
              {[
                { label: 'Swab ATP', ok: true },
                { label: 'Liberação visual', ok: true },
                { label: 'Limpeza úmida (2×/semana)', ok: true },
                { label: 'Máscara + luvas + EPIs', ok: true },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#dcfce7' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#166534' }}>{c.label}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
              EPIs (máscara/luva) não entram neste centro de custo.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-3">Sobre NB-2 — Nível de Biossegurança</div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
          O setor Pó opera em NB-2 (Nível de Biossegurança 2), exigindo procedimentos de contenção moderada para proteção
          dos operadores e do produto. Antes de qualquer operação, a equipe USE realiza liberação com swab ATP e inspeção visual.
          A limpeza úmida é realizada 2× por semana com álcool 70%, peróxido e hipoclorito nas superfícies e equipamentos.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Swab ATP pré-produção','Liberação visual','Limpeza úmida 2×/sem','EPI obrigatório'].map(t => (
            <span key={t} className="badge badge-blue">{t}</span>
          ))}
        </div>
      </div>

      {editando && (
        <ModalEdit titulo="Editar custo USE/mês" valor={val} onChange={setVal}
          onSalvar={() => { setUseMes(val); setEditando(false) }} onClose={() => setEditando(false)} />
      )}
    </div>
  )
}

function ModalEdit({ titulo, valor, onChange, onSalvar, onClose }: { titulo: string; valor: number; onChange: (v: number) => void; onSalvar: () => void; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{ maxWidth: 380 }}>
        <h3 className="font-head" style={{ fontSize: 16, fontWeight: 800, color: '#173a7a', marginBottom: 14 }}>✏️ {titulo}</h3>
        <label className="label-xs">Valor (R$/mês)</label>
        <input type="number" value={valor} onChange={e => onChange(+e.target.value)} autoFocus
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, marginTop: 5, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#f1f5f9', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
          <button onClick={onSalvar} style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#16a34a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
