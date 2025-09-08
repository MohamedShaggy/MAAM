"use client"

import { useLoading } from "@/lib/loading-context"
import { InteractiveLoading } from "@/components/interactive-loading"

export function GlobalLoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      <InteractiveLoading message={loadingMessage} />
    </div>
  )
}
