"use client"

import { useState, useEffect } from 'react'

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const cookies = document.cookie

    setDebugInfo({
      tokenExists: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) + '...' || 'No token',
      cookiesContainToken: cookies.includes('admin_token'),
      currentUrl: window.location.href,
      userAgent: navigator.userAgent
    })

    console.log('Auth Debug Info:', {
      token: token ? 'Present' : 'Missing',
      tokenLength: token?.length || 0,
      cookies: cookies,
      url: window.location.href
    })
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-sm font-mono">
      <h3 className="font-bold mb-2">Authentication Debug Info:</h3>
      <div className="space-y-1">
        <div>Token exists: {debugInfo.tokenExists ? '✅' : '❌'}</div>
        <div>Token length: {debugInfo.tokenLength}</div>
        <div>Token start: {debugInfo.tokenStart}</div>
        <div>Cookies contain token: {debugInfo.cookiesContainToken ? '✅' : '❌'}</div>
        <div>Current URL: {debugInfo.currentUrl}</div>
      </div>
      <button
        onClick={() => {
          const token = localStorage.getItem('admin_token')
          console.log('Manual token check:', token)
          alert(`Token: ${token ? 'Present' : 'Missing'}`)
        }}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Check Token
      </button>
    </div>
  )
}
