"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoading } from '@/lib/loading-context'

export function usePageLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()

  useEffect(() => {
    // Start loading when pathname or search params change
    setLoadingMessage('Loading PortfolioPro...')
    startLoading()

    // Stop loading after a minimum delay to ensure smooth transition
    const timer = setTimeout(() => {
      stopLoading()
    }, 800) // Minimum loading time for better UX

    return () => clearTimeout(timer)
  }, [pathname, searchParams, startLoading, stopLoading, setLoadingMessage])

  return {
    pathname,
    searchParams,
  }
}
