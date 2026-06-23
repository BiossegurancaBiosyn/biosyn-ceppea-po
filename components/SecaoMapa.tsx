'use client'
import { useCaderno } from '@/lib/caderno'

export default function SecaoMapa() {
  const { goTo } = useCaderno()
  const pessoa = (id: string) => goTo('equipe', { tipo: 'pessoa', id })
  const equip = (id: string) => goTo('equipamentos', { tipo: 'equip', id })

  const fig = (x: number, y: number, cor: string, lbl: string, id: string, fl?: boolean) => (
    <g onClick={() => pessoa(id)} className={`map-click${fl ? ' floating' : ''}`}>
      {fl && <circle cx={x} cy={y + 15} r={23} fill="none" stroke={cor} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.45} className="pulse-ring" />}
      <ellipse cx={x} cy={y + 34} rx={9} ry={2.5} fill="rgba(0,0,0,.08)" />
      <path d={`M${x - 9},${y + 15} Q${x - 11},${y + 32} ${x},${y + 33} Q${x + 11},${y + 32} ${x + 9},${y + 15}`} fill={cor} />
      <circle cx={x} cy={y + 7} r={9} fill={cor} />
      <rect x={x - 29} y={y - 15} width={58} height={16} rx={6} fill="#fff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.14))' }} />
      <text x={x} y={y - 3.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={cor}>{lbl}</text>
      {fl && <text x={x} y={y + 50} textAnchor="middle" fontSize={7.5} fill={cor} fontWeight={600}>👷 flutuante</text>}
    </g>
  )
  const box = (x: number, y: number, w: number, h: number, l: string, s: string, at: boolean, id: string, fill = '#fff4e3') => (
    <g onClick={() => equip(id)} className="map-click">
      <rect x={x} y={y} width={w} height={h} rx={9} fill={fill} stroke={at ? '#f59e0b' : '#cbd5e1'} strokeWidth={at ? 1.8 : 1.3} />
      <text x={x + w / 2} y={y + h / 2 - (s ? 5 : 0)} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#374151">{l}</text>
      {s && <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fontSize={8} fill="#94a3b8">{s}</text>}
      {at && <text x={x + w - 10} y={y + 13} fontSize={11} fill="#f59e0b">⚠</text>}
    </g>
  )
  const furn = (x: number, y: number, w: number, h: number, t: string, vert?: boolean) => (
    <g><rect x={x} y={y} width={w} height={h} rx={6} fill="#eef2f7" stroke="#dbe3ec" />
      <text x={x + w / 2} y={y + h / 2 + (vert ? 0 : 3)} textAnchor="middle" fontSize={8} fill="#94a3b8" transform={vert ? `rotate(-90 ${x + w / 2} ${y + h / 2})` : undefined}>{t}</text></g>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Mapa do Setor</h2>
        <p className="section-sub">Planta baixa · clique nos colaboradores (ficha + impacto) ou equipamentos (ficha técnica)</p>
      </div>
      <div className="card" style={{ padding: 16, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 980 600" style={{ width: '100%', minWidth: 620, height: 'auto', display: 'block', fontFamily: 'var(--font-inter)' }}>
            <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><polygon points="0 0,8 4,0 8" fill="#94a3b8" /></marker></defs>
            <rect x={8} y={8} width={964} height={584} rx={12} fill="#fbfcfe" stroke="#cbd5e1" strokeWidth={2} />
            <text x={490} y={32} textAnchor="middle" fontSize={12} fontWeight={800} fill="#173a7a" letterSpacing=".03em">SETOR PÓ · PLANTA BAIXA</text>
            <rect x={8} y={250} width={11} height={62} rx={3} fill="#f9a8c4" stroke="#ec4899" opacity={0.75} /><text x={26} y={284} fontSize={7} fill="#db2777" fontWeight={700}>ENTRADA</text>
            {furn(150, 40, 170, 36, 'Armário de utensílios de limpeza')}
            {furn(60, 150, 16, 230, 'Mesa de rotulagem das embalagens', true)}
            {box(150, 200, 84, 46, 'Balança', '50/100 kg', false, 'EQ-006')}
            {box(150, 270, 84, 46, 'Seladora', 'manual', false, 'EQ-008')}
            <rect x={544} y={170} width={15} height={210} rx={4} fill="#dde5ee" stroke="#bcc8d6" /><text x={551} y={275} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#8aa0b8" transform="rotate(-90 551 275)">PIA DE HIGIENIZAÇÃO</text>
            <rect x={588} y={92} width={372} height={372} rx={11} fill="#fbe4c6" stroke="#f0a050" strokeWidth={1.5} /><text x={774} y={452} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#b45309">Área de misturadores, envase e pesagem</text>
            {box(612, 116, 148, 78, 'Misturador 1', '500 kg · 4 lotes/dia', true, 'EQ-001')}
            {box(776, 116, 160, 78, 'Misturador 2', '500 kg · 4 lotes/dia', true, 'EQ-002')}
            {box(612, 214, 148, 78, 'Misturador 3', '3 lotes/dia', true, 'EQ-003')}
            {box(776, 214, 160, 78, 'Elevador', 'abastecimento', false, 'EQ-013', '#fde9cf')}
            <g onClick={() => goTo('producao')} className="map-click">
              <rect x={690} y={320} width={150} height={48} rx={9} fill="#fde9cf" stroke="#f0a050" />
              <text x={765} y={342} textAnchor="middle" fontSize={10} fontWeight={700} fill="#374151">Envase</text>
              <text x={765} y={356} textAnchor="middle" fontSize={8} fill="#94a3b8">gargalo · ver Produção</text>
              <text x={663} y={350} textAnchor="middle" fontSize={20} fontWeight={900} fill="#dc2626">✕</text>
            </g>
            {box(612, 388, 228, 48, 'Misturador Y', 'Personalize / Big Bag', false, 'EQ-004', '#fde9cf')}
            {furn(400, 470, 120, 42, 'Mesa de apoio')}
            {furn(40, 500, 150, 48, 'Armário utensílios e EPIs')}
            {furn(205, 500, 110, 48, 'Armz. streches')}
            <path d="M244 223 L543 223" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M686 194 L686 214" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M765 292 L765 320" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            {fig(576, 130, '#16a34a', 'Warlysson · Sr', 'WP')}
            {fig(576, 235, '#7c3aed', 'Juan · Jr', 'JR')}
            {fig(905, 330, '#2f6fc0', 'Lucas · Jr', 'LM')}
            {fig(115, 300, '#2563eb', 'João · Jr', 'JC')}
            {fig(400, 250, '#f59e0b', 'Gilson · Téc.', 'GP', true)}
            <rect x={40} y={120} width={185} height={84} rx={9} fill="#fff" stroke="#e2e8f0" />
            <text x={52} y={138} fontSize={8} fontWeight={700} fill="#173a7a" letterSpacing=".05em">LEGENDA · EQUIPE</text>
            {[['#16a34a', 'Warlysson · Operador Sr.'], ['#2f6fc0', 'Lucas · Operador Jr.'], ['#7c3aed', 'Juan · Operador Jr.'], ['#2563eb', 'João · Operador Jr.'], ['#f59e0b', 'Gilson · Técnico (flutuante)']].map((l, i) => (
              <g key={i}><circle cx={54} cy={152 + i * 11} r={3.5} fill={l[0]} /><text x={64} y={155 + i * 11} fontSize={7.5} fill="#64748b">{l[1]}</text></g>
            ))}
          </svg>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>💡 Para a fábrica: cada colaborador mostra o que faz e quanto produz. Custos aparecem apenas na Visão Gestão.</p>
      </div>
    </div>
  )
}
