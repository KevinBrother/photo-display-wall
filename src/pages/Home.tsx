import { useState, useEffect, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

interface Photo {
  id: string; url: string; alt: string; author: string
  w: number; h: number; rot: number; x: number; y: number; scale: number; zIndex: number
}

const RAW_PHOTOS = [
  { id: 'umbrella', url: 'https://images.unsplash.com/photo-1488034976201-ffbaa99cbf5c?w=600&h=800&fit=crop&auto=format', alt: 'Man with umbrella crossing street', author: 'Matthew Henry', w: 280, h: 380 },
  { id: 'woman-walk', url: 'https://images.unsplash.com/photo-1429292394373-ddbcc6bb7468?w=500&h=700&fit=crop&auto=format', alt: 'Woman walking on road', author: 'Molly Porter', w: 240, h: 340 },
  { id: 'cars', url: 'https://images.unsplash.com/photo-1589055396081-cff6a3b5b27f?w=700&h=460&fit=crop&auto=format', alt: 'Cars on road daytime', author: 'Jonathan Formento', w: 380, h: 260 },
  { id: 'bike', url: 'https://images.unsplash.com/photo-1570587726545-494e2bcc2f9f?w=600&h=420&fit=crop&auto=format', alt: 'Man riding bike', author: 'Kin Li', w: 340, h: 240 },
  { id: 'portrait-1', url: 'https://images.unsplash.com/photo-1606143412458-acc5f86de897?w=460&h=640&fit=crop&auto=format', alt: 'Woman editorial', author: 'ali nejatian', w: 220, h: 310 },
  { id: 'portrait-2', url: 'https://images.unsplash.com/photo-1563170446-9c3c0622d8a9?w=460&h=640&fit=crop&auto=format', alt: 'Woman with blue eyes', author: 'Olena Bohovyk', w: 240, h: 330 },
  { id: 'portrait-3', url: 'https://images.unsplash.com/photo-1536180838057-b604200e6f36?w=460&h=640&fit=crop&auto=format', alt: 'Grayscale portrait', author: 'Aiony Haust', w: 200, h: 290 },
  { id: 'red-dress', url: 'https://images.unsplash.com/photo-1662532577856-e8ee8b138a8b?w=600&h=420&fit=crop&auto=format', alt: 'Person in red dress', author: 'Marjan Taghipour', w: 360, h: 260 },
  { id: 'buildings', url: 'https://images.unsplash.com/photo-1552570173-43e2d76c37f4?w=500&h=700&fit=crop&auto=format', alt: 'Buildings in city', author: 'Josh Hild', w: 230, h: 330 },
  { id: 'forest', url: 'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?w=700&h=460&fit=crop&auto=format', alt: 'River between trees', author: 'Karsten Würth', w: 380, h: 250 },
  { id: 'coat', url: 'https://images.unsplash.com/photo-1727341557146-4abab94d0812?w=460&h=640&fit=crop&auto=format', alt: 'Woman with black coat', author: 'Branislav Rodman', w: 210, h: 300 },
  { id: 'arch', url: 'https://images.unsplash.com/photo-1512920115544-d149d1dedcb7?w=500&h=700&fit=crop&auto=format', alt: 'Architectural photography', author: 'Pelle Martin', w: 220, h: 330 },
]

const LAYOUT = [
  { rot: -8, x: 2, y: 5, scale: 1.05, z: 3 },
  { rot: 5, x: 22, y: 40, scale: 0.92, z: 2 },
  { rot: -3, x: 45, y: 8, scale: 1.10, z: 4 },
  { rot: 12, x: 60, y: 44, scale: 0.88, z: 1 },
  { rot: -14, x: 15, y: 63, scale: 0.95, z: 5 },
  { rot: 7, x: 35, y: 73, scale: 1.02, z: 3 },
  { rot: -6, x: 68, y: 18, scale: 0.90, z: 2 },
  { rot: 16, x: 78, y: 58, scale: 1.08, z: 6 },
  { rot: -11, x: 52, y: 56, scale: 0.96, z: 4 },
  { rot: 4, x: 5, y: 83, scale: 1.00, z: 2 },
  { rot: -9, x: 82, y: 80, scale: 0.94, z: 3 },
  { rot: 13, x: 42, y: 29, scale: 0.85, z: 1 },
]

const PHOTOS: Photo[] = RAW_PHOTOS.map((p, i) => ({ ...p, ...LAYOUT[i], zIndex: LAYOUT[i].z }))

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { t } = useTranslation()

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  const px = (mousePos.x / window.innerWidth - 0.5) * 18
  const py = (mousePos.y / window.innerHeight - 0.5) * 12

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, var(--glow-a) 0%, transparent 70%)`, left: '10%', top: '20%', pointerEvents: 'none', zIndex: 0, transform: `translate(${px * 0.5}px, ${py * 0.5}px)`, transition: 'transform 0.6s ease' }} />
      <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, var(--glow-b) 0%, transparent 70%)`, right: '5%', bottom: '15%', pointerEvents: 'none', zIndex: 0, transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)`, transition: 'transform 0.6s ease' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: 'fixed', top: 68, left: 0, right: 0, zIndex: 10, padding: '28px 48px', pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.03em', color: 'var(--fg)', margin: 0, textTransform: 'uppercase' }}>
            WALL
          </h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: `rgba(var(--fg-rgb),0.35)`, letterSpacing: '0.2em', margin: '10px 0 0', textTransform: 'uppercase' }}>
            {PHOTOS.length} {t('home.frames')} · {new Date().getFullYear()}
          </p>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: `rgba(var(--fg-rgb),0.2)`, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0, lineHeight: 1.8, textAlign: 'right' }}>
          {t('home.hover')}<br />{t('home.scroll')}
        </p>
      </div>

      {/* Scrollable canvas */}
      <div style={{ position: 'relative', width: '100%', height: '220vh', zIndex: 1, paddingTop: 68, transform: `translate(${px * 0.3}px, ${py * 0.2}px)`, transition: 'transform 0.5s ease' }}>
        {PHOTOS.map((photo) => {
          const isHovered = hovered === photo.id
          const style: CSSProperties = {
            position: 'absolute',
            left: `${photo.x}%`,
            top: `${photo.y}%`,
            width: photo.w,
            zIndex: isHovered ? 100 : photo.zIndex,
            transform: isHovered ? `rotate(${photo.rot * 0.3}deg) scale(${photo.scale * 1.07})` : `rotate(${photo.rot}deg) scale(${photo.scale})`,
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), z-index 0s',
            cursor: 'pointer',
          }
          return (
            <div key={photo.id} style={style} onMouseEnter={() => setHovered(photo.id)} onMouseLeave={() => setHovered(null)}>
              <div style={{ boxShadow: isHovered ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12)' : '0 12px 40px rgba(0,0,0,0.5)', transition: 'box-shadow 0.4s ease', borderRadius: 2, overflow: 'hidden', background: 'var(--surface)', position: 'relative' }}>
                <img src={photo.url} alt={photo.alt} style={{ width: photo.w, height: photo.h, display: 'block', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 12px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', margin: 0 }}>© {photo.author}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
