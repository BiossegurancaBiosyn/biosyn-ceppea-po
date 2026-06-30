'use client'
import { useCaderno } from '@/lib/caderno'
import { RISCOS, RISCO_CORES, type TipoRisco } from '@/data/ceppea-po'

// Ícone (emoji) por tipo + severidade por risco + cores de severidade
const TIPO_ICON: Record<TipoRisco, string> = {
  'Biológico': '☣️', 'Químico': '⚗️', 'Físico': '🌡️', 'Ergonômico': '🏋️', 'Acidente': '⚠️',
}
const SEVERIDADE: Record<string, 'Crítico' | 'Alto' | 'Moderado'> = {
  RB1: 'Crítico', RA1: 'Alto', RF1: 'Moderado', RE1: 'Moderado', RE2: 'Moderado', RA2: 'Alto', RQ1: 'Moderado',
}
const SEV_COR: Record<string, string> = { 'Crítico': '#b91c1c', 'Alto': '#ef4444', 'Moderado': '#eab308' }
const SEV_RAIO: Record<string, number> = { 'Crítico': 23, 'Alto': 20, 'Moderado': 17 }

const TIPOS: TipoRisco[] = ['Biológico', 'Químico', 'Físico', 'Ergonômico', 'Acidente']

// Posições no mapa (planta organizada do setor Pó)
const POS: Record<string, { x: number; y: number }> = {
  RB1: { x: 770, y: 235 }, RA1: { x: 625, y: 135 }, RF1: { x: 895, y: 320 },
  RE1: { x: 235, y: 320 }, RE2: { x: 440, y: 505 }, RA2: { x: 620, y: 505 }, RQ1: { x: 72, y: 64 },
}

export default function SecaoRisco() {
  const { sub, setSub, back } = useCaderno()

  // ── DETALHE ──
  if (sub?.tipo === 'risco') {
    const r = RISCOS.find(x => x.id === sub.id)
    if (!r) { back(); return null }
    const c = RISCO_CORES[r.tipo]; const sev = SEVERIDADE[r.id]
    return (
      <div className="space-y-4">
        <button onClick={back} className="no-print" style={{ background: 'none', border: 'none', color: '#2f6fc0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Voltar ao mapa de risco</button>
        <div className="card">
          <div className="flex items-center gap-4" style={{ marginBottom: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: SEV_COR[sev], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{TIPO_ICON[r.tipo]}</div>
            <div>
              <div className="font-head" style={{ fontSize: 20, fontWeight: 800, color: '#173a7a' }}>{r.area}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: c.bg, color: c.cor }}>{TIPO_ICON[r.tipo]} Risco {r.tipo}</span>
                <span className="badge" style={{ background: SEV_COR[sev] + '22', color: SEV_COR[sev] }}>Severidade {sev}</span>
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

  const Zona = ({ x, y, w, h, fill, stroke, label }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; label: string }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + 12} y={y + h - 12} fontSize={10} fontWeight={700} fill={stroke}>{label}</text>
    </g>
  )
  const Icon = (r: typeof RISCOS[number]) => {
    const sev = SEVERIDADE[r.id]; const raio = SEV_RAIO[sev]; const p = POS[r.id]
    return (
      <g key={r.id} onClick={() => setSub({ tipo: 'risco', id: r.id })} className="map-click">
        {sev === 'Crítico' && <circle cx={p.x} cy={p.y} r={raio + 6} fill="none" stroke={SEV_COR[sev]} strokeWidth={2} opacity={0.5} className="pulse-ring" />}
        <circle cx={p.x} cy={p.y} r={raio} fill="#fff" stroke={SEV_COR[sev]} strokeWidth={3} />
        <text x={p.x} y={p.y + raio * 0.38} textAnchor="middle" fontSize={raio * 1.15}>{TIPO_ICON[r.tipo]}</text>
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Mapeamento de Risco</h2>
        <p className="section-sub">Classificação NB-2 / BSL-2 Industrial · clique nos ícones para abrir a planilha do risco</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* PLANTA */}
          <div style={{ flex: '1 1 560px', minWidth: 0, padding: 16, overflowX: 'auto' }}>
            <svg viewBox="0 0 1000 600" style={{ width: '100%', minWidth: 560, height: 'auto', display: 'block', fontFamily: 'var(--font-inter)' }}>
              <defs>
                <marker id="azul" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0 0,9 4.5,0 9" fill="#2563eb" /></marker>
                <marker id="verm" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0 0,9 4.5,0 9" fill="#dc2626" /></marker>
              </defs>

              <rect x={6} y={6} width={988} height={588} rx={12} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} />
              <text x={500} y={30} textAnchor="middle" fontSize={13} fontWeight={800} fill="#173a7a">CLASSIFICAÇÃO DA ÁREA · NB-2 / BSL-2 INDUSTRIAL</text>

              {/* Zonas com severidade */}
              <Zona x={555} y={70} w={415} h={330} fill="#fde2e2" stroke="#dc2626" label="ÁREA DE MISTURADORES (ABERTA) · BIOLÓGICO CRÍTICO" />
              <Zona x={340} y={430} w={400} h={140} fill="#fef7cd" stroke="#ca8a04" label="PALETIZAÇÃO · ERGONÔMICO MODERADO" />
              <Zona x={150} y={270} w={180} h={110} fill="#fef7cd" stroke="#ca8a04" label="SELAGEM / EMBALAGEM" />
              <Zona x={150} y={130} w={120} h={90} fill="#eef2f7" stroke="#94a3b8" label="PESAGEM" />
              <Zona x={345} y={130} w={185} h={130} fill="#eef2f7" stroke="#94a3b8" label="ARMAZ. MICROINGREDIENTES" />
              <Zona x={30} y={45} w={185} h={40} fill="#fee2e2" stroke="#dc2626" label="UTENSÍLIOS DE LIMPEZA" />

              {/* Pia de higienização (compacta) */}
              <rect x={533} y={150} width={13} height={170} rx={4} fill="#dbeafe" stroke="#93c5fd" />
              <text x={539} y={235} textAnchor="middle" fontSize={7} fontWeight={600} fill="#3b82f6" transform="rotate(-90 539 235)">PIA HIGIEniz.</text>

              {/* Fluxos: azul = limpo, vermelho = contaminado */}
              <path d="M275 175 L530 175" stroke="#2563eb" strokeWidth={3} fill="none" markerEnd="url(#azul)" />
              <path d="M438 250 L520 230" stroke="#2563eb" strokeWidth={3} fill="none" markerEnd="url(#azul)" />
              <path d="M610 405 L440 440" stroke="#dc2626" strokeWidth={3} fill="none" markerEnd="url(#verm)" strokeDasharray="2 0" />
              <path d="M330 320 L335 320" stroke="#dc2626" strokeWidth={3} fill="none" />
              <path d="M555 330 L335 345" stroke="#dc2626" strokeWidth={3} fill="none" markerEnd="url(#verm)" />

              {/* Ícones de risco */}
              {RISCOS.map(r => Icon(r))}
            </svg>
          </div>

          {/* LEGENDA lateral (estilo da referência) */}
          <div style={{ flex: '0 0 250px', borderLeft: '1px solid #e2e8f0', padding: '16px', background: '#fcfdfe' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>Legenda</div>
            {[
              { ic: '☣️', cor: '#b91c1c', t: 'Risco Biológico Crítico' },
              { ic: '⚗️', cor: '#b91c1c', t: 'Risco Químico Crítico' },
              { ic: '⚗️', cor: '#ef4444', t: 'Risco Químico Alto' },
              { ic: '☣️', cor: '#ef4444', t: 'Risco Biológico Alto' },
              { ic: '🌡️', cor: '#ef4444', t: 'Risco Físico Alto' },
              { ic: '🏋️', cor: '#eab308', t: 'Risco Ergonômico Moderado' },
              { ic: '☣️', cor: '#eab308', t: 'Risco Biológico Moderado' },
              { ic: '⚠️', cor: '#ef4444', t: 'Risco de Acidente Alto' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: `2.5px solid ${l.cor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{l.ic}</span>
                <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>{l.t}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <svg width="34" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#2563eb" strokeWidth="3" /><polygon points="26,1 34,5 26,9" fill="#2563eb" /></svg>
                <span style={{ fontSize: 11.5, color: '#475569' }}>Fluxo limpo (pessoas e materiais)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <svg width="34" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#dc2626" strokeWidth="3" /><polygon points="26,1 34,5 26,9" fill="#dc2626" /></svg>
                <span style={{ fontSize: 11.5, color: '#475569' }}>Fluxo contaminado de materiais</span>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: '#eff6ff', fontSize: 11, color: '#1e40af', lineHeight: 1.6 }}>
              Área: Unidade de Segurança e Esterilização · Controle: diário e estéril · Acesso: limitado e restrito.
            </div>
          </div>
        </div>
      </div>

      {/* Tabela completa */}
      <div className="card">
        <div className="card-title mb-4">📋 Inventário de Riscos do Setor</div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr>{['', 'Área', 'Tipo', 'Severidade', 'Agente / fator', 'Principais medidas'].map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {RISCOS.map(r => {
                const sev = SEVERIDADE[r.id]; const c = RISCO_CORES[r.tipo]
                return (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSub({ tipo: 'risco', id: r.id })}>
                    <td><span style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', border: `2.5px solid ${SEV_COR[sev]}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{TIPO_ICON[r.tipo]}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.area}</td>
                    <td><span className="badge" style={{ background: c.bg, color: c.cor }}>{r.tipo}</span></td>
                    <td><span className="badge" style={{ background: SEV_COR[sev] + '22', color: SEV_COR[sev] }}>{sev}</span></td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.agente}</td>
                    <td style={{ fontSize: 12, color: '#64748b' }}>{r.medidas.slice(0, 2).join(' · ')}…</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid #b91c1c', background: '#fffafa' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#b91c1c' }}>🧬 Classificação NB-2 / BSL-2 Industrial</div>
        <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.7, marginTop: 6 }}>
          Microrganismos de Classe de Risco 1 e 2 (<em>Bacillus</em>, <em>Lactobacillus</em> — Classe 1; <em>E. faecium</em> — Classe 2).
          Risco crítico = <strong>contaminação cruzada</strong> na área aberta de mistura. Controles: liberação USE (swab ATP),
          limpeza úmida, segregação, EPIs e fluxos separados (limpo × contaminado). Revisar a análise a cada mudança de processo.
        </p>
      </div>
    </div>
  )
}
