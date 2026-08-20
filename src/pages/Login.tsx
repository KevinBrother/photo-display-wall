import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

export default function Login() {
  const { i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: 'calc(100vh - 68px)', marginTop: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '40px', background: 'var(--surface)', border: `1px solid rgba(var(--border-rgb),0.1)` }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 900, letterSpacing: '-0.038em', margin: '0 0 8px', lineHeight: 1.1, textTransform: 'uppercase' }}>
          {i18n.language === 'zh' ? '欢迎回来' : 'Welcome Back'}
        </h2>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.06em', margin: '0 0 32px' }}>
          {i18n.language === 'zh' ? '登录您的账号以继续' : 'Log in to your account to continue'}
        </p>

        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.6)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {i18n.language === 'zh' ? '邮箱地址' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '12px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 15,
                background: `rgba(var(--bg-rgb), 0.5)`, color: 'var(--fg)', border: `1px solid rgba(var(--border-rgb),0.15)`,
                outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = `rgba(var(--border-rgb),0.4)`}
              onBlur={e => e.target.style.borderColor = `rgba(var(--border-rgb),0.15)`}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.6)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {i18n.language === 'zh' ? '密码' : 'Password'}
              </label>
              <a href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.4)`, textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--fg)'}
                onMouseLeave={e => e.currentTarget.style.color = `rgba(var(--fg-rgb),0.4)`}
              >
                {i18n.language === 'zh' ? '忘记密码?' : 'Forgot?'}
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px', fontFamily: "'Outfit', sans-serif", fontSize: 15, letterSpacing: '0.1em',
                background: `rgba(var(--bg-rgb), 0.5)`, color: 'var(--fg)', border: `1px solid rgba(var(--border-rgb),0.15)`,
                outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = `rgba(var(--border-rgb),0.4)`}
              onBlur={e => e.target.style.borderColor = `rgba(var(--border-rgb),0.15)`}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '14px', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
              background: 'var(--fg)', color: 'var(--bg)', border: 'none', cursor: 'pointer',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {i18n.language === 'zh' ? '登录' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center', borderTop: `1px solid rgba(var(--border-rgb),0.1)`, paddingTop: 24 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)`, margin: 0 }}>
            {i18n.language === 'zh' ? '还没有账号？' : "Don't have an account?"}{' '}
            <NavLink to="/register" style={{ color: 'var(--fg)', textDecoration: 'none', fontWeight: 600 }}>
              {i18n.language === 'zh' ? '立即注册' : 'Sign Up'}
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}
