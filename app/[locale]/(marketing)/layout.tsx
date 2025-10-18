import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface MarketingLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function MarketingLayout({
  children,
  params
}: MarketingLayoutProps) {
  const { locale } = await params
  
  // Validar se o idioma é suportado
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Carregar mensagens para o idioma atual
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
