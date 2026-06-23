'use client'
import { useState } from 'react'
import { useCaderno } from '@/lib/caderno'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const paradaData = [
  { eq: 'Mist. 1', horas: 8, fill: '#f59e0b' },
  { eq: 'Mist. 2', horas: 8, fill: '#f59e0b' },
  { eq: 'Mist. 3', horas: 8, fill: '#f59e0b' },
  { eq: 'Mist. Y', horas: 4, fill: '#5b9bd5' },
]

export default function SecaoManutencao() {
  const { data, can, setManutMes, verCustos } = useCaderno()
  const [editando, setEditando] = useState(false)
  const [val, setVal] = useState(data.manutMes)
  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="section-title">Manutenção</h2>
          <p className="section-sub">Preventivas, paradas e impacto no setor</p>
        </div>
        {can('manutencao') && (
          <button onClick={() => { setVal(data.manutMes); setEditando(true) }} className="no-print" style={{ padding: '7px 13px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✏️ Editar custo manutenção</button>
        )}
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {[
          { l: 'Custo preventiva/mês', v: verCustos ? brl(data.manutMes) : '🔒', cor: '#173a7a' },
          { l: 'Perfil da equipe', v: 'Op. Pleno', cor: '#2f6fc0' },
          { l: 'Hora-homem manutenção', v: verCustos ? 'R$ 22,49/h' : '🔒', cor: '#2f6fc0' },
          { l: 'Parada/mês', v: '8h (1 dia)', cor: '#dc2626' },
          { l: 'Cx não produzidas', v: '~280 cx', cor: '#dc2626' },
          { l: 'Frequência', v: '1×/mês', cor: '#16a34a' },
        ].map(k => (
          <div key={k.l} className="card">
            <div className="label-xs">{k.l}</div>
            <div className="font-head" style={{ fontSize: 19, fontWeight: 800, color: k.cor, marginTop: 4, letterSpacing: '-.02em' }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="card-title mb-4">Plano de Preventivas</div>
          <div className="space-y-3">
            {[
              { item: 'Misturadores 1, 2, 3', freq: '1×/mês — dia inteiro', pessoas: '2 pessoas (Op. Pleno)', cor: '#16a34a' },
              { item: 'Calibração Balanças', freq: 'Terceirizada', pessoas: 'Empresa terceira', cor: '#5b9bd5' },
              { item: 'Peças / Histórico', freq: 'a informar', pessoas: 'a informar', cor: '#f59e0b' },
            ].map(p => (
              <div key={p.item} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.cor, flexShrink: 0, marginTop: 4 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.item}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.freq} · {p.pessoas}</div>
                  {p.cor === '#f59e0b' && (
                    <span className="a-informar">a informar</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-4">Paradas Estimadas por Equipamento (h/mês)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paradaData}>
              <XAxis dataKey="eq" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="h" />
              <Tooltip formatter={(v: number) => v + ' horas'} />
              <Bar dataKey="horas" radius={[6,6,0,0]}>
                {paradaData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#b45309' }}>⚠ Impacto da Parada Preventiva</div>
        <p style={{ fontSize: 13, color: '#374151', marginTop: 6, lineHeight: 1.8 }}>
          A manutenção preventiva dos misturadores ocorre 1× ao mês, durante um dia inteiro (8h).
          Nesse dia, o setor Pó fica <strong>improdutivo</strong>, resultando em aproximadamente
          <strong> 280 caixas não produzidas</strong> e custo de oportunidade equivalente.
        </p>
        <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: '#fef9c3', color: '#b45309' }}>
          Recomendação: avaliar manutenção em turno extra ou fora do horário produtivo para minimizar impacto.
        </div>
      </div>

      {editando && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditando(false) }}>
          <div className="modal-box" style={{ maxWidth: 380 }}>
            <h3 className="font-head" style={{ fontSize: 16, fontWeight: 800, color: '#173a7a', marginBottom: 14 }}>✏️ Editar custo manutenção/mês</h3>
            <label className="label-xs">Valor (R$/mês)</label>
            <input type="number" value={val} onChange={e => setVal(+e.target.value)} autoFocus
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15, marginTop: 5, outline: 'none' }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setEditando(false)} style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#f1f5f9', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#475569' }}>Cancelar</button>
              <button onClick={() => { setManutMes(val); setEditando(false) }} style={{ flex: 1, padding: '10px', borderRadius: 11, background: '#16a34a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
