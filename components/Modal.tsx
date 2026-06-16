'use client'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function Modal({ onClose, children, title }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#173a7a' }}>{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 font-bold"
            >
              ✕
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 font-bold"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
