import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export interface DocSection {
  id: string
  heading: string
  body: string[]   // paragraphs; strings starting with '• ' are list items
}

interface DocPageProps {
  category: string
  title: string
  subtitle: string
  effectiveDate: string
  lastUpdated: string
  sections: DocSection[]
}

export default function DocPage({ category, title, subtitle, effectiveDate, lastUpdated, sections }: DocPageProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const { t } = useTranslation()
  const contentRef = useRef<HTMLDivElement>(null)

  // Track active section via scroll position within the content column
  useEffect(() => {
    const scroller = contentRef.current
    if (!scroller) return

    function onScroll() {
      const headings = scroller!.querySelectorAll<HTMLElement>('[data-section]')
      let current = sections[0]?.id ?? ''
      for (const el of headings) {
        if (el.getBoundingClientRect().top - scroller!.getBoundingClientRect().top <= 80) {
          current = el.getAttribute('data-section') ?? current
        }
      }
      setActiveId(current)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [sections])

  function scrollTo(id: string) {
    const scroller = contentRef.current
    const el = scroller?.querySelector<HTMLElement>(`[data-section="${id}"]`)
    if (!scroller || !el) return
    const offset = el.offsetTop - 32
    scroller.scrollTo({ top: offset, behavior: 'smooth' })
  }

  return (
    // Fixed-height shell: header + split pane fill exactly the remaining viewport
    <div style={{
      height: 'calc(100vh - 68px)',
      marginTop: 68,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg)',
      color: 'var(--fg)',
    }}>
      {/* Header — fixed, does not scroll */}
      <section style={{
        flexShrink: 0,
        padding: '40px 48px 32px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.08)`,
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}>
          {t('doc.legal')}{category}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
          <div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(24px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.036em',
              color: 'var(--fg)',
              margin: '0 0 8px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}>
              {title}
            </h1>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: `rgba(var(--fg-rgb),0.38)`,
              margin: 0,
            }}>
              {subtitle}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: `rgba(var(--fg-rgb),0.28)`,
              letterSpacing: '0.1em',
              margin: '0 0 3px',
            }}>
              {t('doc.effective')}{effectiveDate}
            </p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: `rgba(var(--fg-rgb),0.18)`,
              letterSpacing: '0.1em',
              margin: 0,
            }}>
              {t('doc.lastUpdated')}{lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Split pane — fills remaining height, each column scrolls independently */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* TOC — scrolls independently if content overflows */}
        <div style={{
          borderRight: `1px solid rgba(var(--border-rgb),0.07)`,
          padding: '28px 0',
          overflowY: 'auto',
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: `rgba(var(--fg-rgb),0.22)`,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: '0 24px 14px',
          }}>
            {t('doc.contents')}
          </p>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'baseline',
                width: '100%',
                padding: '8px 24px',
                background: activeId === s.id ? `rgba(var(--fg-rgb),0.05)` : 'transparent',
                borderTop: 'none',
                borderBottom: 'none',
                borderRight: 'none',
                borderLeft: activeId === s.id ? `2px solid rgba(var(--fg-rgb),0.5)` : '2px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: `rgba(var(--fg-rgb),0.2)`,
                letterSpacing: '0.06em',
                flexShrink: 0,
                minWidth: 18,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: activeId === s.id ? 600 : 400,
                color: activeId === s.id ? 'var(--fg)' : `rgba(var(--fg-rgb),0.38)`,
                lineHeight: 1.4,
                transition: 'color 0.15s',
              }}>
                {s.heading}
              </span>
            </button>
          ))}
        </div>

        {/* Article — this is the scrollable column */}
        <div ref={contentRef} style={{ overflowY: 'auto', padding: '48px 64px 96px' }}>
          <div style={{ maxWidth: 720 }}>
            {sections.map((s, i) => (
              <article key={s.id} style={{ marginBottom: 56 }}>
                <div data-section={s.id}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 20 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: `rgba(var(--fg-rgb),0.2)`,
                      letterSpacing: '0.1em',
                      flexShrink: 0,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      color: 'var(--fg)',
                      margin: 0,
                    }}>
                      {s.heading}
                    </h2>
                  </div>
                </div>
                <div style={{ paddingLeft: 25, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.body.map((para, j) =>
                    para.startsWith('• ') ? (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 12,
                          color: `rgba(var(--fg-rgb),0.28)`,
                          marginTop: 4,
                          flexShrink: 0,
                        }}>·</span>
                        <p style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 14,
                          fontWeight: 300,
                          lineHeight: 1.8,
                          color: `rgba(var(--fg-rgb),0.58)`,
                          margin: 0,
                        }}>
                          {para.slice(2)}
                        </p>
                      </div>
                    ) : (
                      <p key={j} style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 14,
                        fontWeight: 300,
                        lineHeight: 1.8,
                        color: `rgba(var(--fg-rgb),0.58)`,
                        margin: 0,
                      }}>
                        {para}
                      </p>
                    )
                  )}
                </div>
                {i < sections.length - 1 && (
                  <div style={{
                    marginTop: 48,
                    height: 1,
                    background: `rgba(var(--border-rgb),0.07)`,
                  }} />
                )}
              </article>
            ))}

            {/* Contact block */}
            <div style={{
              marginTop: 16,
              padding: '24px 28px',
              border: `1px solid rgba(var(--border-rgb),0.1)`,
              background: `rgba(var(--fg-rgb),0.02)`,
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: `rgba(var(--fg-rgb),0.25)`,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}>{t('doc.questions')}</p>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.7,
                color: `rgba(var(--fg-rgb),0.45)`,
                margin: 0,
              }}>
                {t('doc.contact')} <span style={{ color: 'var(--fg)', fontWeight: 600 }}>legal@axis.studio</span>{t('doc.security')} <span style={{ color: 'var(--fg)', fontWeight: 600 }}>security@axis.studio</span>{t('doc.period')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
