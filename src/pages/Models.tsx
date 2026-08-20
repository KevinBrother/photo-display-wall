import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PricePoint {
  input: number       // credits per 1M tokens
  output: number
  cacheWrite?: number
  cacheRead?: number
}

interface Promo {
  label: string
  labelZh?: string
  expiry: string   // display string
  expiryZh?: string
  price: PricePoint
}

interface LLMModel {
  id: string
  name: string
  provider: string
  providerLogo: string
  description: string
  descriptionZh: string
  contextK: number
  price: PricePoint
  promo?: Promo
  tier: 'flagship' | 'standard' | 'efficient'
  new?: boolean
  badge?: string
  badgeZh?: string
}

// 100 credits = $1 USD
const USD = (cr: number) => `$${(cr / 100).toFixed(cr % 100 === 0 ? 2 : 2)}`

const MODELS: LLMModel[] = [
  // ── Flagship ─────────────────────────────────────────────────────────────────
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    providerLogo: '◆',
    description: "Anthropic's most capable model. Superior reasoning, coding, and nuanced instruction following at scale.",
    descriptionZh: 'Anthropic 最强旗舰模型，具备卓越的推理、编码与复杂指令理解能力。',
    contextK: 1000,
    price: { input: 500, output: 2500, cacheWrite: 625, cacheRead: 50 },
    tier: 'flagship',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    providerLogo: '⬡',
    description: "OpenAI's frontier model with strongest multimodal reasoning and long-context understanding.",
    descriptionZh: 'OpenAI 前沿模型，多模态推理能力最强，支持超长上下文理解。',
    contextK: 1000,
    price: { input: 1000, output: 4000, cacheRead: 100 },
    tier: 'flagship',
    badge: 'Multimodal',
    badgeZh: '多模态',
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini 2.5 Ultra',
    provider: 'Google',
    providerLogo: '✦',
    description: 'Google DeepMind flagship with deep code execution, thinking traces, and 2M context capability.',
    descriptionZh: 'Google DeepMind 旗舰，支持深度代码执行、思维链追踪与 2M 上下文。',
    contextK: 2000,
    price: { input: 750, output: 3000, cacheRead: 75 },
    tier: 'flagship',
    new: true,
  },
  // ── Standard ─────────────────────────────────────────────────────────────────
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    providerLogo: '◆',
    description: 'Exceptional performance-to-cost ratio. Full reasoning capabilities for complex agentic tasks.',
    descriptionZh: '性价比卓越，支持完整推理能力，适合复杂 Agent 任务。',
    contextK: 1000,
    price: { input: 300, output: 1500, cacheWrite: 375, cacheRead: 30 },
    promo: {
      label: 'Intro Offer',
      labelZh: '首发特惠',
      expiry: 'thru Aug 31',
      expiryZh: '截至 8 月 31 日',
      price: { input: 200, output: 1000, cacheWrite: 250, cacheRead: 20 },
    },
    tier: 'standard',
    new: true,
  },
  {
    id: 'gpt-4-1',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    providerLogo: '⬡',
    description: 'Powerful general-purpose model with strong instruction following and function calling accuracy.',
    descriptionZh: '强大的通用模型，指令遵循与函数调用准确率高。',
    contextK: 128,
    price: { input: 200, output: 800, cacheRead: 20 },
    tier: 'standard',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    providerLogo: '✦',
    description: 'Versatile model excelling at coding, analysis, and multimodal tasks with 1M token context.',
    descriptionZh: '全能模型，擅长编码、分析与多模态任务，支持 1M token 上下文。',
    contextK: 1000,
    price: { input: 125, output: 1000, cacheRead: 12 },
    promo: {
      label: 'Limited',
      labelZh: '限时',
      expiry: 'thru Sep 15',
      expiryZh: '截至 9 月 15 日',
      price: { input: 100, output: 800, cacheRead: 10 },
    },
    tier: 'standard',
  },
  // ── Efficient ────────────────────────────────────────────────────────────────
  {
    id: 'claude-haiku',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    providerLogo: '◆',
    description: 'Ultra-fast and compact. Ideal for classification, extraction, and high-volume API workloads.',
    descriptionZh: '超快速轻量模型，适合分类、提取与大规模 API 调用场景。',
    contextK: 200,
    price: { input: 100, output: 500, cacheWrite: 125, cacheRead: 10 },
    tier: 'efficient',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    providerLogo: '⬡',
    description: 'Lightweight and highly capable for focused tasks. Excellent for real-time applications.',
    descriptionZh: '轻量高效，专注任务表现突出，适合实时应用场景。',
    contextK: 128,
    price: { input: 15, output: 60, cacheRead: 1 },
    tier: 'efficient',
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    providerLogo: '✦',
    description: 'Optimized for speed and throughput. Strong reasoning at a fraction of flagship cost.',
    descriptionZh: '极速高吞吐，以旗舰极小成本提供强大推理能力。',
    contextK: 1000,
    price: { input: 30, output: 250, cacheRead: 3 },
    tier: 'efficient',
  },
]

function fmt(cr: number) {
  const val = cr / 100
  return val < 1 ? `$${val.toFixed(3)}` : `$${val.toFixed(2)}`
}

const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: '#c96a3c',
  OpenAI:    '#19c37d',
  Google:    '#4285f4',
}

function PriceCell({ value, promoValue, highlight }: {
  value?: number
  promoValue?: number
  highlight?: boolean
}) {
  if (value === undefined) {
    return (
      <div style={{ textAlign: 'right', color: `rgba(var(--fg-rgb),0.3)` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>-</div>
      </div>
    )
  }

  const hasPromo = promoValue !== undefined

  return (
    <div style={{ textAlign: 'right' }}>
      {hasPromo && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.3)`,
          textDecoration: 'line-through',
          lineHeight: 1,
          marginBottom: 3,
        }}>
          {fmt(value)}
        </div>
      )}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        fontWeight: 500,
        color: hasPromo ? '#16a34a' : highlight ? 'var(--fg)' : `rgba(var(--fg-rgb),0.72)`,
        lineHeight: 1,
      }}>
        {fmt(hasPromo ? promoValue! : value)}
      </div>
    </div>
  )
}

function ModelRow({ model }: { model: LLMModel }) {
  const [hovered, setHovered] = useState(false)
  const { t, i18n } = useTranslation()
  const p = model.price
  const pp = model.promo?.price

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 120px 120px 120px 120px',
        gap: 0,
        alignItems: 'center',
        padding: '18px 24px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.07)`,
        background: hovered ? `rgba(var(--fg-rgb),0.02)` : 'transparent',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
    >
      {/* Model info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingRight: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--fg)',
          }}>
            {model.name}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: PROVIDER_COLORS[model.provider] ?? `rgba(var(--fg-rgb),0.4)`,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {model.providerLogo} {model.provider}
          </span>
          {model.new && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#2563eb',
              border: `1px solid rgba(37,99,235,0.3)`,
              padding: '2px 6px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>{t('models.new')}</span>
          )}
          {model.badge && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: `rgba(var(--fg-rgb),0.4)`,
              border: `1px solid rgba(var(--border-rgb),0.14)`,
              padding: '2px 6px',
              letterSpacing: '0.1em',
            }}>{i18n.language === 'zh' ? (model.badgeZh || model.badge) : model.badge}</span>
          )}
          {model.promo && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#16a34a',
              border: `1px solid rgba(22,163,74,0.3)`,
              background: `rgba(22,163,74,0.06)`,
              padding: '2px 7px',
              letterSpacing: '0.1em',
            }}>
              {i18n.language === 'zh' ? (model.promo.labelZh || model.promo.label) : model.promo.label} · {i18n.language === 'zh' ? (model.promo.expiryZh || model.promo.expiry) : model.promo.expiry}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 300,
            color: `rgba(var(--fg-rgb),0.4)`,
            margin: 0,
            lineHeight: 1.5,
          }}>
            {i18n.language === 'zh' ? model.descriptionZh : model.description}
          </p>
        </div>
        <div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: `rgba(var(--fg-rgb),0.26)`,
            letterSpacing: '0.06em',
          }}>
            {model.contextK >= 1000 ? `${model.contextK / 1000}M` : `${model.contextK}K`} ctx
          </span>
        </div>
      </div>

      {/* Input */}
      <PriceCell value={p.input} promoValue={pp?.input} highlight />
      {/* Output */}
      <PriceCell value={p.output} promoValue={pp?.output} />
      {/* Cache write */}
      <PriceCell value={p.cacheWrite} promoValue={pp?.cacheWrite} />
      {/* Cache read */}
      <PriceCell value={p.cacheRead} promoValue={pp?.cacheRead} />
    </div>
  )
}

export default function Models() {
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const { t, i18n } = useTranslation()

  const providers = ['all', 'Anthropic', 'OpenAI', 'Google']

  const filtered = MODELS.filter(m => providerFilter === 'all' || m.provider === providerFilter)

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68 }}>
      {/* Header */}
      <section style={{ padding: '52px 48px 40px', borderBottom: `1px solid rgba(var(--border-rgb),0.08)` }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 18px',
        }}>
          {i18n.language === 'zh' ? '平台 · 模型定价' : 'Platform · Model Pricing'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
          <div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.038em',
              color: 'var(--fg)',
              margin: '0 0 14px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}>
              {i18n.language === 'zh' ? '模型 &' : 'Models &'}<br />
              <span style={{ color: `rgba(var(--fg-rgb),0.18)` }}>{i18n.language === 'zh' ? '定价' : 'Pricing'}</span>
            </h2>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.75,
              color: `rgba(var(--fg-rgb),0.42)`,
              margin: 0,
              maxWidth: 520,
            }}>
              {i18n.language === 'zh' ? '所有价格以美元计，每百万 token。' : 'All prices in USD per 1M tokens.'}{' '}
              {i18n.language === 'zh' ? '限时优惠价格在活动期间自动替换标准价格。' : 'Promotional prices replace standard rates for the offer period.'}
            </p>
          </div>
        </div>
      </section>

      <div style={{ padding: '0 0 80px' }}>
        {/* Provider filter + column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 120px 120px 120px',
          gap: 0,
          padding: '14px 24px',
          borderBottom: `1px solid rgba(var(--border-rgb),0.12)`,
          position: 'sticky',
          top: 68,
          background: 'var(--bg)',
          zIndex: 10,
          backdropFilter: 'blur(12px)',
          marginLeft: 48,
          marginRight: 48,
          marginTop: 0,
        }}>
          {/* Provider filters */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {providers.map(p => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: providerFilter === p ? `rgba(var(--fg-rgb),0.08)` : 'transparent',
                  border: providerFilter === p
                    ? `1px solid rgba(var(--fg-rgb),0.3)`
                    : `1px solid rgba(var(--border-rgb),0.1)`,
                  color: providerFilter === p
                    ? 'var(--fg)'
                    : p !== 'all' && PROVIDER_COLORS[p]
                    ? PROVIDER_COLORS[p]
                    : `rgba(var(--fg-rgb),0.35)`,
                }}
              >
                {p === 'all' ? (i18n.language === 'zh' ? '全部' : 'All') : p}
              </button>
            ))}
          </div>
          {/* Column labels */}
          {[
            { key: 'input',      label: i18n.language === 'zh' ? '输入' : 'Input'       },
            { key: 'output',     label: i18n.language === 'zh' ? '输出' : 'Output'      },
            { key: 'cacheWrite', label: i18n.language === 'zh' ? '缓存输入' : 'Cache Input'  },
            { key: 'cacheRead',  label: i18n.language === 'zh' ? '缓存输出' : 'Cache Output'   },
          ].map(col => (
            <div key={col.key} style={{ textAlign: 'right' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: `rgba(var(--fg-rgb),0.3)`,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {col.label}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: `rgba(var(--fg-rgb),0.18)`,
                letterSpacing: '0.08em',
              }}>
                {i18n.language === 'zh' ? '/ 百万 tokens' : '/ 1M tokens'}
              </span>
            </div>
          ))}
        </div>

        {/* Table rows */}
        <div style={{ margin: '0 48px', borderTop: `1px solid rgba(var(--border-rgb),0.12)` }}>
          {filtered.map(m => (
            <ModelRow
              key={m.id}
              model={m}
            />
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          margin: '32px 48px 0',
          padding: '20px 24px',
          border: `1px solid rgba(var(--border-rgb),0.08)`,
          background: `rgba(var(--fg-rgb),0.018)`,
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { dot: '#c96a3c', label: 'Anthropic' },
              { dot: '#19c37d', label: 'OpenAI' },
              { dot: '#4285f4', label: 'Google' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, display: 'inline-block' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.08em' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 300,
            color: `rgba(var(--fg-rgb),0.28)`,
            margin: 0,
          }}>
            {i18n.language === 'zh' ? '价格更新于 2026-08-07 · 缓存定价需在 API 密钥中启用 Prompt Caching' : 'Prices updated 2026-08-07 · Cache pricing requires prompt caching to be enabled on your API key'}
          </p>
        </div>
      </div>
    </div>
  )
}
