import { useTranslation } from "react-i18next"
import { useState, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface TopUpPlan {
  id: string
  price: number        // USD charged
  baseCredits: number
  bonusCredits: number
  popular?: boolean
  tag?: string
}

interface Promo {
  id: string
  label: string; labelZh?: string
  description: string; descriptionZh?: string
  /** 'flat' = extra credits; 'percent' = extra % of bonusCredits */
  type: 'flat' | 'percent'
  value: number
  /** null = applies to all plans; otherwise specific plan ids */
  applyTo: string[] | null
  startDate: string
  endDate: string
}

// ── Static data (server-driven in production) ─────────────────────────────────
const PLANS: TopUpPlan[] = [
  { id: 'lite',     price: 5,   baseCredits: 60,   bonusCredits: 15,  tag: 'Try it out' },
  { id: 'basic',    price: 10,  baseCredits: 130,  bonusCredits: 30 },
  { id: 'standard', price: 20,  baseCredits: 300,  bonusCredits: 100, popular: true },
  { id: 'plus',     price: 50,  baseCredits: 800,  bonusCredits: 300 },
  { id: 'pro',      price: 100, baseCredits: 1700, bonusCredits: 700, tag: 'Best value' },
  { id: 'team',     price: 200, baseCredits: 3600, bonusCredits: 1600 },
]

// Promos are per-plan — each plan can have its own active promo (or none)
const PROMOS: Promo[] = [
  {
    id: 'summer-standard',
    label: 'Summer Boost', labelZh: '夏日特惠',
    description: 'Limited-time bonus for this tier', descriptionZh: '限时套餐奖励',
    type: 'percent',
    value: 30,
    applyTo: ['standard'],
    startDate: '2026-08-01',
    endDate: '2026-08-14',
  },
  {
    id: 'summer-pro',
    label: 'Summer Boost', labelZh: '夏日特惠',
    description: 'Limited-time bonus for this tier', descriptionZh: '限时套餐奖励',
    type: 'percent',
    value: 20,
    applyTo: ['pro'],
    startDate: '2026-08-01',
    endDate: '2026-08-14',
  },
  {
    id: 'newuser-plus',
    label: 'Launch Offer', labelZh: '首发优惠',
    description: 'Flat bonus for new users on this tier', descriptionZh: '为新用户提供此级别的固定积分奖励',
    type: 'flat',
    value: 300,
    applyTo: ['plus'],
    startDate: '2026-08-01',
    endDate: '2026-09-15',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function isActive(p: Promo): boolean {
  const now = Date.now()
  return now >= new Date(p.startDate).getTime() && now <= new Date(p.endDate).getTime()
}

function promoExtra(plan: TopUpPlan, promo: Promo): number {
  if (promo.applyTo !== null && !promo.applyTo.includes(plan.id)) return 0
  if (promo.type === 'percent') return Math.round(plan.bonusCredits * promo.value / 100)
  return promo.value
}

function totalCredits(plan: TopUpPlan, promos: Promo[]): number {
  return plan.baseCredits + plan.bonusCredits + promos.reduce((s, p) => s + promoExtra(plan, p), 0)
}

function promoSum(plan: TopUpPlan, promos: Promo[]): number {
  return promos.reduce((s, p) => s + promoExtra(plan, p), 0)
}

function fmt(n: number): string { return n.toLocaleString() }

function daysLeft(endDate: string): number {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000))
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function useCountdown(endDate: string) {
  const calc = () => {
    const diff = new Date(endDate).getTime() - Date.now()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    const secs = Math.floor(diff / 1000)
    return { d: Math.floor(secs / 86400), h: Math.floor((secs % 86400) / 3600), m: Math.floor((secs % 3600) / 60), s: secs % 60 }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [endDate])
  return t
}

// ── Per-card promo strip (shown inside a card that has an active promo) ────────
function CardPromoStrip({ promo }: { promo: Promo }) {
  const t = useCountdown(promo.endDate)
  const days = daysLeft(promo.endDate)
  const urgent = days <= 1
  return (
    <div style={{
      marginTop: 16,
      padding: '10px 14px',
      background: 'rgba(22,163,74,0.07)',
      border: '1px solid rgba(22,163,74,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,0.2)', flexShrink: 0 }} />
        <div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: '#16A34A', letterSpacing: '-0.01em' }}>
            {promo.label}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A', marginLeft: 6 }}>
            {promo.type === 'percent' ? `+${promo.value}% bonus` : `+${fmt(promo.value)} credits`}
          </span>
        </div>
      </div>
      {/* Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {urgent ? (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#DC2626', letterSpacing: '0.08em' }}>Last day!</span>
        ) : (
          <>
            {([['d', t.d], ['h', t.h], ['m', t.m], ['s', t.s]] as [string, number][]).map(([unit, val], i) => (
              <span key={unit} style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                {i > 0 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(22,163,74,0.4)', marginRight: 2 }}>:</span>}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500, color: '#16A34A', lineHeight: 1 }}>{String(val).padStart(2, '0')}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(22,163,74,0.5)', letterSpacing: '0.08em' }}>{unit}</span>
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── Credit stacked bar ────────────────────────────────────────────────────────
function CreditBar({ base, bonus, promo, total }: { base: number; bonus: number; promo: number; total: number }) {
  const pBase  = (base  / total) * 100
  const pBonus = (bonus / total) * 100
  const pPromo = (promo / total) * 100
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ height: 5, display: 'flex', gap: 1, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pBase}%`,  background: `rgba(var(--fg-rgb),0.5)`,  transition: 'width 0.6s ease' }} />
        <div style={{ width: `${pBonus}%`, background: `rgba(var(--fg-rgb),0.22)`, transition: 'width 0.6s ease' }} />
        {pPromo > 0 && <div style={{ width: `${pPromo}%`, background: '#16A34A', transition: 'width 0.6s ease' }} />}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.38)` }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, background: `rgba(var(--fg-rgb),0.5)`, marginRight: 5, borderRadius: 1, verticalAlign: 'middle' }} />
          Base {fmt(base)}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.38)` }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, background: `rgba(var(--fg-rgb),0.22)`, marginRight: 5, borderRadius: 1, verticalAlign: 'middle' }} />
          Bonus +{fmt(bonus)}
        </span>
        {promo > 0 && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A' }}>
            <span style={{ display: 'inline-block', width: 7, height: 7, background: '#16A34A', marginRight: 5, borderRadius: 1, verticalAlign: 'middle' }} />
            Promo +{fmt(promo)}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Plan card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, allPromos, selected, onSelect }: {
  plan: TopUpPlan
  allPromos: Promo[]
  selected: boolean
  onSelect: () => void
}) {
  const { i18n } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Only promos that apply to this specific plan and are currently active
  const planPromos = allPromos.filter(p => isActive(p) && p.applyTo !== null && p.applyTo.includes(plan.id))
  const extra = planPromos.reduce((s, p) => s + promoExtra(plan, p), 0)
  const total = plan.baseCredits + plan.bonusCredits + extra
  const centsPerCredit = ((plan.price * 100) / total).toFixed(2)
  const hasPromo = planPromos.length > 0
  // Multiplier: total credits vs. base price-equivalent (total / baseCredits)
  const multiplier = (total / plan.baseCredits).toFixed(2)

  return (
    <div
      ref={ref}
      onClick={onSelect}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <div style={{
        padding: '24px 22px 22px',
        background: selected ? `rgba(var(--fg-rgb),0.05)` : 'var(--surface)',
        border: selected
          ? `1.5px solid rgba(var(--fg-rgb),0.65)`
          : hasPromo
            ? `1px solid rgba(22,163,74,0.3)`
            : `1px solid rgba(var(--border-rgb),0.1)`,
        transition: 'border-color 0.25s ease, background 0.25s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Badge row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, minHeight: 24 }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {plan.popular && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg)', background: `rgba(var(--fg-rgb),0.1)`, border: `1px solid rgba(var(--border-rgb),0.18)`, padding: '3px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '最受欢迎' : 'Popular'}</span>
            )}
            {plan.tag && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)`, border: `1px solid rgba(var(--border-rgb),0.1)`, padding: '3px 8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? (plan.tag === 'Try it out' ? '试一试' : (plan.tag === 'Best value' ? '超值' : plan.tag)) : plan.tag}</span>
            )}
            {!plan.popular && !plan.tag && <span style={{ display: 'block', height: 24 }} />}
          </div>
          {selected && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginLeft: 8 }}>
              <circle cx="9" cy="9" r="9" fill="var(--fg)" />
              <path d="M5 9L8 12L13 6" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {/* Price + multiplier on same row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: `rgba(var(--fg-rgb),0.35)`, fontWeight: 400 }}>$</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: '-0.045em', color: 'var(--fg)', lineHeight: 1 }}>{plan.price}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.3)`, marginLeft: 3 }}>USD</span>
          </div>
          {/* Multiplier badge */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: hasPromo ? '#16A34A' : `rgba(var(--fg-rgb),0.4)`, lineHeight: 1 }}>
              ×{multiplier}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.08em', marginTop: 2 }}>{i18n.language === 'zh' ? '倍数' : 'multiplier'}</div>
          </div>
        </div>

        {/* Total credits */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: hasPromo ? '#16A34A' : '#2563EB', lineHeight: 1 }}>
            {fmt(total)}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.06em' }}>{i18n.language === 'zh' ? '积分' : 'credits'}</span>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, margin: 0, letterSpacing: '0.08em' }}>
          ${centsPerCredit}¢ / credit
        </p>

        <CreditBar base={plan.baseCredits} bonus={plan.bonusCredits} promo={extra} total={total} />

        {/* Promo strip — only when this plan has an active promotion */}
        <div style={{ marginTop: 'auto' }}>
          {hasPromo
            ? planPromos.map(p => <CardPromoStrip key={p.id} promo={p} />)
            : <div style={{ height: 16 }} />
          }
        </div>
      </div>
    </div>
  )
}

// ── Promo rule detail ─────────────────────────────────────────────────────────
function PromoDetail({ promo }: { promo: Promo }) {
  const { i18n } = useTranslation()
  const active = isActive(promo)
  const days = daysLeft(promo.endDate)
  return (
    <div style={{ padding: '20px 24px', background: 'var(--surface)', border: `1px solid rgba(var(--border-rgb),0.1)`, opacity: active ? 1 : 0.45 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#16A34A' : `rgba(var(--fg-rgb),0.2)`, flexShrink: 0 }} />
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--fg)', margin: 0, letterSpacing: '-0.01em' }}>{i18n.language === 'zh' ? promo.labelZh || promo.label : promo.label}</p>
            {!active && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.12em', textTransform: 'uppercase', border: `1px solid rgba(var(--border-rgb),0.12)`, padding: '2px 7px' }}>{i18n.language === 'zh' ? '已过期' : 'Expired'}</span>}
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: `rgba(var(--fg-rgb),0.45)`, margin: 0, lineHeight: 1.55 }}>{i18n.language === 'zh' ? promo.descriptionZh || promo.description : promo.description}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: active ? '#16A34A' : `rgba(var(--fg-rgb),0.3)`, letterSpacing: '-0.025em', lineHeight: 1 }}>
            {promo.type === 'percent' ? `+${promo.value}%` : `+${fmt(promo.value)}`}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, marginTop: 3, letterSpacing: '0.07em' }}>
            {promo.type === 'percent' ? 'of bonus' : 'flat credits'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 28, paddingTop: 14, borderTop: `1px solid rgba(var(--border-rgb),0.07)`, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Period  </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>
            {new Date(promo.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {new Date(promo.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        {active && (
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Ends in  </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: days <= 3 ? '#DC2626' : `rgba(var(--fg-rgb),0.5)` }}>{days}d</span>
          </div>
        )}
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Applies to  </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>
            {promo.applyTo === null ? 'All packages' : PLANS.filter(p => promo.applyTo!.includes(p.id)).map(p => `$${p.price}`).join(', ')}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Do credits expire?", q_zh: "积分会过期吗？", a: "Credits never expire. Once added to your account they remain available indefinitely, regardless of when you top up.", a_zh: "积分永不过期。一旦添加到您的账户中，它们将无限期有效，无论您何时充值。" },
  { q: "How are promotional bonuses calculated?", q_zh: "促销奖励是如何计算的？", a: "Percentage promos apply to your plan's permanent bonus credits. Flat promos add a fixed amount on top. Multiple active promos stack independently.", a_zh: "百分比促销适用于您套餐的永久奖励积分。固定金额促销会在顶部添加固定数量的积分。多个有效的促销活动独立叠加。" },
  { q: "Can I top up multiple times during a promotion?", q_zh: "我可以在促销期间多次充值吗？", a: "Yes. Each top-up during an active promotion receives the promotional bonus. One-time promos (like First Top-up) are applied only on the qualifying first purchase.", a_zh: "可以。在促销期间进行的每次充值都会获得促销奖励。一次性促销（如首次充值）仅适用于符合条件的首次购买。" },
  { q: "What can I use credits for?", q_zh: "积分可以用来做什么？", a: "Credits are the platform currency used for all paid features — generation requests, exports, priority queue, and API calls. Usage rates depend on feature tier.", a_zh: "积分是用于所有付费功能的平台货币——生成请求、导出、优先队列和 API 调用。使用率取决于功能层级。" },
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Pricing() {
  const { i18n } = useTranslation()
  const [selectedId, setSelectedId] = useState<string>('standard')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const selected = PLANS.find(p => p.id === selectedId)!
  // Only promos active right now AND applying to the selected plan
  const selPromos = PROMOS.filter(p => isActive(p) && p.applyTo !== null && p.applyTo.includes(selected.id))
  const selPromoExtra = selPromos.reduce((s, p) => s + promoExtra(selected, p), 0)
  const selTotal = selected.baseCredits + selected.bonusCredits + selPromoExtra

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 48px 52px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 18px' }}>
          {i18n.language === 'zh' ? '积分 · 充值' : 'Credits · Top-up'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'end' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 900, letterSpacing: '-0.038em', color: 'var(--fg)', margin: 0, lineHeight: 0.9, textTransform: 'uppercase' }}>
            Buy<br /><span style={{ color: `rgba(var(--fg-rgb),0.18)` }}>{i18n.language === 'zh' ? '积分' : 'credits'}</span>
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: `rgba(var(--fg-rgb),0.42)`, margin: 0 }}>
            Pay in USD, spend platform credits. Your credits never expire and carry over indefinitely. Every package includes a permanent bonus — active promotions stack on top automatically.
          </p>
        </div>
      </section>

      <div style={{ padding: '48px 48px 80px' }}>

        {/* ── Plan grid ────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 40, alignItems: 'stretch' }}>
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              allPromos={PROMOS}
              selected={selectedId === plan.id}
              onSelect={() => setSelectedId(plan.id)}
            />
          ))}
        </div>

        {/* ── Summary bar ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 24, alignItems: 'center',
          padding: '24px 32px',
          border: `1px solid rgba(var(--border-rgb),0.14)`,
          background: 'var(--surface)',
          marginBottom: 72,
        }}>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Pay */}
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>{i18n.language === 'zh' ? '您支付' : 'You pay'}</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--fg)', margin: 0 }}>${selected.price} <span style={{ fontSize: 14, fontWeight: 400, color: `rgba(var(--fg-rgb),0.35)` }}>USD</span></p>
            </div>

            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style={{ opacity: 0.2, flexShrink: 0 }}>
              <path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="var(--fg)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Get */}
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>{i18n.language === 'zh' ? '您获得' : 'You get'}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: selPromoExtra > 0 ? '#16A34A' : '#2563EB' }}>{fmt(selTotal)}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: `rgba(var(--fg-rgb),0.35)` }}>{i18n.language === 'zh' ? '积分' : 'credits'}</span>
              </div>
            </div>

            {/* Breakdown pills */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.45)`, border: `1px solid rgba(var(--border-rgb),0.1)`, padding: '4px 10px' }}>
                Base {fmt(selected.baseCredits)}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.45)`, border: `1px solid rgba(var(--border-rgb),0.1)`, padding: '4px 10px' }}>
                +{fmt(selected.bonusCredits)} {i18n.language === 'zh' ? '奖励' : 'bonus'}
              </span>
              {selPromoExtra > 0 && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16A34A', border: `1px solid rgba(22,163,74,0.28)`, padding: '4px 10px' }}>
                  +{fmt(selPromoExtra)} {i18n.language === 'zh' ? '优惠' : 'promo'}
                </span>
              )}
            </div>
          </div>

          {/* CTA button */}
          <button
            style={{ padding: '14px 36px', background: 'var(--fg)', border: 'none', color: 'var(--bg)', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer', transition: 'opacity 0.2s ease', whiteSpace: 'nowrap', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Top up ${selected.price}
          </button>
        </div>

        {/* ── How credits work ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>How it works</p>
            <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.08)` }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: `rgba(var(--border-rgb),0.08)` }}>
            {[
              { n: '01', title: 'Choose a package', body: 'Pick any top-up amount. Every package includes a permanent bonus on top of the base credits.' },
              { n: '02', title: 'Promotions stack', body: 'Active promos automatically add extra credits at checkout — no codes needed. Promos stack with your permanent bonus.' },
              { n: '03', title: 'Credits never expire', body: "Your balance carries over indefinitely. Top up at your pace; we won't pressure you with expiry windows." },
            ].map(step => (
              <div key={step.n} style={{ padding: '28px 28px', background: 'var(--surface)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.2)`, letterSpacing: '0.15em', margin: '0 0 14px' }}>{step.n}</p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--fg)', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{step.title}</p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, color: `rgba(var(--fg-rgb),0.42)`, margin: 0, lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Promotions detail ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{i18n.language === 'zh' ? '促销活动' : 'Promotions'}</p>
            <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.08)` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.1em', flexShrink: 0 }}>
              {PROMOS.filter(isActive).length} {i18n.language === 'zh' ? '个进行中' : 'active'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROMOS.map(promo => <PromoDetail key={promo.id} promo={promo} />)}
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.28)`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{i18n.language === 'zh' ? '常见问题' : 'Questions'}</p>
            <div style={{ flex: 1, height: 1, background: `rgba(var(--border-rgb),0.08)` }} />
          </div>
          <div style={{ border: `1px solid rgba(var(--border-rgb),0.08)` }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? `1px solid rgba(var(--border-rgb),0.07)` : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20 }}
                >
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{i18n.language === 'zh' ? faq.q_zh : faq.q}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: `rgba(var(--fg-rgb),0.28)`, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.22s ease', lineHeight: 1 }}>+</span>
                </button>
                <div style={{ maxHeight: openFaq === i ? 180 : 0, overflow: 'hidden', transition: 'max-height 0.32s ease' }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: `rgba(var(--fg-rgb),0.42)`, margin: 0, padding: '0 28px 22px' }}>
                    {i18n.language === 'zh' ? faq.a_zh : faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fine print ───────────────────────────────────────────────────── */}
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 300, color: `rgba(var(--fg-rgb),0.28)`, lineHeight: 1.8, marginTop: 48, paddingTop: 28, borderTop: `1px solid rgba(var(--border-rgb),0.06)` }}>
          Credits are added to your account instantly after payment confirmation. Promotional bonuses are applied at the moment of purchase under the terms stated for each promotion. Prices are displayed in USD and may be subject to local taxes where applicable.
        </p>
      </div>
    </div>
  )
}
