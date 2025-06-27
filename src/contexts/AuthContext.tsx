import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User, getUserProfile, logAuditAction } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  verifyOTP: (email: string, token: string) => Promise<{ error: any }>
  resendOTP: (email: string) => Promise<{ error: any }>
  getCurrentUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
          if (event === 'SIGNED_IN') {
            await logAuditAction('User signed in')
          }
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const userData = await getUserProfile(userId)
      setUser(userData)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true)
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role || 'public',
            phone_number: userData.phone_number,
            organization: userData.organization,
            badge_number: userData.badge_number,
          }
        }
      })

      if (authError) {
        return { error: authError }
      }

      await logAuditAction('User registration attempt', 'users', authData.user?.id, {
        email,
        role: userData.role || 'public'
      })

      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        await logAuditAction('Failed sign in attempt', undefined, undefined, { email })
      }
      
      return { error }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await logAuditAction('User signed out')
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const verifyOTP = async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })
      
      if (!error) {
        await logAuditAction('OTP verification successful', undefined, undefined, { email })
      }
      
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const resendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      
      if (!error) {
        await logAuditAction('OTP resend requested', undefined, undefined, { email })
      }
      
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const getCurrentUser = async (): Promise<User | null> => {
    if (user) return user
    
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const userData = await getUserProfile(authUser.id)
      setUser(userData)
      return userData
    }
    return null
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    verifyOTP,
    resendOTP,
    getCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}