// Logo BioSyn — lockup horizontal fiel (anel segmentado + "BioSyn" + "Saúde Animal")
// Projetada para fundo claro (usar dentro de um container branco).

const PALETTE = {
  navy:   '#16386e',
  navy2:  '#1d4f93',
  blue:   '#2e6db4',
  bright: '#3f9bd8',
  steel:  '#8fa9c4',
  gray:   '#aab8c6',
  grayL:  '#c8d2dc',
}

// Sequência de cores do anel (irregular, como na marca)
const RING = [
  PALETTE.navy, PALETTE.grayL, PALETTE.bright, PALETTE.blue, PALETTE.steel,
  PALETTE.navy2, PALETTE.gray, PALETTE.bright, PALETTE.navy, PALETTE.grayL,
  PALETTE.blue, PALETTE.steel, PALETTE.bright, PALETTE.navy2, PALETTE.gray,
  PALETTE.navy, PALETTE.grayL, PALETTE.blue, PALETTE.bright, PALETTE.steel,
]

function ring(cx: number, cy: number, R: number, r: number) {
  const n = RING.length
  const gap = 2.4
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180
  return RING.map((color, i) => {
    const s = (i * 360) / n + gap / 2
    const e = ((i + 1) * 360) / n - gap / 2
    const sr = toRad(s), er = toRad(e)
    const x1 = cx + R * Math.cos(sr), y1 = cy + R * Math.sin(sr)
    const x2 = cx + R * Math.cos(er), y2 = cy + R * Math.sin(er)
    const x3 = cx + r * Math.cos(er), y3 = cy + r * Math.sin(er)
    const x4 = cx + r * Math.cos(sr), y4 = cy + r * Math.sin(sr)
    return (
      <path key={i}
        d={`M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 0 0 ${x4} ${y4} Z`}
        fill={color} />
    )
  })
}

export default function LogoBioSyn({ width = 188 }: { width?: number }) {
  const h = width * (64 / 220)
  return (
    <svg width={width} height={h} viewBox="0 0 220 64" style={{ display: 'block' }}>
      {ring(33, 32, 27, 15.5)}
      <text x={67} y={37} fontFamily="var(--font-display), sans-serif" fontWeight={800}
        fontSize={27} letterSpacing="-1" fill={PALETTE.navy}>BioSyn</text>
      <text x={68} y={53} fontFamily="var(--font-display), sans-serif" fontWeight={600}
        fontSize={11} letterSpacing="2.5" fill={PALETTE.gray}>Saúde Animal</text>
    </svg>
  )
}
