'use client'
import { useState } from 'react'
import { PLANO_LIMPEZA, type Periodicidade } from '@/data/ceppea-po'

const PERIODO_CORES: Record<Periodicidade, { bg: string; text: string }> = {
  'Diário':      { bg: '#dcfce7', text: '#16a34a' },
  '3x/semana':  { bg: '#dbeafe', text: '#1e4fa0' },
  'Semanal':    { bg: '#fef9c3', text: '#b45309' },
  'Mensal':     { bg: '#ede9fe', text: '#7c3aed' },
  'Eventual':   { bg: '#fee2e2', text: '#dc2626' },
  'Anual':      { bg: '#f1f5f9', text: '#64748b' },
}

const PERIODOS: (Periodicidade | 'Todos')[] = ['Todos','Diário','3x/semana','Semanal','Mensal','Eventual','Anual']

export default function SecaoLimpeza() {
  const [filtro, setFiltro] = useState<Periodicidade | 'Todos'>('Todos')

  const itens = filtro === 'Todos' ? PLANO_LIMPEZA : PLANO_LIMPEZA.filter(i => i.periodicidade === filtro)

  return (
    <div>
      <h2 className="section-title mb-1">Plano de Limpeza</h2>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        PLIM.01.00 · POP 02 · Elaborado por Michelly Quandt · Aprovado por Alessandra Gruber
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PERIODOS.map(p => {
          const cor = p === 'Todos' ? { bg: '#eef2f7', text: '#173a7a' } : PERIODO_CORES[p as Periodicidade]
          return (
            <button
              key={p}
              onClick={() => setFiltro(p as typeof filtro)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: filtro === p ? cor.bg : '#fff',
                color: filtro === p ? cor.text : '#64748b',
                border: `1px solid ${filtro === p ? cor.text + '44' : '#e2e8f0'}`,
                fontWeight: filtro === p ? 700 : 500,
              }}
            >
              {p}
            </button>
          )
        })}
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#eef2f7' }}>
                {['Item','Periodicidade','Responsável','Observação'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((item, i) => {
                const cor = PERIODO_CORES[item.periodicidade]
                return (
                  <tr key={i} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{item.item}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="badge" style={{ background: cor.bg, color: cor.text }}>
                        {item.periodicidade}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#374151' }}>{item.responsavel}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {item.obs ? (
                        <span style={{ fontSize: 11, background: '#fef9c3', color: '#b45309', padding: '2px 8px', borderRadius: 6 }}>
                          {item.obs}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
