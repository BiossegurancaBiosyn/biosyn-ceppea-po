'use client'
import type { SecaoId } from '@/app/page'
import LogoBioSyn from './LogoBioSyn'

const NAV = [
  {
    grupo: 'Painel',
    itens: [
      { id: 'visao-geral', label: 'Visão Geral',        icon: '▦' },
      { id: 'mapa',        label: 'Mapa do Setor',       icon: '⊞' },
      { id: 'equipe',      label: 'Equipe',              icon: '⊙' },
    ],
  },
  {
    grupo: 'Operação',
    itens: [
      { id: 'cronograma',   label: 'Cronograma',         icon: '◷' },
      { id: 'producao',     label: 'Produção',           icon: '⊕' },
      { id: 'custos',       label: 'Custos',             icon: '◎' },
      { id: 'equipamentos', label: 'Equipamentos',       icon: '⚙' },
    ],
  },
  {
    grupo: 'Qualidade',
    itens: [
      { id: 'limpeza',       label: 'Plano de Limpeza',  icon: '◌' },
      { id: 'biosseguranca', label: 'Biossegurança',     icon: '⊗' },
      { id: 'manutencao',    label: 'Manutenção',        icon: '◉' },
      { id: 'fluxograma',    label: 'Fluxograma',        icon: '⊳' },
    ],
  },
]

interface Props {
  ativa: SecaoId
  onChange: (s: SecaoId) => void
  aberta: boolean
}

export default function Sidebar({ ativa, onChange, aberta }: Props) {
  return (
    <>
      <style>{`
        .sidebar { position:fixed; top:0; left:0; height:100%; z-index:50; width:260px;
          background:linear-gradient(180deg,#0b1f42 0%,#122a58 60%,#162f64 100%);
          display:flex; flex-direction:column; }
        @media(max-width:979px){ .sidebar{ transform:translateX(-260px); transition:transform .22s ease; } }
        @media(min-width:980px){ .sidebar{ transform:translateX(0) !important; } }
        .sidebar.open { transform:translateX(0) !important; }
      `}</style>

      <aside className={`sidebar${aberta ? ' open' : ''}`}>
        {/* Logo area */}
        <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.18)' }}>
            <LogoBioSyn width={196} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 28, borderRadius: 4, background: '#5b9bd5', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#cfe0f0', letterSpacing: '.02em' }}>
                CEPPEA · Setor Pó
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#6f93b8', marginTop: 1 }}>
                Dashboard · Maio 2026
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {NAV.map((grupo) => (
            <div key={grupo.grupo} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#3a6090', padding: '0 8px', marginBottom: 6 }}>
                {grupo.grupo}
              </div>
              {grupo.itens.map((item) => {
                const isAtivo = ativa === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id as SecaoId)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 10,
                      marginBottom: 2,
                      background: isAtivo ? 'rgba(91,155,213,.18)' : 'transparent',
                      color: isAtivo ? '#fff' : '#7a9dbf',
                      fontWeight: isAtivo ? 600 : 400,
                      fontSize: 13,
                      borderLeft: `3px solid ${isAtivo ? '#5b9bd5' : 'transparent'}`,
                      cursor: 'pointer',
                      border: 'none',
                      textAlign: 'left',
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { if (!isAtivo) (e.currentTarget as HTMLElement).style.color = '#c2d8ee' }}
                    onMouseLeave={e => { if (!isAtivo) (e.currentTarget as HTMLElement).style.color = '#7a9dbf' }}
                  >
                    <span style={{ fontSize: 13, opacity: isAtivo ? 1 : 0.6, width: 16, textAlign: 'center' }}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isAtivo && (
                      <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#5b9bd5', flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.07)', fontSize: 10, color: '#2a4a6a' }}>
          BioSyn Saúde Animal · v1.0
        </div>
      </aside>
    </>
  )
}
