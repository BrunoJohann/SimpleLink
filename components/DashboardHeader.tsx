'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/contexts/StoreContext'
import { ExternalLink, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export function DashboardHeader() {
  const { store } = useStore()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SL</span>
          </div>
          <span className="font-bold text-xl text-foreground">SimpleLink</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {store?.slug && (
            <Link 
              href={`/loja/${store.slug}`}
              target="_blank"
              className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Ver Loja Pública</span>
            </Link>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
