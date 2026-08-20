import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function copyText(text: string) {
  try {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  } catch { /* silent */ }
}

interface ApiKey {
  id: string
  name: string
  prefix: string
  suffix: string
  createdAt: string
  lastUsed: string | null
  status: 'active' | 'revoked'
  usageCredits: number
}

const INITIAL_KEYS: ApiKey[] = [
  { id: 'k1', name: 'Production app',   prefix: 'ax_live', suffix: 'k9Qm', createdAt: '2026-06-12', lastUsed: '2026-08-07', status: 'active',  usageCredits: 1420 },
  { id: 'k2', name: 'Local dev',        prefix: 'ax_live', suffix: 'rT2p', createdAt: '2026-07-01', lastUsed: '2026-08-06', status: 'active',  usageCredits: 380  },
  { id: 'k3', name: 'CI pipeline',      prefix: 'ax_live', suffix: 'wX7n', createdAt: '2026-05-20', lastUsed: '2026-07-30', status: 'active',  usageCredits: 204  },
  { id: 'k4', name: 'Old staging key',  prefix: 'ax_live', suffix: 'jK4s', createdAt: '2026-03-08', lastUsed: '2026-06-01', status: 'revoked', usageCredits: 892  },
]

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function masked(prefix: string, suffix: string) {
  return `${prefix}_${'•'.repeat(24)}${suffix}`
}

function NewKeyModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--surface)', border: `1px solid rgba(var(--border-rgb),0.15)`, padding: '40px', width: 440, position: 'relative' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>New API key</p>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--fg)', margin: '0 0 24px', letterSpacing: '-0.02em' }}>Name your key</h3>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) { onCreate(name.trim()); onClose() } }}
          placeholder="e.g. Production app"
          style={{ width: '100%', padding: '12px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 14, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.15)`, color: 'var(--fg)', outline: 'none', boxSizing: 'border-box', marginBottom: 24 }}
        />
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 300, color: `rgba(var(--fg-rgb),0.35)`, margin: '0 0 28px', lineHeight: 1.6 }}>
          The key will be shown once. Copy it immediately — it cannot be retrieved later.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose() } }}
            disabled={!name.trim()}
            style={{ flex: 1, padding: '12px', background: name.trim() ? 'var(--fg)' : `rgba(var(--fg-rgb),0.12)`, color: name.trim() ? 'var(--bg)' : `rgba(var(--fg-rgb),0.25)`, border: 'none', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default', transition: 'all 0.2s' }}>
            Create key
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', background: 'transparent', border: `1px solid rgba(var(--border-rgb),0.15)`, color: `rgba(var(--fg-rgb),0.5)`, fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function NewKeyReveal({ keyStr, onClose }: { keyStr: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { copyText(keyStr); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--surface)', border: `1px solid rgba(22,163,74,0.3)`, padding: '40px', width: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,0.2)' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Key created</p>
        </div>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--fg)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Copy your key now</h3>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, color: `rgba(var(--fg-rgb),0.4)`, margin: '0 0 24px' }}>This key will not be shown again.</p>
        <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
          <div style={{ flex: 1, padding: '12px 14px', background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.12)`, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {keyStr}
          </div>
          <button onClick={copy} style={{ padding: '12px 18px', background: copied ? '#16A34A' : 'var(--fg)', border: 'none', color: 'var(--bg)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid rgba(var(--border-rgb),0.15)`, color: `rgba(var(--fg-rgb),0.5)`, fontFamily: "'Outfit', sans-serif", fontSize: 14, cursor: 'pointer' }}>
          Done
        </button>
      </div>
    </div>
  )
}

export default function Keys() {
  const { i18n } = useTranslation()
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
  const [showModal, setShowModal] = useState(false)
  const [newKeyStr, setNewKeyStr] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revokeId, setRevokeId] = useState<string | null>(null)

  const handleCreate = (name: string) => {
    const random = Math.random().toString(36).slice(2, 10)
    const keyStr = `ax_live_${random}${'x'.repeat(28)}`
    const newKey: ApiKey = {
      id: `k${Date.now()}`, name, prefix: 'ax_live', suffix: random.slice(-4),
      createdAt: new Date().toISOString().slice(0, 10), lastUsed: null, status: 'active', usageCredits: 0,
    }
    setKeys(prev => [newKey, ...prev])
    setNewKeyStr(keyStr)
  }

  const handleCopy = (id: string) => {
    copyText(`ax_live_${'x'.repeat(32)}`)
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRevoke = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k))
    setRevokeId(null)
  }

  const active = keys.filter(k => k.status === 'active')
  const revoked = keys.filter(k => k.status === 'revoked')

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>
      {showModal && <NewKeyModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
      {newKeyStr && <NewKeyReveal keyStr={newKeyStr} onClose={() => setNewKeyStr(null)} />}

      {/* Header */}
      <section style={{ padding: '56px 48px 44px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 16px' }}>{i18n.language === 'zh' ? '设置 · API' : 'Settings · API'}</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-0.038em', color: 'var(--fg)', margin: 0, lineHeight: 0.92, textTransform: 'uppercase' }}>
            {i18n.language === 'zh' ? 'API 密钥' : 'API Keys'}
          </h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', background: 'var(--fg)', border: 'none', color: 'var(--bg)', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em', transition: 'opacity 0.2s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {i18n.language === 'zh' ? '+ 创建密钥' : '+ New key'}
        </button>
      </section>

      <div style={{ padding: '40px 48px 80px' }}>
        {/* Info banner */}
        <div style={{ display: 'flex', gap: 14, padding: '14px 18px', background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.1)`, marginBottom: 40 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="7" stroke={`rgba(var(--fg-rgb),0.3)`} strokeWidth="1" />
            <path d="M8 7V11M8 5V5.5" stroke={`rgba(var(--fg-rgb),0.4)`} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, color: `rgba(var(--fg-rgb),0.45)`, margin: 0, lineHeight: 1.6 }}>
            {i18n.language === 'zh' ? 'API 密钥使用您的账户余额进行身份验证。请妥善保管——不要将其提交到版本控制或暴露在客户端代码中。如果您怀疑密钥已泄露，请立即撤销。' : 'API keys authenticate requests against your account balance. Keep them secret — do not commit to version control or expose in client-side code. Revoke any key you suspect has been compromised.'}
          </p>
        </div>

        {/* Active keys */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{i18n.language === 'zh' ? '已启用' : 'Active'}</p>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A', letterSpacing: '0.1em' }}>{active.length} {i18n.language === 'zh' ? '个密钥' : 'keys'}</span>
            <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.08)` }} />
          </div>

          <div style={{ border: `1px solid rgba(var(--border-rgb),0.1)` }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 110px 120px 90px 110px', padding: '10px 20px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)`, background: `rgba(var(--fg-rgb),0.02)` }}>
              {['Name', 'Key', 'Created', 'Last used', 'Usage', ''].map((h, i) => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {i18n.language === 'zh' ? ['名称', '密钥', '创建时间', '最后使用', '使用量', ''][i] : h}
                </span>
              ))}
            </div>
            {active.map((k, i) => (
              <div key={k.id} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 110px 120px 90px 110px', padding: '16px 20px', alignItems: 'center', borderBottom: i < active.length - 1 ? `1px solid rgba(var(--border-rgb),0.06)` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `rgba(var(--fg-rgb),0.02)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{k.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.04em' }}>{masked(k.prefix, k.suffix)}</span>
                  <button onClick={() => handleCopy(k.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', color: copiedId === k.id ? '#16A34A' : `rgba(var(--fg-rgb),0.3)`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                    {copiedId === k.id ? '✓ copied' : 'copy'}
                  </button>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)` }}>{fmtDate(k.createdAt)}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)` }}>{k.lastUsed ? fmtDate(k.lastUsed) : '—'}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>{k.usageCredits.toLocaleString()} cr</span>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {revokeId === k.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleRevoke(k.id)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#DC2626', border: `1px solid rgba(220,38,38,0.3)`, background: 'none', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.08em' }}>{i18n.language === 'zh' ? '确认' : 'Confirm'}</button>
                      <button onClick={() => setRevokeId(null)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, border: `1px solid rgba(var(--border-rgb),0.12)`, background: 'none', padding: '4px 10px', cursor: 'pointer' }}>{i18n.language === 'zh' ? '取消' : 'Cancel'}</button>
                    </div>
                  ) : (
                    <button onClick={() => setRevokeId(k.id)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#DC2626' }}
                      onMouseLeave={e => { e.currentTarget.style.color = `rgba(var(--fg-rgb),0.3)` }}>
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revoked keys */}
        {revoked.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{i18n.language === 'zh' ? '已撤销' : 'Revoked'}</p>
              <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.08)` }} />
            </div>
            <div style={{ border: `1px solid rgba(var(--border-rgb),0.07)`, opacity: 0.55 }}>
              {revoked.map((k, i) => (
                <div key={k.id} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 110px 120px 90px', padding: '14px 20px', alignItems: 'center', borderBottom: i < revoked.length - 1 ? `1px solid rgba(var(--border-rgb),0.06)` : 'none' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: `rgba(var(--fg-rgb),0.45)`, textDecoration: 'line-through' }}>{k.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.04em' }}>{masked(k.prefix, k.suffix)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)` }}>{fmtDate(k.createdAt)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)` }}>{k.lastUsed ? fmtDate(k.lastUsed) : '—'}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)` }}>{k.usageCredits.toLocaleString()} cr</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
