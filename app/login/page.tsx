'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
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
        setMessage('Erro ao enviar email. Tente novamente.')
      } else {
        setMessage('Verifique seu email para o link de login!')
      }
    } catch (error) {
      setMessage('Erro ao enviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="font-bold text-2xl">SimpleLink</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              volte para o início
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login com Email</CardTitle>
            <CardDescription>
              Digite seu email para receber um link de login seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {message && (
                <div className={`text-sm ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Link de Login'}
              </Button>
            </form>

            <div className="mt-6 text-xs text-gray-500 text-center">
              <p>
                Para desenvolvimento, use um serviço como{' '}
                <a href="https://mailhog.github.io/MailHog/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  MailHog
                </a>{' '}
                para interceptar emails.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
