import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type NoticeType = 'maintenance' | 'feature' | 'pricing' | 'incident' | 'security'

interface Notice {
  id: string
  type: NoticeType
  title: string
  titleZh: string
  summary: string
  summaryZh: string
  body: string
  bodyZh: string
  date: string      // ISO
  pinned?: boolean
  resolved?: boolean   // for incidents/maintenance
}

const TYPE_META: Record<NoticeType, { label: string; labelZh: string; color: string; bg: string }> = {
  maintenance: { label: 'Maintenance',  labelZh: '维护',   color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
  feature:     { label: 'New Feature',  labelZh: '新功能', color: '#2563eb', bg: 'rgba(37,99,235,0.08)'  },
  pricing:     { label: 'Pricing',      labelZh: '定价',   color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  incident:    { label: 'Incident',     labelZh: '故障',   color: '#dc2626', bg: 'rgba(220,38,38,0.08)'  },
  security:    { label: 'Security',     labelZh: '安全',   color: '#16a34a', bg: 'rgba(22,163,74,0.08)'  },
}

const NOTICES: Notice[] = [
  {
    id: 'n01',
    type: 'feature',
    title: 'Claude Opus 5 & Gemini 2.5 Ultra now available',
    titleZh: 'Claude Opus 5 & Gemini 2.5 Ultra 正式上线',
    summary: 'Two new flagship-tier models added to the platform with full cache pricing support.',
    summaryZh: '两款旗舰级模型上线平台，完整支持缓存定价四维度。',
    body: `We are pleased to announce that Claude Opus 5 (Anthropic) and Gemini 2.5 Ultra (Google DeepMind) are now available on the platform.\n\nBoth models support 1M token context windows and all four pricing dimensions: Input, Output, Cache Write, and Cache Read. Prompt caching must be enabled on your API key to access cache pricing.\n\nClaude Opus 5 delivers Anthropic's strongest reasoning and instruction following to date. Gemini 2.5 Ultra extends DeepMind's 2M context capability with native code execution and deep thinking traces.\n\nSee the Models page for full pricing details.`,
    bodyZh: `我们很高兴宣布，Claude Opus 5（Anthropic）与 Gemini 2.5 Ultra（Google DeepMind）现已在平台正式上线。\n\n两款模型均支持 1M token 上下文窗口，以及完整的四维度定价：输入、输出、缓存写入与缓存读取。需在 API 密钥中启用 Prompt Caching 后方可享受缓存定价。\n\nClaude Opus 5 是 Anthropic 迄今最强的推理与指令理解模型。Gemini 2.5 Ultra 将 DeepMind 的 2M 上下文能力与原生代码执行、深度思维链追踪相结合。\n\n详细定价请查看模型页面。`,
    date: '2026-08-07T10:00:00Z',
    pinned: true,
  },
  {
    id: 'n02',
    type: 'pricing',
    title: 'Claude Sonnet 5 introductory pricing — through Aug 31',
    titleZh: 'Claude Sonnet 5 限时优惠价格 — 至 8 月 31 日',
    summary: 'Input reduced from 300 to 200 cr/1M tokens, output from 1,500 to 1,000 cr/1M tokens.',
    summaryZh: '输入从 300 降至 200 积分/百万 token，输出从 1500 降至 1000 积分/百万 token。',
    body: `To celebrate the launch of Claude Sonnet 5, Anthropic is offering introductory pricing through August 31, 2026.\n\nPromo rates:\n• Input: 200 cr / 1M tokens (regular: 300 cr)\n• Output: 1,000 cr / 1M tokens (regular: 1,500 cr)\n• Cache Write: 250 cr / 1M tokens (regular: 375 cr)\n• Cache Read: 20 cr / 1M tokens (regular: 30 cr)\n\nThe discounted rates apply automatically — no coupon or configuration needed. Standard rates resume on September 1, 2026.`,
    bodyZh: `为庆祝 Claude Sonnet 5 发布，Anthropic 提供限时优惠定价，有效期至 2026 年 8 月 31 日。\n\n优惠价格：\n• 输入：200 积分 / 百万 token（原价 300 积分）\n• 输出：1,000 积分 / 百万 token（原价 1,500 积分）\n• 缓存写入：250 积分 / 百万 token（原价 375 积分）\n• 缓存读取：20 积分 / 百万 token（原价 30 积分）\n\n优惠价格自动生效，无需填写优惠码或额外配置。标准价格将于 2026 年 9 月 1 日恢复。`,
    date: '2026-08-05T09:00:00Z',
    pinned: true,
  },
  {
    id: 'n03',
    type: 'incident',
    title: 'Resolved: Elevated latency on inference endpoint',
    titleZh: '已解决：推理接口延迟异常',
    summary: 'A 40-minute degradation affecting the /v1/inference endpoint was fully resolved at 14:22 UTC.',
    summaryZh: '影响 /v1/inference 接口约 40 分钟的延迟异常已于 14:22 UTC 完全恢复。',
    body: `Timeline (all times UTC):\n\n13:41 — Increased error rates and latency spikes detected on the /v1/inference endpoint. On-call engineer paged.\n13:48 — Incident declared. Preliminary diagnosis points to upstream routing saturation.\n14:05 — Traffic rerouted to secondary cluster. Latency begins recovering.\n14:22 — Full recovery confirmed. Incident closed.\n\nAffected: all regions, all models\nMax P99 latency: 18.4 s (normal: ~1.2 s)\nError rate peak: 6.3%\n\nRoot cause: A configuration push to the load balancer introduced a routing loop under high concurrency. A rollback and hot-patch were applied. A post-mortem will be published within 72 hours.\n\nWe apologize for the disruption. Credits for affected requests will be automatically refunded within 24 hours.`,
    bodyZh: `事件时间线（均为 UTC）：\n\n13:41 — 检测到 /v1/inference 接口错误率升高与延迟激增，值班工程师已介入。\n13:48 — 正式宣布故障，初步诊断指向上游路由饱和。\n14:05 — 流量切换至备用集群，延迟开始恢复。\n14:22 — 全面恢复确认，故障关闭。\n\n影响范围：所有地区、所有模型\n最高 P99 延迟：18.4 秒（正常约 1.2 秒）\n错误率峰值：6.3%\n\n根本原因：负载均衡器的一次配置推送在高并发下引入了路由循环。已回滚并应用热补丁。将在 72 小时内发布事后分析报告。\n\n对此次故障深感抱歉。受影响请求的积分将在 24 小时内自动退还。`,
    date: '2026-08-06T14:22:00Z',
    resolved: true,
  },
  {
    id: 'n04',
    type: 'feature',
    title: 'Prompt caching now generally available',
    titleZh: 'Prompt 缓存正式开放',
    summary: 'Cache Write and Cache Read pricing tiers are now live for all API key holders.',
    summaryZh: '缓存写入与缓存读取定价现已对所有 API 密钥持有者开放。',
    body: `Prompt caching exits beta and is now available to all users.\n\nWith caching enabled, repeated prompt prefixes are stored on the inference cluster for up to 5 minutes (Anthropic models) or 10 minutes (Google models). Subsequent requests that hit the cache are charged at the Cache Read rate — typically 10–15× cheaper than standard input pricing.\n\nTo enable caching on your API key, go to the Keys page and toggle "Prompt Caching" for the relevant key. No code changes are required; the platform handles cache_control headers automatically.\n\nSee the Models page for Cache Write and Cache Read rates per model.`,
    bodyZh: `Prompt 缓存正式退出测试版，向所有用户开放。\n\n启用缓存后，重复的提示词前缀将存储在推理集群中，Anthropic 模型缓存有效期 5 分钟，Google 模型为 10 分钟。命中缓存的后续请求按缓存读取价格计费，通常比标准输入价格低 10–15 倍。\n\n在密钥页面开启对应密钥的"Prompt 缓存"开关即可启用，无需修改代码，平台将自动处理 cache_control 请求头。\n\n各模型的缓存写入与缓存读取价格详见模型页面。`,
    date: '2026-08-01T08:00:00Z',
  },
  {
    id: 'n05',
    type: 'maintenance',
    title: 'Scheduled maintenance — Aug 3, 02:00–04:00 UTC',
    titleZh: '计划维护 — 8 月 3 日 02:00–04:00 UTC',
    summary: 'Database cluster upgrade. The API and dashboard will be in read-only mode.',
    summaryZh: '数据库集群升级。API 与控制台将进入只读模式。',
    body: `We will perform a scheduled maintenance window on August 3, 2026 from 02:00 to 04:00 UTC.\n\nDuring this window:\n• New API inference requests will be queued and processed after maintenance ends\n• The dashboard will be accessible in read-only mode\n• Account top-ups and key creation will be temporarily unavailable\n\nExpected downtime for write operations: up to 90 minutes within the 2-hour window.\n\nWe recommend scheduling batch jobs outside this window. Queued requests will not be dropped — they will execute in order once the cluster is restored.\n\nApologies for any inconvenience.`,
    bodyZh: `我们将于 2026 年 8 月 3 日 02:00–04:00 UTC 执行计划维护窗口。\n\n维护期间：\n• 新的 API 推理请求将排队，维护结束后处理\n• 控制台可访问但处于只读模式\n• 账户充值与密钥创建暂时不可用\n\n写操作预计停机时长：2 小时窗口内最多 90 分钟。\n\n建议将批量任务安排在此窗口之外。排队请求不会丢失，集群恢复后将按序执行。\n\n对此带来的不便深感抱歉。`,
    date: '2026-07-29T12:00:00Z',
    resolved: true,
  },
  {
    id: 'n06',
    type: 'security',
    title: 'Reminder: Rotate API keys used in client-side code',
    titleZh: '提醒：请轮换暴露在客户端代码中的 API 密钥',
    summary: 'We detected keys embedded in public repositories. Affected keys have been auto-revoked.',
    summaryZh: '我们检测到密钥被提交至公开仓库，受影响密钥已自动撤销。',
    body: `Our automated scanner identified a small number of platform API keys that were inadvertently committed to public GitHub repositories.\n\nAffected keys have been automatically revoked. If your key stopped working unexpectedly, this is likely the cause.\n\nBest practices:\n• Never include API keys in front-end or client-side code\n• Use environment variables (VITE_*, .env.local) and ensure .env files are in .gitignore\n• Rotate keys periodically from the Keys page\n• Use key scoping to restrict each key to the minimum required models\n\nIf you believe your key was revoked in error, contact support with your key prefix (the first 8 characters).`,
    bodyZh: `我们的自动化扫描器发现少量平台 API 密钥被意外提交到了公开 GitHub 仓库。\n\n受影响的密钥已自动撤销。如果您的密钥突然失效，很可能就是这个原因。\n\n最佳实践：\n• 切勿在前端或客户端代码中包含 API 密钥\n• 使用环境变量（VITE_*、.env.local），并确保 .env 文件已加入 .gitignore\n• 定期在密钥页面轮换密钥\n• 使用密钥作用域将每个密钥限制在所需的最少模型范围\n\n如果您认为密钥被误撤销，请携带密钥前缀（前 8 位字符）联系客服。`,
    date: '2026-07-22T15:00:00Z',
  },
  {
    id: 'n07',
    type: 'pricing',
    title: 'Gemini 2.5 Pro limited-time pricing — through Sep 15',
    titleZh: 'Gemini 2.5 Pro 限时优惠 — 至 9 月 15 日',
    summary: 'Input reduced from 125 to 100 cr/1M, output from 1,000 to 800 cr/1M tokens.',
    summaryZh: '输入从 125 降至 100 积分/百万 token，输出从 1000 降至 800 积分/百万 token。',
    body: `Google has extended promotional pricing for Gemini 2.5 Pro through September 15, 2026.\n\nPromo rates:\n• Input: 100 cr / 1M tokens (regular: 125 cr)\n• Output: 800 cr / 1M tokens (regular: 1,000 cr)\n• Cache Write: 125 cr / 1M tokens (regular: 156 cr)\n• Cache Read: 10 cr / 1M tokens (regular: 12 cr)\n\nApplied automatically to all requests using the gemini-2.5-pro model identifier.`,
    bodyZh: `Google 已将 Gemini 2.5 Pro 的优惠定价延长至 2026 年 9 月 15 日。\n\n优惠价格：\n• 输入：100 积分 / 百万 token（原价 125 积分）\n• 输出：800 积分 / 百万 token（原价 1,000 积分）\n• 缓存写入：125 积分 / 百万 token（原价 156 积分）\n• 缓存读取：10 积分 / 百万 token（原价 12 积分）\n\n所有使用 gemini-2.5-pro 模型标识符的请求自动享受优惠价格。`,
    date: '2026-07-15T09:00:00Z',
    pinned: false,
  },
  {
    id: 'n08',
    type: 'feature',
    title: 'Key usage analytics now available',
    titleZh: '密钥用量分析功能上线',
    summary: 'Per-key token and credit consumption is now visible on the Keys page.',
    summaryZh: '每个 API 密钥的 token 与积分消耗现已在密钥页面可见。',
    body: `You can now view per-key usage analytics directly from the Keys page. Each API key now shows:\n\n• Total tokens consumed (input / output / cached)\n• Credits spent in the last 7 days and 30 days\n• Last-used timestamp\n• Model breakdown\n\nUsage data is updated every 15 minutes. Historical data is retained for 90 days.\n\nThis feature is available to all account tiers at no additional cost.`,
    bodyZh: `您现在可以直接在密钥页面查看每个 API 密钥的用量分析。每个密钥现在显示：\n\n• 总 token 消耗（输入 / 输出 / 缓存）\n• 最近 7 天和 30 天的积分消耗\n• 最后使用时间\n• 模型维度分析\n\n用量数据每 15 分钟更新一次，历史数据保留 90 天。\n\n此功能对所有账户等级免费开放。`,
    date: '2026-07-10T11:00:00Z',
  },
]

function fmtDate(iso: string, lang: 'zh' | 'en') {
  const d = new Date(iso)
  return lang === 'zh'
    ? d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtRelative(iso: string, lang: 'zh' | 'en') {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (lang === 'zh') {
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days} 天前`
    if (days < 30) return `${Math.floor(days / 7)} 周前`
    return `${Math.floor(days / 30)} 个月前`
  }
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function NoticeRow({ notice, onSelect, selected }: {
  notice: Notice
  onSelect: () => void
  selected: boolean
}) {
  const { i18n } = useTranslation()
  const meta = TYPE_META[notice.type]
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '18px 24px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.07)`,
        cursor: 'pointer',
        background: selected ? `rgba(var(--fg-rgb),0.04)` : 'transparent',
        borderLeft: selected ? `2px solid rgba(var(--fg-rgb),0.6)` : `2px solid transparent`,
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: meta.color,
          background: meta.bg,
          padding: '2px 8px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {i18n.language === 'zh' ? meta.labelZh : meta.label}
        </span>
        {notice.pinned && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: `rgba(var(--fg-rgb),0.35)`,
            letterSpacing: '0.1em',
          }}>📌 {i18n.language === 'zh' ? '置顶' : 'Pinned'}</span>
        )}
        {notice.resolved && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#16a34a',
            letterSpacing: '0.1em',
          }}>✓ {i18n.language === 'zh' ? '已解决' : 'Resolved'}</span>
        )}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: `rgba(var(--fg-rgb),0.25)`,
          letterSpacing: '0.06em',
          marginLeft: 'auto',
          flexShrink: 0,
        }}>
          {fmtRelative(notice.date, i18n.language as 'zh' | 'en')}
        </span>
      </div>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--fg)',
        margin: 0,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      }}>
        {i18n.language === 'zh' ? notice.titleZh : notice.title}
      </p>
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        color: `rgba(var(--fg-rgb),0.42)`,
        margin: 0,
        lineHeight: 1.55,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      } as React.CSSProperties}>
        {i18n.language === 'zh' ? notice.summaryZh : notice.summary}
      </p>
    </div>
  )
}

function NoticeDetail({ notice }: { notice: Notice }) {
  const { i18n } = useTranslation()
  const meta = TYPE_META[notice.type]

  return (
    <div style={{ padding: '36px 40px', overflowY: 'auto', height: '100%' }}>
      {/* Tags row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: meta.color,
          background: meta.bg,
          padding: '3px 10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          {i18n.language === 'zh' ? meta.labelZh : meta.label}
        </span>
        {notice.resolved && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: '#16a34a',
            border: `1px solid rgba(22,163,74,0.25)`,
            padding: '3px 10px',
            letterSpacing: '0.1em',
          }}>
            ✓ {i18n.language === 'zh' ? '已解决' : 'Resolved'}
          </span>
        )}
        {notice.pinned && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: `rgba(var(--fg-rgb),0.3)`,
            border: `1px solid rgba(var(--border-rgb),0.12)`,
            padding: '3px 10px',
            letterSpacing: '0.1em',
          }}>
            {i18n.language === 'zh' ? '置顶' : 'Pinned'}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(20px, 2.5vw, 28px)',
        fontWeight: 900,
        letterSpacing: '-0.03em',
        color: 'var(--fg)',
        margin: '0 0 8px',
        lineHeight: 1.15,
      }}>
        {i18n.language === 'zh' ? notice.titleZh : notice.title}
      </h2>

      {/* Date */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: `rgba(var(--fg-rgb),0.28)`,
        margin: '0 0 28px',
        letterSpacing: '0.1em',
      }}>
        {fmtDate(notice.date, i18n.language as 'zh' | 'en')} · {fmtRelative(notice.date, i18n.language as 'zh' | 'en')}
      </p>

      {/* Summary */}
      <p style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 1.6,
        color: `rgba(var(--fg-rgb),0.7)`,
        margin: '0 0 24px',
        paddingBottom: 24,
        borderBottom: `1px solid rgba(var(--border-rgb),0.08)`,
      }}>
        {i18n.language === 'zh' ? notice.summaryZh : notice.summary}
      </p>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {(i18n.language === 'zh' ? notice.bodyZh : notice.body).split('\n').map((line, i) => (
          line === '' ? (
            <div key={i} style={{ height: 14 }} />
          ) : line.startsWith('•') ? (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 4 }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: meta.color,
                marginTop: 2,
                flexShrink: 0,
              }}>•</span>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.7,
                color: `rgba(var(--fg-rgb),0.62)`,
                margin: 0,
              }}>
                {line.slice(1).trim()}
              </p>
            </div>
          ) : (
            <p key={i} style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.7,
              color: `rgba(var(--fg-rgb),0.62)`,
              margin: 0,
            }}>
              {line}
            </p>
          )
        ))}
      </div>
    </div>
  )
}

const TYPE_FILTERS: Array<{ value: NoticeType | 'all'; zh: string; en: string }> = [
  { value: 'all',         zh: '全部',   en: 'All'         },
  { value: 'feature',     zh: '新功能', en: 'Features'    },
  { value: 'pricing',     zh: '定价',   en: 'Pricing'     },
  { value: 'maintenance', zh: '维护',   en: 'Maintenance' },
  { value: 'incident',    zh: '故障',   en: 'Incidents'   },
  { value: 'security',    zh: '安全',   en: 'Security'    },
]

export default function Notices() {
  const [filter, setFilter] = useState<NoticeType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string>(NOTICES[0].id)
  const { t, i18n } = useTranslation()

  const pinned = NOTICES.filter(n => n.pinned && (filter === 'all' || n.type === filter))
  const rest    = NOTICES.filter(n => !n.pinned && (filter === 'all' || n.type === filter))
  const sorted  = [...pinned, ...rest]

  const selected = NOTICES.find(n => n.id === selectedId) ?? NOTICES[0]

  return (
    <div style={{
      background: 'var(--bg)',
      color: 'var(--fg)',
      minHeight: '100vh',
      paddingTop: 68,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <section style={{
        padding: '44px 48px 32px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.08)`,
        flexShrink: 0,
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.28)`,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          {i18n.language === 'zh' ? '平台 · 公告' : 'Platform · Notices'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
          <div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(28px, 4vw, 50px)',
              fontWeight: 900,
              letterSpacing: '-0.038em',
              color: 'var(--fg)',
              margin: '0 0 10px',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}>
              {i18n.language === 'zh' ? '公告 &' : 'Notices &'}<br />
              <span style={{ color: `rgba(var(--fg-rgb),0.18)` }}>{i18n.language === 'zh' ? '通知' : 'Announcements'}</span>
            </h2>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: `rgba(var(--fg-rgb),0.38)`,
              margin: 0,
            }}>
              {i18n.language === 'zh' ? '平台更新、故障通报、定价调整与安全公告。' : 'Platform updates, incidents, pricing changes, and security advisories.'}
            </p>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: `rgba(var(--fg-rgb),0.28)`,
            letterSpacing: '0.1em',
            textAlign: 'right',
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--fg)', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em', lineHeight: 1 }}>
              {NOTICES.length}
            </div>
            {i18n.language === 'zh' ? '条公告' : 'notices total'}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div style={{
        padding: '12px 48px',
        borderBottom: `1px solid rgba(var(--border-rgb),0.07)`,
        display: 'flex',
        gap: 5,
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: filter === f.value ? `rgba(var(--fg-rgb),0.08)` : 'transparent',
              border: filter === f.value
                ? `1px solid rgba(var(--fg-rgb),0.3)`
                : `1px solid rgba(var(--border-rgb),0.1)`,
              color: filter === f.value
                ? 'var(--fg)'
                : f.value !== 'all'
                ? TYPE_META[f.value as NoticeType].color
                : `rgba(var(--fg-rgb),0.35)`,
            }}
          >
            {i18n.language === 'zh' ? f.zh : f.en}
          </button>
        ))}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: `rgba(var(--fg-rgb),0.22)`,
          letterSpacing: '0.06em',
          marginLeft: 'auto',
          alignSelf: 'center',
        }}>
          {i18n.language === 'zh' ? `共 ${sorted.length} 条` : `${sorted.length} result${sorted.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Split pane */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* List */}
        <div style={{
          borderRight: `1px solid rgba(var(--border-rgb),0.08)`,
          overflowY: 'auto',
        }}>
          {sorted.length === 0 ? (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: `rgba(var(--fg-rgb),0.25)`,
              letterSpacing: '0.1em',
            }}>
              {i18n.language === 'zh' ? '此分类下无公告。' : 'No notices in this category.'}
            </div>
          ) : (
            sorted.map(n => (
              <NoticeRow
                key={n.id}
                notice={n}
                selected={selectedId === n.id}
                onSelect={() => setSelectedId(n.id)}
              />
            ))
          )}
        </div>

        {/* Detail */}
        <div style={{ overflowY: 'auto' }}>
          <NoticeDetail notice={selected} />
        </div>
      </div>
    </div>
  )
}
