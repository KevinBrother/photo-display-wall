import DocPage from '../components/DocPage'
import type { DocSection } from '../components/DocPage'
import { useTranslation } from 'react-i18next'

const SECTIONS_EN: DocSection[] = [
  {
    id: 'acceptance',
    heading: 'Acceptance of Terms',
    body: [
      'By creating an account, purchasing credits, or accessing the AXIS platform API ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.',
      'These Terms apply to all users including individual developers, teams, and organizations. If you accept on behalf of an organization, you represent that you have authority to bind that organization.',
      'We reserve the right to update these Terms at any time. Changes take effect upon posting with an updated effective date. Continued use of the Service after changes constitutes acceptance.',
    ],
  },
  {
    id: 'account',
    heading: 'Account Registration & Security',
    body: [
      'You must provide accurate registration information and keep it current. Accounts are for individual or organizational use only — resale of account access is prohibited.',
      'You are responsible for maintaining the security of your account credentials and API keys. Suspected unauthorized access must be reported to us immediately.',
      'We may suspend accounts that show signs of compromise, unusual usage patterns, or suspected abuse, and will notify you as soon as practicable.',
      '• API keys grant access equivalent to your account. Treat them as passwords.',
      '• Keys detected in public repositories are automatically revoked for your protection.',
      '• You may create, scope, and delete keys at any time from the Keys page.',
    ],
  },
  {
    id: 'credits-billing',
    heading: 'Credits & Billing',
    body: [
      'Access to inference endpoints is billed in platform credits. Credits are purchased in advance and deducted in real time per request. 100 credits = $1 USD at the standard exchange rate.',
      'Credits are non-refundable except where required by applicable law or as explicitly stated in a promotional offer. Unused credits do not expire.',
      'Promotional credits (bonus credits issued with top-ups, referral credits, or time-limited offers) expire as stated at the time of issuance. Standard purchased credits are consumed last.',
      '• All credit deductions are logged with timestamp, model, token count, and request ID.',
      '• You may dispute a charge within 30 days by contacting dev@axis.studio with your request ID.',
      '• We reserve the right to adjust pricing with 14 days notice published via the Notices page.',
    ],
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable Use',
    body: [
      'You agree not to use the Service for any unlawful purpose or in a manner that violates the acceptable use policies of underlying model providers (Anthropic, OpenAI, Google DeepMind).',
      'Prohibited uses include but are not limited to:',
      '• Generating content that constitutes child sexual abuse material (CSAM).',
      '• Creating disinformation, synthetic media intended to deceive, or impersonation content without consent.',
      '• Circumventing safety filters, jailbreaking models, or probing for security vulnerabilities not covered by a responsible disclosure agreement.',
      '• Automated scraping, credential stuffing, or denial-of-service attacks against AXIS or third-party systems.',
      '• Reselling API access without written authorization from AXIS.',
      'Violation may result in immediate account suspension without refund and referral to law enforcement where appropriate.',
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual Property',
    body: [
      'You retain ownership of inputs you submit to the Service and outputs generated therefrom, subject to the terms of the underlying model providers.',
      'AXIS retains all rights to the platform, API, branding, documentation, and infrastructure. No license to these materials is granted beyond what is necessary to use the Service.',
      'You grant AXIS a limited, non-exclusive license to process your inputs solely to deliver the Service. We do not use your inputs to train models or for any purpose other than providing inference.',
    ],
  },
  {
    id: 'uptime-sla',
    heading: 'Uptime & Service Level',
    body: [
      'We target 99.5% monthly uptime for the inference API, measured excluding scheduled maintenance windows announced at least 24 hours in advance.',
      'In the event of degradation or outage, we will publish status updates on the Notices page. Credit refunds for downtime affecting your requests are issued automatically within 24 hours for verified failed requests.',
      'We do not guarantee specific inference latency, model output quality, or availability of specific model versions. Models may be deprecated with 60 days notice.',
    ],
  },
  {
    id: 'limitation-liability',
    heading: 'Limitation of Liability',
    body: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, AXIS IS NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.',
      'Our total aggregate liability for direct damages shall not exceed the amount you paid for the Service in the 90 days preceding the claim.',
      'Some jurisdictions do not allow these limitations; in those cases, liability is limited to the fullest extent permitted by applicable law.',
    ],
  },
  {
    id: 'termination',
    heading: 'Termination',
    body: [
      'You may terminate your account at any time. Remaining purchased credits may be requested for refund within 30 days of termination if the balance exceeds $10 USD equivalent.',
      'We may suspend or terminate accounts for violations of these Terms, suspected fraud, or non-payment, with or without prior notice depending on severity.',
      'Upon termination, your API keys are revoked and access to the Service ceases. Logs and usage data are retained for 90 days per our data retention policy.',
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing Law & Disputes',
    body: [
      'These Terms are governed by the laws of the Federal Republic of Germany, without regard to conflict-of-law principles. Disputes shall first be addressed through good-faith negotiation.',
      'If negotiation fails, disputes shall be submitted to binding arbitration in Berlin under the rules of the German Institution of Arbitration (DIS), conducted in English.',
      'Notwithstanding the above, either party may seek injunctive or equitable relief in a court of competent jurisdiction to prevent irreparable harm.',
    ],
  },
]

const SECTIONS_ZH: DocSection[] = [
  { id: 'acceptance', heading: '条款接受', body: ['通过创建账户、购买积分或访问 AXIS 平台 API（"本服务"），您同意受本用户协议（"协议"）约束。如不同意，请勿使用本服务。', '本协议适用于所有用户，包括个人开发者、团队及组织。如您代表组织接受协议，代表您具有约束该组织的权限。', '我们保留随时更新本协议的权利。变更于发布时生效并附带新生效日期。继续使用本服务即视为接受变更。'] },
  { id: 'account', heading: '账户注册与安全', body: ['您须提供准确的注册信息并保持最新。账户仅供个人或组织使用，禁止转售账户访问权限。', '您负责维护账户凭证和 API 密钥的安全性。如怀疑存在未授权访问，须立即向我们报告。', '我们可能暂停显示出被入侵迹象、异常使用模式或疑似滥用的账户，并将尽快通知您。', '• API 密钥的访问权限等同于您的账户，请像密码一样妥善保管。', '• 检测到密钥暴露在公开仓库时，将自动撤销以保护您的账户安全。', '• 您可随时在密钥页面创建、设置权限范围和删除密钥。'] },
  { id: 'credits-billing', heading: '积分与计费', body: ['推理接口的访问按平台积分计费，积分须预先购买，并随请求实时扣除。标准汇率下 100 积分 = 1 美元。', '积分不可退款，法律另有规定或促销活动明确说明的除外。未使用的积分不过期。', '促销积分（充值赠送积分、推荐积分或限时优惠积分）按发放时说明的时间到期，标准购买积分最后扣除。', '• 所有积分扣除记录包含时间戳、模型、token 数量和请求 ID。', '• 您可在扣款 30 天内通过 dev@axis.studio 提供请求 ID 申请异议。', '• 我们保留提前 14 天通过公告页面发布通知后调整价格的权利。'] },
  { id: 'acceptable-use', heading: '合规使用', body: ['您同意不将本服务用于任何违法目的，或违反底层模型提供商（Anthropic、OpenAI、Google DeepMind）可接受使用政策的方式。', '禁止使用包括但不限于：', '• 生成儿童性虐待材料（CSAM）。', '• 创作虚假信息、意图欺骗的合成媒体或未经本人同意的冒充内容。', '• 绕过安全过滤器、破解模型限制或在未签订负责任披露协议的情况下探测安全漏洞。', '• 对 AXIS 或第三方系统实施自动爬取、凭证填充或拒绝服务攻击。', '• 未经 AXIS 书面授权转售 API 访问权限。', '违规可能导致账户立即封禁且不予退款，情节严重者将移交执法机构。'] },
  { id: 'intellectual-property', heading: '知识产权', body: ['您保留提交至本服务的输入内容及其生成输出的所有权，但须遵守底层模型提供商的条款。', 'AXIS 保留平台、API、品牌、文档及基础设施的所有权利，除使用本服务所必需的范围外，不授予任何许可。', '您授予 AXIS 有限的非独家许可，仅用于处理您的输入以提供本服务。我们不会将您的输入用于训练模型或任何其他目的。'] },
  { id: 'uptime-sla', heading: '可用性与服务水平', body: ['我们的目标是推理 API 每月可用性达到 99.5%，计算时排除提前 24 小时公告的计划维护窗口。', '发生降级或中断时，我们将在公告页面发布状态更新。经核实的失败请求的积分退还将在 24 小时内自动完成。', '我们不对特定推理延迟、模型输出质量或特定模型版本的可用性作出保证。模型弃用将提前 60 天通知。'] },
  { id: 'limitation-liability', heading: '责任限制', body: ['在法律允许的最大范围内，AXIS 对因使用本服务产生的任何间接、附带、特殊、后果性或惩罚性损害不承担责任。', '我们对直接损害的总赔偿责任不超过索赔前 90 天内您为本服务支付的金额。', '部分司法管辖区不允许上述限制；在此情况下，责任限于适用法律允许的最大范围。'] },
  { id: 'termination', heading: '终止', body: ['您可随时注销账户。如余额超过等值 10 美元，可在终止后 30 天内申请退还已购买的积分。', '我们可因违反本协议、涉嫌欺诈或未付款，不经事先通知（严重情况）或经通知暂停或终止账户。', '账户终止后，您的 API 密钥将被撤销，服务访问权限将即时停止。日志和使用数据根据我们的数据保留政策保留 90 天。'] },
  { id: 'governing-law', heading: '适用法律与争议解决', body: ['本协议受德意志联邦共和国法律管辖，不考虑法律冲突原则。争议应首先通过善意协商解决。', '协商不成时，争议须提交柏林仲裁，依据德国仲裁机构（DIS）规则，以英语进行。', '尽管有上述规定，任何一方均可向有管辖权的法院申请禁令或衡平救济，以防止不可弥补的损害。'] },
]

export default function Terms() {
  const { t, i18n } = useTranslation()
  return (
    <DocPage
      category={t('terms.category')}
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      effectiveDate={t('terms.effective')}
      lastUpdated={t('terms.updated')}
      sections={i18n.language === 'zh' ? SECTIONS_ZH : SECTIONS_EN}
    />
  )
}
