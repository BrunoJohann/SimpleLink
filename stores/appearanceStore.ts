import { Store } from '@prisma/client'
import { create } from 'zustand'

interface AppearanceState {
  previewStore: Store | null
  setPreviewStore: (store: Store) => void
  updatePreviewStore: (updates: Partial<Store>) => void
}

export const useAppearanceStore = create<AppearanceState>(set => ({
  previewStore: null,
  setPreviewStore: store => set({ previewStore: store }),
  updatePreviewStore: updates =>
    set(state => ({
      previewStore: state.previewStore
        ? {
            ...state.previewStore,
            ...updates,
            theme: {
              ...state.previewStore.theme,
              ...updates.theme,
            } as any,
          }
        : null,
    })),
}))
