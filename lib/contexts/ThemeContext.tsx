'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Carregar tema do localStorage ao montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    
    const initialTheme = savedTheme || systemTheme
    console.log('🎨 Tema inicial:', initialTheme, '(salvo:', savedTheme, ', sistema:', systemTheme, ')')
    
    setThemeState(initialTheme)
    
    // Aplicar tema ao documento
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
      console.log('🌙 Classe dark adicionada ao HTML')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('☀️ Classe dark removida do HTML')
    }
    
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    console.log('🎨 Mudando tema para:', newTheme)
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      console.log('🌙 Dark mode ATIVADO')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('☀️ Light mode ATIVADO')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('🔄 Toggle: de', theme, 'para', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {mounted ? children : <div className="min-h-screen bg-background" />}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

