'use client'

import { useEffect } from 'react'

interface TrackingProps {
  storeSlug: string
  productSlug?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export function Tracking({ storeSlug, productSlug, utm_source, utm_medium, utm_campaign }: TrackingProps) {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const params = new URLSearchParams({
          store: storeSlug,
          ...(utm_source && { utm_source }),
          ...(utm_medium && { utm_medium }),
          ...(utm_campaign && { utm_campaign }),
        })

        if (productSlug) {
          // Track product view
          await fetch(`/api/track/product-view?${params.toString()}&product=${productSlug}`)
        } else {
          // Track store visit
          await fetch(`/api/track/store-visit?${params.toString()}`)
        }
      } catch (error) {
        console.error('Tracking error:', error)
      }
    }

    trackVisit()
  }, [storeSlug, productSlug, utm_source, utm_medium, utm_campaign])

  return null
}
