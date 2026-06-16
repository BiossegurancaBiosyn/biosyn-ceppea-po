'use client'
import Modal from './Modal'

export interface InfoRow { label: string; value: string; highlight?: boolean; warn?: boolean }

interface Props {
  title: string
  sub?: string
  icon?: string
  accent?: string
  banner?: { icon?: string; title: string; text: string; color: string; bg: string }
  rows: InfoRow[]
  note?: string
  onClose: () => void
}

export default function InfoModal({ title, sub, icon, accent = '#173a7a', banner, rows, note, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-4" style={{ marginBottom: banner ? 16 : 18 }}>
        {icon && (
          <div className="icon-box icon-box-lg" style={{ background: accent + '18', fontSize: 24 }}>{icon}</div>
        )}
        <div>
          <div className="font-head" style={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: '-.02em' }}>{title}</div>
          {sub && <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>

      {banner && (
        <div style={{ display: 'flex', gap: 10, padding: '13px 15px', borderRadius: 13, background: banner.bg, marginBottom: 18, borderLeft: `3px solid ${banner.color}` }}>
          {banner.icon && <span style={{ fontSize: 18, flexShrink: 0 }}>{banner.icon}</span>}
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: banner.color }}>{banner.title}</div>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginTop: 2 }}>{banner.text}</p>
          </div>
        </div>
      )}

      <div>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: i < rows.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
            {r.warn
              ? <span className="a-informar">{r.value}</span>
              : <span style={{ fontSize: 14, fontWeight: 700, color: r.highlight ? accent : '#1e293b' }}>{r.value}</span>}
          </div>
        ))}
      </div>

      {note && (
        <div style={{ marginTop: 16, padding: '13px 15px', borderRadius: 13, background: '#f8fafc', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
          {note}
        </div>
      )}
    </Modal>
  )
}
