'use client'
import { useCaderno } from '@/lib/caderno'
import { EQUIPAMENTOS } from '@/data/ceppea-po'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const TT = { borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)', fontSize: 12, fontFamily: 'var(--font-inter)' }

export default function SecaoVisaoGeral({ metaSOP }: { metaSOP: boolean }) {
  const { custos, capacidadeMes, data, verCustos, goTo } = useCaderno()
  const prod = data.producao
  const { total, porCx } = custos(metaSOP)

  const okN = EQUIPAMENTOS.filter(e => e.status === 'ok').length
  const atN = EQUIPAMENTOS.length - okN

  const barCap = [
    { name: 'Capacidade', v: capacidadeMes, fill: '#173a7a' },
    { name: 'Meta S&OP', v: prod.metaSOP, fill: '#16a34a' },
    { name: 'Realizado', v: prod.mesAnteriorRealizado, fill: '#f59e0b' },
  ]
  const barMix = [
    { name: 'Mist. 1', v: 4, fill: '#173a7a' }, { name: 'Mist. 2', v: 4, fill: '#1e4fa0' },
    { name: 'Mist. 3', v: 3, fill: '#2f6fc0' }, { name: 'Mist. Y', v: 2, fill: '#5b9bd5' }, { name: 'Emb.', v: 3, fill: '#7ab8e8' },
  ]
  const pieEq = [{ name: 'Operacionais', value: okN, fill: '#16a34a' }, { name: 'Em atenção', value: atN, fill: '#f59e0b' }]
  const pieCusto = [{ name: 'RH', value: custos(metaSOP).rh, fill: '#173a7a' }, { name: 'USE', value: data.useMes, fill: '#2f6fc0' }, { name: 'Manutenção', value: data.manutMes, fill: '#7ab8e8' }]

  const kpis = [
    { icon: '🎯', label: 'OEE estimado', value: '52%', cor: '#f59e0b', bg: '#fef9c3', go: 'producao' as const },
    { icon: '📦', label: 'Capacidade/dia', value: `${prod.capacidadeDia} cx`, cor: '#15803d', bg: '#dcfce7', go: 'producao' as const },
    { icon: '🏭', label: 'Equipamentos', value: `${EQUIPAMENTOS.length}`, cor: '#c2410c', bg: '#ffedd5', go: 'equipamentos' as const },
    { icon: '🗂️', label: 'Lotes/mês', value: '112', cor: '#2f6fc0', bg: '#dbeafe', go: 'producao' as const },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Visão Geral</h2>
        <p className="section-sub">Panorama do setor Pó · {data.creditos.mesRef} · clique nos cards e gráficos para abrir o detalhe</p>
      </div>

      {/* KPIs operacionais (sem valores R$) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {kpis.map(k => (
          <div key={k.label} className="card clickable" onClick={() => goTo(k.go)} style={{ minHeight: 120 }}>
            <span className="tap-hint">›</span>
            <div className="ic icon-box-md" style={{ background: k.bg, fontSize: 20 }}>{k.icon}</div>
            <div className="kpi" style={{ color: k.cor, marginTop: 12 }}>{k.value}</div>
            <div className="label-xs" style={{ marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos (foco) */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card clickable" onClick={() => goTo('producao')}>
          <span className="tap-hint">›</span>
          <div className="card-title mb-4">📊 Capacidade vs Meta vs Realizado (cx/mês)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barCap} margin={{ top: 4, right: 8, left: -8, bottom: 4 }} barSize={44}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TT} formatter={(v: number) => [v.toLocaleString('pt-BR') + ' cx', '']} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="v" radius={[8, 8, 0, 0]}>{barCap.map((d, i) => <Cell key={i} fill={d.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card clickable" onClick={() => goTo('producao')}>
          <span className="tap-hint">›</span>
          <div className="card-title mb-4">🏭 Lotes/dia por equipamento</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barMix} margin={{ top: 4, right: 8, left: -8, bottom: 4 }} barSize={30}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 6]} />
              <Tooltip contentStyle={TT} formatter={(v: number) => [v + ' lotes/dia', '']} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="v" radius={[7, 7, 0, 0]}>{barMix.map((d, i) => <Cell key={i} fill={d.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card clickable" onClick={() => goTo('equipamentos')} style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="tap-hint">›</span>
          <div className="card-title mb-1">⚙️ Status dos equipamentos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <ResponsiveContainer width="60%" height={170}>
              <PieChart>
                <Pie data={pieEq} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">{pieEq.map((d, i) => <Cell key={i} fill={d.fill} />)}</Pie>
                <Tooltip contentStyle={TT} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#15803d' }} className="font-head">{okN}</div>
              <div className="label-xs">Operacionais</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#f59e0b', marginTop: 8 }} className="font-head">{atN}</div>
              <div className="label-xs">Em atenção</div>
            </div>
          </div>
        </div>

        {verCustos ? (
          <div className="card clickable" onClick={() => goTo('custos')}>
            <span className="tap-hint">›</span>
            <div className="card-title mb-1">🍩 Composição de Custos</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Total: {brl(total)}/mês · {brl(porCx)}/caixa</div>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={pieCusto} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">{pieCusto.map((d, i) => <Cell key={i} fill={d.fill} />)}</Pie>
                <Tooltip contentStyle={TT} formatter={(v: number) => [brl(v), '']} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 220 }}>
            <div style={{ fontSize: 32 }}>🔒</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginTop: 8 }}>Composição de custos</div>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, maxWidth: 220 }}>Dados financeiros visíveis apenas na Visão Gestão (botão 🔒 Custos no topo).</p>
          </div>
        )}
      </div>

      {/* Alertas */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {[
          { cor: '#dc2626', icon: '⚠️', t: 'Déficit de Produção', d: 'Análise nov/2025: realizado 140 cx/dia vs meta 240 cx/dia — déficit de 100 cx/dia.', go: 'producao' as const },
          { cor: '#f59e0b', icon: '⚙️', t: 'Misturadores em Atenção', d: 'Misturadores 1, 2 e 3 aguardando avaliação. Preventiva pausa ~280 cx/dia.', go: 'manutencao' as const },
          { cor: '#16a34a', icon: '✅', t: 'Folga de Capacidade', d: `Capacidade ${capacidadeMes.toLocaleString('pt-BR')} vs meta ${prod.metaSOP.toLocaleString('pt-BR')} cx/mês.`, go: 'producao' as const },
        ].map(a => (
          <div key={a.t} className="card clickable" onClick={() => goTo(a.go)} style={{ borderLeft: `4px solid ${a.cor}`, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ fontSize: 16 }}>{a.icon}</span><span style={{ fontWeight: 700, fontSize: 13, color: a.cor }}>{a.t}</span></div>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{a.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
