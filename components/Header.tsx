'use client'
import { useState } from 'react'
import type { SecId } from '@/lib/caderno'
import { useCaderno } from '@/lib/caderno'

const LABELS: Record<SecId, { title: string; sub: string }> = {
  'visao-geral':   { title: 'Visão Geral', sub: 'Indicadores do setor' },
  'mapa':          { title: 'Mapa do Setor', sub: 'Planta baixa interativa' },
  'equipe':        { title: 'Equipe & Organograma', sub: 'Colaboradores e processo' },
  'cronograma':    { title: 'Cronograma Diário', sub: 'Rotina 08:00 – 18:00' },
  'producao':      { title: 'Produção', sub: 'Capacidade, metas e produtos' },
  'custos':        { title: 'Custos', sub: 'Restrito à gestão' },
  'equipamentos':  { title: 'Equipamentos', sub: '17 ativos do setor' },
  'limpeza':       { title: 'Plano de Limpeza', sub: 'PLIM.01.00 · POP 02' },
  'biosseguranca': { title: 'Biossegurança (USE)', sub: 'Nível NB-2' },
  'manutencao':    { title: 'Manutenção', sub: 'Preventivas e paradas' },
  'fluxograma':    { title: 'Fluxograma', sub: 'Linha Pó acima de 2 kg' },
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const MES_ABR = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface Props {
  secaoAtiva: SecId
  metaSOP: boolean; onToggleMetaSOP: () => void
  onExpandirTudo: () => void; expandido: boolean; mostrarExpandir?: boolean
  onExportPDF: () => void; onMenuToggle: () => void
}

export default function Header({ secaoAtiva, metaSOP, onToggleMetaSOP, onExpandirTudo, expandido, mostrarExpandir = true, onExportPDF, onMenuToggle }: Props) {
  const { title, sub } = LABELS[secaoAtiva]
  const { mesRef, setMesRef, verCustos, gestaoNome, unlockGestao, lockGestao } = useCaderno()
  const [calOpen, setCalOpen] = useState(false)
  const [calAno, setCalAno] = useState(2026)
  const [gOpen, setGOpen] = useState(false)
  const [pin, setPin] = useState(''); const [erro, setErro] = useState('')

  const escolherMes = (i: number) => { setMesRef(`${MESES[i]} ${calAno}`); setCalOpen(false) }
  const tentarG = () => { const r = unlockGestao(pin); if (r.ok) { setGOpen(false); setPin(''); setErro('') } else setErro('Código inválido.') }

  return (
    <>
      <style>{`.header-bar{position:fixed;top:0;right:0;left:0;z-index:30;height:64px;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border-bottom:1px solid #e8eef6;display:flex;align-items:center;justify-content:space-between;padding:0 16px 0 24px;gap:10px}@media(min-width:980px){.header-bar{left:260px!important}}`}</style>
      <header className="header-bar no-print">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: '#f1f5f9', color: '#334155', border: 'none', cursor: 'pointer', fontSize: 16 }} onClick={onMenuToggle}>☰</button>
          <div className="min-w-0">
            <div style={{ fontSize: 16, fontWeight: 800, color: '#173a7a', letterSpacing: '-.02em', lineHeight: 1.2 }} className="font-head">{title}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>BioSyn · Setor Pó · {sub}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Seletor de mês */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setCalOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              📅 <span className="hidden sm:inline">{mesRef}</span>
            </button>
            {calOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setCalOpen(false)} />
                <div style={{ position: 'absolute', top: 44, right: 0, zIndex: 41, background: '#fff', borderRadius: 14, boxShadow: '0 12px 36px rgba(15,40,80,.18)', border: '1px solid #e2e8f0', padding: 14, width: 248 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <button onClick={() => setCalAno(a => a - 1)} style={navBtn}>‹</button>
                    <span className="font-head" style={{ fontWeight: 800, color: '#173a7a' }}>{calAno}</span>
                    <button onClick={() => setCalAno(a => a + 1)} style={navBtn}>›</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                    {MES_ABR.map((m, i) => {
                      const sel = mesRef === `${MESES[i]} ${calAno}`
                      return <button key={m} onClick={() => escolherMes(i)} style={{ padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: sel ? '#173a7a' : '#f1f5f9', color: sel ? '#fff' : '#475569' }}>{m}</button>
                    })}
                  </div>
                  <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 10, lineHeight: 1.5 }}>Dados históricos por mês vêm do JSON importado de cada período.</p>
                </div>
              </>
            )}
          </div>

          {/* Visão Gestão (custos) */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => verCustos ? lockGestao() : setGOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, background: verCustos ? '#dcfce7' : '#f8fafc', border: `1px solid ${verCustos ? '#86efac' : '#e2e8f0'}`, fontSize: 12, fontWeight: 600, color: verCustos ? '#15803d' : '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {verCustos ? '👁 Gestão' : '🔒 Custos'}
            </button>
            {gOpen && !verCustos && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setGOpen(false)} />
                <div style={{ position: 'absolute', top: 44, right: 0, zIndex: 41, background: '#fff', borderRadius: 14, boxShadow: '0 12px 36px rgba(15,40,80,.18)', border: '1px solid #e2e8f0', padding: 16, width: 256 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#173a7a', marginBottom: 4 }}>👁 Visão Gestão</div>
                  <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.6, marginBottom: 10 }}>Código libera os dados de custo (R$) para diretoria/comitê.</p>
                  <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && tentarG()} placeholder="Código de gestão" style={{ width: '100%', padding: '9px 11px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
                  {erro && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 6 }}>{erro}</p>}
                  <button onClick={tentarG} style={{ marginTop: 10, width: '100%', padding: '9px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Liberar custos</button>
                </div>
              </>
            )}
          </div>

          {/* Meta S&OP */}
          <label className="hidden md:flex items-center gap-2 cursor-pointer select-none" style={{ padding: '6px 10px', borderRadius: 10, background: metaSOP ? '#dcfce7' : '#f8fafc', border: `1px solid ${metaSOP ? '#86efac' : '#e2e8f0'}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: metaSOP ? '#15803d' : '#64748b' }}>Meta S&OP</span>
            <button role="switch" aria-checked={metaSOP} onClick={onToggleMetaSOP} className="relative inline-flex h-5 w-9 rounded-full" style={{ background: metaSOP ? '#16a34a' : '#cbd5e1', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" style={{ left: metaSOP ? '18px' : '2px' }} />
            </button>
          </label>

          {mostrarExpandir && (
            <button onClick={onExpandirTudo} className="hidden sm:flex items-center" style={{ padding: '7px 12px', borderRadius: 10, background: expandido ? '#dbeafe' : '#f8fafc', border: `1px solid ${expandido ? '#93c5fd' : '#e2e8f0'}`, fontSize: 12, fontWeight: 600, color: expandido ? '#1e40af' : '#334155', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {expandido ? '↑ Recolher' : '⊞ Expandir'}
            </button>
          )}
          <button onClick={onExportPDF} className="flex items-center gap-1.5" style={{ padding: '7px 14px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ⎙ <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </header>
    </>
  )
}
const navBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 8, border: 'none', background: '#f1f5f9', color: '#475569', cursor: 'pointer', fontSize: 14, fontWeight: 700 }
