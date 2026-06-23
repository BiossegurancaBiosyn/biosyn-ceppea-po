'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CadernoProvider, useCaderno, type SecId } from '@/lib/caderno'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import SecaoVisaoGeral from '@/components/SecaoVisaoGeral'
import SecaoMapa from '@/components/SecaoMapa'
import SecaoEquipe from '@/components/SecaoEquipe'
import SecaoCronograma from '@/components/SecaoCronograma'
import SecaoProducao from '@/components/SecaoProducao'
import SecaoCustos from '@/components/SecaoCustos'
import SecaoEquipamentos from '@/components/SecaoEquipamentos'
import SecaoLimpeza from '@/components/SecaoLimpeza'
import SecaoBiosseguranca from '@/components/SecaoBiosseguranca'
import SecaoManutencao from '@/components/SecaoManutencao'
import SecaoFluxograma from '@/components/SecaoFluxograma'

export type { SecId }

const SECOES: { id: SecId; titulo: string }[] = [
  { id: 'visao-geral', titulo: 'Visão Geral' },
  { id: 'mapa', titulo: 'Mapa do Setor' },
  { id: 'equipe', titulo: 'Equipe & Organograma' },
  { id: 'cronograma', titulo: 'Cronograma' },
  { id: 'producao', titulo: 'Produção' },
  { id: 'custos', titulo: 'Custos' },
  { id: 'equipamentos', titulo: 'Equipamentos' },
  { id: 'limpeza', titulo: 'Plano de Limpeza' },
  { id: 'biosseguranca', titulo: 'Biossegurança (USE)' },
  { id: 'manutencao', titulo: 'Manutenção' },
  { id: 'fluxograma', titulo: 'Fluxograma' },
]

function renderSecao(id: SecId, metaSOP: boolean, expandAll: boolean) {
  switch (id) {
    case 'visao-geral':   return <SecaoVisaoGeral metaSOP={metaSOP} />
    case 'mapa':          return <SecaoMapa />
    case 'equipe':        return <SecaoEquipe metaSOP={metaSOP} />
    case 'cronograma':    return <SecaoCronograma expandirTudo={expandAll} />
    case 'producao':      return <SecaoProducao metaSOP={metaSOP} />
    case 'custos':        return <SecaoCustos metaSOP={metaSOP} />
    case 'equipamentos':  return <SecaoEquipamentos />
    case 'limpeza':       return <SecaoLimpeza />
    case 'biosseguranca': return <SecaoBiosseguranca />
    case 'manutencao':    return <SecaoManutencao />
    case 'fluxograma':    return <SecaoFluxograma />
  }
}

// ── Diálogo de Edição ──
function EdicaoDialog({ onClose }: { onClose: () => void }) {
  const { editorNome, areas, unlock, lock, exportJSON, importJSON, resetAll } = useCaderno()
  const [pin, setPin] = useState(''); const [erro, setErro] = useState(''); const [info, setInfo] = useState<string | null>(null)
  const tentar = () => { const r = unlock(pin); if (r.ok) { setInfo(`Acesso: ${r.nome} · ${r.funcao}`); setErro('') } else setErro('Código inválido.') }
  return (
    <Modal title="🔒 Edição do Caderno" onClose={onClose}>
      {!editorNome ? (
        <>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>Edição restrita aos responsáveis. Cada função edita apenas suas áreas.</p>
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && tentar()} placeholder="Código de acesso" style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }} />
          {erro && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{erro}</p>}
          <button onClick={tentar} style={{ marginTop: 14, width: '100%', padding: '11px', borderRadius: 12, background: '#173a7a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Entrar no modo edição</button>
        </>
      ) : (
        <>
          <div style={{ padding: '13px 15px', borderRadius: 13, background: '#dcfce7', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d' }}>✓ {editorNome}</div>
            <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>Áreas: {areas.join(', ')}</div>
          </div>
          {info && <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{info}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={exportJSON} style={btnSec}>↓ Exportar dados do mês (JSON)</button>
            <label style={{ ...btnSec, textAlign: 'center' }}>↑ Importar dados (JSON)<input type="file" accept="application/json" style={{ display: 'none' }} onChange={async e => { const f = e.target.files?.[0]; if (f) setInfo(await importJSON(f) ? 'Importado com sucesso.' : 'Falha ao importar.') }} /></label>
            <button onClick={() => { if (confirm('Restaurar dados padrão?')) { resetAll(); setInfo('Restaurado.') } }} style={{ ...btnSec, border: '1px solid #fecaca', color: '#dc2626' }}>↺ Restaurar padrão</button>
            <button onClick={() => { lock(); onClose() }} style={{ padding: '10px', borderRadius: 11, background: '#173a7a', color: '#fff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>Sair do modo edição</button>
          </div>
        </>
      )}
    </Modal>
  )
}
const btnSec: React.CSSProperties = { padding: '10px', borderRadius: 11, background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: '#334155' }

function Dashboard() {
  const { editorNome, sec, goTo, mesRef, verCustos, gestaoNome, lockGestao } = useCaderno()
  const [metaSOP, setMetaSOP] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [edicaoAberta, setEdicaoAberta] = useState(false)
  const { data } = useCaderno()

  const handleExportPDF = useCallback(() => window.print(), [])
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarAberta(false) }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])
  const podeExpandir = sec === 'visao-geral' || expandAll

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'var(--font-inter)' }}>
      {sidebarAberta && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarAberta(false)} />}
      <Sidebar ativa={sec} onChange={(s) => { goTo(s); setSidebarAberta(false); setExpandAll(false) }} aberta={sidebarAberta} />

      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 0 }}>
        <style>{`@media (min-width: 980px){ .main-shift { margin-left:260px !important; } }`}</style>
        <div className="main-shift flex flex-col min-h-screen flex-1">
          <Header
            secaoAtiva={sec}
            metaSOP={metaSOP} onToggleMetaSOP={() => setMetaSOP(v => !v)}
            onExpandirTudo={() => setExpandAll(v => !v)} expandido={expandAll} mostrarExpandir={podeExpandir}
            onExportPDF={handleExportPDF} onMenuToggle={() => setSidebarAberta(v => !v)}
          />

          {(editorNome || gestaoNome) && (
            <div className="no-print" style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 20, background: editorNome ? '#fffbeb' : '#eff6ff', borderBottom: `1px solid ${editorNome ? '#fde68a' : '#bfdbfe'}`, padding: '7px 20px' }}>
              <div className="main-shift" style={{ fontSize: 12, color: editorNome ? '#92400e' : '#1e40af', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <span>{editorNome ? `✏️ Edição — ${editorNome}` : `👁 Visão Gestão — ${gestaoNome} · custos visíveis`}</span>
                {gestaoNome && !editorNome && <button onClick={lockGestao} style={{ background: 'none', border: 'none', color: '#1e40af', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}>sair</button>}
              </div>
            </div>
          )}

          <main className="flex-1 p-4 md:p-6" style={{ paddingTop: (editorNome || gestaoNome) ? 102 : 80 }}>
            {expandAll ? (
              <div className="space-y-10">
                <div className="card no-print" style={{ background: '#173a7a', color: '#fff' }}>
                  <div className="font-head" style={{ fontWeight: 800, fontSize: 16 }}>📖 Caderno completo — modo expandido</div>
                  <p style={{ fontSize: 13, opacity: .9, marginTop: 4 }}>Todas as abas visíveis. Use <strong>⎙ Exportar PDF</strong> para o documento completo.{!verCustos && ' (custos ocultos — ative a Visão Gestão)'}</p>
                </div>
                {SECOES.filter(s => s.id !== 'custos' || verCustos).map(s => (
                  <section key={s.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
                      <div style={{ width: 5, height: 24, borderRadius: 4, background: '#5b9bd5' }} />
                      <h2 className="font-head" style={{ fontSize: 15, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.titulo}</h2>
                    </div>
                    {renderSecao(s.id, metaSOP, true)}
                  </section>
                ))}
              </div>
            ) : renderSecao(sec, metaSOP, false)}

            <footer style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                <strong style={{ color: '#64748b' }}>Elaborado por:</strong> {data.creditos.elaboradoPor}
                <span style={{ margin: '0 8px' }}>·</span>
                <strong style={{ color: '#64748b' }}>Aprovado por:</strong> {data.creditos.aprovadoPor}
                <span style={{ margin: '0 8px' }}>·</span>Ref.: {mesRef}
              </div>
              <button className="no-print" onClick={() => setEdicaoAberta(true)} style={{ fontSize: 11, color: editorNome ? '#15803d' : '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                {editorNome ? '✏️ Editando' : '🔒 Edição'}
              </button>
            </footer>
          </main>
        </div>
      </div>
      {edicaoAberta && <EdicaoDialog onClose={() => setEdicaoAberta(false)} />}
    </div>
  )
}

export default function Page() {
  return <CadernoProvider><Dashboard /></CadernoProvider>
}
