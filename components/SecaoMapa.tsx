'use client'
import { useState } from 'react'
import Modal from './Modal'
import { useCaderno } from '@/lib/caderno'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type ModalData =
  | { type: 'pessoa'; id: string }
  | { type: 'eq'; nome: string; status: string; cap: string; resp: string; manut: string }
  | { type: 'atencao' }

function PersonFigure({ x, y, cor, label, id, flutuante, onClick }:
  { x:number; y:number; cor:string; label:string; id:string; flutuante?:boolean; onClick:(id:string)=>void }) {
  return (
    <g onClick={() => onClick(id)} className={`map-click${flutuante ? ' floating' : ''}`}>
      {flutuante && (
        <>
          <circle cx={x} cy={y+15} r={23} fill="none" stroke={cor} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.45} className="pulse-ring" />
          <circle cx={x} cy={y+15} r={23} fill="none" stroke={cor} strokeWidth={1.3} strokeDasharray="5 3" opacity={0.3} />
        </>
      )}
      <ellipse cx={x} cy={y+34} rx={9} ry={2.5} fill="rgba(0,0,0,.08)" />
      <path d={`M${x-9},${y+15} Q${x-11},${y+32} ${x},${y+33} Q${x+11},${y+32} ${x+9},${y+15}`} fill={cor} opacity={0.92} />
      <circle cx={x} cy={y+7} r={9} fill={cor} />
      <rect x={x-29} y={y-15} width={58} height={16} rx={6} fill="white" style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,.14))' }} />
      <text x={x} y={y-3.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={cor}>{label}</text>
      {flutuante && <text x={x} y={y+50} textAnchor="middle" fontSize={7.5} fill={cor} fontWeight={600}>👷 flutuante</text>}
    </g>
  )
}

function EqBox({ x, y, w, h, label, sub, status, onClick, fill='#fff4e3' }:
  { x:number; y:number; w:number; h:number; label:string; sub?:string; status:'ok'|'atencao'; onClick:()=>void; fill?:string }) {
  return (
    <g onClick={onClick} className="map-click">
      <rect x={x} y={y} width={w} height={h} rx={9} fill={fill}
        stroke={status === 'atencao' ? '#f59e0b' : '#cbd5e1'} strokeWidth={status === 'atencao' ? 1.8 : 1.3} />
      <text x={x+w/2} y={y+h/2-(sub?5:0)} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#374151">{label}</text>
      {sub && <text x={x+w/2} y={y+h/2+9} textAnchor="middle" fontSize={8} fill="#94a3b8">{sub}</text>}
      {status === 'atencao' && <text x={x+w-10} y={y+13} fontSize={11} fill="#f59e0b">⚠</text>}
    </g>
  )
}

function Furniture({ x, y, w, h, label, vertical }:
  { x:number; y:number; w:number; h:number; label:string; vertical?:boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#eef2f7" stroke="#dbe3ec" strokeWidth={1} />
      {vertical
        ? <text x={x+w/2} y={y+h/2} textAnchor="middle" fontSize={8} fill="#94a3b8" transform={`rotate(-90 ${x+w/2} ${y+h/2})`}>{label}</text>
        : <text x={x+w/2} y={y+h/2+3} textAnchor="middle" fontSize={8} fill="#94a3b8">{label}</text>}
    </g>
  )
}

export default function SecaoMapa() {
  const { data, rhBase } = useCaderno()
  const RH_BASE = rhBase
  const [modal, setModal] = useState<ModalData | null>(null)
  const openPessoa = (id: string) => setModal({ type: 'pessoa', id })
  const openEq = (nome: string, status: string, cap: string, resp: string, manut: string) =>
    setModal({ type: 'eq', nome, status, cap, resp, manut })
  const pessoa = modal?.type === 'pessoa' ? data.equipe.find(e => e.id === modal.id) : null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Mapa do Setor</h2>
        <p className="section-sub">Planta baixa interativa · clique nos equipamentos e colaboradores para detalhes</p>
      </div>

      <div className="card" style={{ padding: 16, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 980 600" style={{ width:'100%', minWidth:620, height:'auto', display:'block', fontFamily:'var(--font-inter)' }}>
            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <polygon points="0 0,8 4,0 8" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Parede externa */}
            <rect x={8} y={8} width={964} height={584} rx={12} fill="#fbfcfe" stroke="#cbd5e1" strokeWidth={2} />
            <text x={490} y={32} textAnchor="middle" fontSize={12} fontWeight={800} fill="#173a7a" letterSpacing=".03em">
              SETOR PÓ · PLANTA BAIXA
            </text>

            {/* ─── Portas / acessos (rosa) ─── */}
            <rect x={8} y={250} width={11} height={62} rx={3} fill="#f9a8c4" stroke="#ec4899" strokeWidth={1} opacity={0.75} />
            <text x={26} y={284} fontSize={7} fill="#db2777" fontWeight={700}>ENTRADA</text>
            <rect x={300} y={8} width={70} height={11} rx={3} fill="#f9a8c4" stroke="#ec4899" strokeWidth={1} opacity={0.6} />
            <rect x={476} y={581} width={80} height={11} rx={3} fill="#f9a8c4" stroke="#ec4899" strokeWidth={1} opacity={0.6} />

            {/* ─── Armário utensílios de limpeza (topo) ─── */}
            <Furniture x={150} y={40} w={170} h={36} label="Armário de utensílios de limpeza" />

            {/* ─── Mesa de rotulagem das embalagens (esquerda) ─── */}
            <Furniture x={60} y={150} w={16} h={230} label="Mesa de rotulagem das embalagens" vertical />

            {/* ─── Balança + Seladora (centro-esquerda, empilhados) ─── */}
            <EqBox x={150} y={200} w={84} h={46} label="Balança" sub="50/100 kg" status="ok" fill="#fff4e3"
              onClick={() => openEq('Balanças Digitais','ok','50 / 100 kg','Gilson','Calibração terceirizada')} />
            <EqBox x={150} y={270} w={84} h={46} label="Seladora" sub="manual" status="ok" fill="#fff4e3"
              onClick={() => openEq('Seladora','ok','—','João','a informar')} />

            {/* ─── Pia de higienização (MENOR, divisor central) ─── */}
            <rect x={544} y={170} width={15} height={210} rx={4} fill="#dde5ee" stroke="#bcc8d6" strokeWidth={1} />
            <text x={551.5} y={275} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#8aa0b8" transform="rotate(-90 551.5 275)">PIA DE HIGIENIZAÇÃO</text>

            {/* ─── Área de misturadores (MENOR, laranja, direita) ─── */}
            <rect x={588} y={92} width={372} height={372} rx={11} fill="#fbe4c6" stroke="#f0a050" strokeWidth={1.5} />
            <text x={774} y={452} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#b45309" letterSpacing=".02em">
              Área de misturadores, envase e pesagem
            </text>

            {/* Misturador 1 (topo-esq) — 500 kg */}
            <EqBox x={612} y={116} w={148} h={78} label="Misturador 1" sub="500 kg · 4 lotes/dia" status="atencao"
              onClick={() => openEq('Misturador 1','atencao','500 kg','Warlysson','Mensal')} />
            {/* Misturador 2 (topo-dir) — 500 kg */}
            <EqBox x={776} y={116} w={160} h={78} label="Misturador 2" sub="500 kg · 4 lotes/dia" status="atencao"
              onClick={() => openEq('Misturador 2','atencao','500 kg','Warlysson','Mensal')} />
            {/* Misturador 3 (baixo-esq, à frente do Mist.1) */}
            <EqBox x={612} y={214} w={148} h={78} label="Misturador 3" sub="3 lotes/dia" status="atencao"
              onClick={() => openEq('Misturador 3','atencao','n/inf','Lucas','Mensal')} />
            {/* Elevador (baixo-dir, ao lado do Mist.3) */}
            <EqBox x={776} y={214} w={160} h={78} label="Elevador" sub="abastecimento" status="ok" fill="#fde9cf"
              onClick={() => openEq('Elevador de Abastecimento','ok','—','João','a informar')} />

            {/* Envase + X vermelho (gargalo) */}
            <g onClick={() => setModal({ type: 'atencao' })} className="map-click">
              <rect x={690} y={320} width={150} height={48} rx={9} fill="#fde9cf" stroke="#f0a050" strokeWidth={1.3} />
              <text x={765} y={342} textAnchor="middle" fontSize={10} fontWeight={700} fill="#374151">Envase</text>
              <text x={765} y={356} textAnchor="middle" fontSize={8} fill="#94a3b8">Envasadora de Pós</text>
              <text x={663} y={350} textAnchor="middle" fontSize={20} fontWeight={900} fill="#dc2626">✕</text>
            </g>
            {/* Misturador Y (Personalize/Big Bag) */}
            <EqBox x={612} y={388} w={228} h={48} label="Misturador Y" sub="Personalize / Big Bag" status="ok" fill="#fde9cf"
              onClick={() => openEq('Misturador Y','ok','—','Juan','Mensal')} />

            {/* ─── Mesa de apoio (não usar; ao lado direito-baixo fora da área) ─── */}
            {/* (a área cobre quase tudo à direita; mesa de apoio à esquerda-baixo da pia) */}
            <Furniture x={400} y={470} w={120} h={42} label="Mesa de apoio" />

            {/* ─── Armários inferiores (esquerda) ─── */}
            <Furniture x={40} y={500} w={150} h={48} label="Armário de utensílios e EPIs" />
            <Furniture x={205} y={500} w={110} h={48} label="Armz. streches" />

            {/* ─── Setas de fluxo animadas ─── */}
            <path d="M 244 223 L 543 223" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M 686 194 L 686 214" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M 765 292 L 765 320" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />
            <path d="M 686 368 L 686 388" stroke="#94a3b8" strokeWidth={1.6} fill="none" markerEnd="url(#arr)" strokeDasharray="7 4" className="flow-arrow" />

            {/* ─── Bonecos ─── */}
            <PersonFigure x={576} y={130} cor="#16a34a" id="WP" label="Warlysson · Sr" onClick={openPessoa} />
            <PersonFigure x={576} y={235} cor="#7c3aed" id="JR" label="Juan · Jr" onClick={openPessoa} />
            <PersonFigure x={905} y={330} cor="#2f6fc0" id="LM" label="Lucas · Jr" onClick={openPessoa} />
            <PersonFigure x={115} y={300} cor="#2563eb" id="JC" label="João · Jr" onClick={openPessoa} />
            <PersonFigure x={400} y={250} cor="#f59e0b" id="GP" label="Gilson · Técnico" onClick={openPessoa} flutuante />

            {/* ─── Legenda ─── */}
            <rect x={40} y={120} width={185} height={84} rx={9} fill="white" stroke="#e2e8f0" strokeWidth={1} />
            <text x={52} y={138} fontSize={8} fontWeight={700} fill="#173a7a" letterSpacing=".05em">LEGENDA · EQUIPE</text>
            {[
              { cor:'#16a34a', lbl:'Warlysson · Operador Sr.' },
              { cor:'#2f6fc0', lbl:'Lucas · Operador Jr.' },
              { cor:'#7c3aed', lbl:'Juan · Operador Jr.' },
              { cor:'#2563eb', lbl:'João · Operador Jr.' },
              { cor:'#f59e0b', lbl:'Gilson · Técnico (flutuante)' },
            ].map((l, i) => (
              <g key={i}>
                <circle cx={54} cy={152+i*11} r={3.5} fill={l.cor} />
                <text x={64} y={155+i*11} fontSize={7.5} fill="#64748b">{l.lbl}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Modal Pessoa (formato limpo) */}
      {modal?.type === 'pessoa' && pessoa && (
        <Modal onClose={() => setModal(null)}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width:54, height:54, borderRadius:'50%', background:pessoa.cor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, fontWeight:800, color:'#fff', flexShrink:0 }}>
              {pessoa.iniciais}
            </div>
            <div>
              <div className="font-head" style={{ fontSize:18, fontWeight:800, color:'#173a7a', letterSpacing:'-.02em' }}>{pessoa.nome}</div>
              <div style={{ fontSize:12.5, color:'#94a3b8', marginTop:2 }}>{pessoa.cargo} · {pessoa.nivel}</div>
            </div>
          </div>

          {pessoa.flutuante && (
            <div style={{ display:'flex', gap:10, padding:'13px 15px', borderRadius:13, background:'#eff6ff', marginBottom:16, borderLeft:'3px solid #2f6fc0' }}>
              <span style={{ fontSize:18 }}>🛟</span>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'#1e40af' }}>Função flutuante</div>
                <p style={{ fontSize:12, color:'#475569', lineHeight:1.6, marginTop:2 }}>
                  Não entra diretamente na linha — circula garantindo qualidade, entrando na operação apenas quando necessário.
                </p>
              </div>
            </div>
          )}

          <div>
            {[
              { l:'Turno',            v: pessoa.turno },
              { l:'Área de atuação',  v: pessoa.area },
              { l:'Custo total/mês',  v: pessoa.custoTotal ? brl(pessoa.custoTotal) : 'Não alocado ao setor', hl:true },
              { l:'Custo hora-homem', v: pessoa.horaHomem ? `R$ ${pessoa.horaHomem.toFixed(2).replace('.',',')}` : '—' },
              { l:'Líquido (ref.)',   v: pessoa.liquido ? brl(pessoa.liquido) : '—' },
              { l:'% do RH do setor', v: pessoa.custoTotal ? `${((pessoa.custoTotal/RH_BASE)*100).toFixed(1)}%` : '—' },
              { l:'Bônus meta S&OP',  v: pessoa.bonus ? brl(pessoa.bonus) : '—' },
            ].map((r, i, arr) => (
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom: i<arr.length-1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize:13, color:'#64748b' }}>{r.l}</span>
                <span style={{ fontSize:14, fontWeight:700, color: r.hl ? '#173a7a' : '#1e293b' }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop:14 }}>
            <div className="label-xs" style={{ marginBottom:6 }}>Responsabilidades</div>
            <p style={{ fontSize:12.5, color:'#64748b', lineHeight:1.7 }}>{pessoa.atuacaoProcesso}</p>
            <ul style={{ fontSize:12, color:'#64748b', lineHeight:1.85, marginTop:6 }}>
              {pessoa.responsabilidades.map(r => <li key={r}>• {r}</li>)}
            </ul>
          </div>
        </Modal>
      )}

      {/* Modal Equipamento */}
      {modal?.type === 'eq' && (
        <Modal title={modal.nome} onClose={() => setModal(null)}>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <span className={`badge ${modal.status === 'atencao' ? 'badge-yellow' : 'badge-green'}`}>
              {modal.status === 'atencao' ? '⚠ Atenção' : '✓ Operacional'}
            </span>
          </div>
          {[
            { l:'Capacidade', v: modal.cap },
            { l:'Responsável', v: modal.resp },
            { l:'Manutenção preventiva', v: modal.manut },
          ].map((r, i, arr) => (
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom: i<arr.length-1?'1px solid #f1f5f9':'none', fontSize:13 }}>
              <span style={{ color:'#64748b' }}>{r.l}</span>
              <span style={{ fontWeight:700, color:'#1e293b' }}>
                {r.v === 'a informar' ? <span className="a-informar">a informar</span> : r.v === '—' ? <span style={{color:'#cbd5e1'}}>—</span> : r.v}
              </span>
            </div>
          ))}
        </Modal>
      )}

      {/* Modal Gargalo */}
      {modal?.type === 'atencao' && (
        <Modal title="⚠️ Gargalo — Área de Envase" onClose={() => setModal(null)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {[
              {l:'Realizado', v:'140 cx/dia', cor:'#dc2626'},
              {l:'Meta',      v:'240 cx/dia', cor:'#16a34a'},
              {l:'Déficit',   v:'100 cx/dia', cor:'#dc2626'},
              {l:'OEE Perf.', v:'58,3%',      cor:'#f59e0b'},
            ].map(k => (
              <div key={k.l} style={{ padding:'13px', borderRadius:12, background:'#f8fafc' }}>
                <div className="label-xs">{k.l}</div>
                <div className="font-head" style={{ fontSize:19, fontWeight:800, color:k.cor, marginTop:3 }}>{k.v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'13px 15px', borderRadius:13, background:'#fef9c3', border:'1px solid #fde047', fontSize:12, color:'#713f12', lineHeight:1.7 }}>
            <strong>Ação recomendada:</strong> levantar causas raiz do baixo desempenho de performance e revisar o cronograma de lotes/dia.
          </div>
        </Modal>
      )}
    </div>
  )
}
