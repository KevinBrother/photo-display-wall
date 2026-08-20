import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// ── Types ──────────────────────────────────────────────────────────────────────
type ConsumeType = 'generation' | 'export' | 'api' | 'priority'

interface ConsumeRecord {
  id: string
  type: ConsumeType
  description: string
  credits: number
  date: string   // ISO
  status: 'success' | 'failed' | 'refunded'
}

interface TopUpRecord {
  id: string
  amount: number  // USD
  credits: number
  bonus: number
  promo?: string
  date: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const TOPUPS: TopUpRecord[] = [
  { id: 't1', amount: 100, credits: 1700, bonus: 700, promo: 'Summer Boost', date: '2026-08-05T09:14:00Z' },
  { id: 't2', amount: 20,  credits: 300,  bonus: 100, date: '2026-07-18T14:32:00Z' },
  { id: 't3', amount: 50,  credits: 800,  bonus: 300, promo: 'Launch Offer', date: '2026-06-02T11:05:00Z' },
  { id: 't4', amount: 20,  credits: 300,  bonus: 100, date: '2026-04-29T08:47:00Z' },
]

const TOTAL_TOPPED   = TOPUPS.reduce((s, t) => s + t.credits + t.bonus, 0)
const REMAINING      = 2840
const CONSUMED       = TOTAL_TOPPED - REMAINING

const TYPE_META: Record<ConsumeType, { label: string; labelZh?: string; color: string }> = {
  generation: { label: 'Generation', labelZh: '生成', color: '#2563EB' },
  export:     { label: 'Export', labelZh: '导出', color: '#7C3AED' },
  api:        { label: 'API Call', labelZh: 'API 调用', color: '#0891B2' },
  priority:   { label: 'Priority Queue', labelZh: '优先队列', color: '#D97706' },
}

const RECORDS: ConsumeRecord[] = [
  { id: 'r01', type: 'generation', description: 'Batch image generation ×24',   credits: 240, date: '2026-08-07T10:22:00Z', status: 'success' },
  { id: 'r02', type: 'export',     description: 'High-res export (4K, 3 files)', credits: 60,  date: '2026-08-07T09:58:00Z', status: 'success' },
  { id: 'r03', type: 'api',        description: 'API · inference endpoint',       credits: 15,  date: '2026-08-06T18:40:00Z', status: 'success' },
  { id: 'r04', type: 'generation', description: 'Style transfer ×8',              credits: 80,  date: '2026-08-06T15:13:00Z', status: 'success' },
  { id: 'r05', type: 'priority',   description: 'Priority queue · 2h slot',       credits: 100, date: '2026-08-06T11:05:00Z', status: 'success' },
  { id: 'r06', type: 'generation', description: 'Batch image generation ×12',     credits: 120, date: '2026-08-05T20:31:00Z', status: 'failed' },
  { id: 'r07', type: 'api',        description: 'API · batch classification',      credits: 45,  date: '2026-08-05T16:20:00Z', status: 'success' },
  { id: 'r08', type: 'export',     description: 'ZIP archive export',              credits: 30,  date: '2026-08-04T14:09:00Z', status: 'refunded' },
  { id: 'r09', type: 'generation', description: 'Portrait upscale ×6',            credits: 60,  date: '2026-08-04T10:44:00Z', status: 'success' },
  { id: 'r10', type: 'api',        description: 'API · streaming inference',       credits: 22,  date: '2026-08-03T19:57:00Z', status: 'success' },
  { id: 'r11', type: 'generation', description: 'Batch generation ×30',            credits: 300, date: '2026-08-03T13:22:00Z', status: 'success' },
  { id: 'r12', type: 'priority',   description: 'Priority queue · 1h slot',        credits: 50,  date: '2026-08-02T09:10:00Z', status: 'success' },
  { id: 'r13', type: 'export',     description: 'RAW export ×10',                  credits: 80,  date: '2026-08-01T17:35:00Z', status: 'success' },
  { id: 'r14', type: 'generation', description: 'Style transfer ×16',              credits: 160, date: '2026-07-31T14:50:00Z', status: 'success' },
  { id: 'r15', type: 'api',        description: 'API · bulk embed',                credits: 38,  date: '2026-07-30T11:15:00Z', status: 'success' },
  { id: 'r16', type: 'generation', description: 'Batch generation ×20',            credits: 200, date: '2026-07-29T08:40:00Z', status: 'success' },
]

const PAGE_SIZE = 8

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString() }

function fmtDate(iso: string, lng: string = 'en') {
  return new Date(iso).toLocaleString(lng === 'zh' ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function fmtDateShort(iso: string, lng: string = 'en') {
  return new Date(iso).toLocaleDateString(lng === 'zh' ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 900 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number>(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * ease))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])
  return <>{fmt(val)}</>
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({ label, value, sub, color, pct }: { label: string; labelZh?: string; value: number; sub?: string; color: string; pct?: number }) {
  return (
    <div style={{ padding: '28px 28px 24px', background: 'var(--surface)', border: `1px solid rgba(var(--border-rgb),0.1)` }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 900, letterSpacing: '-0.045em', color, lineHeight: 1 }}>
          <AnimatedNumber target={value} />
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.06em' }}>cr</span>
      </div>
      {pct !== undefined && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ height: 3, background: `rgba(var(--border-rgb),0.1)`, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 1s ease' }} />
          </div>
        </div>
      )}
      {sub && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 300, color: `rgba(var(--fg-rgb),0.35)`, margin: 0 }}>{sub}</p>}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ConsumeRecord['status'] }) {
  const { i18n } = useTranslation()
  const cfg = {
    success:  { label: 'Success', labelZh: '成功', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
    failed:   { label: 'Failed', labelZh: '失败', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
    refunded: { label: 'Refunded', labelZh: '已退款', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  }[status]
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`, padding: '3px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Account() {
  const { i18n } = useTranslation()
  const [typeFilter, setTypeFilter] = useState<ConsumeType | 'all'>('all')
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'consume' | 'topup'>('consume')

  const filtered = RECORDS.filter(r => typeFilter === 'all' || r.type === typeFilter)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageRecords = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const usedPct = Math.round((CONSUMED / TOTAL_TOPPED) * 100)
  const remainPct = 100 - usedPct

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '56px 48px 44px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          {i18n.language === 'zh' ? '账户 · 积分' : 'Account · Credits'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.038em', color: 'var(--fg)', margin: 0, lineHeight: 0.92, textTransform: 'uppercase' }}>
            {i18n.language === 'zh' ? '我的' : 'My'}<br /><span style={{ color: `rgba(var(--fg-rgb),0.18)` }}>{i18n.language === 'zh' ? '钱包' : 'wallet'}</span>
          </h2>
          {/* Usage ring summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke={`rgba(var(--border-rgb),0.1)`} strokeWidth="7" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#2563EB" strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - remainPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <text x="36" y="40" textAnchor="middle" fontFamily="Outfit, sans-serif" fontSize="14" fontWeight="900" fill="var(--fg)">{remainPct}%</text>
            </svg>
            <div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--fg)', margin: '0 0 3px', letterSpacing: '-0.01em' }}>{i18n.language === 'zh' ? '余额' : 'Remaining balance'}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, margin: 0, letterSpacing: '0.06em' }}>{usedPct}% {i18n.language === 'zh' ? '历史充值已消耗' : 'consumed of all-time top-ups'}</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding: '40px 48px 80px' }}>

        {/* ── Stat tiles ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 48 }}>
          <StatTile label={i18n.language === 'zh' ? '历史充值总额' : 'Total topped up'} value={TOTAL_TOPPED} sub={`${TOPUPS.length}  ${i18n.language === 'zh' ? '次充值' : 'top-ups'} · $${TOPUPS.reduce((s,t)=>s+t.amount,0)} USD`} color="var(--fg)" />
          <StatTile label={i18n.language === 'zh' ? '可用余额' : 'Remaining'} value={REMAINING} sub={`${remainPct}% ${i18n.language === 'zh' ? '占比' : 'of total'}`} color="#2563EB" pct={remainPct} />
          <StatTile label={i18n.language === 'zh' ? '已消耗' : 'Consumed'} value={CONSUMED} sub={`${RECORDS.filter(r=>r.status==='success').length} ${i18n.language === 'zh' ? '笔交易' : 'transactions'}`} color={`rgba(var(--fg-rgb),0.45)`} pct={usedPct} />
        </div>

        {/* ── Breakdown by type ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 56 }}>
          {(Object.entries(TYPE_META) as [ConsumeType, typeof TYPE_META[ConsumeType]][]).map(([type, meta]) => {
            const sum = RECORDS.filter(r => r.type === type && r.status === 'success').reduce((s, r) => s + r.credits, 0)
            const pct = Math.round((sum / CONSUMED) * 100)
            return (
              <div key={type} style={{ padding: '18px 20px', background: 'var(--surface)', border: `1px solid rgba(var(--border-rgb),0.1)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 1, background: meta.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? meta.labelZh : meta.label}</span>
                </div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: meta.color, lineHeight: 1, marginBottom: 6 }}>
                  {fmt(sum)}
                </div>
                <div style={{ height: 3, background: `rgba(var(--border-rgb),0.1)`, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: meta.color, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.06em' }}>{pct}% {i18n.language === 'zh' ? '占比' : 'of consumed'}</span>
              </div>
            )
          })}
        </div>

        {/* ── Tab: consume / top-up history ────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `1px solid rgba(var(--border-rgb),0.1)` }}>
          {(['consume', 'topup'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1) }} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === t ? 'var(--fg)' : `rgba(var(--fg-rgb),0.35)`,
              borderBottom: tab === t ? `2px solid var(--fg)` : `2px solid transparent`,
              marginBottom: -1, transition: 'color 0.2s ease',
            }}>
              {t === 'consume' ? (i18n.language === 'zh' ? '消费记录' : 'Consumption') : (i18n.language === 'zh' ? '充值记录' : 'Top-up history')}
            </button>
          ))}
        </div>

        {tab === 'consume' ? (
          <>
            {/* Type filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {(['all', 'generation', 'export', 'api', 'priority'] as const).map(f => (
                <button key={f} onClick={() => { setTypeFilter(f); setPage(1) }} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: typeFilter === f ? `rgba(var(--fg-rgb),0.08)` : 'transparent',
                  border: typeFilter === f ? `1px solid rgba(var(--fg-rgb),0.35)` : `1px solid rgba(var(--border-rgb),0.1)`,
                  color: typeFilter === f ? 'var(--fg)' : `rgba(var(--fg-rgb),0.4)`,
                }}>
                  {f === 'all' ? (i18n.language === 'zh' ? '所有类型' : 'All types') : (i18n.language === 'zh' ? TYPE_META[f].labelZh : TYPE_META[f].label)}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, alignSelf: 'center', letterSpacing: '0.08em' }}>
                {filtered.length} {i18n.language === 'zh' ? '条记录' : 'records'}
              </span>
            </div>

            {/* Table */}
            <div style={{ border: `1px solid rgba(var(--border-rgb),0.1)` }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 90px 90px', gap: 0, padding: '10px 20px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)`, background: `rgba(var(--fg-rgb),0.02)` }}>
                {['Description', 'Type', 'Date', 'Credits', 'Status'].map(h => (
                  <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? { Description: '描述', Type: '类型', Date: '日期', Credits: '积分', Status: '状态', Paid: '支付', Base: '基础积分', Bonus: '赠送', 'Total received': '总计收到' }[h] || h : h}</span>
                ))}
              </div>

              {pageRecords.map((r, i) => (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 100px 90px 90px',
                  padding: '14px 20px', alignItems: 'center',
                  borderBottom: i < pageRecords.length - 1 ? `1px solid rgba(var(--border-rgb),0.06)` : 'none',
                  background: r.status === 'failed' ? `rgba(220,38,38,0.02)` : 'transparent',
                  transition: 'background 0.15s ease',
                }}
                  onMouseEnter={e => { if (r.status !== 'failed') (e.currentTarget as HTMLDivElement).style.background = `rgba(var(--fg-rgb),0.02)` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = r.status === 'failed' ? `rgba(220,38,38,0.02)` : 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 1, background: TYPE_META[r.type].color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 400, color: r.status === 'failed' ? `rgba(var(--fg-rgb),0.4)` : 'var(--fg)', letterSpacing: '-0.005em' }}>{r.description}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: TYPE_META[r.type].color, letterSpacing: '0.08em' }}>{i18n.language === 'zh' ? TYPE_META[r.type].labelZh : TYPE_META[r.type].label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.04em' }}>{fmtDateShort(r.date, i18n.language)}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: r.status === 'refunded' ? '#D97706' : r.status === 'failed' ? `rgba(var(--fg-rgb),0.3)` : 'var(--fg)', letterSpacing: '-0.02em' }}>
                    {r.status === 'refunded' ? `+${fmt(r.credits)}` : `−${fmt(r.credits)}`}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.1em' }}>
                  {i18n.language === 'zh' ? `第 ${page} 页，共 ${totalPages} 页` : `Page ${page} of ${totalPages}`}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: 32, height: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                      background: page === p ? 'var(--fg)' : 'transparent',
                      color: page === p ? 'var(--bg)' : `rgba(var(--fg-rgb),0.4)`,
                      border: page === p ? 'none' : `1px solid rgba(var(--border-rgb),0.12)`,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>{p}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Top-up history */
          <div style={{ border: `1px solid rgba(var(--border-rgb),0.1)` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 120px', gap: 0, padding: '10px 20px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)`, background: `rgba(var(--fg-rgb),0.02)` }}>
              {['Date', 'Paid', 'Base', 'Bonus', 'Total received'].map(h => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? { Description: '描述', Type: '类型', Date: '日期', Credits: '积分', Status: '状态', Paid: '支付', Base: '基础积分', Bonus: '赠送', 'Total received': '总计收到' }[h] || h : h}</span>
              ))}
            </div>
            {TOPUPS.map((t, i) => (
              <div key={t.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 120px',
                padding: '16px 20px', alignItems: 'center',
                borderBottom: i < TOPUPS.length - 1 ? `1px solid rgba(var(--border-rgb),0.06)` : 'none',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `rgba(var(--fg-rgb),0.02)` }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 400, color: 'var(--fg)', margin: '0 0 3px', letterSpacing: '-0.005em' }}>{fmtDate(t.date, i18n.language)}</p>
                  {t.promo && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A', border: `1px solid rgba(22,163,74,0.25)`, padding: '2px 7px', letterSpacing: '0.1em' }}>
                      {t.promo}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em' }}>${t.amount}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.5)`, letterSpacing: '0.06em' }}>{fmt(t.credits)}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.promo ? '#16A34A' : `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.06em' }}>+{fmt(t.bonus)}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: '#2563EB', letterSpacing: '-0.025em' }}>{fmt(t.credits + t.bonus)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
