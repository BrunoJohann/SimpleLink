'use client'

import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/contexts/StoreContext'
import { ExternalLink, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export function DashboardHeader() {
  const { store } = useStore()

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SL</span>
          </div>
          <span className="font-bold text-xl">SimpleLink</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {store?.slug && (
            <Link 
              href={`/loja/${store.slug}`}
              target="_blank"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Ver Loja Pública
            </Link>
          )}
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
