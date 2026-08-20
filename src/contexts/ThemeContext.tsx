import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface ThemeDefinition {
  id: string
  name: string
  label: string          // short descriptor shown in picker
  bg: string
  surface: string
  fg: string
  fgRgb: string          // "r, g, b" for use in rgba()
  borderRgb: string      // "r, g, b" for subtle borders
  navBlur: string        // frosted nav background
  swatch: string         // solid color for the swatch chip
  swatchAccent: string   // contrast accent dot on swatch
  glowA: string          // ambient glow color A (full rgba)
  glowB: string          // ambient glow color B (full rgba)
}

export const THEMES: Record<string, ThemeDefinition> = {
  chalk: {
    id: 'chalk',
    name: 'Chalk',
    label: 'Bright minimal',
    bg: '#f7f4ef',
    surface: '#ffffff',
    fg: '#0a0a0a',
    fgRgb: '10, 10, 10',
    borderRgb: '0, 0, 0',
    navBlur: 'rgba(247,244,239,0.94)',
    swatch: '#f7f4ef',
    swatchAccent: '#0a0a0a',
    glowA: 'rgba(0,0,0,0)',
    glowB: 'rgba(0,0,0,0)',
  },
  ink: {
    id: 'ink',
    name: 'Ink',
    label: 'Brutalist paper',
    bg: '#ece8de',
    surface: '#e0dbd0',
    fg: '#111111',
    fgRgb: '17, 17, 17',
    borderRgb: '0, 0, 0',
    navBlur: 'rgba(236,232,222,0.95)',
    swatch: '#ece8de',
    swatchAccent: '#111111',
    glowA: 'rgba(0,0,0,0)',
    glowB: 'rgba(0,0,0,0)',
  },
  dune: {
    id: 'dune',
    name: 'Dune',
    label: 'Desert warmth',
    bg: '#f5ede0',
    surface: '#fffaf3',
    fg: '#2c1a08',
    fgRgb: '44, 26, 8',
    borderRgb: '44, 26, 8',
    navBlur: 'rgba(245,237,224,0.95)',
    swatch: '#f5ede0',
    swatchAccent: '#c4621a',
    glowA: 'rgba(196,98,26,0.08)',
    glowB: 'rgba(220,160,60,0.06)',
  },
  sage: {
    id: 'sage',
    name: 'Sage',
    label: 'Muted botanical',
    bg: '#eaede8',
    surface: '#f5f7f4',
    fg: '#1a2418',
    fgRgb: '26, 36, 24',
    borderRgb: '26, 36, 24',
    navBlur: 'rgba(234,237,232,0.95)',
    swatch: '#eaede8',
    swatchAccent: '#3a6b34',
    glowA: 'rgba(58,107,52,0.07)',
    glowB: 'rgba(120,160,80,0.05)',
  },
  glacier: {
    id: 'glacier',
    name: 'Glacier',
    label: 'Arctic cool',
    bg: '#e8eef4',
    surface: '#f4f8fc',
    fg: '#0e1e2e',
    fgRgb: '14, 30, 46',
    borderRgb: '14, 30, 46',
    navBlur: 'rgba(232,238,244,0.95)',
    swatch: '#e8eef4',
    swatchAccent: '#1a6fa8',
    glowA: 'rgba(26,111,168,0.07)',
    glowB: 'rgba(80,160,220,0.05)',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    label: 'Dusty editorial',
    bg: '#f4ecea',
    surface: '#fdf7f6',
    fg: '#2a1212',
    fgRgb: '42, 18, 18',
    borderRgb: '42, 18, 18',
    navBlur: 'rgba(244,236,234,0.95)',
    swatch: '#f4ecea',
    swatchAccent: '#b83a3a',
    glowA: 'rgba(184,58,58,0.07)',
    glowB: 'rgba(200,100,80,0.05)',
  },
}

const THEME_ORDER = ['chalk', 'ink', 'dune', 'sage', 'glacier', 'rose']

function applyTheme(t: ThemeDefinition) {
  const r = document.documentElement.style
  r.setProperty('--bg', t.bg)
  r.setProperty('--surface', t.surface)
  r.setProperty('--fg', t.fg)
  r.setProperty('--fg-rgb', t.fgRgb)
  r.setProperty('--border-rgb', t.borderRgb)
  r.setProperty('--nav-blur', t.navBlur)
  r.setProperty('--glow-a', t.glowA)
  r.setProperty('--glow-b', t.glowB)
  document.documentElement.setAttribute('data-theme', t.id)
}

interface ThemeContextValue {
  theme: ThemeDefinition
  themes: ThemeDefinition[]
  setTheme: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    const saved = localStorage.getItem('axis-theme')
    return (saved && THEMES[saved]) ? saved : 'chalk'
  })

  const theme = THEMES[themeId] ?? THEMES.chalk

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('axis-theme', themeId)
  }, [themeId, theme])

  // Apply immediately on mount without flash
  useEffect(() => { applyTheme(theme) }, [])  // eslint-disable-line

  const setTheme = (id: string) => {
    if (THEMES[id]) setThemeId(id)
  }

  return (
    <ThemeContext.Provider value={{ theme, themes: THEME_ORDER.map(id => THEMES[id]), setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
