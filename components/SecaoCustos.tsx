'use client'
import { useState } from 'react'
import { PARAMS } from '@/data/ceppea-po'
import { useCaderno } from '@/lib/caderno'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import InfoModal, { type InfoRow } from './InfoModal'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
interface ModalDef { title: string; sub?: string; icon: string; accent: string; rows: InfoRow[]; note?: string }

export default function SecaoCustos({ metaSOP }: { metaSOP: boolean }) {
  const { data, custos, rhBase, rhComBonus, verCustos } = useCaderno()
  const { rh, total, porCx, porLote } = custos(metaSOP)
  const EQUIPE = data.equipe
  const RH_BASE = rhBase
  const USE_MES = data.useMes
  const MANUT_MES = data.manutMes
  const [modal, setModal] = useState<ModalDef | null>(null)

  if (!verCustos) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '56px 24px', maxWidth: 460, margin: '40px auto' }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div className="font-head" style={{ fontSize: 18, fontWeight: 800, color: '#173a7a', marginTop: 10 }}>Dados restritos à Gestão</div>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginTop: 8 }}>
          Os custos (R$) do setor são visíveis apenas para coordenação, comitê e diretoria.
          Use o botão <strong>🔒 Custos</strong> no topo para ativar a Visão Gestão com o código de acesso.
        </p>
      </div>
    )
  }

  const pieData = [
    { name: 'RH', value: rh, fill: '#173a7a' },
    { name: 'USE', value: USE_MES, fill: '#2f6fc0' },
    { name: 'Manutenção', value: MANUT_MES, fill: '#5b9bd5' },
  ]

  return (
    <div>
      <div className="mb-4">
        <h2 className="section-title">Custos do Setor Pó</h2>
        <p className="section-sub">Consolidado mensal · clique nos cards para detalhar</p>
      </div>

      {/* Consolidado */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {([
          { l: 'RH Total/mês', v: brl(rh), cor: '#173a7a', note: metaSOP ? '(inclui bônus S&OP)' : '',
            m: { title:'Custo de RH', icon:'👥', accent:'#173a7a', sub:'Folha mensal', rows:[
              {label:'RH base', value:brl(RH_BASE), highlight:true},{label:'Com bônus S&OP', value:brl(rhComBonus)},{label:'Total c/ encargos', value:'líquido × 1,8108'}], note:'Coordenador e Líder não alocados ao setor.' } },
          { l: 'USE/mês', v: brl(USE_MES), cor: '#2f6fc0',
            m: { title:'Custo USE', icon:'🧪', accent:'#2f6fc0', sub:'Biossegurança NB-2', rows:[
              {label:'Total', value:brl(USE_MES), highlight:true},{label:'Mão de obra', value:'R$ 210,53'},{label:'Materiais', value:'R$ 719,96'},{label:'Custo/caixa', value:'R$ 0,21'}] } },
          { l: 'Manutenção/mês', v: brl(MANUT_MES), cor: '#5b9bd5',
            m: { title:'Custo Manutenção', icon:'🔧', accent:'#5b9bd5', sub:'Preventiva', rows:[
              {label:'Total', value:brl(MANUT_MES), highlight:true},{label:'Equipe', value:'2 × Op. Pleno'},{label:'Parada', value:'8h/mês'},{label:'Custo/caixa', value:'R$ 0,08'}] } },
          { l: 'TOTAL/mês', v: brl(total), cor: '#173a7a',
            m: { title:'Custo Total', icon:'◎', accent:'#173a7a', sub:'RH + USE + Manutenção', rows:[
              {label:'Total/mês', value:brl(total), highlight:true},{label:'RH', value:brl(rh)},{label:'USE', value:brl(USE_MES)},{label:'Manutenção', value:brl(MANUT_MES)},{label:'Energia/depreciação', value:'a informar', warn:true}] } },
          { l: 'Custo/caixa', v: brl(porCx), cor: '#16a34a',
            m: { title:'Custo por Caixa', icon:'🪙', accent:'#16a34a', rows:[
              {label:'Total/caixa', value:brl(porCx), highlight:true},{label:'Base', value:`${PARAMS.CX_MES.toLocaleString('pt-BR')} cx/mês`}] } },
          { l: 'Custo/lote', v: brl(porLote), cor: '#16a34a',
            m: { title:'Custo por Lote', icon:'🗂️', accent:'#16a34a', rows:[
              {label:'Total/lote', value:brl(porLote), highlight:true},{label:'Base', value:`${PARAMS.LOTES_MES} lotes/mês`}] } },
        ] as { l:string; v:string; cor:string; note?:string; m:ModalDef }[]).map(k => (
          <div key={k.l} className="card clickable" onClick={() => setModal(k.m)}>
            <span className="tap-hint">›</span>
            <div className="label-xs">{k.l}</div>
            <div className="font-head" style={{ fontSize: 21, fontWeight: 800, color: k.cor, marginTop: 4, letterSpacing: '-.025em' }}>{k.v}</div>
            {k.note && <div style={{ fontSize: 10, color: '#16a34a', marginTop: 2 }}>{k.note}</div>}
          </div>
        ))}
      </div>

      {/* RH detalhado */}
      <div className="card mb-4">
        <div className="card-title mb-4">Detalhamento RH</div>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#eef2f7' }}>
                {['Colaborador','Cargo','Líquido','Custo Total','Hora-Homem','% RH','Bônus'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EQUIPE.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 ? '#f8fafc' : '#fff', borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '9px 10px', fontWeight: 700, color: c.cor }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.cor, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {c.iniciais}
                      </div>
                      {c.nome.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </td>
                  <td style={{ padding: '9px 10px', color: '#64748b', fontSize: 11 }}>{c.cargo}</td>
                  <td style={{ padding: '9px 10px' }}>{c.liquido ? brl(c.liquido) : <span className="a-informar">não alocado</span>}</td>
                  <td style={{ padding: '9px 10px', fontWeight: 700 }}>
                    {c.custoTotal ? brl(c.custoTotal) : <span className="a-informar">não alocado</span>}
                  </td>
                  <td style={{ padding: '9px 10px' }}>{c.horaHomem ? `R$ ${c.horaHomem.toFixed(2).replace('.', ',')}` : <span className="a-informar">—</span>}</td>
                  <td style={{ padding: '9px 10px' }}>
                    {c.custoTotal ? `${((c.custoTotal / RH_BASE) * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td style={{ padding: '9px 10px' }}>
                    {c.bonus && metaSOP ? <span style={{ color: '#16a34a', fontWeight: 700 }}>{brl(c.bonus)}</span> : c.bonus ? <span style={{ color: '#94a3b8' }}>{brl(c.bonus)}</span> : '—'}
                  </td>
                </tr>
              ))}
              <tr style={{ background: '#eef2f7', fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: '10px 10px', fontSize: 13, color: '#173a7a' }}>TOTAL RH BASE</td>
                <td colSpan={5} style={{ padding: '10px 10px', fontSize: 13, color: '#173a7a' }}>
                  {brl(RH_BASE)} &nbsp;|&nbsp; Com bônus: {brl(rhComBonus)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 8 }}>
          * Rafael (Coord.) e Lúcia (Líder) não alocados ao setor Pó. Ratio encargos/benefícios: ~81% (líquido × 1,8108). Horas: {PARAMS.HORAS}h/mês.
        </div>
      </div>

      {/* USE + Manutenção + Gráfico */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div className="card">
          <div className="card-title mb-3">USE / Biossegurança</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Mão de obra (11h)</span><span className="font-semibold">R$ 210,53</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Materiais</span><span className="font-semibold">R$ 719,96</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2"><span>Total USE/mês</span><span style={{ color: '#2f6fc0' }}>R$ 930,49</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Custo/caixa</span><span>R$ 0,21</span></div>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-3">Manutenção Preventiva</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">2 pessoas × 8h/mês</span><span className="font-semibold">R$ 359,81</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Custo/caixa</span><span>R$ 0,08</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Impacto parada</span><span style={{ color: '#dc2626', fontWeight: 600 }}>~280 cx/dia</span></div>
            <div className="text-xs" style={{ color: '#f59e0b', background: '#fef9c3', padding: '4px 8px', borderRadius: 6, marginTop: 4 }}>
              Calibração balanças, peças e histórico: a informar
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-3">Composição de Custos</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip formatter={(v: number) => brl(v)} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: '#fef9c3', color: '#b45309' }}>
        ⚠ Energia elétrica, hora-máquina e depreciação de equipamentos ainda não mensurados — incluir na próxima revisão do centro de custo.
      </div>

      {modal && <InfoModal {...modal} onClose={() => setModal(null)} />}
    </div>
  )
}
