'use client'
import type { SecaoId } from '@/app/page'

const LABELS: Record<SecaoId, { title: string; sub: string }> = {
  'visao-geral':   { title: 'Visão Geral', sub: 'KPIs e indicadores do setor' },
  'mapa':          { title: 'Mapa do Setor', sub: 'Planta baixa interativa' },
  'equipe':        { title: 'Equipe & Organograma', sub: 'Colaboradores e hierarquia' },
  'cronograma':    { title: 'Cronograma Diário', sub: 'Rotina operacional 08:00 – 18:00' },
  'producao':      { title: 'Produção', sub: 'Capacidade, metas e produtos' },
  'custos':        { title: 'Custos', sub: 'RH, USE, manutenção e consolidado' },
  'equipamentos':  { title: 'Equipamentos', sub: '17 ativos do setor' },
  'limpeza':       { title: 'Plano de Limpeza', sub: 'PLIM.01.00 · POP 02' },
  'biosseguranca': { title: 'Biossegurança (USE)', sub: 'Nível NB-2' },
  'manutencao':    { title: 'Manutenção', sub: 'Preventivas e paradas' },
  'fluxograma':    { title: 'Fluxograma', sub: 'Linha Pó acima de 2 kg' },
}

interface Props {
  secaoAtiva: SecaoId
  metaSOP: boolean
  onToggleMetaSOP: () => void
  onExpandirTudo: () => void
  expandido: boolean
  mostrarExpandir?: boolean
  onExportPDF: () => void
  onMenuToggle: () => void
}

export default function Header({ secaoAtiva, metaSOP, onToggleMetaSOP, onExpandirTudo, expandido, mostrarExpandir = true, onExportPDF, onMenuToggle }: Props) {
  const { title, sub } = LABELS[secaoAtiva]

  return (
    <>
      <style>{`
        .header-bar { position:fixed; top:0; right:0; left:0; z-index:30; height:64px;
          background:rgba(255,255,255,.95); backdrop-filter:blur(8px);
          border-bottom:1px solid #e8eef6;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 20px 0 24px; gap:12px; }
        @media(min-width:980px){ .header-bar{ left:260px !important; } }
      `}</style>

      <header className="header-bar no-print">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background: '#f1f5f9', color: '#334155', border: 'none', cursor: 'pointer', fontSize: 16 }}
            onClick={onMenuToggle}
          >☰</button>

          <div className="min-w-0">
            <div style={{ fontSize: 16, fontWeight: 800, color: '#173a7a', letterSpacing: '-.02em', lineHeight: 1.2 }}>
              {title}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              BioSyn · Setor Pó · {sub}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Toggle Meta S&OP */}
          <label className="flex items-center gap-2 cursor-pointer select-none"
            style={{ padding: '6px 12px', borderRadius: 10, background: metaSOP ? '#dcfce7' : '#f8fafc', border: `1px solid ${metaSOP ? '#86efac' : '#e2e8f0'}`, transition: 'all .2s' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: metaSOP ? '#15803d' : '#64748b', whiteSpace: 'nowrap' }}
              className="hidden sm:block">
              Meta S&OP
            </span>
            <button
              role="switch"
              aria-checked={metaSOP}
              onClick={onToggleMetaSOP}
              className="relative inline-flex h-5 w-9 rounded-full transition-colors flex-shrink-0"
              style={{ background: metaSOP ? '#16a34a' : '#cbd5e1', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all"
                style={{ left: metaSOP ? '18px' : '2px' }} />
            </button>
          </label>

          {/* Expandir tudo (apenas na Visão Geral) */}
          {mostrarExpandir && (
            <button
              onClick={onExpandirTudo}
              className="hidden sm:flex items-center gap-1.5 transition-all"
              style={{ padding: '7px 12px', borderRadius: 10, background: expandido ? '#dbeafe' : '#f8fafc', border: `1px solid ${expandido ? '#93c5fd' : '#e2e8f0'}`, fontSize: 12, fontWeight: 600, color: expandido ? '#1e40af' : '#334155', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {expandido ? '↑ Recolher abas' : '⊞ Expandir abas'}
            </button>
          )}

          {/* PDF */}
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 transition-all"
            style={{ padding: '7px 14px', borderRadius: 10, background: '#173a7a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(23,58,122,.25)' }}
          >
            <span>⎙</span>
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>
        </div>
      </header>
    </>
  )
}
