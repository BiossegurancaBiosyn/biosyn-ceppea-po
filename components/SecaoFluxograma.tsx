'use client'
import { useState } from 'react'

type Etapa = {
  id: string; label: string; raia: string
  cor: string; textCor: string; responsavel: string; tipo: string; detalhe: string
  desvio?: { label: string; detalhe: string }
}

const ETAPAS: Etapa[] = [
  { id:'r1', label:'Insumo recebido', raia:'Recebimento', cor:'#dcfce7', textCor:'#166534', responsavel:'Almoxarifado', tipo:'Almoxarifado', detalhe:'Entrada do insumo no almoxarifado. Conferência de NF, quantidade, lote e identificação visual.' },
  { id:'r2', label:'Inspeção CQ', raia:'Recebimento', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'Laboratório CQ', tipo:'Laboratório CQ', detalhe:'Análise físico-química do insumo no laboratório. Define aprovação ou rejeição para uso.', desvio:{label:'Não liberado → Adequação com fornecedor', detalhe:'Insumo reprovado é devolvido ou passa por adequação junto ao fornecedor antes de retornar à inspeção.'} },
  { id:'r3', label:'Insumo liberado', raia:'Recebimento', cor:'#dcfce7', textCor:'#166534', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'CQ emite a liberação formal do insumo, autorizando o uso na produção.' },
  { id:'m1', label:'Planejamento de produção', raia:'Mistura e Envase', cor:'#f1f5f9', textCor:'#334155', responsavel:'PCP', tipo:'PCP', detalhe:'PCP emite a Ordem de Produção (OP) conforme demanda do S&OP do mês.' },
  { id:'m2', label:'Preparação (3 frentes)', raia:'Mistura e Envase', cor:'#fcd34d', textCor:'#78350f', responsavel:'Operadores', tipo:'Área de mistura e envase', detalhe:'Três frentes simultâneas: separação de embalagens, pesagem de microingredientes (OP) e desumidificação dos insumos.' },
  { id:'m3', label:'Peneiramento', raia:'Mistura e Envase', cor:'#1e293b', textCor:'#f8fafc', responsavel:'Operador (Mistura Fina)', tipo:'Mistura Fina', detalhe:'Peneiramento dos ingredientes para garantir granulometria adequada antes da mistura.' },
  { id:'m4', label:'Mistura fina + grossa', raia:'Mistura e Envase', cor:'#fcd34d', textCor:'#78350f', responsavel:'Warlysson / Lucas / Juan', tipo:'Área de mistura e envase', detalhe:'Mistura conforme formulação nos Misturadores 1, 2, 3 ou Y. Etapa-chave de homogeneização.' },
  { id:'m5', label:'Rotulagem de embalagens', raia:'Mistura e Envase', cor:'#fce7f3', textCor:'#9d174d', responsavel:'João', tipo:'Embalagem e selagem', detalhe:'Aplicação de rótulos com lote, validade e identificação do produto.' },
  { id:'m6', label:'Envase e pesagem', raia:'Mistura e Envase', cor:'#fcd34d', textCor:'#78350f', responsavel:'Operadores', tipo:'Área de mistura e envase', detalhe:'Envase do produto nas embalagens pesadas e rotuladas, conforme peso-alvo.' },
  { id:'m7', label:'Análise de reténs / amostras', raia:'Mistura e Envase', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'Gilson (CQ)', tipo:'Controle de Qualidade', detalhe:'Coleta de amostras de retenção para rastreabilidade e liberação do lote.' },
  { id:'p1', label:'Inspeção PA', raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'Inspeção do produto acabado: peso, aspecto e rótulo.' },
  { id:'p2', label:'2ª conferência de pesagem', raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem', tipo:'Embalagem e selagem', detalhe:'Dupla conferência de peso após o envase.' },
  { id:'p3', label:'Selagem', raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'João', tipo:'Embalagem e selagem', detalhe:'Selagem das embalagens na seladora manual.' },
  { id:'p4', label:'Inspeção de selagem', raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'Verificação da integridade da selagem.' },
  { id:'p5', label:'Preparação PA (filme stretch)', raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem', tipo:'Embalagem e selagem', detalhe:'Paletização e envoltura com filme stretch.' },
  { id:'p6', label:'Liberação PA', raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'CQ emite a liberação final do produto acabado.' },
  { id:'p7', label:'Estoque PA', raia:'Produto Acabado', cor:'#dcfce7', textCor:'#166534', responsavel:'Almoxarifado', tipo:'Almoxarifado', detalhe:'Produto armazenado no estoque de produto acabado.' },
  { id:'re1', label:'Identificação de NC', raia:'Reprocesso', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'CQ identifica não conformidade durante a produção ou inspeção.' },
  { id:'re2', label:'Requisição de PA (PCP)', raia:'Reprocesso', cor:'#f1f5f9', textCor:'#334155', responsavel:'PCP', tipo:'PCP', detalhe:'PCP emite a requisição de reprocesso do produto.' },
  { id:'re3', label:'Reprocesso', raia:'Reprocesso', cor:'#fcd34d', textCor:'#78350f', responsavel:'Área de mistura', tipo:'Área de mistura e envase', detalhe:'Produto é reprocessado conforme procedimento específico.' },
  { id:'re4', label:'Selagem / Peneiramento', raia:'Reprocesso', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem', tipo:'Embalagem e selagem', detalhe:'Reembalagem ou peneiramento do produto reprocessado.' },
  { id:'re5', label:'Liberação de PA (CQ)', raia:'Reprocesso', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ', tipo:'Controle de Qualidade', detalhe:'Nova liberação do produto após reprocesso.' },
]

const RAIAS = [
  { id: 'Recebimento', label: 'Recebimento', icon: '📥', cor: '#166534', bg: '#f0fdf4', bd: '#86efac' },
  { id: 'Mistura e Envase', label: 'Mistura e Envase', icon: '🌀', cor: '#854d0e', bg: '#fffbeb', bd: '#fcd34d' },
  { id: 'Produto Acabado', label: 'Produto Acabado', icon: '📦', cor: '#9d174d', bg: '#fdf2f8', bd: '#f9a8d4' },
  { id: 'Reprocesso', label: 'Reprocesso', icon: '🔄', cor: '#1e3a8a', bg: '#eff6ff', bd: '#93c5fd' },
]

const LEGENDA = [
  { cor: '#ede9fe', label: 'Controle de Qualidade' }, { cor: '#dcfce7', label: 'Almoxarifado' },
  { cor: '#fcd34d', label: 'Área de mistura e envase' }, { cor: '#fce7f3', label: 'Embalagem e selagem' },
  { cor: '#1e293b', label: 'Mistura Fina' }, { cor: '#f1f5f9', label: 'PCP' },
]

export default function SecaoFluxograma() {
  const [raia, setRaia] = useState('Recebimento')
  const [tipoSel, setTipoSel] = useState<string | null>(null)
  const ativa = RAIAS.find(r => r.id === raia)!
  const etapas = ETAPAS.filter(e => e.raia === raia)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Fluxograma</h2>
        <p className="section-sub">Linha Pó acima de 2 kg · selecione um nível para ver o passo a passo detalhado</p>
      </div>

      {/* Seletor de níveis */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {RAIAS.map(r => {
          const on = r.id === raia
          const n = ETAPAS.filter(e => e.raia === r.id).length
          return (
            <button key={r.id} onClick={() => { setRaia(r.id); setTipoSel(null) }}
              className="card clickable" style={{ textAlign: 'left', cursor: 'pointer', borderTop: `4px solid ${r.bd}`, background: on ? r.bg : '#fff', boxShadow: on ? '0 8px 24px rgba(15,40,80,.12)' : undefined, transform: on ? 'translateY(-2px)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 22 }}>{r.icon}</span>
                <span className="badge" style={{ background: on ? r.bd + '60' : '#f1f5f9', color: r.cor }}>{n} etapas</span>
              </div>
              <div className="font-head" style={{ fontSize: 15, fontWeight: 800, color: r.cor, marginTop: 8 }}>{r.label}</div>
            </button>
          )
        })}
      </div>

      {/* Legenda clicável */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Legenda — clique para destacar um tipo de atividade</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LEGENDA.map(l => {
            const on = tipoSel === l.label
            return (
              <button key={l.label} onClick={() => setTipoSel(on ? null : l.label)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: on ? '#fff' : '#64748b', cursor: 'pointer', padding: '5px 11px', borderRadius: 99, border: `1px solid ${on ? l.cor : '#e2e8f0'}`, background: on ? l.cor : '#fff', fontWeight: on ? 600 : 500 }}>
                <span style={{ width: 12, height: 12, borderRadius: 4, background: l.cor, border: '1px solid #0001', flexShrink: 0 }} />
                {l.label}
              </button>
            )
          })}
          {tipoSel && <button onClick={() => setTipoSel(null)} style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>limpar</button>}
        </div>
      </div>

      {/* Passo a passo detalhado da raia selecionada */}
      <div className="card" style={{ borderTop: `4px solid ${ativa.bd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>{ativa.icon}</span>
          <div className="font-head" style={{ fontSize: 17, fontWeight: 800, color: ativa.cor }}>{ativa.label}</div>
        </div>
        <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 18 }}>Passo a passo descrito do processo · {etapas.length} etapas</p>

        <div style={{ position: 'relative' }}>
          {etapas.map((e, i) => {
            const dim = tipoSel && e.tipo !== tipoSel
            const isDark = e.cor === '#1e293b'
            return (
              <div key={e.id} style={{ display: 'flex', gap: 14, opacity: dim ? .35 : 1, transition: 'opacity .2s' }}>
                {/* índice + linha */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: e.cor, color: isDark ? '#fff' : e.textCor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, border: `2px solid ${e.textCor}25` }}>{i + 1}</div>
                  {i < etapas.length - 1 && (
                    <svg width="14" height="46" viewBox="0 0 14 46" style={{ flexShrink: 0 }}>
                      <line x1="7" y1="0" x2="7" y2="36" stroke={ativa.bd} strokeWidth="2" strokeDasharray="3 2.5" className="flow-arrow" />
                      <path d="M3 33 L7 40 L11 33" stroke={ativa.bd} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {/* conteúdo */}
                <div style={{ flex: 1, paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: '#1e293b' }}>{e.label}</span>
                    <span style={{ padding: '2px 9px', borderRadius: 7, background: e.cor, color: isDark ? '#fff' : e.textCor, fontSize: 10.5, fontWeight: 600 }}>{e.tipo}</span>
                    <span className="badge badge-blue" style={{ fontSize: 10 }}>👤 {e.responsavel}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.65, marginTop: 5 }}>{e.detalhe}</p>
                  {e.desvio && (
                    <div style={{ marginTop: 8, padding: '10px 13px', borderRadius: 11, background: '#fef9c3', border: '1px solid #fde047' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#a16207' }}>⤵ {e.desvio.label}</div>
                      <p style={{ fontSize: 11.5, color: '#713f12', lineHeight: 1.55, marginTop: 3 }}>{e.desvio.detalhe}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
