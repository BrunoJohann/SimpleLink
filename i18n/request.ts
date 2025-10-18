import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Obter o idioma solicitado
  const requested = await requestLocale

  // Validar se o idioma é suportado, caso contrário usar o padrão
  const locale = routing.locales.includes(requested as any)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,

    // Configurações de formatação global
    timeZone: 'America/Sao_Paulo',
    now: new Date(),

    // Tratamento de erros
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('next-intl error:', error)
      }
    },

    // Fallback para mensagens não encontradas
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(Boolean).join('.')

      if (error.code === 'MISSING_MESSAGE') {
        return `[${path}]` // Mostrar chave em desenvolvimento
      }

      return `[Erro: ${path}]`
    },
  }
})
