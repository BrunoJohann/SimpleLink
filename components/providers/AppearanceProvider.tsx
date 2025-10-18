'use client'

import { Store } from '@prisma/client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface AppearanceState {
  store: Store
  updateStore: (updates: Partial<Store>) => void
}

const AppearanceContext = createContext<AppearanceState | undefined>(undefined)

interface AppearanceProviderProps {
  readonly children: ReactNode
  readonly initialStore: Store
}

export function AppearanceProvider({ children, initialStore }: AppearanceProviderProps) {
  const [store, setStore] = useState<Store>(initialStore)

  const updateStore = (updates: Partial<Store>) => {
    setStore(prev => ({
      ...prev,
      ...updates,
      theme: {
        ...prev.theme,
        ...updates.theme,
      } as any,
    }))
  }

  const value = useMemo(() => ({ store, updateStore }), [store])

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider')
  }
  return context
}
