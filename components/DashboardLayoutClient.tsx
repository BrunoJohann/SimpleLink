'use client'

import {
    BarChart3,
    Package,
    Palette,
    Store
} from 'lucide-react'
import Link from 'next/link'

const navigation = [
  { name: 'Visão Geral', href: '/dashboard', icon: Store },
  { name: 'Produtos', href: '/dashboard/products', icon: Package },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Aparência', href: '/dashboard/appearance', icon: Palette },
]

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-card border-r min-h-screen">
        <div className="p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
