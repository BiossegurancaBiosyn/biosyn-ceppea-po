'use client'
import { useCaderno } from '@/lib/caderno'
import { RISCOS, RISCO_CORES, GRAU_RAIO, type TipoRisco, type GrauRisco } from '@/data/ceppea-po'

const TIPOS: TipoRisco[] = ['Biológico', 'Físico', 'Químico', 'Ergonômico', 'Acidente']
const GRAUS: GrauRisco[] = ['Pequeno', 'Médio', 'Grande']

export default function SecaoRisco() {
  const { sub, setSub, back } = useCaderno()

  // ── DETALHE (planilha do risco) ──
  if (sub?.tipo === 'risco') {
    const r = RISCOS.find(x => x.id === sub.id)
    if (!r) { back(); return null }
    const c = RISCO_CORES[r.tipo]
    return (
      <div className="space-y-4">
        <button onClick={back} className="no-print" style={{ background: 'none', border: 'none', color: '#2f6fc0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Voltar ao mapa de risco</button>
        <div className="card">
          <div className="flex items-center gap-4" style={{ marginBottom: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: c.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{r.grau[0]}</div>
            <div>
              <div className="font-head" style={{ fontSize: 20, fontWeight: 800, color: '#173a7a' }}>{r.area}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: c.bg, color: c.cor }}>● Risco {r.tipo}</span>
                <span className="badge badge-gray">Grau {r.grau}</span>
              </div>
            </div>
          </div>
          <table className="tbl">
            <tbody>
              <tr><td style={{ fontWeight: 600, width: 200 }}>Agente / fator de risco</td><td>{r.agente}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Fonte geradora</td><td>{r.fonte}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Possível consequência</td><td>{r.consequencia}</td></tr>
              <tr><td style={{ fontWeight: 600, verticalAlign: 'top' }}>Medidas de controle</td><td><ul style={{ paddingLeft: 4, lineHeight: 1.9 }}>{r.medidas.map(m => <li key={m}>• {m}</li>)}</ul></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const furn = (x: number, y: number, w: number, h: number, t: string, vert?: boolean) => (
    <g><rect x={x} y={y} width={w} height={h} rx={6} fill="#eef2f7" stroke="#dbe3ec" />
      <text x={x + w / 2} y={y + h / 2 + (vert ? 0 : 3)} textAnchor="middle" fontSize={8} fill="#94a3b8" transform={vert ? `rotate(-90 ${x + w / 2} ${y + h / 2})` : undefined}>{t}</text></g>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Mapeamento de Risco</h2>
        <p className="section-sub">Padrão NR-5 · cor = tipo de risco · tamanho do círculo = grau · clique para abrir a planilha do risco</p>
      </div>

      {/* Legenda */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {TIPOS.map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#475569' }}>
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: RISCO_CORES[t].cor }} />{t}
              </span>
            ))}
          </div>
          <div style={{ width: 1, height: 22, background: '#e2e8f0' }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {GRAUS.map(g => (
              <span key={g} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#475569' }}>
                <span style={{ width: GRAU_RAIO[g] * 0.9, height: GRAU_RAIO[g] * 0.9, borderRadius: '50%', background: '#94a3b8' }} />{g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Planta com riscos */}
      <div className="card" style={{ padding: 16, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 980 600" style={{ width: '100%', minWidth: 620, height: 'auto', display: 'block', fontFamily: 'var(--font-inter)' }}>
            <defs>
              <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><polygon points="0 0,8 4,0 8" fill="#94a3b8" /></marker>
            </defs>
            <rect x={8} y={8} width={964} height={584} rx={12} fill="#fbfcfe" stroke="#cbd5e1" strokeWidth={2} />
            <text x={490} y={32} textAnchor="middle" fontSize={12} fontWeight={800} fill="#173a7a" letterSpacing=".03em">MAPA DE RISCO · SETOR PÓ</text>

            {/* Zona de alto risco biológico (misturadores) */}
            <rect x={588} y={92} width={372} height={372} rx={11} fill="#92400e18" stroke="#92400e" strokeWidth={1.5} strokeDasharray="6 4" />
            <text x={774} y={452} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#92400e">Área de misturadores (aberta) · contaminação cruzada</text>

            {/* Áreas auxiliares */}
            {furn(150, 200, 84, 46, 'Balança')}
            {furn(150, 270, 84, 46, 'Seladora')}
            {furn(150, 40, 170, 36, 'Armário utensílios de limpeza')}
            <rect x={544} y={170} width={15} height={210} rx={4} fill="#dde5ee" stroke="#bcc8d6" /><text x={551} y={275} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#8aa0b8" transform="rotate(-90 551 275)">PIA DE HIGIENIZAÇÃO</text>
            <rect x={230} y={500} width={300} height={70} rx={8} fill="#fef9c322" stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="5 3" /><text x={380} y={540} textAnchor="middle" fontSize={9} fontWeight={700} fill="#a16207">Paletização (ergonômico)</text>

            {/* Setas de fluxo */}
            <path d="M244 250 L540 250" stroke="#94a3b8" strokeWidth={1.5} fill="none" markerEnd="url(#ar)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M620 470 L420 510" stroke="#94a3b8" strokeWidth={1.5} fill="none" markerEnd="url(#ar)" strokeDasharray="7 4" className="flow-arrow" />

            {/* Círculos de risco */}
            {RISCOS.map(r => {
              const c = RISCO_CORES[r.tipo]; const raio = GRAU_RAIO[r.grau]
              return (
                <g key={r.id} onClick={() => setSub({ tipo: 'risco', id: r.id })} className="map-click">
                  {r.grau === 'Grande' && <circle cx={r.x} cy={r.y} r={raio + 6} fill="none" stroke={c.cor} strokeWidth={1.5} opacity={0.5} className="pulse-ring" />}
                  <circle cx={r.x} cy={r.y} r={raio} fill={c.cor} opacity={0.88} stroke="#fff" strokeWidth={2} />
                  <text x={r.x} y={r.y + 3.5} textAnchor="middle" fontSize={raio > 14 ? 11 : 9} fontWeight={800} fill="#fff">{r.tipo[0]}</text>
                </g>
              )
            })}
          </svg>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>💡 Clique em um círculo para ver agente, fonte, consequência e medidas de controle. Letra = tipo (B/F/Q/E/A).</p>
      </div>

      {/* Tabela completa */}
      <div className="card">
        <div className="card-title mb-4">📋 Inventário de Riscos do Setor</div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr>{['Área', 'Tipo', 'Grau', 'Agente / fator', 'Principais medidas'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {RISCOS.map(r => {
                const c = RISCO_CORES[r.tipo]
                return (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSub({ tipo: 'risco', id: r.id })}>
                    <td style={{ fontWeight: 600 }}>{r.area}</td>
                    <td><span className="badge" style={{ background: c.bg, color: c.cor }}>● {r.tipo}</span></td>
                    <td><span className="badge badge-gray">{r.grau}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.agente}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.medidas.slice(0, 2).join(' · ')}…</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid #92400e', background: '#fffaf0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>🧬 Nível de Biossegurança NB-2</div>
        <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.7, marginTop: 6 }}>
          O setor opera em NB-2 com microrganismos de Classe de Risco 1 e 2 (ex.: <em>Bacillus</em> e <em>Lactobacillus</em> — Classe 1; <em>E. faecium</em> — Classe 2).
          O principal risco é a <strong>contaminação cruzada</strong> na área aberta de mistura, controlada por liberação USE, limpeza e segregação.
          A análise de risco deve ser revisada periodicamente e a cada mudança de processo.
        </p>
      </div>
    </div>
  )
}
