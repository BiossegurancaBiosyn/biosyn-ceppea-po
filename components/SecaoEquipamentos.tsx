'use client'
import { useState } from 'react'
import { EQUIPAMENTOS, type Equipamento } from '@/data/ceppea-po'
import Modal from './Modal'

const EQ_ICON: Record<string, string> = {
  'Horizontal': '⚙️', 'Big Bag (Personalize)': '🛄', 'Acima de 2 kg': '🏭',
  'Digital': '⚖️', 'Manual': '🔒', 'Emulsificador': '🌀', 'Micronizador': '⚗️',
  'Peneira': '🔍', 'Separador Magnético': '🧲', 'Elevador': '🏗️',
  'Movimentação': '🚜', 'Limpeza': '🧹', 'Monitoramento': '🌡️',
}

function StatusDot({ status }: { status: string }) {
  const ok = status === 'ok'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600,
      color: ok ? '#15803d' : '#a16207',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: ok ? '#22c55e' : '#f59e0b',
        boxShadow: ok ? '0 0 0 2px #dcfce7' : '0 0 0 2px #fef9c3',
        display: 'inline-block',
      }} />
      {ok ? 'Operacional' : 'Atenção'}
    </span>
  )
}

export default function SecaoEquipamentos() {
  const [sel, setSel] = useState<Equipamento | null>(null)
  const [filtro, setFiltro] = useState<'todos' | 'ok' | 'atencao'>('todos')

  const lista = filtro === 'todos' ? EQUIPAMENTOS : EQUIPAMENTOS.filter(e => e.status === filtro)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Equipamentos</h2>
        <p className="section-sub">17 ativos do setor · clique para ver a ficha técnica</p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'todos', label: `Todos (${EQUIPAMENTOS.length})` },
          { id: 'ok',      label: `✓ Operacionais (${EQUIPAMENTOS.filter(e=>e.status==='ok').length})` },
          { id: 'atencao', label: `⚠ Atenção (${EQUIPAMENTOS.filter(e=>e.status==='atencao').length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFiltro(f.id as typeof filtro)}
            style={{
              padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filtro === f.id ? '#173a7a' : '#f8fafc',
              color: filtro === f.id ? '#fff' : '#64748b',
              border: `1px solid ${filtro === f.id ? '#173a7a' : '#e2e8f0'}`,
              transition: 'all .15s',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {lista.map(eq => (
          <button
            key={eq.id}
            onClick={() => setSel(eq)}
            className="card text-left"
            style={{
              padding: '18px',
              cursor: 'pointer',
              borderTop: `3px solid ${eq.status === 'atencao' ? '#f59e0b' : '#22c55e'}`,
              transition: 'all .18s',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="icon-box icon-box-md" style={{
                background: eq.status === 'atencao' ? '#fef9c3' : '#dcfce7',
                fontSize: 20,
              }}>
                {EQ_ICON[eq.tipo] || '⚙️'}
              </div>
              <StatusDot status={eq.status} />
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{eq.nome}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{eq.id} · {eq.tipo}</div>

            {eq.capacidade !== '—' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#64748b' }}>Capacidade</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{eq.capacidade}</span>
              </div>
            )}
            {eq.responsavel !== '—' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                <span style={{ color: '#64748b' }}>Responsável</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{eq.responsavel}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Modal */}
      {sel && (
        <Modal onClose={() => setSel(null)}>
          <div className="flex items-center gap-4 mb-5">
            <div className="icon-box icon-box-lg" style={{
              background: sel.status === 'atencao' ? '#fef9c3' : '#dcfce7',
              fontSize: 26,
            }}>
              {EQ_ICON[sel.tipo] || '⚙️'}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#173a7a', letterSpacing: '-.01em' }}>{sel.nome}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{sel.id} · {sel.tipo}</div>
              <div className="mt-2">
                <StatusDot status={sel.status} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', marginBottom: 16 }} />

          <div className="space-y-0">
            {[
              { label: 'Status',                value: sel.status === 'atencao' ? 'ATENÇÃO' : 'Operacional', badge: sel.status === 'atencao' ? 'badge-yellow' : 'badge-green' },
              { label: 'Capacidade',            value: sel.capacidade },
              { label: 'Lotes/dia',             value: sel.lotesDia },
              { label: 'Localização',           value: sel.area },
              { label: 'Responsável',           value: sel.responsavel },
              { label: 'Manutenção preventiva', value: sel.preventiva },
              { label: 'Custo hora-máquina',    value: 'a-informar' },
              { label: 'Valor do equipamento',  value: 'a-informar' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
                {r.badge ? (
                  <span className={`badge ${r.badge}`}>{r.value}</span>
                ) : r.value === 'a-informar' ? (
                  <span className="a-informar">a informar</span>
                ) : r.value === '—' ? (
                  <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.value}</span>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
