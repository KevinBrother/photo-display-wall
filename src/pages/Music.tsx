import { useTranslation } from "react-i18next"
import { useState, useRef, useEffect } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type GenStatus = 'idle' | 'queued' | 'generating' | 'done' | 'error'

interface MusicModel {
  id: string
  name: string
  credits: number
  desc: string
}

interface GeneratedMusic {
  id: string
  title: string
  prompt: string
  model: string
  instrumental: boolean
  duration: number
  bpm: number
  credits: number
  createdAt: string
  coverColor: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const MUSIC_MODELS: MusicModel[] = [
  { id: 'suno-v35',    name: 'Suno v3.5 Pro',     credits: 10, desc: 'Full-song vocal & rich orchestration' },
  { id: 'udio-v15',    name: 'Udio v1.5 Studio',  credits: 12, desc: 'High-fidelity acoustic & electronic' },
  { id: 'stable-audio',name: 'Stable Audio 2.0',  credits: 6,  desc: 'High quality sound design & stems' },
  { id: 'musiclm-hd',  name: 'MusicLM Pro',       credits: 8,  desc: 'Melodic generation from rich descriptions' },
]

const STYLE_PRESETS = [
  { id: 'p1', name: 'Lo-Fi Chill', prompt: 'Lo-fi hip hop beat with smooth dusty rhodes piano, vinyl crackle, mellow bassline', bpm: 82 },
  { id: 'p2', name: 'Synthwave', prompt: '80s retro synthwave, driving analog bassline, bright neon lead synths, gated reverb drums', bpm: 120 },
  { id: 'p3', name: 'Epic Cinema', prompt: 'Cinematic orchestral soundtrack, dramatic strings, triumphant brass, thunderous percussion', bpm: 110 },
  { id: 'p4', name: 'Acoustic Folk', prompt: 'Warm acoustic indie folk, fingerpicked Martin guitar, gentle cello, cozy fireside ambiance', bpm: 95 },
  { id: 'p5', name: 'Cyberpunk', prompt: 'Heavy industrial dark electro, distorted bass, glitchy percussions, dystopian cyberpunk atmosphere', bpm: 130 },
  { id: 'p6', name: 'Smooth Jazz', prompt: 'Late night cozy jazz quartet, warm walking bass, soft trumpet melody, brushed snare drum', bpm: 88 },
]

const COLOR_GRADIENTS = [
  'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
  'linear-gradient(135deg, #18181B 0%, #27272A 50%, #3F3F46 100%)',
  'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
  'linear-gradient(135deg, #701A75 0%, #86198F 50%, #A21CAF 100%)',
  'linear-gradient(135deg, #7C2D12 0%, #9A3412 50%, #C2410C 100%)',
]

const HISTORY_INIT: GeneratedMusic[] = [
  {
    id: 'm1',
    title: 'Neon Odyssey',
    prompt: '80s retro synthwave, driving analog bassline, bright neon lead synths, gated reverb drums',
    model: 'Suno v3.5 Pro',
    instrumental: true,
    duration: 184,
    bpm: 120,
    credits: 10,
    createdAt: '2026-08-07T09:41:00Z',
    coverColor: COLOR_GRADIENTS[0],
  },
  {
    id: 'm2',
    title: 'Midnight Reverie',
    prompt: 'Lo-fi hip hop beat with smooth dusty rhodes piano, vinyl crackle, mellow bassline',
    model: 'Udio v1.5 Studio',
    instrumental: true,
    duration: 142,
    bpm: 82,
    credits: 12,
    createdAt: '2026-08-07T09:15:00Z',
    coverColor: COLOR_GRADIENTS[1],
  },
  {
    id: 'm3',
    title: 'Sunrise Horizon',
    prompt: 'Warm acoustic indie folk, fingerpicked Martin guitar, gentle cello, cozy fireside ambiance',
    model: 'Stable Audio 2.0',
    instrumental: false,
    duration: 165,
    bpm: 95,
    credits: 6,
    createdAt: '2026-08-06T21:33:00Z',
    coverColor: COLOR_GRADIENTS[2],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function fmtDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
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
export default function Music() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [modelId, setModelId] = useState('suno-v35')
  const [instrumental, setInstrumental] = useState(true)
  const [bpm, setBpm] = useState(120)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [status, setStatus] = useState<GenStatus>('idle')
  const [history, setHistory] = useState<GeneratedMusic[]>(HISTORY_INIT)
  const [selectedTrack, setSelectedTrack] = useState<GeneratedMusic | null>(null)
  const [credits] = useState(2840)

  // Audio Playback simulation state
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const model = MUSIC_MODELS.find(m => m.id === modelId)!
  const canGenerate = prompt.trim().length > 0 && status === 'idle' && credits >= model.credits
  const displayed = selectedTrack ?? history[0] ?? null

  // Playback timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && displayed) {
      interval = setInterval(() => {
        setPlaybackTime(t => {
          if (t >= displayed.duration) {
            setIsPlaying(false)
            return 0
          }
          return t + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, displayed])

  // Reset playback when switching displayed track
  useEffect(() => {
    setPlaybackTime(0)
    setIsPlaying(false)
  }, [selectedTrack?.id])

  const handleGenerate = () => {
    if (!canGenerate) return
    setStatus('queued')
    setSelectedTrack(null)
    setIsPlaying(false)
    setPlaybackTime(0)

    setTimeout(() => setStatus('generating'), 1200)
    setTimeout(() => {
      const generatedTitle = title.trim() || (lang === 'zh' ? '无标题音乐' : 'Untitled Track')
      const newTrack: GeneratedMusic = {
        id: `m${Date.now()}`,
        title: generatedTitle,
        prompt: prompt.trim(),
        model: model.name,
        instrumental,
        duration: Math.floor(Math.random() * 80) + 120, // 120s - 200s
        bpm: bpm || 120,
        credits: model.credits,
        createdAt: new Date().toISOString(),
        coverColor: COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)],
      }
      setHistory(prev => [newTrack, ...prev])
      setSelectedTrack(newTrack)
      setStatus('done')
      setTimeout(() => {
        setStatus('idle')
        setIsPlaying(true)
      }, 800)
    }, 5200)
  }

  const handleApplyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setPrompt(preset.prompt)
    if (!title) {
      setTitle(preset.name)
    }
    setBpm(preset.bpm)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const togglePlay = () => {
    if (!displayed) return
    setIsPlaying(!isPlaying)
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', paddingTop: 68, display: 'grid', gridTemplateColumns: '340px 1fr 240px', height: '100vh', overflow: 'hidden' }}>

      {/* ── Left panel: controls ──────────────────────────────────────────── */}
      <div style={{ borderRight: `1px solid rgba(var(--border-rgb),0.1)`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '28px 24px', flex: 1 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {lang === 'zh' ? '生成音乐' : 'GENERATE MUSIC'}
          </p>

          {/* Prompt */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              {lang === 'zh' ? '提示词' : 'Prompt'}
            </label>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={lang === 'zh' ? "输入乐器、情绪、曲风、节奏描述..." : "Describe genre, instruments, tempo, mood..."}
              rows={4}
              style={{ width: '100%', padding: '12px', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.65, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.12)`, color: 'var(--fg)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Style Presets / Templates */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              {lang === 'zh' ? '音乐模板' : 'Style Presets'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {STYLE_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    padding: '8px 10px',
                    textAlign: 'left',
                    background: `rgba(var(--fg-rgb),0.02)`,
                    border: `1px solid rgba(var(--border-rgb),0.08)`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `rgba(var(--fg-rgb),0.25)`
                    e.currentTarget.style.background = `rgba(var(--fg-rgb),0.05)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `rgba(var(--border-rgb),0.08)`
                    e.currentTarget.style.background = `rgba(var(--fg-rgb),0.02)`
                  }}
                >
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: 'var(--fg)', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: `rgba(var(--fg-rgb),0.35)` }}>{p.bpm} BPM</div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              {lang === 'zh' ? '音频模型' : 'Music Model'}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MUSIC_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setModelId(m.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', background: modelId === m.id ? `rgba(var(--fg-rgb),0.07)` : 'transparent',
                    border: modelId === m.id ? `1px solid rgba(var(--fg-rgb),0.25)` : `1px solid rgba(var(--border-rgb),0.08)`,
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: modelId === m.id ? 500 : 400, color: modelId === m.id ? 'var(--fg)' : `rgba(var(--fg-rgb),0.6)` }}>{m.name}</div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, marginTop: 1 }}>{m.desc}</div>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: modelId === m.id ? '#2563EB' : `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.06em', flexShrink: 0, marginLeft: 8 }}>
                    {m.credits} cr
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instrumental Switch */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.08)` }}>
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--fg)', display: 'block' }}>
                  {lang === 'zh' ? '纯音乐模式' : 'Instrumental Only'}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.35)` }}>
                  {instrumental ? (lang === 'zh' ? '无人声伴奏' : 'No vocal lyrics') : (lang === 'zh' ? '含AI生成人声' : 'With AI vocals')}
                </span>
              </div>
              <button
                onClick={() => setInstrumental(!instrumental)}
                style={{
                  width: 36, height: 20, borderRadius: 10,
                  background: instrumental ? '#2563EB' : `rgba(var(--fg-rgb),0.15)`,
                  border: 'none', position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s', padding: 0,
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, left: instrumental ? 19 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', marginBottom: showAdvanced ? 16 : 0 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {lang === 'zh' ? '高级模式' : 'Advanced'}
            </span>
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.4, transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M1 1L4 4L7 1" stroke="var(--fg)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>

          {showAdvanced && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              {/* Title */}
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                  {lang === 'zh' ? '音乐标题' : 'Track Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={lang === 'zh' ? "自定义标题 (可选)" : "Optional custom title"}
                  style={{ width: '100%', padding: '8px 12px', fontFamily: "'Outfit', sans-serif", fontSize: 13, background: `rgba(var(--fg-rgb),0.03)`, border: `1px solid rgba(var(--border-rgb),0.1)`, color: 'var(--fg)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* BPM */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {lang === 'zh' ? '速度 (BPM)' : 'Tempo (BPM)'}
                  </label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.5)` }}>{bpm}</span>
                </div>
                <input type="range" min={60} max={180} value={bpm} onChange={e => setBpm(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--fg)' }} />
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
            {status === 'queued' ? (lang === 'zh' ? '排队中…' : 'Queued…') : status === 'generating' ? (lang === 'zh' ? '生成中…' : 'Generating…') : (lang === 'zh' ? `生成音乐 · ${model.credits} 积分` : `Generate Music · ${model.credits} cr`)}
            <ProgressBar status={status} />
          </button>
        </div>
      </div>

      {/* ── Center: audio player stage ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: `rgba(var(--fg-rgb),0.02)`, overflowY: 'auto' }}>
        {status !== 'idle' && status !== 'done' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 560 }}>
            <div style={{ width: '100%', aspectRatio: '16 / 10', background: `rgba(var(--fg-rgb),0.04)`, border: `1px solid rgba(var(--border-rgb),0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Shimmer */}
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent 0%, rgba(var(--fg-rgb),0.06) 50%, transparent 100%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                {/* Visualizer wave animation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 32 }}>
                  {[12, 24, 16, 28, 14, 22, 30, 18, 26, 12].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        height: h,
                        background: '#2563EB',
                        animation: `wave 1s ease-in-out infinite alternate ${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                  {status === 'queued' ? (lang === 'zh' ? '等待任务队列…' : 'In queue…') : (lang === 'zh' ? 'AI 正在编曲合成…' : 'Synthesizing audio stems…')}
                </p>
              </div>
            </div>
          </div>
        ) : displayed ? (
          <div style={{ maxWidth: 600, width: '100%' }}>
            
            {/* Audio Stage Visualizer Card */}
            <div style={{
              width: '100%', aspectRatio: '16 / 9', background: displayed.coverColor,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '24px 28px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
              marginBottom: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
            }}>
              
              {/* Subtle background vinyl groove ring */}
              <div style={{
                position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none'
              }} />

              {/* Top Tag & Model */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {displayed.model}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 8px', borderRadius: 3, letterSpacing: '0.08em' }}>
                  {displayed.instrumental ? (lang === 'zh' ? '纯音乐' : 'INSTRUMENTAL') : (lang === 'zh' ? '带人声' : 'VOCAL')}
                </span>
              </div>

              {/* Middle Play/Spectrum */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
                <button
                  onClick={togglePlay}
                  style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#fff', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)', flexShrink: 0, transition: 'transform 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Animated Spectrum Waveform */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, height: 48 }}>
                  {[16, 28, 20, 38, 44, 26, 18, 34, 48, 30, 22, 40, 36, 14, 28, 42, 32, 20, 36, 46, 24, 16, 32, 22, 14].map((h, i) => {
                    const active = (i / 25) <= (playbackTime / displayed.duration)
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: isPlaying ? Math.max(8, Math.min(48, h + (Math.sin(playbackTime * 4 + i) * 12))) : h,
                          background: active ? '#fff' : 'rgba(255,255,255,0.3)',
                          borderRadius: 1.5,
                          transition: isPlaying ? 'height 0.15s ease' : 'background 0.2s',
                        }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Bottom Scrubber & Time */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {displayed.title}
                  </h3>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
                    {fmtDuration(playbackTime)} / {fmtDuration(displayed.duration)}
                  </div>
                </div>
                
                {/* Progress Bar Track */}
                <div
                  onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const newPct = Math.max(0, Math.min(1, clickX / rect.width))
                    setPlaybackTime(Math.floor(newPct * displayed.duration))
                  }}
                  style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}
                >
                  <div style={{ width: `${(playbackTime / displayed.duration) * 100}%`, height: '100%', background: '#fff', borderRadius: 2 }} />
                </div>
              </div>

            </div>

            {/* Prompt description */}
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 300, color: `rgba(var(--fg-rgb),0.55)`, margin: '0 0 14px', lineHeight: 1.6 }}>
              {displayed.prompt}
            </p>

            {/* Metadata badges matching Generate.tsx */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                [lang === 'zh' ? '模型' : 'Model', displayed.model],
                [lang === 'zh' ? '速度' : 'BPM', `${displayed.bpm} BPM`],
                [lang === 'zh' ? '时长' : 'Duration', fmtDuration(displayed.duration)],
                [lang === 'zh' ? '消耗' : 'Cost', lang === 'zh' ? `${displayed.credits} 积分` : `${displayed.credits} cr`]
              ].map(([k, v]) => (
                <span key={k as string} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.4)`, letterSpacing: '0.08em' }}>
                  <span style={{ color: `rgba(var(--fg-rgb),0.2)` }}>{k} · </span>{v}
                </span>
              ))}
            </div>

          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 300, color: `rgba(var(--fg-rgb),0.25)`, margin: 0 }}>
              {lang === 'zh' ? '输入提示词或选择模板并点击生成' : 'Enter a prompt or select a preset to generate'}
            </p>
          </div>
        )}
      </div>

      {/* ── Right panel: history ──────────────────────────────────────────── */}
      <div style={{ borderLeft: `1px solid rgba(var(--border-rgb),0.1)`, overflowY: 'auto' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: `1px solid rgba(var(--border-rgb),0.07)` }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.3)`, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
            {lang === 'zh' ? '历史记录' : 'History'}
          </p>
        </div>

        <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map(item => {
            const isSelected = (selectedTrack?.id ?? history[0]?.id) === item.id
            return (
              <div
                key={item.id}
                onClick={() => setSelectedTrack(item)}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? `1.5px solid rgba(var(--fg-rgb),0.5)` : `1px solid rgba(var(--border-rgb),0.1)`,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                  background: 'var(--surface)',
                }}
              >
                {/* Mini cover header */}
                <div style={{ height: 48, background: item.coverColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#000" style={{ marginLeft: 1 }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#fff', letterSpacing: '0.06em' }}>
                      {fmtDuration(item.duration)}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                    {item.instrumental ? 'Inst' : 'Vocal'}
                  </span>
                </div>

                {/* Track details */}
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: 'var(--fg)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 300, color: `rgba(var(--fg-rgb),0.45)`, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                    {item.prompt}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: `rgba(var(--fg-rgb),0.25)`, letterSpacing: '0.06em' }}>
                      {fmtTime(item.createdAt)}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#2563EB', letterSpacing: '0.06em' }}>
                      {item.credits} cr
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        @keyframes wave {
          0%   { transform: scaleY(0.4) }
          100% { transform: scaleY(1.4) }
        }
      `}</style>
    </div>
  )
}
