import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Lista de idiomas suportados
  locales: ['pt-BR', 'en'],

  // Idioma padrão (fallback para inglês)
  defaultLocale: 'en',

  // Prefixo de idioma nas URLs
  localePrefix: 'as-needed',

  // Detecção automática de idioma
  localeDetection: true,

  // Configuração de cookies para persistir preferência do usuário
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
  },
})

// Exportar tipos para TypeScript
export type Locale = (typeof routing.locales)[number]
