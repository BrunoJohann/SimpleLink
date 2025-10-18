'use client'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function LoginPage() {
  const t = useTranslations('login')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      })

      if (result?.error) {
        setMessage(t('errorMessage'))
      } else {
        setMessage(t('successMessage'))
      }
    } catch (error) {
      setMessage(t('errorMessage'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header com seletor de idioma */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="font-bold text-2xl">SimpleLink</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('subtitle')}{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              {t('backToHome')}
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('emailLogin')}</CardTitle>
            <CardDescription>
              {t('emailDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  disabled={isLoading}
                />
              </div>

              {message && (
                <div className={`text-sm ${message.includes(t('errorMessage')) ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('submitting') : t('submitButton')}
              </Button>
            </form>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>
                {t('developmentNote')}{' '}
                <a href="https://mailhog.github.io/MailHog/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {t('mailhogLink')}
                </a>{' '}
                {t('developmentNoteEnd')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
