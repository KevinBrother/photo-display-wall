import { useTranslation } from "react-i18next"
import { useState, useRef, useEffect } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2'
type GenStatus = 'idle' | 'queued' | 'generating' | 'done' | 'error'

interface GeneratedImage {
  id: string
  prompt: string
  model: string
  aspectRatio: AspectRatio
  seed: number
  credits: number
  url: string
  createdAt: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const MODELS = [
  { id: 'flux-pro',     name: 'FLUX Pro 1.1',        credits: 12 },
  { id: 'flux-schnell', name: 'FLUX Schnell',         credits: 3  },
  { id: 'sdxl-turbo',  name: 'SDXL Turbo',           credits: 4  },
  { id: 'sd3-medium',  name: 'Stable Diffusion 3',   credits: 8  },
  { id: 'ideogram-v2', name: 'Ideogram 2.0',          credits: 10 },
]

const RATIOS: { ratio: AspectRatio; w: number; h: number }[] = [
  { ratio: '1:1',  w: 1, h: 1 },
  { ratio: '16:9', w: 16, h: 9 },
  { ratio: '9:16', w: 9, h: 16 },
  { ratio: '4:3',  w: 4, h: 3 },
  { ratio: '3:4',  w: 3, h: 4 },
  { ratio: '3:2',  w: 3, h: 2 },
]

// Mock Unsplash images for "generated" results
const MOCK_URLS = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1024&h=1024&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1686161999460-0bf72e5a27c8?w=1024&h=768&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1687360442808-76f5a4f1a7e3?w=768&h=1024&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1680868543815-b8825568c5ea?w=1024&h=1024&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1673255745677-4d59e399d06a?w=1024&h=576&fit=crop&auto=format',
]

const HISTORY_INIT: GeneratedImage[] = [
  { id: 'h1', prompt: 'A solitary lighthouse at dusk, dramatic storm clouds, long exposure photography',       model: 'FLUX Pro 1.1',      aspectRatio: '16:9', seed: 4829201, credits: 12, url: MOCK_URLS[1], createdAt: '2026-08-07T09:41:00Z' },
  { id: 'h2', prompt: 'Minimalist product shot of ceramic coffee mug on marble surface, soft window light',  model: 'SDXL Turbo',        aspectRatio: '1:1',  seed: 7741003, credits: 4,  url: MOCK_URLS[0], createdAt: '2026-08-07T09:15:00Z' },
  { id: 'h3', prompt: 'Portrait of elderly woman, film grain, golden hour, street photography style',         model: 'Stable Diffusion 3',aspectRatio: '3:4',  seed: 1192847, credits: 8,  url: MOCK_URLS[2], createdAt: '2026-08-06T21:33:00Z' },
  { id: 'h4', prompt: 'Cyberpunk cityscape, neon reflections, rain-slicked streets, cinematic composition',  model: 'FLUX Schnell',      aspectRatio: '16:9', seed: 3302918, credits: 3,  url: MOCK_URLS[4], createdAt: '2026-08-06T18:09:00Z' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function aspectStyle(ratio: AspectRatio): { width: string; aspectRatio: string } {
  const r = RATIOS.find(r => r.ratio === ratio)!
  return { width: '100%', aspectRatio: `${r.w} / ${r.h}` }
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// ── Progress bar ───────────────────────────────────────────────────────────────
function ProgressBar({ status }: { status: GenStatus }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    if (status === 'idle' || status === 'error') { setPct(0); return }
    if (status === 'done') { setPct(100); return }
    const interval = setInterval(() => {
      setPct(prev => {
        if (status === 'queued') return Math.min(prev + 2, 15)
        if (status === 'generating') return Math.min(prev + 1.8, 92)
        return prev
      })
    }, 80)
    return () => clearInterval(interval)
  }, [status])

  if (status === 'idle') return null
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `rgba(var(--border-rgb),0.1)` }}>
      <div style={{ height: '100%', width: `${pct}%`, background: status === 'error' ? '#DC2626' : status === 'done' ? '#16A34A' : '#2563EB', transition: 'width 0.12s linear, background 0.3s ease' }} />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Generate() {
  const { i18n } = useTranslation()
  const [prompt, setPrompt] = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [modelId, setModelId] = useState('flux-pro')
  const [ratio, setRatio] = useState<AspectRatio>('1:1')
  const [steps, setSteps] = useState(30)
  const [guidance, setGuidance] = useState(7.5)
  const [seed, setSeed] = useState('')
  const [status, setStatus] = useState<GenStatus>('idle')
  const [history, setHistory] = useState<GeneratedImage[]>(HISTORY_INIT)
  const [selectedHist, setSelectedHist] = useState<GeneratedImage | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [credits] = useState(2840)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const model = MODELS.find(m => m.id === modelId)!
  const canGenerate = prompt.trim().length > 0 && status === 'idle' && credits >= model.credits

  const handleGenerate = () => {
    if (!canGenerate) return
    setStatus('queued')
    setSelectedHist(null)
    setTimeout(() => setStatus('generating'), 1200)
    setTimeout(() => {
      const newImg: GeneratedImage = {
        id: `g${Date.now()}`,
        prompt: prompt.trim(),
        model: model.name,
        aspectRatio: ratio,
        seed: seed ? parseInt(seed) : Math.floor(Math.random() * 9999999),
        credits: model.credits,
        url: MOCK_URLS[Math.floor(Math.random() * MOCK_URLS.length)],
        createdAt: new Date().toISOString(),
      }
      setHistory(prev => [newImg, ...prev])
      setSelectedHist(newImg)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 800)
    }, 5200)
  }

  const displayed = selectedHist ?? history[0] ?? null

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68, display: 'grid', gridTemplateColumns: '340px 1fr 220px', height: '100vh', overflow: 'hidden' }}>

      {/* ── Left panel: controls ──────────────────────────────────────────── */}
      <div style={{ borderRight: `1px solid rgba(var(--border-rgb),0.1)`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px', flex: 1 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 20px' }}>{i18n.language === 'zh' ? '生成' : 'Generate'}</p>

          {/* Prompt */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{i18n.language === 'zh' ? '提示词' : 'Prompt'}</label>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={5}
              style={{ width: '100%', padding: '12px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.65, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.12)`, color: 'var(--fg)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Model */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{i18n.language === 'zh' ? '模型' : 'Model'}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setModelId(m.id)} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', background: modelId === m.id ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                  border: modelId === m.id ? `1px solid rgba(var(--fg-rgb),0.25)` : `1px solid rgba(var(--border-rgb),0.08)`,
                  cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: modelId === m.id ? 500 : 400, color: modelId === m.id ? 'var(--fg)' : `rgba(var(--fg-rgb),0.5)` }}>{m.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: modelId === m.id ? '#2563EB' : `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.06em' }}>{m.credits} cr</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{i18n.language === 'zh' ? '比例' : 'Aspect ratio'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {RATIOS.map(r => (
                <button key={r.ratio} onClick={() => setRatio(r.ratio)} style={{
                  padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  background: ratio === r.ratio ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                  border: ratio === r.ratio ? `1px solid rgba(var(--fg-rgb),0.25)` : `1px solid rgba(var(--border-rgb),0.08)`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {/* Mini aspect preview */}
                  <div style={{ width: Math.round(24 * Math.min(r.w / r.h, 1.5)), height: Math.round(24 * Math.min(r.h / r.w, 1.5)), background: ratio === r.ratio ? `rgba(var(--fg-rgb),0.4)` : `rgba(var(--fg-rgb),0.12)`, transition: 'background 0.15s' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ratio === r.ratio ? 'var(--fg)' : `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.06em' }}>{r.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: showAdvanced ? 16 : 0 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '高级' : 'Advanced'}</span>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.4, transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M1 1L4 4L7 1" stroke="var(--fg)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {showAdvanced && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              {/* Negative prompt */}
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Negative prompt</label>
                <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)} rows={2} placeholder={i18n.language === 'zh' ? '反向提示词...' : 'What to avoid...'} style={{ width: '100%', padding: '10px 12px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.1)`, color: 'var(--fg)', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {/* Steps */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '步数' : 'Steps'}</label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>{steps}</span>
                </div>
                <input type="range" min={1} max={100} value={steps} onChange={e => setSteps(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--fg)' }} />
              </div>
              {/* Guidance */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{i18n.language === 'zh' ? '引导系数' : 'Guidance'}</label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>{guidance.toFixed(1)}</span>
                </div>
                <input type="range" min={1} max={20} step={0.5} value={guidance} onChange={e => setGuidance(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--fg)' }} />
              </div>
              {/* Seed */}
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>{i18n.language === 'zh' ? '种子' : 'Seed'}</label>
                <input type="number" value={seed} onChange={e => setSeed(e.target.value)} placeholder={i18n.language === 'zh' ? '随机' : 'Random'} style={{ width: '100%', padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.1)`, color: 'var(--fg)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}
        </div>

        {/* Generate button (sticky bottom) */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid rgba(var(--border-rgb),0.08)`, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.1em' }}>Balance</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#2563EB', letterSpacing: '0.06em' }}>{credits.toLocaleString()} cr</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              width: '100%', padding: '14px', background: canGenerate ? 'var(--fg)' : `rgba(var(--fg-rgb),0.1)`,
              border: 'none', color: canGenerate ? 'var(--bg)' : `rgba(var(--fg-rgb),0.3)`,
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700,
              cursor: canGenerate ? 'pointer' : 'default',
              transition: 'all 0.2s', letterSpacing: '-0.01em', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { if (canGenerate) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {status === 'queued' ? (i18n.language === 'zh' ? '排队中…' : 'Queued…') : status === 'generating' ? (i18n.language === 'zh' ? '生成中…' : 'Generating…') : (i18n.language === 'zh' ? `生成 · ${model.credits} 积分` : `Generate · ${model.credits} cr`)}
            <ProgressBar status={status} />
          </button>
        </div>
      </div>

      {/* ── Center: image preview ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: `rgba(var(--fg-rgb),0.02)`, overflowY: 'auto' }}>
        {status !== 'idle' && status !== 'done' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ ...aspectStyle(ratio), maxWidth: 560, background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Shimmer */}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent 0%, rgba(var(--fg-rgb),0.06) 50%, transparent 100%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  {status === 'queued' ? 'In queue…' : 'Generating…'}
                </p>
              </div>
            </div>
          </div>
        ) : displayed ? (
          <div style={{ maxWidth: 640, width: '100%' }}>
            <div style={{ ...aspectStyle(displayed.aspectRatio), overflow: 'hidden', background: `rgba(var(--fg-rgb),0.04)`, marginBottom: 16 }}>
              <img src={displayed.url} alt={displayed.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, color: `rgba(var(--fg-rgb),0.45)`, margin: '0 0 10px', lineHeight: 1.6 }}>{displayed.prompt}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[[i18n.language === 'zh' ? '模型' : 'Model', displayed.model], [i18n.language === 'zh' ? '比例' : 'Ratio', displayed.aspectRatio], [i18n.language === 'zh' ? '种子' : 'Seed', displayed.seed], [i18n.language === 'zh' ? '消耗' : 'Cost', i18n.language === 'zh' ? `${displayed.credits} 积分` : `${displayed.credits} cr`]].map(([k, v]) => (
                <span key={k as string} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.08em' }}>
                  <span style={{ color: `rgba(var(--fg-rgb),0.18)` }}>{k} · </span>{v}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 300, color: `rgba(var(--fg-rgb),0.25)`, margin: 0 }}>{i18n.language === 'zh' ? '输入提示词并点击生成' : 'Enter a prompt and click Generate'}</p>
          </div>
        )}
      </div>

      {/* ── Right panel: history ──────────────────────────────────────────── */}
      <div style={{ borderLeft: `1px solid rgba(var(--border-rgb),0.1)`, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>History</p>
        </div>
        <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map(img => (
            <div key={img.id} onClick={() => setSelectedHist(img)} style={{
              cursor: 'pointer',
              border: (selectedHist?.id ?? history[0]?.id) === img.id ? `1.5px solid rgba(var(--fg-rgb),0.5)` : `1px solid rgba(var(--border-rgb),0.1)`,
              overflow: 'hidden', transition: 'border-color 0.15s',
            }}>
              <div style={{ ...aspectStyle(img.aspectRatio), background: `rgba(var(--fg-rgb),0.04)` }}>
                <img src={img.url} alt={img.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--surface)' }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 400, color: `rgba(var(--fg-rgb),0.5)`, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>{img.prompt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.06em' }}>{fmtTime(img.createdAt)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#2563EB', letterSpacing: '0.06em' }}>{img.credits} cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
      `}</style>
    </div>
  )
}
