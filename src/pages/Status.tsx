import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Channel {
  id: string
  name: string
  provider: string
  providerLogo: string
  modelId: string
  status: 'normal' | 'degraded' | 'down'
  availability: number
  history: ('success' | 'warning' | 'error')[]
  latency: number
  lastCheck: string
}

// Generate random history bars
const generateHistory = () => {
  return Array.from({ length: 60 }).map(() => {
    const r = Math.random()
    if (r > 0.98) return 'error'
    if (r > 0.93) return 'warning'
    return 'success'
  })
}

const CHANNELS: Channel[] = [
  {
    id: 'c1',
    name: 'GPT PRO',
    provider: 'OpenAI',
    providerLogo: '⬡',
    modelId: 'gpt-5.6-terra',
    status: 'normal',
    availability: 97.0,
    history: generateHistory(),
    latency: 1061,
    lastCheck: '21:43:55'
  },
  {
    id: 'c2',
    name: 'GPT PLUS',
    provider: 'OpenAI',
    providerLogo: '⬡',
    modelId: 'gpt-5.6-sol',
    status: 'normal',
    availability: 96.4,
    history: generateHistory(),
    latency: 1386,
    lastCheck: '21:43:55'
  },
  {
    id: 'c3',
    name: 'CCMAX',
    provider: 'Anthropic',
    providerLogo: '◆',
    modelId: 'claude-opus-4-8',
    status: 'normal',
    availability: 97.7,
    history: generateHistory(),
    latency: 1531,
    lastCheck: '21:43:55'
  },
  {
    id: 'c4',
    name: 'GEMINI ULTRA',
    provider: 'Google',
    providerLogo: '✦',
    modelId: 'gemini-2.5-ultra',
    status: 'degraded',
    availability: 92.1,
    history: generateHistory(),
    latency: 2402,
    lastCheck: '21:43:55'
  }
]

interface Upstream {
  id: string
  name: string
  providerLogo: string
  status: 'normal' | 'degraded' | 'down'
  statusText: string
  statusTextZh: string
  url: string
}

const UPSTREAMS: Upstream[] = [
  { id: 'openai', name: 'OpenAI', providerLogo: '⬡', status: 'normal', statusText: 'All Systems Operational', statusTextZh: '所有系统运行正常', url: 'https://status.openai.com/' },
  { id: 'anthropic', name: 'Anthropic', providerLogo: '◆', status: 'normal', statusText: 'All Systems Operational', statusTextZh: '所有系统运行正常', url: 'https://status.anthropic.com/' },
  { id: 'google', name: 'Google Workspace', providerLogo: '✦', status: 'normal', statusText: 'All Systems Operational', statusTextZh: '所有系统运行正常', url: 'https://status.cloud.google.com/' }
]

function StatusSquare({ status }: { status: 'normal' | 'degraded' | 'down' }) {
  let color = '#16a34a'
  if (status === 'degraded') color = '#eab308'
  if (status === 'down') color = '#dc2626'

  return (
    <div style={{
      width: 6,
      height: 6,
      background: color,
      boxShadow: `0 0 8px ${color}`
    }} />
  )
}

function Checkbox({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div style={{
        width: 14, height: 14,
        border: `1px solid ${checked ? 'var(--fg)' : 'rgba(var(--border-rgb),0.3)'}`,
        background: checked ? 'var(--fg)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.7)`, textTransform: 'uppercase' }}>
        {label}
      </span>
    </label>
  )
}

export default function Status() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const [days, setDays] = useState(7)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [channels, setChannels] = useState(CHANNELS)
  const [lastUpdated, setLastUpdated] = useState(() => {
    const d = new Date()
    return d.toLocaleTimeString('en-US', { hour12: false })
  })

  const refresh = () => {
    const d = new Date()
    setLastUpdated(d.toLocaleTimeString('en-US', { hour12: false }))
    setChannels(CHANNELS.map(c => ({
      ...c,
      history: generateHistory(),
      latency: Math.floor(Math.random() * 500) + 1000,
      lastCheck: d.toLocaleTimeString('en-US', { hour12: false })
    })))
  }

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const hasIssues = channels.some(s => s.status !== 'normal')

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>
      <section style={{ padding: '52px 48px 24px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 18px',
        }}>
          {lang === 'zh' ? '系统 · 运行状态' : 'System · Status'}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.038em',
            color: 'var(--fg)',
            margin: 0,
            lineHeight: 0.95,
            textTransform: 'uppercase',
          }}>
            {lang === 'zh' ? '渠道状态' : 'Channel Status'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)` }}>
              {lang === 'zh' ? '整体运行状况' : 'Global State'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', padding: '6px 12px', border: `1px solid rgba(var(--border-rgb),0.1)` }}>
              <StatusSquare status={hasIssues ? 'degraded' : 'normal'} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--fg)', textTransform: 'uppercase' }}>
                {hasIssues 
                  ? (lang === 'zh' ? '部分降级' : 'Degraded')
                  : (lang === 'zh' ? '全部正常' : 'Operational')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Control bar */}
      <div style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[7, 15, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                padding: '8px 16px',
                background: days === d ? 'var(--surface)' : 'transparent',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: days === d ? 'var(--fg)' : `rgba(var(--fg-rgb),0.4)`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              {d} {lang === 'zh' ? '天' : 'Days'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Checkbox 
            checked={autoRefresh} 
            onChange={setAutoRefresh} 
            label={lang === 'zh' ? '自动刷新 (5s)' : 'Auto-refresh (5s)'} 
          />
          <div style={{ width: 1, height: 16, background: `rgba(var(--border-rgb),0.2)` }} />
          <button
            onClick={refresh}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: 0, background: 'transparent', border: 'none',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg)',
              cursor: 'pointer', textTransform: 'uppercase'
            }}
          >
            <span style={{ color: `rgba(var(--fg-rgb),0.4)` }}>{lang === 'zh' ? '最新更新' : 'Updated'}: {lastUpdated}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
        {channels.map(ch => (
          <div key={ch.id} style={{
            background: 'var(--bg)',
            border: `1px solid rgba(var(--border-rgb),0.12)`,
            padding: '24px 24px 0 24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'var(--fg)' }}>{ch.providerLogo}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ch.provider}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{ch.name}</h3>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)`, marginTop: 4 }}>{ch.modelId}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StatusSquare status={ch.status} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ch.status === 'normal' ? '#16a34a' : ch.status === 'degraded' ? '#eab308' : '#dc2626', textTransform: 'uppercase' }}>
                  {lang === 'zh' ? (ch.status === 'normal' ? '正常' : ch.status === 'degraded' ? '降级' : '中断') : ch.status}
                </span>
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, textTransform: 'uppercase' }}>
                  {lang === 'zh' ? '可用率' : 'Availability'} · {days}d
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 300, color: 'var(--fg)', lineHeight: 0.8 }}>
                  {ch.availability.toFixed(1)}<span style={{ fontSize: 18, color: `rgba(var(--fg-rgb),0.3)` }}>%</span>
                </div>
              </div>
              <div style={{ height: 2, background: `rgba(var(--border-rgb),0.1)` }}>
                <div style={{ width: `${ch.availability}%`, height: '100%', background: ch.status === 'normal' ? 'var(--fg)' : ch.status === 'degraded' ? '#eab308' : '#dc2626' }} />
              </div>
            </div>

            {/* History */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, textTransform: 'uppercase' }}>
                  {lang === 'zh' ? '最近 60 次检测' : 'Last 60 checks'}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ch.status === 'normal' ? 'var(--fg)' : ch.status === 'degraded' ? '#eab308' : '#dc2626', fontWeight: 600 }}>
                  97% {lang === 'zh' ? '正常' : 'OK'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 2, height: 32, alignItems: 'flex-end' }}>
                {ch.history.map((h, i) => {
                  let hColor = '#16a34a' // success
                  let hHeight = '100%'
                  if (h === 'warning') {
                    hColor = '#eab308'
                    hHeight = '70%'
                  } else if (h === 'error') {
                    hColor = '#dc2626'
                    hHeight = '40%'
                  }

                  return (
                    <div key={i} style={{
                      flex: 1,
                      height: hHeight,
                      background: hColor,
                      transition: 'height 0.2s ease'
                    }} />
                  )
                })}
              </div>
            </div>

            {/* Bottom Metrics */}
            <div style={{ display: 'flex', borderTop: `1px solid rgba(var(--border-rgb),0.1)`, margin: '0 -24px' }}>
              <div style={{ flex: 1, padding: '16px 24px', borderRight: `1px solid rgba(var(--border-rgb),0.1)` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, textTransform: 'uppercase', marginBottom: 4 }}>
                  {lang === 'zh' ? '延迟' : 'Latency'}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--fg)' }}>
                  {ch.latency} ms
                </div>
              </div>
              <div style={{ flex: 1, padding: '16px 24px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, textTransform: 'uppercase', marginBottom: 4 }}>
                  {lang === 'zh' ? '上次检测' : 'Last Check'}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--fg)' }}>
                  {ch.lastCheck}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Upstream Status */}
      <div style={{ padding: '0 48px 64px' }}>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          margin: '0 0 24px',
          color: 'var(--fg)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em'
        }}>
          {lang === 'zh' ? '官方服务商状态' : 'Official Provider Status'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {UPSTREAMS.map(up => (
            <a 
              key={up.id} 
              href={up.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: `1px solid rgba(var(--border-rgb),0.12)`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                color: 'var(--fg)',
                transition: 'border-color 0.2s ease, background 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--border-rgb),0.3)'
                e.currentTarget.style.background = `rgba(var(--fg-rgb),0.02)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(var(--border-rgb),0.12)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{up.providerLogo}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, textTransform: 'uppercase' }}>{up.name}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" style={{ opacity: 0.4 }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', padding: '12px 16px', border: `1px solid rgba(var(--border-rgb),0.08)` }}>
                <StatusSquare status={up.status} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: up.status === 'normal' ? '#16a34a' : up.status === 'degraded' ? '#eab308' : '#dc2626', textTransform: 'uppercase' }}>
                  {lang === 'zh' ? up.statusTextZh : up.statusText}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

