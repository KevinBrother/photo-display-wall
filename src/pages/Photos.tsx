import { useTranslation } from "react-i18next"
import { useState, useMemo } from 'react'

interface ExifData {
  camera: string; lens: string; focalLength: string; aperture: string
  shutter: string; iso: number; exposureComp: string; whiteBalance: string
  flash: string; metering: string; focusMode: string
}
interface PhotoRecord {
  id: string; title: string; location: string; date: string; time: string; category: string; exif: ExifData
}

const ALL_PHOTOS: PhotoRecord[] = [
  { id: 'p001', title: 'Man with umbrella, Shinjuku crossing', location: 'Tokyo, Japan', date: '2024-03-12', time: '18:44', category: 'Street', exif: { camera: 'Fujifilm X-T5', lens: 'XF 35mm f/1.4 R', focalLength: '35mm (52mm eq.)', aperture: 'f/2.0', shutter: '1/250s', iso: 1600, exposureComp: '-0.7 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Spot', focusMode: 'AF-C' } },
  { id: 'p002', title: 'Woman walking, wet asphalt', location: 'Copenhagen, Denmark', date: '2024-01-08', time: '07:22', category: 'Street', exif: { camera: 'Leica M11', lens: 'Summicron-M 28mm f/2', focalLength: '28mm', aperture: 'f/2.8', shutter: '1/500s', iso: 800, exposureComp: '0 EV', whiteBalance: 'Daylight', flash: 'Off', metering: 'Center-weighted', focusMode: 'Manual' } },
  { id: 'p003', title: 'Intersection, yellow cabs', location: 'New York, USA', date: '2023-11-21', time: '14:10', category: 'Urban', exif: { camera: 'Sony A7R V', lens: 'FE 24-70mm f/2.8 GM II', focalLength: '35mm', aperture: 'f/5.6', shutter: '1/1000s', iso: 200, exposureComp: '+0.3 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Evaluative', focusMode: 'AF-C' } },
  { id: 'p004', title: 'Cyclist, motion blur', location: 'Amsterdam, Netherlands', date: '2023-09-04', time: '09:55', category: 'Street', exif: { camera: 'Fujifilm X100VI', lens: 'Built-in 23mm f/2', focalLength: '23mm (35mm eq.)', aperture: 'f/8.0', shutter: '1/30s', iso: 400, exposureComp: '-0.3 EV', whiteBalance: 'Cloudy', flash: 'Off', metering: 'Evaluative', focusMode: 'AF-S' } },
  { id: 'p005', title: 'Editorial portrait, black top', location: 'Studio, Milan', date: '2024-05-18', time: '11:30', category: 'Portrait', exif: { camera: 'Nikon Z9', lens: 'NIKKOR Z 85mm f/1.2 S', focalLength: '85mm', aperture: 'f/1.4', shutter: '1/200s', iso: 100, exposureComp: '0 EV', whiteBalance: '5500K', flash: 'Profoto B10X', metering: 'Spot', focusMode: 'AF-S' } },
  { id: 'p006', title: 'Blue-eyed portrait, natural light', location: 'Prague, Czech Republic', date: '2024-02-29', time: '13:05', category: 'Portrait', exif: { camera: 'Canon EOS R5', lens: 'RF 50mm f/1.2 L USM', focalLength: '50mm', aperture: 'f/1.6', shutter: '1/320s', iso: 250, exposureComp: '+0.7 EV', whiteBalance: 'Shade', flash: 'Off', metering: 'Center-weighted', focusMode: 'Face-detect' } },
  { id: 'p007', title: 'B&W close-up, tank top', location: 'Barcelona, Spain', date: '2023-08-15', time: '16:48', category: 'Portrait', exif: { camera: 'Leica M10 Monochrom', lens: 'APO-Summicron-M 90mm f/2', focalLength: '90mm', aperture: 'f/2.0', shutter: '1/500s', iso: 3200, exposureComp: '-0.3 EV', whiteBalance: 'N/A (mono)', flash: 'Off', metering: 'Spot', focusMode: 'Manual' } },
  { id: 'p008', title: 'Red dress, desert backlight', location: 'Almería, Spain', date: '2024-06-03', time: '19:22', category: 'Fashion', exif: { camera: 'Hasselblad X2D 100C', lens: 'XCD 65mm f/2.8', focalLength: '65mm (51mm eq.)', aperture: 'f/4.0', shutter: '1/800s', iso: 64, exposureComp: '-1.0 EV', whiteBalance: 'Daylight', flash: 'Off', metering: 'Spot', focusMode: 'AF-S' } },
  { id: 'p009', title: 'City highrise, dusk geometry', location: 'Seoul, South Korea', date: '2023-12-10', time: '17:38', category: 'Architecture', exif: { camera: 'Sony A7R V', lens: 'FE 16-35mm f/2.8 GM', focalLength: '24mm', aperture: 'f/8.0', shutter: '1/60s', iso: 800, exposureComp: '-0.7 EV', whiteBalance: 'Tungsten', flash: 'Off', metering: 'Evaluative', focusMode: 'AF-S' } },
  { id: 'p010', title: 'Forest river, long exposure', location: 'Black Forest, Germany', date: '2023-10-22', time: '08:15', category: 'Landscape', exif: { camera: 'Canon EOS R5', lens: 'RF 24mm f/1.8 Macro IS STM', focalLength: '24mm', aperture: 'f/11', shutter: '4s', iso: 100, exposureComp: '0 EV', whiteBalance: 'Shade', flash: 'Off', metering: 'Evaluative', focusMode: 'Manual' } },
  { id: 'p011', title: 'Woman, coat obscuring face', location: 'Warsaw, Poland', date: '2024-04-07', time: '12:00', category: 'Fashion', exif: { camera: 'Fujifilm GFX 100S', lens: 'GF 110mm f/2 R LM WR', focalLength: '110mm (87mm eq.)', aperture: 'f/2.8', shutter: '1/640s', iso: 200, exposureComp: '+0.3 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Spot', focusMode: 'Face-detect' } },
  { id: 'p012', title: 'Brutalist facade, symmetry', location: 'Brussels, Belgium', date: '2023-07-30', time: '11:10', category: 'Architecture', exif: { camera: 'Leica Q3', lens: 'Summilux 28mm f/1.7', focalLength: '28mm', aperture: 'f/5.6', shutter: '1/500s', iso: 100, exposureComp: '0 EV', whiteBalance: 'Daylight', flash: 'Off', metering: 'Evaluative', focusMode: 'AF-S' } },
  { id: 'p013', title: 'Golden hour alley', location: 'Lisbon, Portugal', date: '2024-07-14', time: '20:05', category: 'Street', exif: { camera: 'Fujifilm X-T5', lens: 'XF 23mm f/1.4 R LM WR', focalLength: '23mm (35mm eq.)', aperture: 'f/2.0', shutter: '1/1000s', iso: 160, exposureComp: '-0.7 EV', whiteBalance: 'Daylight', flash: 'Off', metering: 'Spot', focusMode: 'AF-S' } },
  { id: 'p014', title: 'Night market, neon reflections', location: 'Hong Kong, China', date: '2023-11-05', time: '22:30', category: 'Street', exif: { camera: 'Sony A7 IV', lens: 'FE 35mm f/1.4 GM', focalLength: '35mm', aperture: 'f/1.8', shutter: '1/125s', iso: 3200, exposureComp: '+0.3 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Spot', focusMode: 'AF-C' } },
  { id: 'p015', title: 'Mountain sunrise, fog layer', location: 'Lofoten, Norway', date: '2024-08-01', time: '04:52', category: 'Landscape', exif: { camera: 'Nikon Z8', lens: 'NIKKOR Z 14-24mm f/2.8 S', focalLength: '14mm', aperture: 'f/8.0', shutter: '1/30s', iso: 400, exposureComp: '+0.7 EV', whiteBalance: 'Cloudy', flash: 'Off', metering: 'Evaluative', focusMode: 'Manual' } },
  { id: 'p016', title: 'Underground, commuter silhouette', location: 'London, UK', date: '2024-01-25', time: '08:44', category: 'Street', exif: { camera: 'Ricoh GR IIIx', lens: 'Built-in 40mm f/2.8', focalLength: '40mm (60mm eq.)', aperture: 'f/2.8', shutter: '1/60s', iso: 6400, exposureComp: '-0.7 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Center-weighted', focusMode: 'Snap' } },
  { id: 'p017', title: 'Rain on glass, bokeh city', location: 'Zurich, Switzerland', date: '2023-09-18', time: '19:10', category: 'Abstract', exif: { camera: 'Leica M11', lens: 'Noctilux-M 50mm f/0.95', focalLength: '50mm', aperture: 'f/0.95', shutter: '1/500s', iso: 200, exposureComp: '0 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Spot', focusMode: 'Manual' } },
  { id: 'p018', title: 'Crowd, overhead perspective', location: 'Shanghai, China', date: '2024-05-01', time: '15:22', category: 'Urban', exif: { camera: 'Canon EOS R3', lens: 'RF 70-200mm f/2.8 L IS USM', focalLength: '135mm', aperture: 'f/4.0', shutter: '1/800s', iso: 640, exposureComp: '-0.3 EV', whiteBalance: 'Auto', flash: 'Off', metering: 'Evaluative', focusMode: 'AF-C' } },
]

const PAGE_SIZE = 8
const CATEGORIES = ['All', 'Street', 'Portrait', 'Fashion', 'Architecture', 'Landscape', 'Urban', 'Abstract']
const CATEGORY_COLORS: Record<string, string> = { Street: '#4A6CF7', Portrait: '#2EC4B6', Fashion: '#C94040', Architecture: '#E8A838', Landscape: '#5BB974', Urban: '#9B5DE5', Abstract: '#F77F4A' }

function ExifRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '5px 0', borderBottom: `1px solid rgba(var(--border-rgb),0.05)` }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.75)`, textAlign: 'right', letterSpacing: '0.04em' }}>{value}</span>
    </div>
  )
}

function PhotoRow({ photo, rank }: { photo: PhotoRecord; rank: number }) {
  const [expanded, setExpanded] = useState(false)
  const color = CATEGORY_COLORS[photo.category] ?? '#9B9BA8'

  return (
    <div style={{ borderBottom: `1px solid rgba(var(--border-rgb),0.06)`, transition: 'background 0.2s ease', background: expanded ? `rgba(var(--fg-rgb),0.025)` : 'transparent' }}>
      <div onClick={() => setExpanded(v => !v)} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 180px 120px 96px 96px 80px 40px', gap: 0, alignItems: 'center', padding: '0 32px', height: 58, cursor: 'pointer', userSelect: 'none' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.22)`, letterSpacing: '0.08em' }}>{String(rank).padStart(3, '0')}</span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--fg)', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.title}</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, margin: 0, letterSpacing: '0.08em', marginTop: 2 }}>{photo.location}</p>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.55)`, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.exif.camera}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.45)`, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.exif.focalLength}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.7)`, letterSpacing: '0.04em' }}>{photo.exif.shutter}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.7)`, letterSpacing: '0.04em' }}>{photo.exif.aperture}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.7)`, letterSpacing: '0.04em' }}>{photo.exif.iso}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: `rgba(var(--fg-rgb),0.25)`, transform: expanded ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s ease', lineHeight: 1, justifySelf: 'end' }}>+</span>
      </div>

      <div style={{ maxHeight: expanded ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ padding: '0 32px 28px 80px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 40px' }}>
          {[
            { heading: 'Capture', rows: [['Date', photo.date], ['Time', photo.time], ['Location', photo.location]] },
            { heading: 'Exposure', rows: [['Shutter', photo.exif.shutter], ['Aperture', photo.exif.aperture], ['ISO', photo.exif.iso], ['Exp. Comp', photo.exif.exposureComp]] },
            { heading: 'Optics', rows: [['Camera', photo.exif.camera], ['Lens', photo.exif.lens], ['Focal Length', photo.exif.focalLength]] },
            { heading: 'Settings', rows: [['White Bal.', photo.exif.whiteBalance], ['Metering', photo.exif.metering], ['Focus Mode', photo.exif.focusMode], ['Flash', photo.exif.flash]] },
          ].map(col => (
            <div key={col.heading}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.2)`, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 8px' }}>{col.heading}</p>
              {col.rows.map(([l, v]) => <ExifRow key={l} label={l} value={v} />)}
            </div>
          ))}
        </div>
        <div style={{ padding: '0 32px 20px 80px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: color }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{photo.category}</span>
        </div>
      </div>
    </div>
  )
}

export default function Photos() {
  const { i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'date' | 'iso' | 'shutter'>('date')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let data = ALL_PHOTOS.filter(p => {
      const matchCat = category === 'All' || p.category === category
      const q = search.toLowerCase()
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.exif.camera.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
    return [...data].sort((a, b) => {
      if (sort === 'date') return b.date.localeCompare(a.date)
      if (sort === 'iso') return b.exif.iso - a.exif.iso
      if (sort === 'shutter') {
        const toSec = (s: string) => s.includes('/') ? Number(s.replace('s','').split('/')[0]) / Number(s.replace('s','').split('/')[1]) : parseFloat(s)
        return toSec(b.exif.shutter) - toSec(a.exif.shutter)
      }
      return 0
    })
  }, [category, sort, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Header */}
      <section style={{ padding: '64px 48px 40px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'end', marginBottom: 36 }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>{i18n.language === 'zh' ? '档案 · EXIF 记录' : 'Archive · EXIF Records'}</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--fg)', margin: 0, lineHeight: 0.92, textTransform: 'uppercase' }}>
              {ALL_PHOTOS.length} frames<br />
              <span style={{ color: `rgba(var(--fg-rgb),0.22)`, fontSize: '0.6em', fontWeight: 300, letterSpacing: '-0.01em', textTransform: 'none' }}>camera metadata log</span>
            </h2>
          </div>
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder={i18n.language === 'zh' ? '搜索标题、位置、相机…' : 'Search title, location, camera…'} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg)', background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.1)`, padding: '10px 16px 10px 36px', width: 280, outline: 'none', caretColor: 'var(--fg)' }} />
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="var(--fg)" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1) }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', border: category === cat ? `1px solid rgba(var(--fg-rgb),0.5)` : `1px solid rgba(var(--border-rgb),0.1)`, background: category === cat ? `rgba(var(--fg-rgb),0.07)` : 'transparent', color: category === cat ? 'var(--fg)' : `rgba(var(--fg-rgb),0.35)`, cursor: 'pointer', transition: 'all 0.18s ease' }}>
                {cat}{cat !== 'All' && <span style={{ marginLeft: 6, color: CATEGORY_COLORS[cat] ?? 'inherit', opacity: 0.7 }}>{ALL_PHOTOS.filter(p => p.category === cat).length}</span>}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 8 }}>Sort</span>
            {(['date', 'iso', 'shutter'] as const).map(s => (
              <button key={s} onClick={() => setSort(s)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', border: sort === s ? `1px solid rgba(var(--fg-rgb),0.4)` : '1px solid transparent', background: 'transparent', color: sort === s ? 'var(--fg)' : `rgba(var(--fg-rgb),0.3)`, cursor: 'pointer', transition: 'all 0.18s ease' }}>{i18n.language === 'zh' ? { date: '日期', iso: 'ISO', shutter: '快门' }[s] || s : s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 180px 120px 96px 96px 80px 40px', gap: 0, padding: '0 32px', height: 36, alignItems: 'center', background: `rgba(var(--fg-rgb),0.025)`, borderBottom: `1px solid rgba(var(--border-rgb),0.08)`, position: 'sticky', top: 68, zIndex: 10 }}>
        {['#', 'Title / Location', 'Camera', 'Focal Length', 'Shutter', 'Aperture', 'ISO', ''].map((h, i) => (
          <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.22)`, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? { '#': '#', 'Title / Location': '标题 / 位置', 'Camera': '相机', 'Focal Length': '焦距', 'Shutter': '快门', 'Aperture': '光圈', 'ISO': 'ISO', '': '' }[h] || h : h}</span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {pageData.length === 0 ? (
          <div style={{ padding: '80px 48px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '没有匹配的记录' : 'No records match'}</p>
          </div>
        ) : (
          pageData.map((photo, i) => <PhotoRow key={photo.id} photo={photo} rank={(page - 1) * PAGE_SIZE + i + 1} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '32px 32px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(var(--border-rgb),0.07)` }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.1em' }}>
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} {i18n.language === 'zh' ? `共 ${filtered.length} 条记录` : `of ${filtered.length} records`}
          </span>

          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '8px 14px', background: 'transparent', border: `1px solid rgba(var(--border-rgb),0.1)`, color: page === 1 ? `rgba(var(--fg-rgb),0.15)` : `rgba(var(--fg-rgb),0.55)`, cursor: page === 1 ? 'default' : 'pointer', transition: 'all 0.18s ease', letterSpacing: '0.05em' }}>←</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
              const isEllipsis = totalPages > 7 && Math.abs(n - page) > 2 && n !== 1 && n !== totalPages
              const showEllipsisBefore = n === page - 3 && page > 4
              const showEllipsisAfter = n === page + 3 && page < totalPages - 3
              if (isEllipsis && !showEllipsisBefore && !showEllipsisAfter) return null
              if (showEllipsisBefore || showEllipsisAfter) return <span key={n} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.2)`, padding: '0 4px' }}>…</span>
              return (
                <button key={n} onClick={() => setPage(n)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, width: 36, height: 36, background: page === n ? 'var(--fg)' : 'transparent', border: page === n ? 'none' : `1px solid rgba(var(--border-rgb),0.08)`, color: page === n ? 'var(--bg)' : `rgba(var(--fg-rgb),0.45)`, cursor: 'pointer', transition: 'all 0.18s ease', fontWeight: page === n ? 700 : 400, letterSpacing: '0.04em' }}>{n}</button>
              )
            })}

            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '8px 14px', background: 'transparent', border: `1px solid rgba(var(--border-rgb),0.1)`, color: page === totalPages ? `rgba(var(--fg-rgb),0.15)` : `rgba(var(--fg-rgb),0.55)`, cursor: page === totalPages ? 'default' : 'pointer', transition: 'all 0.18s ease', letterSpacing: '0.05em' }}>→</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '前往' : 'Go to'}</span>
            <input type="number" min={1} max={totalPages} defaultValue={page} key={page} onKeyDown={e => { if (e.key === 'Enter') { const v = parseInt((e.target as HTMLInputElement).value); if (v >= 1 && v <= totalPages) setPage(v) } }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, width: 48, padding: '7px 10px', background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.1)`, color: 'var(--fg)', outline: 'none', textAlign: 'center', letterSpacing: '0.04em' }} />
          </div>
        </div>
      )}
    </div>
  )
}
