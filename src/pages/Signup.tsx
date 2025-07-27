import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import bgImage from '@/assets/hero-home.jpg'
import { useToast } from '@/components/ui/use-toast'
import { API_BASE_URL } from '@/lib/config'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, email, password, confirmPassword }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({ title: 'Registration successful', description: 'Please check your email to verify your account.' })
        navigate('/login')
      } else {
        toast({ title: 'Signup failed', description: data.error || 'Signup failed', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Network error', description: 'Could not connect to server', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-lg p-10 w-full max-w-md text-white">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">M</div>
          <h2 className="text-2xl font-semibold">Welcome</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-1 bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1 bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 rounded-full py-2 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>

        {/* Bottom Links */}
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
