import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import bgImage from '@/assets/hero-home.jpg'
import logo from '@/assets/Logo.png'
import { useToast } from '@/components/ui/use-toast'
import { API_BASE_URL } from '@/lib/config'
import { Camera } from 'lucide-react'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Please select an image smaller than 5MB', variant: 'destructive' })
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please select an image file', variant: 'destructive' })
        return
      }

      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('mobile', mobile)
      formData.append('password', password)
      formData.append('confirmPassword', confirmPassword)
      if (profileImage) {
        formData.append('profileImage', profileImage)
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        toast({ 
          title: 'Registration successful!', 
          description: 'Please check your email and click the verification link to complete your registration. You will be automatically logged in after verification.',
          duration: 7000
        })
        navigate('/login?message=Please verify your email to complete registration')
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
          <div className="mb-2">
            <img src={logo} alt="Pakistan Online Logo" className="h-16 w-auto mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold">Welcome</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image Section */}
          <div className="text-center">
            <Label className="text-white mb-3 block">Profile Photo</Label>
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImagePreview || undefined} />
                <AvatarFallback className="text-lg">
                  {fullName ? fullName[0] : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
              >
                <Camera className="mr-2 h-4 w-4" />
                {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {profileImagePreview && (
                <p className="text-xs text-green-300">Photo selected ✓</p>
              )}
            </div>
          </div>

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
            <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
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
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-full py-2 font-semibold"
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
