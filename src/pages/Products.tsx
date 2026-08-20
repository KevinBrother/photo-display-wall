import { useState, useEffect, useRef } from 'react'

const CASES = [
  { id: 'meridian', index: '001', client: 'Meridian Bank', category: 'Brand Identity · Digital', year: '2024', title: 'Redefining trust\nin financial services', desc: 'A full brand overhaul for a challenger bank entering three European markets. We rebuilt their visual language from the ground up — mark, type system, motion principles, and a design system used across iOS, Android, and web.', tags: ['Identity', 'Motion', 'Design System'], img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format', accent: '#4A6CF7', wide: true },
  { id: 'velour', index: '002', client: 'Velour', category: 'Fashion · Editorial', year: '2024', title: 'Season lookbook', desc: 'Art direction and interactive editorial for SS24. Shot on location in Lisbon over five days.', tags: ['Art Direction', 'Photography'], img: 'https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=600&h=800&fit=crop&auto=format', accent: '#C94040', wide: false },
  { id: 'forma', index: '003', client: 'Forma OS', category: 'Product · SaaS', year: '2023', title: 'Zero-to-launch\nin 14 weeks', desc: 'End-to-end product design for a project management platform. From strategy and UX research to a shipped design system in Figma and Storybook.', tags: ['UX Research', 'Product Design', 'Design System'], img: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&h=700&fit=crop&auto=format', accent: '#2EC4B6', wide: false },
  { id: 'arch', index: '004', client: 'Studio Voss', category: 'Architecture · Spatial', year: '2023', title: 'Invisible interface\nfor a visible space', desc: 'Environmental graphic design and wayfinding for a 14-storey mixed-use development in Copenhagen. Every sign, surface, and digital touchpoint designed as one coherent system.', tags: ['Wayfinding', 'Spatial', 'Typography'], img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=560&fit=crop&auto=format', accent: '#E8A838', wide: true },
  { id: 'sono', index: '005', client: 'Sono Audio', category: 'Product · Hardware Brand', year: '2022', title: 'Sound, visualized', desc: 'Brand identity and packaging for a boutique audio hardware company. The mark abstracts acoustic waveforms into a geometric system that scales from product to billboard.', tags: ['Identity', 'Packaging', '3D'], img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=700&fit=crop&auto=format', accent: '#9B5DE5', wide: false },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function CaseCard({ c, offset = 0 }: { c: typeof CASES[0], offset?: number }) {
  const { ref, visible } = useInView(0.15)
  const [hovered, setHovered] = useState(false)

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ opacity: visible ? 1 : 0, transform: visible ? `translateY(${offset}px)` : `translateY(${40 + offset}px)`, transition: 'opacity 0.9s ease, transform 0.9s ease', cursor: 'pointer', gridColumn: c.wide ? 'span 2' : 'span 1' }}>

      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', boxShadow: hovered ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${c.accent}40` : `0 8px 32px rgba(0,0,0,0.3)`, transition: 'box-shadow 0.4s ease' }}>
        <img src={c.img} alt={c.client} style={{ width: '100%', height: c.wide ? 420 : 360, objectFit: 'cover', display: 'block', filter: hovered ? 'brightness(0.6) saturate(0.9)' : 'brightness(0.45) saturate(0.6)', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'filter 0.5s ease, transform 0.6s ease' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: c.accent, transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.4s ease', transformOrigin: 'left' }} />
        <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(240,236,228,0.35)', letterSpacing: '0.15em' }}>{c.index}</div>
        <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(240,236,228,0.35)', letterSpacing: '0.15em' }}>{c.year}</div>
      </div>

      <div style={{ padding: '28px 4px 0', display: 'grid', gridTemplateColumns: c.wide ? '1fr 1fr' : '1fr', gap: c.wide ? 32 : 0 }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 10px' }}>{c.client} · {c.category}</p>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: c.wide ? 28 : 20, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--fg)', margin: 0, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{c.title}</h3>
        </div>
        <div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: `rgba(var(--fg-rgb),0.45)`, margin: '0 0 16px' }}>{c.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {c.tags.map(tag => (
              <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.accent, border: `1px solid ${c.accent}50`, padding: '4px 10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Identity', 'Product', 'Editorial', 'Spatial']

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Header */}
      <section style={{ padding: '72px 48px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>Selected work · 2020–2024</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: 900, letterSpacing: '-0.035em', color: 'var(--fg)', margin: 0, lineHeight: 0.92, textTransform: 'uppercase' }}>
            What we've<br /><span style={{ color: `rgba(var(--fg-rgb),0.22)` }}>made</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 24 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.75, color: `rgba(var(--fg-rgb),0.45)`, margin: 0 }}>
            A selection of client engagements spanning identity, digital product, editorial, and spatial design.
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '7px 16px', border: filter === cat ? `1px solid rgba(var(--fg-rgb),0.6)` : `1px solid rgba(var(--border-rgb),0.12)`, background: filter === cat ? `rgba(var(--fg-rgb),0.08)` : 'transparent', color: filter === cat ? 'var(--fg)' : `rgba(var(--fg-rgb),0.4)`, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '72px 48px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px 40px' }}>
          {CASES.map((c, i) => <CaseCard key={c.id} c={c} offset={i % 2 === 1 ? 48 : 0} />)}
        </div>
      </section>
    </div>
  )
}
