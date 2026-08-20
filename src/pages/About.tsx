import { NavLink } from 'react-router'

const TEAM = [
  { name: 'Yuki Tanaka',   role: 'CEO & Co-founder',          since: '2022', avatar: 'YT' },
  { name: 'Reza Ahmadi',   role: 'CTO & Co-founder',          since: '2022', avatar: 'RA' },
  { name: 'Lena Müller',   role: 'Head of Product',           since: '2023', avatar: 'LM' },
  { name: 'Kofi Asante',   role: 'Lead Infrastructure Eng.',  since: '2023', avatar: 'KA' },
  { name: 'Priya Nair',    role: 'Head of Developer Relations', since: '2024', avatar: 'PN' },
  { name: 'Theo Bergmann', role: 'Security & Compliance',     since: '2024', avatar: 'TB' },
]

const MILESTONES = [
  { date: 'Q1 2022', text: 'Founded in Berlin. First private alpha with 12 design-studio partners.' },
  { date: 'Q3 2022', text: 'Seed round closed. Infrastructure migrated to multi-region on-demand cluster.' },
  { date: 'Q1 2023', text: 'Public beta launch. Credit-based billing and API key management introduced.' },
  { date: 'Q3 2023', text: 'Series A. Expanded model catalog to 18 providers.' },
  { date: 'Q1 2024', text: 'Prompt caching launched in beta. Cache pricing added to all LLM tiers.' },
  { date: 'Q2 2024', text: 'SOC 2 Type II certification achieved.' },
  { date: 'Q1 2026', text: 'Platform reaches 40,000 active developers. 9-model flagship lineup launched.' },
]

const VALUES = [
  {
    glyph: '◈',
    title: 'Transparent pricing',
    body: "No hidden fees, no surprise invoices. Every credit charge is logged in real time with model, token count, and timestamp. You pay exactly what you use.",
  },
  {
    glyph: '◉',
    title: 'Developer-first',
    body: 'We build for engineers. Every feature ships with a stable API before it gets a UI. Docs are a first-class product, not an afterthought.',
  },
  {
    glyph: '◫',
    title: 'Multi-provider by design',
    body: "We don't bet on a single foundation model vendor. Our routing layer gives you access to Anthropic, OpenAI, and Google under one key, one credit balance, one bill.",
  },
  {
    glyph: '◎',
    title: 'Security without ceremony',
    body: 'SOC 2 Type II certified. All keys are stored encrypted at rest. Scoped keys, automatic revocation on leak detection, and audit logs are standard — not add-ons.',
  },
]

export default function About() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{
        padding: '72px 48px 64px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.08)`,
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 22px',
        }}>
          Company · About
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end' }}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: 'var(--fg)',
            margin: 0,
            lineHeight: 0.9,
            textTransform: 'uppercase',
          }}>
            We build<br />
            <span style={{ color: `rgba(var(--fg-rgb),0.15)` }}>the layer</span><br />
            between you<br />
            <span style={{ color: `rgba(var(--fg-rgb),0.15)` }}>& every</span><br />
            frontier model.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.85,
              color: `rgba(var(--fg-rgb),0.55)`,
              margin: 0,
            }}>
              AXIS is a multi-provider AI inference platform built for developers and teams who need reliable, transparent access to the best foundation models — without vendor lock-in or unpredictable billing.
            </p>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.85,
              color: `rgba(var(--fg-rgb),0.38)`,
              margin: 0,
            }}>
              One credit balance. One API key. Anthropic, OpenAI, and Google — all under one roof.
            </p>
            <div style={{ display: 'flex', gap: 32, marginTop: 8 }}>
              {[
                { n: '40K+', label: 'Active developers' },
                { n: '9',    label: 'Flagship models' },
                { n: '3',    label: 'Providers' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: 'var(--fg)',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>{stat.n}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: `rgba(var(--fg-rgb),0.28)`,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '64px 48px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: '0 0 40px',
        }}>
          What we stand for
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: `rgba(var(--border-rgb),0.07)` }}>
          {VALUES.map(v => (
            <div key={v.title} style={{
              padding: '36px 36px',
              background: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                color: `rgba(var(--fg-rgb),0.18)`,
              }}>{v.glyph}</span>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                margin: 0,
              }}>{v.title}</h3>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.75,
                color: `rgba(var(--fg-rgb),0.48)`,
                margin: 0,
              }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '64px 48px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: '0 0 40px',
        }}>
          History
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: 32,
              paddingBottom: 28,
              marginBottom: 28,
              borderBottom: i < MILESTONES.length - 1 ? `1px solid rgba(var(--border-rgb),0.07)` : 'none',
              alignItems: 'baseline',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: `rgba(var(--fg-rgb),0.3)`,
                letterSpacing: '0.12em',
              }}>{m.date}</span>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.7,
                color: `rgba(var(--fg-rgb),0.6)`,
                margin: 0,
              }}>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '64px 48px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: '0 0 40px',
        }}>
          Team
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: `rgba(var(--border-rgb),0.07)` }}>
          {TEAM.map(person => (
            <div key={person.name} style={{
              padding: '28px 28px',
              background: 'var(--bg)',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40,
                height: 40,
                background: `rgba(var(--fg-rgb),0.06)`,
                border: `1px solid rgba(var(--border-rgb),0.1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: `rgba(var(--fg-rgb),0.4)`,
                letterSpacing: '0.06em',
                flexShrink: 0,
              }}>
                {person.avatar}
              </div>
              <div>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg)',
                  margin: '0 0 3px',
                }}>{person.name}</p>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 300,
                  color: `rgba(var(--fg-rgb),0.42)`,
                  margin: '0 0 6px',
                }}>{person.role}</p>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: `rgba(var(--fg-rgb),0.22)`,
                  letterSpacing: '0.1em',
                }}>since {person.since}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / links */}
      <section style={{ padding: '56px 48px 80px' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: '0 0 32px',
        }}>
          Contact
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'General inquiries', value: 'hello@axis.studio' },
            { label: 'Developer support', value: 'dev@axis.studio' },
            { label: 'Security disclosure', value: 'security@axis.studio' },
          ].map(c => (
            <div key={c.label} style={{
              padding: '20px 24px',
              border: `1px solid rgba(var(--border-rgb),0.1)`,
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: `rgba(var(--fg-rgb),0.28)`,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}>{c.label}</p>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--fg)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>{c.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
