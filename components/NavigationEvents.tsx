'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'

export function NavigationEvents() {
  const pathname = usePathname()

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement
      const href = target.getAttribute('href')
      
      if (href && href.startsWith('/') && !href.startsWith('/#')) {
        NProgress.start()
      }
    }

    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    // Adiciona listeners para todos os links
    document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
      NProgress.done()
    }
  }, [pathname])

  return null
}

