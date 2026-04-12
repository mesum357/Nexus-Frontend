import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import bgImage from '@/assets/hero-home.jpg'
import { useToast } from '@/components/ui/use-toast'
import { API_BASE_URL } from '@/lib/config'
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setSubmitted(true)
        toast({ title: 'Check your email', description: data.message })
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to send reset link', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Network error', description: 'Could not connect to server', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendReset = async () => {
    if (!email.trim()) return
    setIsResending(true)
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({ title: 'Sent again', description: data.message || 'If your email is registered, check your inbox.' })
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to resend', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not connect to server', variant: 'destructive' })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {submitted ? (
          <div className="space-y-4 text-center text-sm">
            <p className="text-gray-700">
              If <strong>{email}</strong> is registered, you will receive an email with a reset link. You can resend if
              nothing arrived.
            </p>
            <Button type="button" variant="outline" className="w-full" onClick={handleResendReset} disabled={isResending}>
              {isResending ? 'Sending…' : 'Resend reset email'}
            </Button>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className={submitted ? 'hidden' : ''}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm space-y-2">
          {submitted ? (
            <>
              <button type="button" className="text-blue-600 hover:underline block mx-auto" onClick={() => setSubmitted(false)}>
                Use a different email
              </button>
              <span className="block text-gray-600">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </span>
            </>
          ) : (
            <>
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
