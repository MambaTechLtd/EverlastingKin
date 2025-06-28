import React, { useState } from 'react'
import { X, Mail, Lock, User, Phone, Building, Badge, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { isAdminAccount } from '../../lib/adminAccounts'

interface AuthPopupProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

const AuthPopup: React.FC<AuthPopupProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  const { signIn, signUp, verifyOTP, resendOTP } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'public' as 'public' | 'mortuary_staff' | 'police',
    organization: '',
    badgeNumber: '',
  })
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdminEmail = isAdminAccount(formData.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          if (error.message.includes('Email not confirmed') && !isAdminEmail) {
            setStep('otp')
            setSuccess('Please check your email for the verification code.')
          } else {
            setError(error.message)
          }
        } else {
          if (isAdminEmail) {
            setSuccess('Admin access granted!')
          } else {
            setSuccess('Successfully signed in!')
          }
          setTimeout(() => {
            onClose()
            resetForm()
          }, 1000)
        }
      } else {
        // Sign up mode
        if (isAdminEmail) {
          setError('Admin accounts should use sign in instead of registration.')
          return
        }
        
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          role: formData.role,
          organization: formData.organization,
          badge_number: formData.badgeNumber,
        })
        
        if (error) {
          setError(error.message)
        } else {
          setStep('otp')
          setSuccess('Please check your email for the verification code.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await verifyOTP(formData.email, otp)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Email verified successfully!')
        setTimeout(() => {
          onClose()
          resetForm()
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { error } = await resendOTP(formData.email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Verification code resent to your email.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'public',
      organization: '',
      badgeNumber: '',
    })
    setStep('form')
    setOtp('')
    setError('')
    setSuccess('')
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-ek-bg-main border border-ek-accent-gold/20 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ek-accent-gold/20">
          <h2 className="text-xl font-semibold text-ek-text-main">
            {mode === 'signin' ? 'Sign In' : 'Register'} to Everlasting Kin
          </h2>
          <button
            onClick={handleClose}
            className="text-ek-text-muted hover:text-ek-text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-ek-text-main mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                    placeholder="Enter your email"
                  />
                  {isAdminEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Shield className="w-4 h-4 text-ek-accent-gold" />
                    </div>
                  )}
                </div>
                {isAdminEmail && (
                  <p className="text-xs text-ek-accent-gold mt-1 flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Admin account detected</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-ek-text-main mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Admin Account Notice */}
              {isAdminEmail && mode === 'signin' && (
                <div className="bg-ek-accent-gold/10 border border-ek-accent-gold/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-ek-accent-gold mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-ek-text-main">
                      <p className="font-medium mb-1">Administrator Access</p>
                      <p className="text-ek-text-muted">
                        You are signing in with full administrative privileges.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign Up Additional Fields - Only show for non-admin accounts */}
              {mode === 'signup' && !isAdminEmail && (
                <>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ek-text-main mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                          placeholder="First name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ek-text-main mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-ek-text-main mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-ek-text-main mb-2">
                      Account Type
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main focus:outline-none focus:border-ek-accent-mint transition-colors"
                    >
                      <option value="public">General Public</option>
                      <option value="mortuary_staff">Mortuary Staff</option>
                      <option value="police">Police Officer</option>
                    </select>
                  </div>

                  {/* Professional Fields */}
                  {(formData.role === 'mortuary_staff' || formData.role === 'police') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-ek-text-main mb-2">
                          Organization
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                          <input
                            type="text"
                            required
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                            placeholder={formData.role === 'police' ? 'Police Department' : 'Mortuary/Funeral Home'}
                          />
                        </div>
                      </div>

                      {formData.role === 'police' && (
                        <div>
                          <label className="block text-sm font-medium text-ek-text-main mb-2">
                            Badge Number
                          </label>
                          <div className="relative">
                            <Badge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ek-text-muted w-4 h-4" />
                            <input
                              type="text"
                              required
                              value={formData.badgeNumber}
                              onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors"
                              placeholder="Your badge number"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Professional Account Notice */}
                  {(formData.role === 'mortuary_staff' || formData.role === 'police') && (
                    <div className="bg-ek-accent-gold/10 border border-ek-accent-gold/30 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-ek-accent-gold mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-ek-text-main">
                          <p className="font-medium mb-1">Professional Account Review</p>
                          <p className="text-ek-text-muted">
                            Professional accounts require administrative approval before access is granted. 
                            You'll receive an email notification once your account is reviewed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Admin Registration Block */}
              {mode === 'signup' && isAdminEmail && (
                <div className="bg-ek-error/10 border border-ek-error/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-ek-error mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-ek-text-main">
                      <p className="font-medium mb-1">Admin Account Detected</p>
                      <p className="text-ek-text-muted">
                        This email is registered as an administrator account. Please use the sign in option instead.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center space-x-2 text-ek-error text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-ek-success text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (mode === 'signup' && isAdminEmail)}
                className="w-full bg-ek-accent-gold hover:bg-ek-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed text-ek-bg-main font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleOTPVerification} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-ek-accent-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-ek-accent-mint" />
                </div>
                <h3 className="text-lg font-semibold text-ek-text-main mb-2">
                  Verify Your Email
                </h3>
                <p className="text-ek-text-muted text-sm">
                  We've sent a verification code to<br />
                  <span className="font-medium text-ek-text-main">{formData.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ek-text-main mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-ek-bg-main border border-ek-accent-gold/30 rounded-lg text-ek-text-main placeholder-ek-text-muted focus:outline-none focus:border-ek-accent-mint transition-colors text-center text-lg font-mono"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-ek-error text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-ek-success text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ek-accent-gold hover:bg-ek-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed text-ek-bg-main font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-ek-accent-mint hover:text-ek-accent-mint/80 text-sm font-medium disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {/* Mode Toggle */}
          {step === 'form' && (
            <div className="mt-6 text-center">
              <span className="text-ek-text-muted text-sm">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                onClick={onToggleMode}
                className="ml-2 text-ek-accent-mint hover:text-ek-accent-mint/80 text-sm font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPopup