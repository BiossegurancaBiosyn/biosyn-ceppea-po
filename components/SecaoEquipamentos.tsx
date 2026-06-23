'use client'
import { useState } from 'react'
import { EQUIPAMENTOS, type Equipamento } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'

const EQ_ICON: Record<string, string> = {
  'Horizontal': '⚙️', 'Big Bag (Personalize)': '🛄', 'Acima de 2 kg': '🏭', 'Digital': '⚖️', 'Manual': '🔒',
  'Emulsificador': '🌀', 'Micronizador': '⚗️', 'Peneira': '🔍', 'Separador Magnético': '🧲', 'Elevador': '🏗️',
  'Movimentação': '🚜', 'Limpeza': '🧹', 'Monitoramento': '🌡️',
}
function Dot({ ok }: { ok: boolean }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: ok ? '#15803d' : '#a16207' }}>
    <span style={{ width: 7, height: 7, borderRadius: '50%', background: ok ? '#22c55e' : '#f59e0b', boxShadow: `0 0 0 2px ${ok ? '#dcfce7' : '#fef9c3'}` }} />{ok ? 'Operacional' : 'Atenção'}</span>
}

export default function SecaoEquipamentos() {
  const { sub, setSub, back } = useCaderno()
  const [filtro, setFiltro] = useState<'todos' | 'ok' | 'atencao'>('todos')

  // ── DETALHE ──
  if (sub?.tipo === 'equip') {
    const e = EQUIPAMENTOS.find(x => x.id === sub.id)
    if (!e) { back(); return null }
    const at = e.status === 'atencao'
    return (
      <div className="space-y-4">
        <button onClick={back} className="no-print" style={{ background: 'none', border: 'none', color: '#2f6fc0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Voltar aos equipamentos</button>
        <div className="card">
          <div className="flex items-center gap-4" style={{ marginBottom: 18 }}>
            <div className="ic icon-box-lg" style={{ background: at ? '#fef9c3' : '#dcfce7', fontSize: 24 }}>{EQ_ICON[e.tipo] || '⚙️'}</div>
            <div><div className="font-head" style={{ fontSize: 20, fontWeight: 800, color: '#173a7a' }}>{e.nome}</div><div style={{ fontSize: 13, color: '#94a3b8' }}>{e.id} · {e.tipo}</div><div style={{ marginTop: 6 }}><Dot ok={!at} /></div></div>
          </div>
          <table className="tbl">
            <tbody>
              {[['Tipo', e.tipo], ['Capacidade', e.capacidade], ['Lotes/dia', e.lotesDia], ['Localização', e.area], ['Responsável', e.responsavel], ['Manutenção preventiva', e.preventiva], ['Custo hora-máquina', 'a informar'], ['Valor / depreciação', 'a informar']].map(r => (
                <tr key={r[0]}><td style={{ fontWeight: 600, width: 220 }}>{r[0]}</td><td>{r[1] === 'a informar' ? <span className="a-informar">a informar</span> : r[1] === '—' ? <span style={{ color: '#cbd5e1' }}>—</span> : r[1]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── GRID ──
  const lista = filtro === 'todos' ? EQUIPAMENTOS : EQUIPAMENTOS.filter(e => e.status === filtro)
  return (
    <div className="space-y-4">
      <div><h2 className="section-title">Equipamentos</h2><p className="section-sub">17 ativos · clique para a ficha técnica</p></div>
      <div className="flex items-center gap-2 flex-wrap">
        {[['todos', `Todos (${EQUIPAMENTOS.length})`], ['ok', `✓ Operacionais (${EQUIPAMENTOS.filter(e => e.status === 'ok').length})`], ['atencao', `⚠ Atenção (${EQUIPAMENTOS.filter(e => e.status === 'atencao').length})`]].map(f => (
          <button key={f[0]} onClick={() => setFiltro(f[0] as typeof filtro)} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filtro === f[0] ? '#173a7a' : '#f8fafc', color: filtro === f[0] ? '#fff' : '#64748b', border: `1px solid ${filtro === f[0] ? '#173a7a' : '#e2e8f0'}` }}>{f[1]}</button>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {lista.map(eq => (
          <div key={eq.id} className="card clickable" style={{ borderTop: `3px solid ${eq.status === 'atencao' ? '#f59e0b' : '#22c55e'}` }} onClick={() => setSub({ tipo: 'equip', id: eq.id })}>
            <div className="flex items-start justify-between mb-3"><div className="ic icon-box-md" style={{ background: eq.status === 'atencao' ? '#fef9c3' : '#dcfce7', fontSize: 20 }}>{EQ_ICON[eq.tipo] || '⚙️'}</div><Dot ok={eq.status === 'ok'} /></div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{eq.nome}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{eq.id} · {eq.tipo}</div>
            {eq.capacidade !== '—' && <div className="row" style={{ borderBottom: 'none', padding: '3px 0' }}><span style={{ fontSize: 12, color: '#64748b' }}>Capacidade</span><span style={{ fontSize: 12, fontWeight: 600 }}>{eq.capacidade}</span></div>}
            {eq.responsavel !== '—' && <div className="row" style={{ borderBottom: 'none', padding: '3px 0' }}><span style={{ fontSize: 12, color: '#64748b' }}>Responsável</span><span style={{ fontSize: 12, fontWeight: 600 }}>{eq.responsavel}</span></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
