'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface StoreLanguageSelectorProps {
  readonly currentLanguage: string
  readonly onLanguageChange: (language: string) => Promise<void>
}

export function StoreLanguageSelector({ currentLanguage, onLanguageChange }: StoreLanguageSelectorProps) {
  const t = useTranslations('dashboard.appearance.form')
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' }
  ]

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) return

    setIsUpdating(true)
    try {
      await onLanguageChange(languageCode)
      toast({
        title: t('messages.updateSuccess'),
        description: t('messages.languageUpdated'),
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('messages.error'),
        description: error instanceof Error ? error.message : t('messages.unexpectedError'),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('storeLanguage.title')}</CardTitle>
        <CardDescription>{t('storeLanguage.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">{t('storeLanguage.currentLanguage')}</Label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={currentLanguage === language.code ? 'default' : 'outline'}
                className="justify-start h-auto p-4"
                onClick={() => handleLanguageChange(language.code)}
                disabled={isUpdating}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-muted-foreground">{language.code}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {t('storeLanguage.info')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
