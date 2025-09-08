"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useLoading } from '@/lib/loading-context'
import { useEffect } from 'react'

export function useNavigationLoading() {
  const router = useRouter()
  const pathname = usePathname()
  const { startLoading, stopLoading, setLoadingMessage } = useLoading()

  const navigateWithLoading = (href: string, message = 'Loading page...') => {
    setLoadingMessage(message)
    startLoading()

    // Add a small delay to show the loading state
    setTimeout(() => {
      router.push(href)
    }, 300)
  }

  const replaceWithLoading = (href: string, message = 'Loading page...') => {
    setLoadingMessage(message)
    startLoading()

    setTimeout(() => {
      router.replace(href)
    }, 300)
  }

  // Auto-stop loading when route changes
  useEffect(() => {
    stopLoading()
  }, [pathname, stopLoading])

  return {
    navigateWithLoading,
    replaceWithLoading,
  }
}
