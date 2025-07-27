import { useState } from 'react'
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import bgImage from '@/assets/hero-home.jpg'
import { API_BASE_URL } from '@/lib/config'

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const { token: tokenParam } = useParams();
  const token = tokenParam || searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: 'Invalid link', description: 'Reset token is missing.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Password reset', description: data.message });
        setSubmitted(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to reset password', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network error', description: 'Could not connect to server', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-lg p-10 w-full max-w-md text-white">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2">M</div>
          <h2 className="text-2xl font-semibold">Reset Password</h2>
        </div>
        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-white/80">Your password has been reset. Redirecting to login...</p>
            <Link to="/login" className="text-blue-300 hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="password" className="text-white">New Password</Label>
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
              <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
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
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 
