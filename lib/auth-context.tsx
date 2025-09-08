"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthService } from './auth'

interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        }

        console.log('Login: Setting user data:', userData)
        setUser(userData)

        // Store token in localStorage for client-side use
        localStorage.setItem('admin_token', data.token)
        console.log('Login: Token stored in localStorage')

        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    // Clear client-side state
    setUser(null)
    localStorage.removeItem('admin_token')
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    console.log('Auth check: Token in localStorage:', !!token)

    if (!token) {
      console.log('Auth check: No token found, setting loading to false')
      setIsLoading(false)
      return
    }

    try {
      console.log('Auth check: Verifying token...')
      const user = await AuthService.getUserFromToken(token)
      console.log('Auth check: User from token:', user ? 'Found' : 'Not found')

      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role,
        }
        console.log('Auth check: Setting user data:', userData)
        setUser(userData)
      } else {
        console.log('Auth check: No user found, logging out')
        logout()
      }
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
    } finally {
      console.log('Auth check: Setting loading to false')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
