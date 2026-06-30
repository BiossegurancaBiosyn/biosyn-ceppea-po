'use client'
import { useCaderno } from '@/lib/caderno'
import { RISCOS, RISCO_CORES, type TipoRisco } from '@/data/ceppea-po'

const TIPO_ICON: Record<TipoRisco, string> = {
  'Biológico': '☣️', 'Químico': '⚗️', 'Físico': '🌡️', 'Ergonômico': '🏋️', 'Acidente': '⚠️',
}
const SEVERIDADE: Record<string, 'Crítico' | 'Alto' | 'Moderado'> = {
  RB1: 'Crítico', RA1: 'Alto', RF1: 'Moderado', RE1: 'Moderado', RE2: 'Moderado', RA2: 'Alto', RQ1: 'Moderado',
}
const SEV_COR: Record<string, string> = { 'Crítico': '#b91c1c', 'Alto': '#ef4444', 'Moderado': '#eab308' }
const SEV_RAIO: Record<string, number> = { 'Crítico': 22, 'Alto': 19, 'Moderado': 16 }

// Posições fiéis à planta enviada (orientação vertical)
const POS: Record<string, { x: number; y: number }> = {
  RB1: { x: 360, y: 165 },  // Biológico — mistura (centro do topo)
  RA1: { x: 250, y: 95 },   // Acidente — plataforma em altura (topo)
  RF1: { x: 520, y: 235 },  // Físico — pó em suspensão
  RE1: { x: 160, y: 548 },  // Ergonômico — selagem
  RE2: { x: 185, y: 700 },  // Ergonômico — paletização
  RA2: { x: 450, y: 700 },  // Acidente — circulação/empilhadeira
  RQ1: { x: 450, y: 470 },  // Químico — utensílios de limpeza
}

export default function SecaoRisco() {
  const { sub, setSub, back } = useCaderno()

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

  // Zona com rótulo no CANTO SUPERIOR (não atrapalha os ícones)
  const Zona = ({ x, y, w, h, fill, stroke, label, dash, hatch }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; label: string; dash?: boolean; hatch?: boolean }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={dash ? '7 5' : undefined} />
      {hatch && Array.from({ length: Math.floor(w / 18) }).map((_, i) => <line key={i} x1={x + 8 + i * 18} y1={y + 6} x2={x + 8 + i * 18} y2={y + h - 6} stroke={stroke} strokeWidth={0.6} opacity={0.25} />)}
      <rect x={x + 8} y={y + 7} width={Math.min(w - 16, label.length * 5.6 + 14)} height={16} rx={5} fill="#ffffffcc" />
      <text x={x + 15} y={y + 19} fontSize={9.5} fontWeight={700} fill={stroke}>{label}</text>
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
        <p className="section-sub">Classificação NB-2 / BSL-2 Industrial · planta do setor · clique nos ícones para a planilha do risco</p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 640 780" style={{ width: '100%', maxWidth: 560, margin: '0 auto', height: 'auto', display: 'block', fontFamily: 'var(--font-inter)' }}>
          <defs>
            <marker id="azul" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0 0,9 4.5,0 9" fill="#2563eb" /></marker>
            <marker id="verm" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><polygon points="0 0,9 4.5,0 9" fill="#dc2626" /></marker>
          </defs>

          <rect x={6} y={6} width={628} height={768} rx={12} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} />
          <text x={320} y={28} textAnchor="middle" fontSize={12} fontWeight={800} fill="#173a7a">CLASSIFICAÇÃO DA ÁREA · NB-2 / BSL-2 INDUSTRIAL</text>

          {/* Faixa PCM (acesso) à esquerda do topo */}
          <rect x={40} y={48} width={26} height={258} rx={6} fill="#e2e8f0" stroke="#94a3b8" />
          <text x={53} y={177} textAnchor="middle" fontSize={9} fontWeight={700} fill="#64748b" transform="rotate(-90 53 177)">PCM · ACESSO</text>

          {/* Mistura de pós (área aberta) — topo */}
          <Zona x={74} y={48} w={526} h={258} fill="#fde2e2" stroke="#dc2626" dash label="MISTURA DE PÓS · ÁREA ABERTA · 103 m²" />

          {/* Pesagem / balança */}
          <Zona x={74} y={326} w={150} h={86} fill="#eef2f7" stroke="#94a3b8" label="PESAGEM / BALANÇA" />

          {/* Armazenamento de microingredientes (com prateleiras) */}
          <Zona x={360} y={326} w={240} h={120} fill="#eef2f7" stroke="#94a3b8" hatch label="ARMAZ. MICROINGREDIENTES · 24,55 m²" />

          {/* Utensílios de limpeza (químico) */}
          <Zona x={360} y={456} w={170} h={40} fill="#fee2e2" stroke="#dc2626" label="UTENSÍLIOS DE LIMPEZA" />

          {/* Selagem / embalagem */}
          <Zona x={74} y={488} w={250} h={120} fill="#fef7cd" stroke="#ca8a04" label="SELAGEM / EMBALAGEM" />

          {/* Acesso (rosa) */}
          <Zona x={540} y={508} w={60} h={100} fill="#fce7f3" stroke="#db2777" label="ACESSO" />

          {/* Paletização (com paletes) */}
          <Zona x={74} y={636} w={526} h={120} fill="#fef7cd" stroke="#ca8a04" hatch label="PALETIZAÇÃO" />

          {/* Saídas (verde) */}
          <rect x={14} y={350} width={14} height={40} rx={3} fill="#86efac" stroke="#16a34a" /><text x={21} y={344} textAnchor="middle" fontSize={6.5} fill="#16a34a" fontWeight={700}>SAÍDA</text>
          <rect x={14} y={660} width={14} height={40} rx={3} fill="#86efac" stroke="#16a34a" />

          {/* Fluxos: azul = limpo, vermelho = contaminado */}
          <path d="M30 250 L70 220" stroke="#2563eb" strokeWidth={3} fill="none" markerEnd="url(#azul)" />
          <path d="M300 326 L320 308" stroke="#2563eb" strokeWidth={3} fill="none" markerEnd="url(#azul)" />
          <path d="M360 250 L455 250" stroke="#dc2626" strokeWidth={3} fill="none" markerEnd="url(#verm)" />
          <path d="M200 306 L180 486" stroke="#dc2626" strokeWidth={3} fill="none" markerEnd="url(#verm)" />
          <path d="M200 608 L200 634" stroke="#dc2626" strokeWidth={3} fill="none" markerEnd="url(#verm)" />

          {/* Ícones de risco */}
          {RISCOS.map(r => Icon(r))}
        </svg>
      </div>

      {/* Legenda abaixo do mapa */}
      <div className="card">
        <div className="card-title mb-3">Legenda</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px 18px' }}>
          {[
            { ic: '☣️', cor: '#b91c1c', t: 'Risco Biológico Crítico' },
            { ic: '⚗️', cor: '#b91c1c', t: 'Risco Químico Crítico' },
            { ic: '⚗️', cor: '#ef4444', t: 'Risco Químico Alto' },
            { ic: '☣️', cor: '#ef4444', t: 'Risco Biológico Alto' },
            { ic: '🌡️', cor: '#ef4444', t: 'Risco Físico Alto' },
            { ic: '🌡️', cor: '#eab308', t: 'Risco Físico Moderado' },
            { ic: '🏋️', cor: '#eab308', t: 'Risco Ergonômico Moderado' },
            { ic: '☣️', cor: '#eab308', t: 'Risco Biológico Moderado' },
            { ic: '⚠️', cor: '#ef4444', t: 'Risco de Acidente Alto' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: `2.5px solid ${l.cor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{l.ic}</span>
              <span style={{ fontSize: 11.5, color: '#475569', fontWeight: 600 }}>{l.t}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="34" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#2563eb" strokeWidth="3" /><polygon points="26,1 34,5 26,9" fill="#2563eb" /></svg>
            <span style={{ fontSize: 11.5, color: '#475569' }}>Fluxo limpo (pessoas e materiais)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <svg width="34" height="10"><line x1="0" y1="5" x2="26" y2="5" stroke="#dc2626" strokeWidth="3" /><polygon points="26,1 34,5 26,9" fill="#dc2626" /></svg>
            <span style={{ fontSize: 11.5, color: '#475569' }}>Fluxo contaminado de materiais</span>
          </div>
        </div>
      </div>

      {/* Inventário */}
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
