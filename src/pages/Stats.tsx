import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

// ── Categorical palette (validated for light surfaces, AA contrast) ──
const CAT = ['#2563EB', '#16A34A', '#DC2626', '#D97706', '#7C3AED', '#0891B2', '#BE185D']

// ── Raw dataset (mirrors Archive page + photographer attribution) ──
const RAW = [
  { id: 'p001', date: '2024-03-12', category: 'Street',       camera: 'Fujifilm X-T5',       photographer: 'Maren Holst',  iso: 1600, shutter: 1/250,  aperture: 2.0  },
  { id: 'p002', date: '2024-01-08', category: 'Street',       camera: 'Leica M11',            photographer: 'Jin Park',     iso: 800,  shutter: 1/500,  aperture: 2.8  },
  { id: 'p003', date: '2023-11-21', category: 'Urban',        camera: 'Sony A7R V',           photographer: 'Sofia Reyes',  iso: 200,  shutter: 1/1000, aperture: 5.6  },
  { id: 'p004', date: '2023-09-04', category: 'Street',       camera: 'Fujifilm X100VI',      photographer: 'Luca Ferri',   iso: 400,  shutter: 1/30,   aperture: 8.0  },
  { id: 'p005', date: '2024-05-18', category: 'Portrait',     camera: 'Nikon Z9',             photographer: 'Maren Holst',  iso: 100,  shutter: 1/200,  aperture: 1.4  },
  { id: 'p006', date: '2024-02-29', category: 'Portrait',     camera: 'Canon EOS R5',         photographer: 'Jin Park',     iso: 250,  shutter: 1/320,  aperture: 1.6  },
  { id: 'p007', date: '2023-08-15', category: 'Portrait',     camera: 'Leica M10 Monochrom',  photographer: 'Sofia Reyes',  iso: 3200, shutter: 1/500,  aperture: 2.0  },
  { id: 'p008', date: '2024-06-03', category: 'Fashion',      camera: 'Hasselblad X2D 100C',  photographer: 'Maren Holst',  iso: 64,   shutter: 1/800,  aperture: 4.0  },
  { id: 'p009', date: '2023-12-10', category: 'Architecture', camera: 'Sony A7R V',           photographer: 'Luca Ferri',   iso: 800,  shutter: 1/60,   aperture: 8.0  },
  { id: 'p010', date: '2023-10-22', category: 'Landscape',    camera: 'Canon EOS R5',         photographer: 'Jin Park',     iso: 100,  shutter: 4,      aperture: 11   },
  { id: 'p011', date: '2024-04-07', category: 'Fashion',      camera: 'Fujifilm GFX 100S',    photographer: 'Sofia Reyes',  iso: 200,  shutter: 1/640,  aperture: 2.8  },
  { id: 'p012', date: '2023-07-30', category: 'Architecture', camera: 'Leica Q3',             photographer: 'Luca Ferri',   iso: 100,  shutter: 1/500,  aperture: 5.6  },
  { id: 'p013', date: '2024-07-14', category: 'Street',       camera: 'Fujifilm X-T5',        photographer: 'Maren Holst',  iso: 160,  shutter: 1/1000, aperture: 2.0  },
  { id: 'p014', date: '2023-11-05', category: 'Street',       camera: 'Sony A7 IV',           photographer: 'Jin Park',     iso: 3200, shutter: 1/125,  aperture: 1.8  },
  { id: 'p015', date: '2024-08-01', category: 'Landscape',    camera: 'Nikon Z8',             photographer: 'Sofia Reyes',  iso: 400,  shutter: 1/30,   aperture: 8.0  },
  { id: 'p016', date: '2024-01-25', category: 'Street',       camera: 'Ricoh GR IIIx',        photographer: 'Luca Ferri',   iso: 6400, shutter: 1/60,   aperture: 2.8  },
  { id: 'p017', date: '2023-09-18', category: 'Abstract',     camera: 'Leica M11',            photographer: 'Maren Holst',  iso: 200,  shutter: 1/500,  aperture: 0.95 },
  { id: 'p018', date: '2024-05-01', category: 'Urban',        camera: 'Canon EOS R3',         photographer: 'Sofia Reyes',  iso: 640,  shutter: 1/800,  aperture: 4.0  },
]

// ── Derived aggregations ──
function groupCount<T extends string>(arr: { [k: string]: T }[], key: string): { name: T; count: number }[] {
  const m: Record<string, number> = {}
  arr.forEach(r => { const v = (r as Record<string, string>)[key]; m[v] = (m[v] ?? 0) + 1 })
  return Object.entries(m).map(([name, count]) => ({ name: name as T, count })).sort((a, b) => b.count - a.count)
}

const byCategory    = groupCount(RAW as never[], 'category')
const byCamera      = groupCount(RAW as never[], 'camera').slice(0, 8)
const byPhotographer = groupCount(RAW as never[], 'photographer')

const byMonth = (() => {
  const m: Record<string, number> = {}
  RAW.forEach(r => {
    const ym = r.date.slice(0, 7)
    m[ym] = (m[ym] ?? 0) + 1
  })
  return Object.entries(m).sort(([a], [b]) => a.localeCompare(b)).map(([name, count]) => ({ name: name.replace(/^\d{4}-/, ''), month: name, count }))
})()

const by2023 = RAW.filter(r => r.date.startsWith('2023')).length
const by2024 = RAW.filter(r => r.date.startsWith('2024')).length

const avgISO = Math.round(RAW.reduce((s, r) => s + r.iso, 0) / RAW.length)
const avgAperture = (RAW.reduce((s, r) => s + r.aperture, 0) / RAW.length).toFixed(1)

const isoRanges = [
  { name: '≤ 200',   count: RAW.filter(r => r.iso <= 200).length },
  { name: '201–800', count: RAW.filter(r => r.iso > 200 && r.iso <= 800).length },
  { name: '801–3200',count: RAW.filter(r => r.iso > 800 && r.iso <= 3200).length },
  { name: '> 3200',  count: RAW.filter(r => r.iso > 3200).length },
]

// ── Custom tooltip ──
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid rgba(var(--border-rgb),0.12)', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <p style={{ margin: '0 0 4px', color: `rgba(var(--fg-rgb),0.5)`, letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: 0, color: 'var(--fg)', fontWeight: 600, fontSize: 15 }}>{payload[0].value}</p>
    </div>
  )
}

// ── Stat tile ──
function KPI({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ padding: '28px 32px', border: `1px solid rgba(var(--border-rgb),0.1)`, background: 'var(--surface)' }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.38)`, letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 10px' }}>{label}</p>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, margin: '8px 0 0', letterSpacing: '0.1em' }}>{sub}</p>}
    </div>
  )
}

// ── Section wrapper ──
function Section({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{label}</p>
        <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.1)` }} />
      </div>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', margin: '0 0 32px' }}>{title}</h3>
      {children}
    </section>
  )
}

// ── Year toggle ──
type YearFilter = '2023' | '2024' | 'all'

export default function Stats() {
  const [yearFilter, setYearFilter] = useState<YearFilter>('all')

  const filtered = yearFilter === 'all' ? RAW : RAW.filter(r => r.date.startsWith(yearFilter))
  const filteredByCategory    = groupCount(filtered as never[], 'category')
  const filteredByCamera      = groupCount(filtered as never[], 'camera').slice(0, 8)
  const filteredByPhotographer = groupCount(filtered as never[], 'photographer')

  const axisStyle = { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: `rgba(var(--fg-rgb),0.4)` } as const

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Header */}
      <section style={{ padding: '64px 48px 52px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              Analytics · Jul 2023 – Aug 2024
            </p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--fg)', margin: 0, lineHeight: 0.92, textTransform: 'uppercase' }}>
              {RAW.length} shots<br />
              <span style={{ color: `rgba(var(--fg-rgb),0.22)`, fontSize: '0.55em', fontWeight: 300, letterSpacing: '-0.01em', textTransform: 'none' }}>across 13 cameras · 4 photographers</span>
            </h2>
          </div>

          {/* Year filter */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['all', '2023', '2024'] as YearFilter[]).map(y => (
              <button key={y} onClick={() => setYearFilter(y)}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 18px', border: yearFilter === y ? `1px solid rgba(var(--border-rgb),0.5)` : `1px solid rgba(var(--border-rgb),0.12)`, background: yearFilter === y ? `rgba(var(--fg-rgb),0.08)` : 'transparent', color: yearFilter === y ? 'var(--fg)' : `rgba(var(--fg-rgb),0.38)`, cursor: 'pointer', transition: 'all 0.18s ease' }}>
                {y === 'all' ? 'All time' : y}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '52px 48px 96px' }}>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, marginBottom: 64, background: `rgba(var(--border-rgb),0.08)` }}>
          <KPI label="Total frames" value={filtered.length} />
          <KPI label="2023" value={filtered.filter(r => r.date.startsWith('2023')).length} sub="frames shot" />
          <KPI label="2024" value={filtered.filter(r => r.date.startsWith('2024')).length} sub="frames shot" />
          <KPI label="Avg ISO" value={Math.round(filtered.reduce((s, r) => s + r.iso, 0) / (filtered.length || 1))} />
          <KPI label="Avg aperture" value={`f/${(filtered.reduce((s, r) => s + r.aperture, 0) / (filtered.length || 1)).toFixed(1)}`} />
        </div>

        {/* Monthly timeline */}
        <Section label="01 / Timeline" title="Frames per month">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={`rgba(var(--border-rgb),0.08)`} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: `rgba(var(--border-rgb),0.15)`, strokeWidth: 1 }} />
                <Line type="monotone" dataKey="count" stroke={CAT[0]} strokeWidth={2} dot={{ r: 4, fill: CAT[0], strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* 2-col row: category + photographer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }}>

          {/* By category — horizontal bars */}
          <Section label="02 / Genre" title="Shots by category">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredByCategory} layout="vertical" margin={{ top: 0, right: 32, left: 0, bottom: 0 }} barSize={14}>
                  <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={88} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: `rgba(var(--border-rgb),0.05)` }} />
                  <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                    {filteredByCategory.map((_, i) => <Cell key={i} fill={CAT[i % CAT.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* By photographer — pie */}
          <Section label="03 / Photographer" title="Shots by shooter">
            <div style={{ height: 260, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={filteredByPhotographer} dataKey="count" nameKey="name" cx="42%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2} strokeWidth={0}>
                    {filteredByPhotographer.map((_, i) => <Cell key={i} fill={CAT[i % CAT.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.6)` }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Direct labels */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginTop: 16 }}>
              {filteredByPhotographer.map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT[i % CAT.length], flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--fg)', fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)` }}>{p.count}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Camera ranking — full width */}
        <Section label="04 / Equipment" title="Most-used cameras">
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredByCamera} margin={{ top: 4, right: 8, left: -16, bottom: 48 }} barSize={28}>
                <CartesianGrid vertical={false} stroke={`rgba(var(--border-rgb),0.08)`} />
                <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 11 }} axisLine={false} tickLine={false} angle={-32} textAnchor="end" interval={0} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: `rgba(var(--border-rgb),0.05)` }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {filteredByCamera.map((_, i) => <Cell key={i} fill={i === 0 ? CAT[0] : `rgba(var(--border-rgb),0.18)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Champion callout */}
          {filteredByCamera[0] && (
            <div style={{ marginTop: 24, padding: '16px 24px', background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.1)`, display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: CAT[0], letterSpacing: '0.15em', textTransform: 'uppercase' }}>Most used</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--fg)' }}>{filteredByCamera[0].name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: `rgba(var(--fg-rgb),0.45)` }}>{filteredByCamera[0].count} frame{filteredByCamera[0].count !== 1 ? 's' : ''}</span>
            </div>
          )}
        </Section>

        {/* ISO distribution */}
        <Section label="05 / Exposure" title="ISO sensitivity distribution">
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={isoRanges} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={48}>
                <CartesianGrid vertical={false} stroke={`rgba(var(--border-rgb),0.08)`} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: `rgba(var(--border-rgb),0.05)` }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {isoRanges.map((_, i) => <Cell key={i} fill={CAT[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Overall avg ISO</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fg)', margin: 0 }}>{avgISO}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Overall avg aperture</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fg)', margin: 0 }}>f/{avgAperture}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Year-on-year</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--fg)', margin: 0 }}>
                {by2023} → {by2024}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: by2024 >= by2023 ? '#16A34A' : '#DC2626', marginLeft: 10, fontWeight: 400 }}>
                  {by2024 >= by2023 ? '↑' : '↓'} {Math.abs(by2024 - by2023)} shots
                </span>
              </p>
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}
