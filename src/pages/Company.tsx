import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: '2016', label: 'Founded' },
  { value: '48+', label: 'Team members' },
  { value: '230+', label: 'Projects delivered' },
  { value: '19', label: 'Countries' },
]

const VALUES = [
  { num: '01', title: 'Radical clarity', body: 'We strip every brief to its essential truth before we touch a canvas. Complexity is the enemy of impact.' },
  { num: '02', title: 'Craft over speed', body: "We schedule time for second-guessing. The work that ships is the work we'd hang on a wall." },
  { num: '03', title: 'Uncomfortable honesty', body: "We tell clients when an idea won't work. A trusted partner is worth more than a comfortable vendor." },
  { num: '04', title: 'Perpetual curiosity', body: 'Every discipline bleeds into ours. We read, watch, travel, and bring that friction back to the studio.' },
]

const TEAM = [
  { name: 'Maren Holst', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&auto=format', rot: -4 },
  { name: 'Jin Park', role: 'Head of Strategy', img: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=500&fit=crop&auto=format', rot: 3 },
  { name: 'Sofia Reyes', role: 'Lead Designer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&auto=format', rot: -2 },
  { name: 'Luca Ferri', role: 'Technical Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format', rot: 5 },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export default function Company() {
  const heroRef = useInView(0.1)
  const statsRef = useInView(0.2)
  const valuesRef = useInView(0.1)
  const teamRef = useInView(0.1)

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* Hero */}
      <section ref={heroRef.ref} style={{ minHeight: '90vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ padding: '80px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 24px' }}>
            Est. 2016 · Oslo / Seoul / Milan
          </p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(52px, 6vw, 88px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.035em', margin: 0, color: 'var(--fg)', textTransform: 'uppercase', opacity: heroRef.visible ? 1 : 0, transform: heroRef.visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
            We build<br />
            <span style={{ color: `rgba(var(--fg-rgb),0.22)` }}>things</span><br />
            that last.
          </h2>
        </div>
        {/* Right image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=1100&fit=crop&auto=format" alt="Studio workspace" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.65)' }} />
          <div style={{ position: 'absolute', bottom: 48, right: -36, transform: 'rotate(90deg)', transformOrigin: 'bottom right' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(240,236,228,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>
              Axis Studio · Creative & Technology
            </p>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `rgba(var(--border-rgb),0.06)` }} />
      </section>

      {/* Stats */}
      <section ref={statsRef.ref} style={{ padding: '64px 48px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: `1px solid rgba(var(--border-rgb),0.07)`, borderTop: `1px solid rgba(var(--border-rgb),0.07)` }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ borderRight: i < STATS.length - 1 ? `1px solid rgba(var(--border-rgb),0.07)` : 'none', padding: '0 48px 0 0', opacity: statsRef.visible ? 1 : 0, transform: statsRef.visible ? 'none' : 'translateY(24px)', transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s` }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(40px, 4vw, 64px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--fg)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 10 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* About */}
      <section style={{ padding: '96px 48px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>About</p>
          <div style={{ width: 40, height: 1, background: `rgba(var(--fg-rgb),0.2)` }} />
        </div>
        <div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 300, lineHeight: 1.55, color: `rgba(var(--fg-rgb),0.85)`, margin: '0 0 32px' }}>
            Axis Studio is an independent creative practice working at the intersection of visual identity, digital product, and spatial design. We partner with brands and founders who believe that the way something looks is inseparable from what it means.
          </p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.75, color: `rgba(var(--fg-rgb),0.45)`, margin: 0 }}>
            Founded in Oslo, we now operate from studios in Seoul and Milan. Our work spans brand systems, interactive installations, editorial campaigns, and software products — all held together by a relentless obsession with the detail that most people never notice but everyone feels.
          </p>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef.ref} style={{ padding: '0 48px 96px' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 48px' }}>Our values</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: `rgba(var(--border-rgb),0.07)`, border: `1px solid rgba(var(--border-rgb),0.07)` }}>
          {VALUES.map((v, i) => (
            <div key={v.num} style={{ padding: '48px', background: 'var(--bg)', opacity: valuesRef.visible ? 1 : 0, transform: valuesRef.visible ? 'none' : 'translateY(32px)', transition: `opacity 0.8s ease ${i * 0.12}s, transform 0.8s ease ${i * 0.12}s` }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.15em' }}>{v.num}</span>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg)', margin: '16px 0 16px' }}>{v.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, color: `rgba(var(--fg-rgb),0.5)`, margin: 0 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef.ref} style={{ padding: '0 48px 120px' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 48px' }}>Core team</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {TEAM.map((member, i) => (
            <div key={member.name} style={{ opacity: teamRef.visible ? 1 : 0, transform: teamRef.visible ? `rotate(${member.rot}deg)` : `rotate(${member.rot}deg) translateY(40px)`, transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`, marginTop: i % 2 === 1 ? 32 : 0 }}>
              <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(var(--border-rgb),0.07)` }}>
                <img src={member.img} alt={member.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block', filter: 'brightness(0.8) saturate(0.7)' }} />
              </div>
              <div style={{ padding: '16px 4px 0' }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--fg)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{member.name}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
