import DocPage from '../components/DocPage'
import type { DocSection } from '../components/DocPage'
import { useTranslation } from 'react-i18next'

const SECTIONS_EN: DocSection[] = [
  {
    id: 'overview',
    heading: 'Overview',
    body: [
      'AXIS Studio GmbH ("AXIS", "we", "us") operates the AXIS platform, an AI inference API service. This Privacy Policy explains what personal data we collect, how we use it, and your rights under applicable law including the EU General Data Protection Regulation (GDPR).',
      'Our registered address is Rosenthaler Str. 40, 10178 Berlin, Germany. Our Data Protection Officer can be reached at dpo@axis.studio.',
      'By using the Service, you acknowledge this Policy. If you do not agree, please discontinue use and contact us to request account deletion.',
    ],
  },
  {
    id: 'data-collected',
    heading: 'Data We Collect',
    body: [
      'We collect the following categories of personal data:',
      '• Account data: email address, name or handle, payment method (tokenized; we do not store full card numbers), and registration timestamp.',
      '• Usage data: API request logs including timestamp, model ID, token counts, request ID, and HTTP status. Prompt and completion content is not stored beyond the duration of the request.',
      '• Billing data: credit purchase history, top-up amounts, promo codes applied, and refund records. Retained for 7 years for tax compliance.',
      '• Technical data: IP address, browser/client user-agent, and session identifiers. Used for security, fraud prevention, and rate limiting.',
      '• Communications: emails and support messages you send us. Retained for 3 years.',
    ],
  },
  {
    id: 'data-use',
    heading: 'How We Use Your Data',
    body: [
      'We process personal data under the following legal bases (GDPR Art. 6):',
      '• Contract performance: to provision and operate your account, process payments, and deliver inference results.',
      '• Legitimate interests: to detect fraud, investigate abuse, maintain security, and improve service reliability.',
      '• Legal obligation: to comply with applicable financial, tax, and law enforcement requirements.',
      '• Consent: for optional communications such as product newsletters. You may withdraw consent at any time.',
      'We do not sell, rent, or share your personal data with third parties for their own marketing purposes. We do not use your inference inputs or outputs to train models.',
    ],
  },
  {
    id: 'data-sharing',
    heading: 'Data Sharing & Sub-processors',
    body: [
      'We share data only with trusted sub-processors under binding data processing agreements. Key sub-processors include:',
      '• Hetzner Online GmbH (Germany) — primary infrastructure and database hosting.',
      '• Stripe Payments Europe Ltd (Ireland) — payment processing. Subject to PCI-DSS.',
      '• Postmark / Wildbit (USA) — transactional email delivery. EU Standard Contractual Clauses apply.',
      '• Sentry (USA) — error monitoring. Anonymized stack traces only; no personal data in payloads.',
      'Inference requests are forwarded to upstream model providers (Anthropic, OpenAI, Google). These providers receive the content of your prompts pursuant to their own terms and privacy policies. We strongly recommend reviewing each provider\'s data handling documentation.',
    ],
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    body: [
      'We retain personal data for the minimum period necessary for the stated purpose:',
      '• Account and usage data: retained for 90 days after account deletion, then purged.',
      '• Billing records: retained for 7 years (legal obligation under German commercial law).',
      '• API request logs (metadata only, no content): retained for 90 days, then anonymized.',
      '• Support communications: retained for 3 years.',
      'You may request early deletion of non-legally-required data by contacting dpo@axis.studio. We will respond within 30 days.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    body: [
      'We implement technical and organizational measures appropriate to the risk, including:',
      '• All data in transit encrypted with TLS 1.2+. Data at rest encrypted with AES-256.',
      '• API keys hashed with Argon2id. Full keys are never stored or logged.',
      '• Role-based access control for internal staff; least-privilege by default.',
      '• SOC 2 Type II certified since Q2 2024. Annual penetration testing by third-party auditors.',
      '• Automated scanning of public code repositories for leaked API keys, with immediate revocation.',
      'No system can guarantee absolute security. If you discover a vulnerability, please report it to security@axis.studio under our responsible disclosure program.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your Rights (GDPR)',
    body: [
      'If you are located in the EU/EEA, you have the following rights under GDPR:',
      '• Right of access (Art. 15): request a copy of personal data we hold about you.',
      '• Right to rectification (Art. 16): request correction of inaccurate data.',
      '• Right to erasure (Art. 17): request deletion of your data where no legal basis for retention exists.',
      '• Right to restriction (Art. 18): request that we limit processing under certain conditions.',
      '• Right to data portability (Art. 20): receive your data in a structured, machine-readable format.',
      '• Right to object (Art. 21): object to processing based on legitimate interests.',
      'To exercise any right, contact dpo@axis.studio. We will respond within 30 days. You also have the right to lodge a complaint with the Berlin Commissioner for Data Protection (BlnBDI).',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies & Tracking',
    body: [
      'We use only strictly necessary cookies for session management and CSRF protection. We do not use tracking cookies, advertising pixels, or third-party analytics scripts.',
      'The dashboard does not load any third-party JavaScript from advertising networks. All assets are self-hosted or served from our CDN under our domain.',
      'If this policy changes, we will update this page and notify you via the Notices page at least 14 days before any new cookies are activated.',
    ],
  },
  {
    id: 'international',
    heading: 'International Transfers',
    body: [
      'Where data is transferred outside the EU/EEA (e.g., to US-based sub-processors), we rely on EU Standard Contractual Clauses (SCCs) or equivalent safeguards as required by GDPR Chapter V.',
      'For transfers to Anthropic, OpenAI, and Google, we additionally recommend reviewing each provider\'s Data Processing Agreements, which you may need to execute separately for your own GDPR compliance as a data controller.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Material changes will be announced on the Notices page at least 14 days in advance. The updated policy will carry a new effective date at the top of this page.',
      'For minor changes (clarifications, corrections, formatting), we will update the "Last updated" date without a notice.',
    ],
  },
]

const SECTIONS_ZH: DocSection[] = [
  { id: 'overview', heading: '概述', body: ['AXIS Studio GmbH（"AXIS"、"我们"）运营 AXIS 平台，这是一项 AI 推理 API 服务。本隐私政策说明我们收集哪些个人数据、如何使用这些数据，以及您在适用法律（包括欧盟《通用数据保护条例》GDPR）下的权利。', '我们的注册地址为德国柏林 Rosenthaler Str. 40, 10178。数据保护官联系方式：dpo@axis.studio。', '使用本服务即表示您知晓本政策。如不同意，请停止使用并联系我们删除您的账户。'] },
  { id: 'data-collected', heading: '我们收集的数据', body: ['我们收集以下类别的个人数据：', '• 账户数据：电子邮件地址、姓名或昵称、支付方式（已令牌化；我们不存储完整卡号）及注册时间戳。', '• 使用数据：API 请求日志，包括时间戳、模型 ID、token 数量、请求 ID 和 HTTP 状态码。提示词及补全内容不在请求时长之外存储。', '• 计费数据：积分购买历史、充值金额、使用的促销码及退款记录。依法保留 7 年。', '• 技术数据：IP 地址、浏览器/客户端 User-Agent 及会话标识符。用于安全、欺诈预防和速率限制。', '• 通信内容：您发送给我们的电子邮件和客服消息。保留 3 年。'] },
  { id: 'data-use', heading: '数据使用方式', body: ['我们依据以下 GDPR 第 6 条规定的法律依据处理个人数据：', '• 履行合同：提供和运营您的账户、处理付款、交付推理结果。', '• 合法利益：检测欺诈、调查滥用、维护安全、提升服务可靠性。', '• 法律义务：遵守适用的财务、税务及执法要求。', '• 同意：用于可选通信，如产品通讯。您可随时撤回同意。', '我们不会出售、出租或为第三方营销目的共享您的个人数据。我们不会将您的推理输入或输出用于训练模型。'] },
  { id: 'data-sharing', heading: '数据共享与子处理方', body: ['我们仅在签订具有约束力的数据处理协议的前提下与受信任的子处理方共享数据。主要子处理方包括：', '• Hetzner Online GmbH（德国）— 主要基础设施和数据库托管。', '• Stripe Payments Europe Ltd（爱尔兰）— 支付处理，遵守 PCI-DSS 标准。', '• Postmark / Wildbit（美国）— 事务性邮件发送，适用欧盟标准合同条款。', '• Sentry（美国）— 错误监控，仅传输匿名化堆栈追踪，不含个人数据。', '推理请求将转发至上游模型提供商（Anthropic、OpenAI、Google）。这些提供商将依据各自条款和隐私政策接收您的提示词内容。强烈建议您查阅各提供商的数据处理文档。'] },
  { id: 'data-retention', heading: '数据保留', body: ['我们在实现既定目的所需的最短时间内保留个人数据：', '• 账户和使用数据：账户删除后保留 90 天，随后清除。', '• 计费记录：保留 7 年（德国商法法律义务）。', '• API 请求日志（仅元数据，不含内容）：保留 90 天后匿名化。', '• 客服通信：保留 3 年。', '您可通过联系 dpo@axis.studio 申请提前删除非法定必须保留的数据。我们将在 30 天内回复。'] },
  { id: 'security', heading: '安全措施', body: ['我们实施与风险相适应的技术和组织措施，包括：', '• 传输中数据通过 TLS 1.2+ 加密，静态数据通过 AES-256 加密。', '• API 密钥使用 Argon2id 哈希存储，完整密钥不会被存储或记录。', '• 内部员工基于角色的访问控制，默认最小权限原则。', '• 自 2024 年第二季度起通过 SOC 2 Type II 认证，每年由第三方机构进行渗透测试。', '• 自动扫描公开代码仓库中泄露的 API 密钥，发现后立即撤销。', '没有任何系统能保证绝对安全。如发现漏洞，请通过 security@axis.studio 在我们的负责任披露计划下进行报告。'] },
  { id: 'your-rights', heading: '您的权利（GDPR）', body: ['如果您位于欧盟/欧洲经济区，您享有 GDPR 规定的以下权利：', '• 访问权（第 15 条）：请求获取我们持有的您的个人数据副本。', '• 更正权（第 16 条）：请求更正不准确的数据。', '• 删除权（第 17 条）：在不存在保留法律依据时请求删除数据。', '• 限制权（第 18 条）：在特定条件下请求限制处理。', '• 可携带权（第 20 条）：以结构化、机器可读格式接收您的数据。', '• 反对权（第 21 条）：反对基于合法利益的数据处理。', '如需行使上述权利，请联系 dpo@axis.studio，我们将在 30 天内回复。您还有权向柏林数据保护专员（BlnBDI）提出投诉。'] },
  { id: 'cookies', heading: 'Cookie 与追踪', body: ['我们仅使用会话管理和 CSRF 防护所必需的 Cookie，不使用追踪 Cookie、广告像素或第三方分析脚本。', '控制台不加载来自广告网络的任何第三方 JavaScript。所有资源均自托管或通过我们域名下的 CDN 提供。', '如本政策发生变化，我们将更新本页面，并在任何新 Cookie 启用前至少 14 天通过公告页面通知您。'] },
  { id: 'international', heading: '国际数据传输', body: ['当数据传输至欧盟/欧洲经济区以外（例如传输至美国子处理方）时，我们依据 GDPR 第五章要求，采用欧盟标准合同条款（SCC）或同等保障措施。', '对于传输至 Anthropic、OpenAI 和 Google 的情况，我们建议您额外查阅各提供商的数据处理协议（DPA），作为数据控制方，您可能需要单独签署相关协议以满足自身的 GDPR 合规要求。'] },
  { id: 'changes', heading: '政策变更', body: ['我们可能会不时更新本隐私政策。重大变更将提前至少 14 天在公告页面公告。更新后的政策将在页面顶部注明新的生效日期。', '对于较小的变更（澄清、更正、格式调整），我们将更新"最后更新"日期，不另行发出通知。'] },
]

export default function Privacy() {
  const { t, i18n } = useTranslation()
  return (
    <DocPage
      category={t('privacy.category')}
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      effectiveDate={t('privacy.effective')}
      lastUpdated={t('privacy.updated')}
      sections={i18n.language === 'zh' ? SECTIONS_ZH : SECTIONS_EN}
    />
  )
}
