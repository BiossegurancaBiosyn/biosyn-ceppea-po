'use client'
import { useState } from 'react'
import Modal from './Modal'

type Etapa = {
  id: string; label: string; raia: string
  cor: string; textCor: string; responsavel: string; tipo: string; detalhe: string
  desvio?: { label: string; detalhe: string }
}

const ETAPAS: Etapa[] = [
  // RECEBIMENTO
  { id:'r1', label:'Insumo recebido',       raia:'Recebimento', cor:'#dcfce7', textCor:'#166534', responsavel:'Almoxarifado',  tipo:'Almoxarifado',           detalhe:'Entrada do insumo. Conferência de NF, quantidade e identificação.' },
  { id:'r2', label:'Inspeção CQ',            raia:'Recebimento', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'Lab. CQ',       tipo:'Laboratório CQ',         detalhe:'Análise físico-química. Aprovação ou rejeição.', desvio:{label:'Não liberado → Adequação fornecedor', detalhe:'Devolução ou adequação com o fornecedor.'} },
  { id:'r3', label:'Insumo liberado',        raia:'Recebimento', cor:'#dcfce7', textCor:'#166534', responsavel:'CQ',            tipo:'Controle de Qualidade',  detalhe:'CQ emite liberação do insumo para produção.' },
  // MISTURA
  { id:'m1', label:'Planejamento (PCP)',     raia:'Mistura e Envase', cor:'#f1f5f9', textCor:'#334155', responsavel:'PCP', tipo:'PCP', detalhe:'PCP emite a Ordem de Produção conforme demanda S&OP.' },
  { id:'m2', label:'Preparação (3 frentes)', raia:'Mistura e Envase', cor:'#fef9c3', textCor:'#854d0e', responsavel:'Operadores', tipo:'Área de mistura e envase', detalhe:'Separação embalagens + Pesagem microingredientes + Desumidificação.' },
  { id:'m3', label:'Peneiramento',           raia:'Mistura e Envase', cor:'#1e293b', textCor:'#f8fafc', responsavel:'Op. Mistura Fina', tipo:'Mistura Fina', detalhe:'Peneiramento para granulometria adequada.' },
  { id:'m4', label:'Mistura fina + grossa',  raia:'Mistura e Envase', cor:'#fcd34d', textCor:'#78350f', responsavel:'Warlysson / Lucas / Juan', tipo:'Área de mistura e envase', detalhe:'Mistura nos misturadores 1, 2, 3 ou Y conforme formulação.' },
  { id:'m5', label:'Rotulagem',              raia:'Mistura e Envase', cor:'#fce7f3', textCor:'#9d174d', responsavel:'João',       tipo:'Embalagem e selagem',   detalhe:'Aplicação de rótulos com lote, validade e identificação.' },
  { id:'m6', label:'Envase e pesagem',       raia:'Mistura e Envase', cor:'#fcd34d', textCor:'#78350f', responsavel:'Operadores', tipo:'Área de mistura e envase', detalhe:'Envase do produto nas embalagens pesadas e rotuladas.' },
  { id:'m7', label:'Análise de reténs',      raia:'Mistura e Envase', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'Gilson (CQ)', tipo:'Controle de Qualidade', detalhe:'Coleta de amostras e retenção para rastreabilidade.' },
  // PA
  { id:'p1', label:'Inspeção PA',            raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ',   tipo:'Controle de Qualidade',  detalhe:'Inspeção do PA: peso, aspecto e rótulo.' },
  { id:'p2', label:'2ª conferência peso',    raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem', tipo:'Embalagem e selagem', detalhe:'Dupla conferência de peso após envase.' },
  { id:'p3', label:'Selagem',                raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'João', tipo:'Embalagem e selagem',    detalhe:'Selagem das embalagens na seladora manual.' },
  { id:'p4', label:'Inspeção de selagem',    raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ',   tipo:'Controle de Qualidade',  detalhe:'Verificação da integridade da selagem.' },
  { id:'p5', label:'Film stretch + palete',  raia:'Produto Acabado', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem', tipo:'Embalagem e selagem', detalhe:'Paletização e envoltura com filme stretch.' },
  { id:'p6', label:'Liberação PA',           raia:'Produto Acabado', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ',   tipo:'Controle de Qualidade',  detalhe:'CQ emite liberação final do produto acabado.' },
  { id:'p7', label:'Estoque PA',             raia:'Produto Acabado', cor:'#dcfce7', textCor:'#166534', responsavel:'Almoxarifado', tipo:'Almoxarifado',      detalhe:'Produto armazenado no estoque de PA.' },
  // REPROCESSO
  { id:'re1', label:'Identificação NC',      raia:'Reprocesso', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ',          tipo:'Controle de Qualidade', detalhe:'CQ identifica não conformidade.' },
  { id:'re2', label:'Requisição (PCP)',       raia:'Reprocesso', cor:'#f1f5f9', textCor:'#334155', responsavel:'PCP',          tipo:'PCP',                   detalhe:'PCP emite requisição de reprocesso.' },
  { id:'re3', label:'Reprocesso',            raia:'Reprocesso', cor:'#fcd34d', textCor:'#78350f', responsavel:'Área mistura',  tipo:'Área de mistura e envase', detalhe:'Produto reprocessado conforme procedimento.' },
  { id:'re4', label:'Selagem / Peneiramento',raia:'Reprocesso', cor:'#fce7f3', textCor:'#9d174d', responsavel:'Embalagem',    tipo:'Embalagem e selagem',   detalhe:'Reembalagem ou peneiramento do produto reprocessado.' },
  { id:'re5', label:'Liberação PA (CQ)',      raia:'Reprocesso', cor:'#ede9fe', textCor:'#5b21b6', responsavel:'CQ',           tipo:'Controle de Qualidade', detalhe:'Nova liberação após reprocesso.' },
]

const RAIAS = [
  { id: 'Recebimento',      label: 'RECEBIMENTO',       cor: '#166534', bg: '#f0fdf4', border: '#86efac' },
  { id: 'Mistura e Envase', label: 'MISTURA E ENVASE',  cor: '#854d0e', bg: '#fffbeb', border: '#fcd34d' },
  { id: 'Produto Acabado',  label: 'PRODUTO ACABADO',   cor: '#9d174d', bg: '#fdf2f8', border: '#f9a8d4' },
  { id: 'Reprocesso',       label: 'REPROCESSO',        cor: '#1e3a8a', bg: '#eff6ff', border: '#93c5fd' },
]

const LEGENDA = [
  { cor: '#ede9fe',  label: 'Controle de Qualidade' },
  { cor: '#dcfce7',  label: 'Almoxarifado' },
  { cor: '#fcd34d',  label: 'Área de mistura e envase' },
  { cor: '#fce7f3',  label: 'Embalagem e selagem' },
  { cor: '#1e293b',  label: 'Mistura Fina' },
  { cor: '#f1f5f9',  label: 'PCP' },
]

function EtapaCard({ e, onClick }: { e: Etapa; onClick: () => void }) {
  const isDark = e.cor === '#1e293b'
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '10px 12px',
        borderRadius: 10, background: e.cor,
        color: e.textCor, fontSize: 12, fontWeight: 600,
        border: `1px solid ${isDark ? '#374151' : e.textCor + '25'}`,
        cursor: 'pointer', lineHeight: 1.3,
        transition: 'transform .15s, box-shadow .15s',
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      }}
      onMouseEnter={e2 => { (e2.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e2.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.12)' }}
      onMouseLeave={e2 => { (e2.currentTarget as HTMLElement).style.transform = 'none'; (e2.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,.06)' }}
    >
      {e.label}
      {e.desvio && <span style={{ marginLeft: 4, fontSize: 9, opacity: .7 }}>⤵</span>}
    </button>
  )
}

function Arrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3px 0' }}>
      <svg width="14" height="20" viewBox="0 0 14 20">
        <line x1="7" y1="1" x2="7" y2="13" stroke="#94a3b8" strokeWidth={1.6} strokeLinecap="round" strokeDasharray="3 2.5" className="flow-arrow" />
        <path d="M3 11 L7 16 L11 11" stroke="#94a3b8" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function SecaoFluxograma() {
  const [sel, setSel] = useState<Etapa | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Fluxograma</h2>
        <p className="section-sub">Linha Pó acima de 2 kg · 4 raias de processo · clique nas etapas para detalhes</p>
      </div>

      {/* Legenda */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 10 }}>Legenda — Tipo de atividade</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LEGENDA.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.cor, border: '1px solid rgba(0,0,0,.08)', flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Swimlanes */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', minWidth: 600 }}>
          {RAIAS.map(raia => {
            const etapas = ETAPAS.filter(e => e.raia === raia.id)
            return (
              <div key={raia.id} style={{ background: raia.bg, borderRight: `1px solid ${raia.border}40` }}>
                {/* Header */}
                <div style={{ padding: '14px 12px', background: raia.bg, borderBottom: `2px solid ${raia.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: raia.cor, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center' }}>
                    {raia.label}
                  </div>
                </div>

                {/* Etapas */}
                <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {etapas.map((e, i) => (
                    <div key={e.id}>
                      <EtapaCard e={e} onClick={() => setSel(e)} />
                      {i < etapas.length - 1 && <Arrow />}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Nota de fluxo entre raias */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#64748b' }}>Nota:</strong> setas entre raias indicam passagem de responsabilidade.
            NC identificada pelo CQ retorna ao PCP → Reprocesso → Embalagem → nova liberação CQ.
            Clique em qualquer etapa para ver detalhes do responsável e procedimento.
          </p>
        </div>
      </div>

      {/* Modal */}
      {sel && (
        <Modal title={sel.label} onClose={() => setSel(null)}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ padding: '4px 12px', borderRadius: 8, background: sel.cor, color: sel.textCor, fontSize: 12, fontWeight: 600, border: `1px solid ${sel.textCor}20` }}>
              {sel.tipo}
            </span>
            <span className="badge badge-blue">{sel.raia}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: '12px', borderRadius: 12, background: '#f8fafc' }}>
              <div className="label-xs">Responsável</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>{sel.responsavel}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 12, background: '#f8fafc' }}>
              <div className="label-xs">Tipo</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 4 }}>{sel.tipo}</div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>{sel.detalhe}</p>

          {sel.desvio && (
            <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: '#fef9c3', border: '1px solid #fde047' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#a16207', marginBottom: 4 }}>⤵ Desvio / Exceção</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#854d0e', marginBottom: 4 }}>{sel.desvio.label}</div>
              <p style={{ fontSize: 12, color: '#713f12', lineHeight: 1.6 }}>{sel.desvio.detalhe}</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
