'use client'
import { useState } from 'react'
import { PARAMS, PRODUTOS } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import Modal from './Modal'

const TOOLTIP_STYLE = { borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)', fontSize: 12, fontFamily: 'var(--font-inter)' }

export default function SecaoProducao({ metaSOP }: { metaSOP: boolean }) {
  const { data, can, setProducao } = useCaderno()
  const prod = data.producao

  const [lotesDia, setLotesDia] = useState(7)
  const [cxLote, setCxLote] = useState(40)
  const [dias, setDias] = useState(prod.diasUteis)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(prod)

  const capacidadeMes = prod.capacidadeDia * prod.diasUteis
  const cxMes = lotesDia * cxLote * dias
  const folga = cxMes - prod.metaSOP
  const pctMeta = Math.min(Math.round((cxMes / prod.metaSOP) * 100), 200)

  const comparData = [
    { name: 'Capacidade', cx: capacidadeMes, fill: '#173a7a' },
    { name: 'Meta S&OP',  cx: prod.metaSOP, fill: '#16a34a' },
    { name: 'Calculado',  cx: cxMes, fill: folga >= 0 ? '#2f6fc0' : '#dc2626' },
    { name: 'Realizado',  cx: prod.mesAnteriorRealizado, fill: '#f59e0b' },
  ]
  const mixData = [
    { name: 'Mist. 1', lotes: 4, fill: '#173a7a' },
    { name: 'Mist. 2', lotes: 4, fill: '#1e4fa0' },
    { name: 'Mist. 3', lotes: 3, fill: '#2f6fc0' },
    { name: 'Mist. Y', lotes: 2, fill: '#5b9bd5' },
    { name: 'Embalagem', lotes: 3, fill: '#7ab8e8' },
  ]

  const salvar = () => { setProducao(form); setEditando(false) }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">Produção</h2>
          <p className="section-sub">Capacidade instalada, metas e simulador interativo · {data.creditos.mesRef}</p>
        </div>
        {can('processo') && (
          <button onClick={() => { setForm(prod); setEditando(true) }} className="no-print"
            style={{ padding: '8px 14px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            ✏️ Editar dados do mês
          </button>
        )}
      </div>

      {prod.obs && (
        <div className="card" style={{ padding: '12px 16px', borderLeft: '3px solid #5b9bd5', background: '#f8fafc' }}>
          <span className="label-xs">Observação do mês</span>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>{prod.obs}</p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {[
          { icon: '📦', label: 'Capacidade/dia', value: `${prod.capacidadeDia} cx`, cor: '#173a7a', bg: '#dbeafe' },
          { icon: '📊', label: 'Capacidade/mês', value: `${capacidadeMes.toLocaleString('pt-BR')} cx`, cor: '#173a7a', bg: '#dbeafe' },
          { icon: '🎯', label: 'Meta S&OP', value: `${prod.metaSOP.toLocaleString('pt-BR')} cx`, cor: '#15803d', bg: '#dcfce7' },
          { icon: '🏭', label: 'Lotes/mês', value: `${PARAMS.LOTES_MES}`, cor: '#2f6fc0', bg: '#e0f2fe' },
          { icon: '📅', label: 'Dias úteis', value: `${prod.diasUteis}`, cor: '#7c3aed', bg: '#ede9fe' },
          { icon: '⏱', label: 'Horas/mês', value: `${PARAMS.HORAS}h`, cor: '#64748b', bg: '#f1f5f9' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '16px' }}>
            <div className="icon-box icon-box-sm" style={{ background: k.bg, fontSize: 16, marginBottom: 10 }}>{k.icon}</div>
            <div className="font-head" style={{ fontSize: 21, fontWeight: 800, color: k.cor, letterSpacing: '-.025em' }}>{k.value}</div>
            <div className="label-xs" style={{ marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <div className="card-title mb-4">Capacidade vs Meta vs Realizado (cx/mês)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={comparData} margin={{ top:4, right:8, left:-8, bottom:4 }} barSize={36}>
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v:number) => [v.toLocaleString('pt-BR') + ' cx', '']} cursor={{ fill:'#f1f5f9' }} />
              <ReferenceLine y={prod.metaSOP} stroke="#16a34a" strokeDasharray="4 3" strokeWidth={1.5} />
              <Bar dataKey="cx" radius={[7,7,0,0]}>{comparData.map((d, i) => <Cell key={i} fill={d.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize:10, color:'#94a3b8', marginTop:4 }}>Realizado = mês anterior ({data.creditos.mesRef})</p>
        </div>

        <div className="card">
          <div className="card-title mb-4">Lotes/dia por equipamento</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mixData} margin={{ top:4, right:8, left:-8, bottom:4 }} barSize={30}>
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} domain={[0,6]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v:number) => [v + ' lotes/dia', '']} cursor={{ fill:'#f1f5f9' }} />
              <Bar dataKey="lotes" radius={[7,7,0,0]}>{mixData.map((d, i) => <Cell key={i} fill={d.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produtos */}
      <div className="card">
        <div className="card-title mb-4">📋 Produtos do Setor</div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr>{['Cód','Descrição','Peso CX','Vendido (Jun–Dez)','Estimado Anual +30%'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {PRODUTOS.map(p => (
                <tr key={p.codigo}>
                  <td style={{ fontWeight:700, color:'#173a7a' }}>{p.codigo}</td>
                  <td style={{ fontWeight:500 }}>{p.nome}</td>
                  <td>{p.peso}</td>
                  <td><span style={{ fontWeight:600 }}>{p.vendidoCx.toLocaleString('pt-BR')}</span> cx</td>
                  <td><span style={{ fontWeight:700, color:'#16a34a' }}>{p.estimadoAnual.toLocaleString('pt-BR')}</span> cx</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize:11, color:'#94a3b8', marginTop:8 }}>Insumos principais: Calcário · Cloreto de sódio · Caulim · Creme de milho</p>
      </div>

      {/* Simulador */}
      <div className="card">
        <div className="card-title mb-1">🧮 Simulador de Produção</div>
        <p style={{ fontSize:12, color:'#94a3b8', marginBottom:20 }}>Ajuste os parâmetros para simular cenários (não altera os dados oficiais do mês)</p>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { label:'Lotes/dia', value:lotesDia, min:1, max:15, onChange:setLotesDia },
            { label:'Caixas/lote', value:cxLote, min:10, max:80, onChange:setCxLote },
            { label:'Dias úteis', value:dias, min:10, max:25, onChange:setDias },
          ].map(s => (
            <div key={s.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'#334155' }}>{s.label}</span>
                <span className="font-head" style={{ fontSize:14, fontWeight:800, color:'#173a7a' }}>{s.value}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.onChange(+e.target.value)} style={{ width:'100%' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, padding:'20px', borderRadius:14, background: folga >= 0 ? '#f0fdf4' : '#fef2f2', border:`1px solid ${folga >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <div className="font-head" style={{ fontSize:36, fontWeight:900, color: folga >= 0 ? '#15803d' : '#dc2626', letterSpacing:'-.03em', lineHeight:1 }}>
                {cxMes.toLocaleString('pt-BR')} <span style={{ fontSize:18 }}>caixas/mês</span>
              </div>
              <div style={{ fontSize:13, color: folga >= 0 ? '#16a34a' : '#dc2626', marginTop:6, fontWeight:600 }}>
                {folga >= 0 ? `+${folga.toLocaleString('pt-BR')} acima da meta S&OP (${prod.metaSOP.toLocaleString('pt-BR')})` : `${folga.toLocaleString('pt-BR')} abaixo da meta`}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div className="font-head" style={{ fontSize:28, fontWeight:800, color: folga >= 0 ? '#16a34a' : '#dc2626' }}>{pctMeta}%</div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>da meta S&OP</div>
            </div>
          </div>
          <div style={{ marginTop:14, height:8, borderRadius:8, background: folga >= 0 ? '#bbf7d0' : '#fecaca', overflow:'hidden' }}>
            <div style={{ width:`${Math.min(pctMeta, 100)}%`, height:'100%', borderRadius:8, background: folga >= 0 ? '#16a34a' : '#dc2626', transition:'width .4s ease' }} />
          </div>
        </div>
      </div>


      {/* Editar dados do mês */}
      {editando && (
        <Modal title="✏️ Editar dados do mês" onClose={() => setEditando(false)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { k:'metaSOP', label:'Meta S&OP (cx)' },
              { k:'mesAnteriorDesejado', label:'Desejado mês anterior (cx)' },
              { k:'mesAnteriorRealizado', label:'Realizado mês anterior (cx)' },
              { k:'capacidadeDia', label:'Capacidade/dia (cx)' },
              { k:'diasUteis', label:'Dias úteis' },
            ].map(f => (
              <div key={f.k}>
                <label className="label-xs">{f.label}</label>
                <input type="number" value={(form as any)[f.k]} onChange={e => setForm({ ...form, [f.k]: +e.target.value })}
                  style={{ width:'100%', padding:'9px 11px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:14, marginTop:4, outline:'none' }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}>
            <label className="label-xs">Observação do mês</label>
            <textarea value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })} rows={2}
              style={{ width:'100%', padding:'9px 11px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:13, marginTop:4, outline:'none', resize:'vertical' }} />
          </div>
          <div style={{ background:'#eff6ff', borderRadius:10, padding:'10px 12px', fontSize:11.5, color:'#1e40af', marginTop:12 }}>
            A capacidade só deve ser alterada em caso de mudança real de processo ou problema de produção.
          </div>
          <button onClick={salvar} style={{ marginTop:14, width:'100%', padding:'11px', borderRadius:12, background:'#16a34a', color:'#fff', border:'none', fontWeight:600, fontSize:14, cursor:'pointer' }}>
            Salvar dados do mês
          </button>
        </Modal>
      )}
    </div>
  )
}
