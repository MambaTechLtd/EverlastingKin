import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, AppUser, getUserProfile, logAuditAction } from '../lib/supabase'
import { validateAdminCredentials, isAdminAccount } from '../lib/adminAccounts'

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  verifyOTP: (email: string, token: string) => Promise<{ error: any }>
  resendOTP: (email: string) => Promise<{ error: any }>
  getCurrentUser: () => Promise<AppUser | null>
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
  const [user, setUser] = useState<AppUser | null>(null)
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

  const signUp = async (email: string, password: string, userData: Partial<AppUser>) => {
    try {
      setLoading(true)
      
      // Check if this is an admin account trying to register
      if (isAdminAccount(email)) {
        return { error: { message: 'Admin accounts should use sign in instead of registration.' } }
      }
      
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

      await logAuditAction('User registration attempt', {
        table_name: 'users',
        record_id: authData.user?.id,
        details: {
          email,
          role: userData.role || 'public'
        }
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
      
      // Check if this is a predefined admin account
      const adminAccount = validateAdminCredentials(email, password)
      if (adminAccount) {
        // Create a mock session for admin accounts
        setUser(adminAccount.profile)
        setSession({
          access_token: 'admin-token',
          refresh_token: 'admin-refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: {
            id: adminAccount.profile.id,
            email: adminAccount.profile.email,
            aud: 'authenticated',
            role: 'authenticated',
            email_confirmed_at: new Date().toISOString(),
            phone_confirmed_at: null,
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: { provider: 'admin', providers: ['admin'] },
            user_metadata: {
              first_name: adminAccount.profile.first_name,
              last_name: adminAccount.profile.last_name,
              role: 'admin'
            },
            identities: [],
            created_at: adminAccount.profile.created_at,
            updated_at: adminAccount.profile.updated_at
          }
        } as Session)
        
        await logAuditAction('Admin direct sign in', {
          details: { email, admin_account: true }
        })
        
        return { error: null }
      }
      
      // Regular Supabase authentication for non-admin accounts
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        await logAuditAction('Failed sign in attempt', {
          details: { email }
        })
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
    
    // Check if this is an admin session
    if (user && (user.id === 'admin-eva-001' || user.id === 'admin-expert-001')) {
      // For admin accounts, just clear the local state
      setUser(null)
      setSession(null)
    } else {
      // For regular users, use Supabase signOut
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    }
  }

  const verifyOTP = async (email: string, token: string) => {
    try {
      // Admin accounts don't need OTP verification
      if (isAdminAccount(email)) {
        return { error: { message: 'Admin accounts do not require OTP verification.' } }
      }
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      })
      
      if (!error) {
        await logAuditAction('OTP verification successful', {
          details: { email }
        })
      }
      
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const resendOTP = async (email: string) => {
    try {
      // Admin accounts don't need OTP
      if (isAdminAccount(email)) {
        return { error: { message: 'Admin accounts do not require OTP verification.' } }
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      
      if (!error) {
        await logAuditAction('OTP resend requested', {
          details: { email }
        })
      }
      
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const getCurrentUser = async (): Promise<AppUser | null> => {
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