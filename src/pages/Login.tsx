import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import bgImage from '@/assets/hero-home.jpg'
import logo from '@/assets/globeLogo.png'
import { useToast } from '@/components/ui/use-toast'
import { API_BASE_URL } from '@/lib/config'
import { pwaFetch, handleAuthError, setCachedAuthState, isOnline } from '@/lib/pwa-auth'
import { Wifi, WifiOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline())
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()

  // Handle URL parameters for success/error messages
  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const message = searchParams.get('message')
    
    if (error) {
      toast({ 
        title: 'Error', 
        description: error, 
        variant: 'destructive' 
      })
    }
    
    if (success) {
      toast({ 
        title: 'Success', 
        description: success,
        duration: 5000
      })
    }
    
    if (message) {
      toast({ 
        title: 'Info', 
        description: decodeURIComponent(message),
        duration: 5000
      })
    }
    
    // Clear URL parameters after showing the message
    if (error || success || message) {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNeedsVerification(false)
    
    try {
      // Check if offline
      if (!isOnline()) {
        toast({ 
          title: 'Offline mode', 
          description: 'Authentication requires an internet connection. Please check your connection and try again.',
          variant: 'destructive',
          duration: 7000
        })
        return
      }

      const response = await pwaFetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })
      const data = await response.json()
      
      if (response.ok) {
        // Cache successful authentication
        setCachedAuthState({
          isAuthenticated: true,
          user: data.user,
          isOffline: false
        })
        
        toast({ title: 'Login successful', description: 'Welcome back!' })
        navigate('/')
      } else {
        toast({ title: 'Login failed', description: data.error || 'Login failed', variant: 'destructive' })
      }
    } catch (err) {
      const errorInfo = handleAuthError(err)
      toast({ 
        title: errorInfo.needsOnline ? 'Connection required' : 'Login failed', 
        description: errorInfo.message, 
        variant: 'destructive',
        duration: errorInfo.needsOnline ? 7000 : 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email address first', variant: 'destructive' })
      return
    }

    if (!isOnline()) {
      toast({ 
        title: 'Offline mode', 
        description: 'Email verification requires an internet connection.',
        variant: 'destructive'
      })
      return
    }

    setIsResendingVerification(true)
    try {
      const response = await pwaFetch(`${API_BASE_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (response.ok) {
        toast({ title: 'Verification disabled', description: data.message })
      } else {
        toast({ title: 'Failed to send email', description: data.error, variant: 'destructive' })
      }
    } catch (err) {
      const errorInfo = handleAuthError(err)
      toast({ 
        title: errorInfo.needsOnline ? 'Connection required' : 'Failed to send email', 
        description: errorInfo.message, 
        variant: 'destructive' 
      })
    } finally {
      setIsResendingVerification(false)
    }
  }

  // Add network status listener
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false)
    const handleOffline = () => setIsOfflineMode(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-3xl shadow-lg p-10 w-full max-w-md text-black">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="mb-2">
            <img src={logo} alt="E - Dunia Logo" className="h-16 w-auto mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-black">Welcome</h2>
          
          {/* Offline Indicator */}
          {isOfflineMode && (
            <div className="mt-3 flex items-center justify-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2">
              <WifiOff className="h-4 w-4 text-red-300" />
              <span className="text-sm text-red-300">Offline - Login requires internet connection</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-black">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1 bg-white border border-gray-300 text-black placeholder-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-black">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 bg-white border border-gray-300 text-black placeholder-gray-500"
            />
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-full py-2 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Email Verification Section - Disabled */}
        {false && needsVerification && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-sm text-yellow-200 mb-3">
              Your email needs to be verified before you can log in.
            </p>
            <Button
              onClick={handleResendVerification}
              disabled={isResendingVerification}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2 rounded"
            >
              {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </div>
        )}

        {/* Bottom Links */}
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
