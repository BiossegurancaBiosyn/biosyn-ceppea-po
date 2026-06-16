'use client'
import { useState, useEffect } from 'react'
import { CRONOGRAMA } from '@/data/ceppea-po'

const HORA_META: Record<string, { cor: string; bg: string; label: string }> = {
  '08:00–08:30': { cor: '#2563eb', bg: '#dbeafe', label: 'Preparação' },
  '08:30–17:00': { cor: '#16a34a', bg: '#dcfce7', label: 'Produção' },
  '17:00–18:00': { cor: '#7c3aed', bg: '#ede9fe', label: 'Finalização' },
  '17:30–17:50': { cor: '#7c3aed', bg: '#ede9fe', label: 'Limpeza' },
}

const PESSOA_COR: Record<string, string> = {
  'Warlysson':         '#16a34a',
  'Lucas':             '#2f6fc0',
  'Juan':              '#7c3aed',
  'João':              '#2563eb',
  'Gilson (USE/CQ)':   '#f59e0b',
  'USE':               '#f59e0b',
  'Manutenção':        '#94a3b8',
  'Toda a equipe':     '#173a7a',
}

function PersonTag({ name }: { name: string }) {
  const cor = PESSOA_COR[name] || '#64748b'
  const initials = name.split(' ')[0].slice(0, 2).toUpperCase()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px 3px 4px', borderRadius: 99,
      background: cor + '18', border: `1px solid ${cor}40`,
      fontSize: 11, fontWeight: 600, color: cor,
    }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: cor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
        {initials}
      </span>
      {name}
    </span>
  )
}

export default function SecaoCronograma({ expandirTudo }: { expandirTudo: boolean }) {
  const [abertos, setAbertos] = useState<Set<number>>(new Set([0]))

  useEffect(() => {
    setAbertos(expandirTudo ? new Set(CRONOGRAMA.map((_, i) => i)) : new Set([0]))
  }, [expandirTudo])

  const toggle = (i: number) =>
    setAbertos(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Cronograma Diário</h2>
        <p className="section-sub">Rotina operacional · 08:00 às 18:00 · Clique nas etapas para expandir</p>
      </div>

      {/* Barra visual de horário */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(HORA_META).map(([hora, { cor, bg }]) => (
            <span key={hora} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, color: cor }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: bg, border: `1px solid ${cor}50`, display: 'inline-block' }} />
              {hora}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>
            {abertos.size} / {CRONOGRAMA.length} expandidas
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ padding: '8px 0' }}>
        {CRONOGRAMA.map((etapa, i) => {
          const aberto = abertos.has(i)
          const meta = HORA_META[etapa.hora] || { cor: '#64748b', bg: '#f1f5f9', label: '' }
          const isLast = i === CRONOGRAMA.length - 1

          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: 0,
                  padding: '0', background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Coluna de hora + linha */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80, flexShrink: 0, paddingTop: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: meta.cor, whiteSpace: 'nowrap', letterSpacing: '-.01em' }}>
                    {etapa.hora.split('–')[0]}
                  </div>
                  {!isLast && <div style={{ width: 1, flex: 1, minHeight: 32, background: '#e2e8f0', margin: '4px 0' }} />}
                </div>

                {/* Bolinha */}
                <div style={{ paddingTop: 13, flexShrink: 0 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: aberto ? meta.cor : '#fff',
                    border: `2px solid ${meta.cor}`,
                    flexShrink: 0,
                    transition: 'background .2s',
                  }} />
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1, padding: '10px 16px 10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em',
                        background: meta.bg, color: meta.cor, padding: '2px 7px', borderRadius: 5 }}>
                        {meta.label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{etapa.titulo}</span>
                    </div>
                    <span style={{ fontSize: 16, color: '#cbd5e1', transform: aberto ? 'rotate(90deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>›</span>
                  </div>

                  {aberto && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, marginBottom: 10 }}>{etapa.detalhe}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {etapa.pessoas.map(p => <PersonTag key={p} name={p} />)}
                        {etapa.equipamentos.map(e => (
                          <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px', borderRadius: 99, background: '#f1f5f9', border: '1px solid #e2e8f0',
                            fontSize: 11, fontWeight: 500, color: '#64748b' }}>
                            ⚙ {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Resumo do dia */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {[
          { icon: '⏱', label: 'Jornada', value: '10h / dia' },
          { icon: '🏭', label: 'Misturadores', value: '4 linhas' },
          { icon: '📦', label: 'Meta lotes/dia', value: '7 lotes' },
          { icon: '✅', label: 'Liberação USE', value: 'Pré + Pós' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#173a7a' }}>{k.value}</div>
            <div className="label-xs" style={{ marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
