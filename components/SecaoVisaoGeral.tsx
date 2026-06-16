'use client'
import { useState } from 'react'
import { PARAMS } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import InfoModal, { type InfoRow } from './InfoModal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const TOOLTIP_STYLE = { borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)', fontSize: 12, fontFamily: 'var(--font-inter)' }

function OEEGauge({ value }: { value: number }) {
  const r = 64, cx = 80, cy = 80
  const circ = 2 * Math.PI * r
  const color = value >= 70 ? '#16a34a' : value >= 50 ? '#f59e0b' : '#dc2626'
  const dash = (value / 100) * circ * 0.75
  return (
    <svg width={160} height={110} viewBox="0 0 160 110" style={{ fontFamily: 'var(--font-display)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={12} strokeDasharray={`${circ * .75} ${circ}`} strokeDashoffset={circ * .125} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={12} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * .125} strokeLinecap="round" style={{ transition: 'stroke-dasharray .8s ease', filter: `drop-shadow(0 0 6px ${color}55)` }} />
      <text x={cx} y={cy + 2} textAnchor="middle" fontSize={28} fontWeight={800} fill={color}>{value}%</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize={9} fill="#94a3b8" letterSpacing="1">OEE ESTIMADO</text>
    </svg>
  )
}

type ModalKey = string
interface ModalDef { title: string; sub?: string; icon: string; accent: string; rows: InfoRow[]; note?: string }

export default function SecaoVisaoGeral({ metaSOP }: { metaSOP: boolean }) {
  const { custos, rhBase, rhComBonus, capacidadeMes, data } = useCaderno()
  const { rh, total, porCx, porLote } = custos(metaSOP)
  const [modal, setModal] = useState<ModalDef | null>(null)

  const MODALS: Record<ModalKey, ModalDef> = {
    oee: {
      title: 'OEE — Eficiência Global', sub: 'Overall Equipment Effectiveness', icon: '🎯', accent: '#f59e0b',
      rows: [
        { label: 'OEE estimado', value: '52%', highlight: true },
        { label: 'Disponibilidade', value: '93,8%' },
        { label: 'Performance', value: '58,3%' },
        { label: 'Qualidade', value: '96,0%' },
      ],
      note: 'OEE = Disponibilidade × Performance × Qualidade. O principal ponto de melhoria é a Performance (58,3%), reflexo do gargalo de envase. Valor estimado — atualizar com apontamentos reais.',
    },
    rh: {
      title: 'Custo de RH', sub: 'Folha mensal do setor Pó', icon: '👥', accent: '#173a7a',
      rows: [
        { label: 'RH base/mês', value: brl(rhBase), highlight: true },
        { label: 'RH com bônus S&OP', value: brl(rhComBonus) },
        { label: 'Colaboradores alocados', value: `${data.equipe.filter(c=>!c.naoAlocado&&c.custoTotal).length}` },
        { label: 'Não alocados ao setor', value: 'Coordenador + Líder' },
        { label: 'Custo/caixa (RH)', value: brl(rh / (capacidadeMes||1)) },
      ],
      note: 'Rafael (Coordenador Geral) e Lúcia (Líder) não têm custo alocado ao setor Pó — atuam em toda a indústria.',
    },
    cap: {
      title: 'Capacidade Produtiva', sub: 'Instalada vs realizada', icon: '📦', accent: '#15803d',
      rows: [
        { label: 'Capacidade/dia', value: '280 cx', highlight: true },
        { label: 'Capacidade/mês', value: '4.480 cx' },
        { label: 'Meta S&OP/mês', value: '3.000 cx' },
        { label: 'Realizado (ref.)', value: '140 cx/dia' },
        { label: 'Folga vs meta', value: '+1.480 cx/mês' },
      ],
      note: '7 lotes/dia × 40 cx × 16 dias úteis = 4.480 cx/mês. Há folga sobre a meta S&OP, porém o realizado de nov/2025 ficou abaixo do potencial.',
    },
    eq: {
      title: 'Equipamentos', sub: '17 ativos do setor', icon: '🏭', accent: '#c2410c',
      rows: [
        { label: 'Total de equipamentos', value: '17', highlight: true },
        { label: 'Operacionais', value: '14' },
        { label: 'Em atenção', value: '3 (Misturadores 1, 2, 3)' },
        { label: 'Preventiva misturadores', value: 'Mensal' },
      ],
      note: 'Misturadores 1, 2 e 3 em status de atenção. A preventiva mensal (dia inteiro) pausa a produção em ~280 cx.',
    },
    porCx: {
      title: 'Custo por Caixa', sub: 'RH + USE + Manutenção', icon: '🪙', accent: '#173a7a',
      rows: [
        { label: 'Custo total/caixa', value: brl(porCx), highlight: true },
        { label: 'RH', value: metaSOP ? 'R$ 6,39' : 'R$ 5,34' },
        { label: 'USE', value: 'R$ 0,21' },
        { label: 'Manutenção', value: 'R$ 0,08' },
        { label: 'Base de cálculo', value: `${PARAMS.CX_MES.toLocaleString('pt-BR')} cx/mês` },
      ],
      note: 'Energia, hora-máquina e depreciação ainda não mensurados.',
    },
    porLote: {
      title: 'Custo por Lote', sub: `${PARAMS.LOTES_MES} lotes/mês`, icon: '🗂️', accent: '#173a7a',
      rows: [
        { label: 'Custo total/lote', value: brl(porLote), highlight: true },
        { label: 'Custo total/mês', value: brl(total) },
        { label: 'Lotes/mês', value: `${PARAMS.LOTES_MES}` },
        { label: 'Lotes/dia', value: '7' },
      ],
    },
    use: {
      title: 'Custo USE / Mês', sub: 'Biossegurança NB-2', icon: '🧪', accent: '#2f6fc0',
      rows: [
        { label: 'Total USE/mês', value: 'R$ 930,49', highlight: true },
        { label: 'Mão de obra (11h)', value: 'R$ 210,53' },
        { label: 'Materiais', value: 'R$ 719,96' },
        { label: 'Custo/caixa', value: 'R$ 0,21' },
      ],
      note: 'Liberação diária (swab ATP + visual) + limpeza úmida 2×/semana. EPIs não entram neste centro de custo.',
    },
    manut: {
      title: 'Manutenção / Mês', sub: 'Preventiva dos misturadores', icon: '🔧', accent: '#dc2626',
      rows: [
        { label: 'Custo preventiva/mês', value: 'R$ 359,81', highlight: true },
        { label: 'Equipe', value: '2 × Operador Pleno' },
        { label: 'Hora-homem', value: 'R$ 22,49/h' },
        { label: 'Parada mensal', value: '8h (1 dia)' },
        { label: 'Caixas não produzidas', value: '~280 cx' },
      ],
      note: 'Calibração de balanças é terceirizada. Peças e histórico: a informar.',
    },
  }

  const barData = [{ name: 'Capacidade', valor: capacidadeMes }, { name: 'Meta S&OP', valor: data.producao.metaSOP }, { name: 'Realizado*', valor: data.producao.mesAnteriorRealizado }]
  const pieData = [{ name: 'RH', value: rh }, { name: 'USE', value: 930.49 }, { name: 'Manutenção', value: 359.81 }]
  const PIE_COLORS = ['#173a7a', '#2f6fc0', '#7ab8e8']

  const open = (k: ModalKey) => setModal(MODALS[k])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Visão Geral · KPIs</h2>
        <p className="section-sub">Painel executivo do setor Pó · BioSyn Saúde Animal · Maio / 2026 · clique nos cards para detalhar</p>
      </div>

      {/* Row 1 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <div className="card clickable flex flex-col items-center justify-center" style={{ minHeight: 176 }} onClick={() => open('oee')}>
          <span className="tap-hint">›</span>
          <OEEGauge value={52} />
          <p style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>Disp. 93,8% × Perf. 58,3% × Qual. 96%</p>
        </div>

        <div className="card clickable flex flex-col justify-between" style={{ minHeight: 176 }} onClick={() => open('rh')}>
          <span className="tap-hint">›</span>
          <div className="flex items-start justify-between">
            <div className="icon-box icon-box-md" style={{ background: '#dbeafe', fontSize: 20 }}>👥</div>
            {metaSOP && <span className="badge badge-green" style={{ marginRight: 24 }}>+bônus</span>}
          </div>
          <div>
            <div className="kpi-value">{brl(rh)}</div>
            <div className="label-xs" style={{ marginTop: 5 }}>Custo RH / Mês</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>7 pessoas · 2 não alocadas (Coord.+Líder)</div>
          </div>
        </div>

        <div className="card clickable flex flex-col justify-between" style={{ minHeight: 176 }} onClick={() => open('cap')}>
          <span className="tap-hint">›</span>
          <div className="icon-box icon-box-md" style={{ background: '#dcfce7', fontSize: 20 }}>📦</div>
          <div>
            <div className="kpi-value" style={{ color: '#15803d' }}>280</div>
            <div className="label-xs" style={{ marginTop: 5 }}>Capacidade cx/dia</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>Meta S&OP 3.000 cx/mês · realizado 140 cx/dia</div>
          </div>
        </div>

        <div className="card clickable flex flex-col justify-between" style={{ minHeight: 176 }} onClick={() => open('eq')}>
          <span className="tap-hint">›</span>
          <div className="icon-box icon-box-md" style={{ background: '#ffedd5', fontSize: 20 }}>🏭</div>
          <div>
            <div className="kpi-value" style={{ color: '#c2410c' }}>17</div>
            <div className="label-xs" style={{ marginTop: 5 }}>Equipamentos</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>14 operacionais · 3 em atenção</div>
          </div>
        </div>
      </div>

      {/* Row 2 — mini cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { k: 'porCx',   icon: '🪙', label: 'Custo por Caixa', value: brl(porCx),   sub: 'RH+USE+Manut.', badge: `${PARAMS.CX_MES.toLocaleString('pt-BR')} CX`, bc: '#dbeafe', bt: '#1e40af', accent: '#16a34a' },
          { k: 'porLote', icon: '🗂️', label: 'Custo por Lote',  value: brl(porLote), sub: `${PARAMS.LOTES_MES} lotes/mês`, accent: '#2f6fc0' },
          { k: 'use',     icon: '🧪', label: 'Custo USE / Mês',  value: 'R$ 930,49',  sub: 'MO + materiais', accent: '#f59e0b' },
          { k: 'manut',   icon: '🔧', label: 'Manutenção / Mês', value: 'R$ 359,81',  sub: 'preventiva', badge: '8H PARADA', bc: '#fee2e2', bt: '#b91c1c', accent: '#dc2626' },
        ].map(c => (
          <div key={c.k} className="card clickable" style={{ padding: '16px 18px', borderLeft: `3px solid ${c.accent}` }} onClick={() => open(c.k)}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 17 }}>{c.icon}</span>
              {c.badge && <span className="badge" style={{ background: c.bc, color: c.bt, fontSize: 10 }}>{c.badge}</span>}
            </div>
            <div className="kpi-value-sm" style={{ color: '#173a7a' }}>{c.value}</div>
            <div className="label-xs" style={{ marginTop: 4 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card">
          <div className="card-title mb-4">📊 Capacidade vs Meta vs Realizado (mês)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -8, bottom: 4 }} barSize={42}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v.toLocaleString('pt-BR') + ' cx', '']} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}><Cell fill="#173a7a" /><Cell fill="#16a34a" /><Cell fill="#f59e0b" /></Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>* Recorde histórico nov/2025</p>
        </div>

        <div className="card">
          <div className="card-title mb-1">🍩 Composição de Custos do Setor</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Total: {brl(total)}/mês{metaSOP ? ' (c/ bônus S&OP)' : ''}</div>
          <ResponsiveContainer width="100%" height={195}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={85} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [brl(v), '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {[
          { cor: '#dc2626', tcor: '#dc2626', icon: '⚠️', title: 'Déficit de Produção', text: 'Análise nov/2025: realizado 140 cx/dia vs meta 240 cx/dia — déficit de 100 cx/dia.' },
          { cor: '#f59e0b', tcor: '#b45309', icon: '⚙️', title: 'Misturadores em Atenção', text: 'Misturadores 1, 2 e 3 aguardando avaliação. Preventiva mensal pausa ~280 cx/dia.' },
          { cor: '#16a34a', tcor: '#16a34a', icon: '✅', title: 'Folga de Capacidade', text: 'Capacidade 4.480 cx/mês vs meta S&OP 3.000 cx/mês. Folga de +1.480 cx.' },
        ].map(a => (
          <div key={a.title} className="card" style={{ borderLeft: `4px solid ${a.cor}`, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: a.tcor }}>{a.title}</span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{a.text}</p>
          </div>
        ))}
      </div>

      {modal && <InfoModal {...modal} onClose={() => setModal(null)} />}
    </div>
  )
}
