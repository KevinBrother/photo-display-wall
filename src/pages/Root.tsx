import { Outlet, NavLink, useLocation } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
  { to: '/',          key: 'nav.gallery',  index: '01' },
  { to: '/company',   key: 'nav.studio',   index: '02' },
  { to: '/products',  key: 'nav.work',     index: '03' },
  { to: '/pricing',   key: 'nav.pricing',  index: '04' },
  { to: '/photos',    key: 'nav.archive',  index: '05' },
  { to: '/stats',     key: 'nav.stats',    index: '06' },
  { to: '/generate',  key: 'nav.generate', index: '07' },
  { to: '/models',    key: 'nav.models',   index: '08' },
  { to: '/status',    key: 'nav.status',   index: '09' },
  { to: '/account',   key: 'nav.account',  index: '10' },
  { to: '/keys',      key: 'nav.keys',     index: '11' },
  { to: '/notices',   key: 'nav.notices',  index: '12' },
]

export default function Root() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Default to true to show the avatar UI
  const pickerRef = useRef<HTMLDivElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { theme, themes, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const toggleLang = () => i18n.changeLanguage(lang === 'zh' ? 'en' : 'zh')

  useEffect(() => {
    const el = document.querySelector('main')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', fn)
    return () => el.removeEventListener('scroll', fn)
  }, [location.pathname])

  useEffect(() => {
    const el = document.querySelector('main')
    if (el) el.scrollTop = 0
    setScrolled(false)
  }, [location.pathname])

  // Close picker on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) {
        setSupportOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          padding: '0 48px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--nav-blur)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? `1px solid rgba(var(--border-rgb),0.07)` : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', color: 'var(--fg)' }}>
          AXIS<span style={{ color: `rgba(var(--fg-rgb),0.25)`, fontWeight: 300 }}>.STUDIO</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                fontFamily: lang === 'zh' ? "'Outfit', sans-serif" : "'JetBrains Mono', monospace",
                fontSize: lang === 'zh' ? 12 : 11,
                letterSpacing: lang === 'zh' ? '0.05em' : '0.15em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--fg)' : `rgba(var(--fg-rgb),0.35)`,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: isActive ? `rgba(var(--fg-rgb),0.4)` : `rgba(var(--fg-rgb),0.15)` }}>{item.index}</span>
                  {t(item.key)}
                  {isActive && (
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg)', marginTop: 2 }} />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Support / QR */}
          <div ref={supportRef} style={{ position: 'relative', marginLeft: 4 }}>
            <button
              onClick={() => setSupportOpen(v => !v)}
              title={lang === 'zh' ? '联系客服' : 'Support'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                border: `1px solid rgba(var(--border-rgb),0.12)`,
                background: supportOpen ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                color: supportOpen ? 'var(--fg)' : `rgba(var(--fg-rgb),0.5)`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = `rgba(var(--border-rgb),0.3)` }}
              onMouseLeave={e => { if (!supportOpen) { e.currentTarget.style.color = `rgba(var(--fg-rgb),0.5)`; e.currentTarget.style.borderColor = `rgba(var(--border-rgb),0.12)` } }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
              </svg>
            </button>

            {/* QR Modal */}
            {supportOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--surface)',
                  border: `1px solid rgba(var(--border-rgb),0.1)`,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                  padding: '24px',
                  width: 240,
                  zIndex: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--fg)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                    {lang === 'zh' ? '联系专属客服' : 'Contact Support'}
                  </h4>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, margin: 0, lineHeight: 1.4 }}>
                    {lang === 'zh' ? '扫码添加微信获取更多帮助' : 'Scan to add us on WeChat'}
                  </p>
                </div>
                
                <div style={{
                  width: 160,
                  height: 160,
                  background: 'var(--fg)',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Real QR code image would go here. Using a placeholder pattern. */}
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg)', position: 'relative' }}>
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="1" strokeLinecap="square">
                      <rect width="6" height="6" x="2" y="2" />
                      <rect width="2" height="2" x="4" y="4" />
                      <rect width="6" height="6" x="16" y="2" />
                      <rect width="2" height="2" x="18" y="4" />
                      <rect width="6" height="6" x="2" y="16" />
                      <rect width="2" height="2" x="4" y="18" />
                      <path d="M10 2h4v2h-4zM10 6h2v4h-2zM14 6h2v2h-2zM2 10h4v2H2zM8 10h2v4H8zM14 10h6v2h-6zM10 14h2v2h-2zM14 14h2v2h-2zM18 14h4v2h-4zM10 18h4v2h-4zM14 20h2v2h-2zM18 18h2v2h-2zM20 20h2v2h-2z" fill="var(--fg)" stroke="none"/>
                    </svg>
                  </div>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ID: AXIS-SUPPORT
                </div>
              </div>
            )}
          </div>

          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              padding: '5px 10px',
              border: `1px solid rgba(var(--border-rgb),0.12)`,
              background: 'transparent',
              color: `rgba(var(--fg-rgb),0.5)`,
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
              marginLeft: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = `rgba(var(--border-rgb),0.3)` }}
            onMouseLeave={e => { e.currentTarget.style.color = `rgba(var(--fg-rgb),0.5)`; e.currentTarget.style.borderColor = `rgba(var(--border-rgb),0.12)` }}
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>

          {/* Theme switcher */}
          <div ref={pickerRef} style={{ position: 'relative', marginLeft: 4 }}>
            <button
              onClick={() => setPickerOpen(v => !v)}
              title={t('theme.switch')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 10px 5px 7px',
                border: `1px solid rgba(var(--border-rgb),0.12)`,
                background: pickerOpen ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                borderRadius: 0,
              }}
            >
              {/* Swatch */}
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: theme.swatch, border: `1px solid rgba(var(--border-rgb),0.2)`, boxShadow: `inset 0 0 0 2px ${theme.swatchAccent}40`, flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(var(--fg-rgb),0.5)` }}>
                  {theme.name}
                </span>
              </span>
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.4, transform: pickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                <path d="M1 1L4 4L7 1" stroke="var(--fg)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Picker panel */}
            {pickerOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--surface)',
                  border: `1px solid rgba(var(--border-rgb),0.1)`,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                  padding: '8px',
                  minWidth: 220,
                  zIndex: 400,
                }}
              >
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '4px 8px 10px' }}>
                  {t('theme.select')}
                </p>
                {themes.map(tOption => (
                  <button
                    key={tOption.id}
                    onClick={() => { setTheme(tOption.id); setPickerOpen(false) }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '9px 10px',
                      background: theme.id === tOption.id ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { if (theme.id !== tOption.id) (e.currentTarget as HTMLElement).style.background = `rgba(var(--fg-rgb),0.04)` }}
                    onMouseLeave={e => { if (theme.id !== tOption.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    {/* Swatch */}
                    <span style={{ position: 'relative', width: 28, height: 20, borderRadius: 2, background: tOption.bg, border: `1px solid rgba(var(--border-rgb),0.12)`, flexShrink: 0, overflow: 'hidden' }}>
                      <span style={{ position: 'absolute', bottom: 3, right: 4, width: 6, height: 6, borderRadius: '50%', background: tOption.swatchAccent }} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{tOption.name}</span>
                      <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>{tOption.label}</span>
                    </span>
                    {theme.id === tOption.id && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8, paddingLeft: 16, borderLeft: `1px solid rgba(var(--border-rgb),0.12)` }}>
            {isLoggedIn ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    background: 'var(--fg)',
                    color: 'var(--bg)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'opacity 0.2s ease',
                    borderRadius: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  JD
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'var(--surface)',
                      border: `1px solid rgba(var(--border-rgb),0.1)`,
                      boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                      padding: '8px',
                      minWidth: 180,
                      zIndex: 400,
                    }}
                  >
                    <div style={{ padding: '8px 10px', borderBottom: `1px solid rgba(var(--border-rgb),0.1)`, marginBottom: 4 }}>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.01em' }}>John Doe</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.05em' }}>john@example.com</div>
                    </div>
                    
                    {[
                      { to: '/account', label: lang === 'zh' ? '个人设置' : 'Settings' },
                      { to: '/keys', label: lang === 'zh' ? 'API 密钥' : 'API Keys' },
                      { to: '/pricing', label: lang === 'zh' ? '订阅套餐' : 'Billing' },
                    ].map(item => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 10px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: `rgba(var(--fg-rgb),0.6)`,
                          textDecoration: 'none',
                          transition: 'background 0.15s ease, color 0.15s ease',
                          letterSpacing: '0.05em',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `rgba(var(--fg-rgb),0.04)`; e.currentTarget.style.color = 'var(--fg)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = `rgba(var(--fg-rgb),0.6)` }}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    
                    <button
                      onClick={() => { setIsLoggedIn(false); setUserMenuOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        marginTop: 4,
                        borderTop: `1px solid rgba(var(--border-rgb),0.1)`,
                        background: 'transparent',
                        border: 'none',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: `rgba(var(--fg-rgb),0.6)`,
                        cursor: 'pointer',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        letterSpacing: '0.05em',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `rgba(var(--fg-rgb),0.04)`; e.currentTarget.style.color = 'var(--fg)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = `rgba(var(--fg-rgb),0.6)` }}
                    >
                      {lang === 'zh' ? '退出登录' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  style={({ isActive }) => ({
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--fg)' : `rgba(var(--fg-rgb),0.5)`,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  })}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--fg)'}
                  onMouseLeave={e => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.color = `rgba(var(--fg-rgb),0.5)`
                    }
                  }}
                >
                  {lang === 'zh' ? '登录' : 'LOGIN'}
                </NavLink>
                <NavLink
                  to="/register"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--bg)',
                    background: 'var(--fg)',
                    padding: '5px 12px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {lang === 'zh' ? '注册' : 'SIGN UP'}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Outlet />
        {/* Footer */}
        <footer style={{
          borderTop: `1px solid rgba(var(--border-rgb),0.07)`,
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 14,
              letterSpacing: '-0.04em',
              color: `rgba(var(--fg-rgb),0.3)`,
            }}>
              AXIS<span style={{ fontWeight: 300 }}>.STUDIO</span>
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: `rgba(var(--fg-rgb),0.18)`,
              letterSpacing: '0.08em',
            }}>
              © 2026 AXIS Studio GmbH
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { to: '/about',   key: 'nav.about' },
              { to: '/notices', key: 'nav.notices' },
              { to: '/terms',   key: 'nav.terms' },
              { to: '/privacy', key: 'nav.privacy' },
            ].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--fg)' : `rgba(var(--fg-rgb),0.28)`,
                  textDecoration: 'none',
                  padding: '4px 10px',
                  border: `1px solid rgba(var(--border-rgb),${isActive ? '0.2' : '0.08'})`,
                  background: isActive ? `rgba(var(--fg-rgb),0.05)` : 'transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                })}
              >
                {t(link.key)}
              </NavLink>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}
