"use client"

import { useState, useEffect, useRef } from "react"

interface InteractiveLoadingProps {
  message?: string
}

export function InteractiveLoading({ message = "Loading portfolio content..." }: InteractiveLoadingProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || // Small screens
                   'ontouchstart' in window || // Touch devices
                   navigator.maxTouchPoints > 0 // Multi-touch devices
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Skip mouse tracking on mobile devices
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        setMousePosition({
          x: (e.clientX - centerX) / 50, // Divide by 50 to reduce the effect
          y: (e.clientY - centerY) / 50,
        })
      }
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePosition({ x: 0, y: 0 })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden relative ${
        isMobile ? '' : 'cursor-pointer'
      }`}
    >
      {/* Animated background blobs - similar to hero section */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl animate-blob transition-transform duration-300"
          style={{
            backgroundColor: `color-mix(in srgb, hsl(var(--theme-primary)) 20%, transparent)`,
            transform: isMobile
              ? 'translate(0px, 0px) scale(1)'
              : isHovered
                ? `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`
                : 'translate(0px, 0px) scale(1)',
          }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 transition-transform duration-300"
          style={{
            backgroundColor: `color-mix(in srgb, hsl(var(--theme-accent)) 20%, transparent)`,
            transform: isMobile
              ? 'translate(0px, 0px) scale(1)'
              : isHovered
                ? `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px) scale(1.15)`
                : 'translate(0px, 0px) scale(1)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 transition-transform duration-300"
          style={{
            backgroundColor: `color-mix(in srgb, hsl(var(--theme-secondary)) 20%, transparent)`,
            transform: isMobile
              ? 'translate(0px, 0px) scale(1)'
              : isHovered
                ? `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * -0.4}px) scale(0.9)`
                : 'translate(0px, 0px) scale(1)',
          }}
        />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Interactive loading dots */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full bg-gradient-primary transition-all duration-300 animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                transform: isMobile
                  ? 'translateY(0px) scale(1)'
                  : isHovered
                    ? `translateY(${mousePosition.y * 0.2}px) scale(${1 + index * 0.1})`
                    : 'translateY(0px) scale(1)',
              }}
            />
          ))}
        </div>

        {/* Loading message with hover effect */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-300">
            PortfolioPro
          </h2>
          <p className="text-muted-foreground transition-all duration-300">
            {message}
          </p>
        </div>

        {/* Interactive progress indicator */}
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-in-out"
              style={{
                width: isMobile
                  ? '60%'
                  : isHovered
                    ? '100%'
                    : '60%',
                transform: isMobile
                  ? 'translateX(0px)'
                  : isHovered
                    ? `translateX(${mousePosition.x * 0.1}px)`
                    : 'translateX(0px)',
              }}
            />
          </div>
        </div>

        {/* Hover instruction - only show on desktop */}
        {!isMobile && (
          <div className="text-xs text-muted-foreground opacity-60 transition-opacity duration-300">
            {isHovered ? "✨ Move your cursor to interact" : "👆 Hover to interact"}
          </div>
        )}
      </div>
    </div>
  )
}
