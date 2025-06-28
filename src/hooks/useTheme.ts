import { useAuth } from '../contexts/AuthContext'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  success: string
  warning: string
  error: string
  border: string
}

export const useTheme = (): ThemeColors => {
  const { user } = useAuth()
  
  // Default theme (public users)
  const defaultTheme: ThemeColors = {
    primary: '#2C2C42',
    secondary: '#FFD180',
    accent: '#8EF6E4',
    background: '#2C2C42',
    surface: '#3A3A52',
    text: '#F6F8FF',
    textMuted: '#B8BACF',
    success: '#69E99C',
    warning: '#FFD180',
    error: '#EA5C5A',
    border: '#FFD180'
  }

  // Admin theme - Deep Purple & Gold
  const adminTheme: ThemeColors = {
    primary: '#1A1A2E',
    secondary: '#16213E',
    accent: '#E94560',
    background: '#0F0F23',
    surface: '#16213E',
    text: '#EEEEFF',
    textMuted: '#A0A0B8',
    success: '#00D9FF',
    warning: '#FFB800',
    error: '#FF6B6B',
    border: '#E94560'
  }

  // Mortuary Staff theme - Serene Blue & Silver
  const mortuaryTheme: ThemeColors = {
    primary: '#1E3A5F',
    secondary: '#2E5984',
    accent: '#87CEEB',
    background: '#0D1B2A',
    surface: '#1E3A5F',
    text: '#F0F8FF',
    textMuted: '#B0C4DE',
    success: '#98FB98',
    warning: '#DDA0DD',
    error: '#F08080',
    border: '#87CEEB'
  }

  // Police theme - Professional Navy & Badge Gold
  const policeTheme: ThemeColors = {
    primary: '#1C2951',
    secondary: '#2A3F7A',
    accent: '#FFD700',
    background: '#0A1628',
    surface: '#1C2951',
    text: '#F5F5F5',
    textMuted: '#C0C0C0',
    success: '#32CD32',
    warning: '#FF8C00',
    error: '#DC143C',
    border: '#FFD700'
  }

  switch (user?.role) {
    case 'admin':
      return adminTheme
    case 'mortuary_staff':
      return mortuaryTheme
    case 'police':
      return policeTheme
    default:
      return defaultTheme
  }
}

export const applyTheme = (theme: ThemeColors) => {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.primary)
  root.style.setProperty('--theme-secondary', theme.secondary)
  root.style.setProperty('--theme-accent', theme.accent)
  root.style.setProperty('--theme-background', theme.background)
  root.style.setProperty('--theme-surface', theme.surface)
  root.style.setProperty('--theme-text', theme.text)
  root.style.setProperty('--theme-text-muted', theme.textMuted)
  root.style.setProperty('--theme-success', theme.success)
  root.style.setProperty('--theme-warning', theme.warning)
  root.style.setProperty('--theme-error', theme.error)
  root.style.setProperty('--theme-border', theme.border)
}