'use client'

import { createContext, ReactNode, useContext } from 'react'

interface Store {
  id: string
  slug: string
  name: string
}

interface StoreContextType {
  store: Store | null
}

const StoreContext = createContext<StoreContextType>({ store: null })

export function StoreProvider({ 
  children, 
  store 
}: { 
  children: ReactNode
  store: Store | null 
}) {
  return (
    <StoreContext.Provider value={{ store }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
