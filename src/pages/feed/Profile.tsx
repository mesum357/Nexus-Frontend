import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Settings, Edit, Camera, Grid, Heart, Bookmark } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface User {
  _id: string;
  username: string;
  email?: string;
  fullName?: string;
  profileImage?: string;
  city?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const stats = [
    { label: "Posts", value: "42" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "234" },
  ];

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=400&h=400&fit=crop`,
    likes: Math.floor(Math.random() * 100) + 10,
  }));

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Try the new endpoint first
        console.log('Profile - Trying new endpoint:', `${API_BASE_URL}/api/auth/me`);
        let response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile - New endpoint response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile - Current user data received:', data);
          console.log('Profile - Data type:', typeof data);
          console.log('Profile - Data keys:', Object.keys(data));
          
          // Try different ways to extract user data
          const userData = data.user || data || null;
          console.log('Profile - Final user data:', userData);
          
          setCurrentUser(userData);
          // Redirect to canonical username route when user is available
          if (userData && userData.username) {
            navigate(`/feed/profile/${userData.username}`, { replace: true })
          }
          return;
        } else {
          console.log('Profile - New endpoint failed, trying old endpoint');
        }
        
        // Fallback to old endpoint
        console.log('Profile - Trying old endpoint:', `${API_BASE_URL}/me`);
        response = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include'
        });
        
        console.log('Profile - Old endpoint response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile - Old endpoint user data:', data);
          const userData = data.user || data || null;
          setCurrentUser(userData);
          if (userData && userData.username) {
            navigate(`/feed/profile/${userData.username}`, { replace: true })
          }
        } else {
          console.log('Profile - Both endpoints failed');
          const errorText = await response.text();
          console.log('Profile - Error response:', errorText);
          setCurrentUser(null);
        }
      } catch (error) {
        console.log('Profile - Error fetching current user:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
              <p className="text-muted-foreground mb-4">If you are already logged in, try refreshing the page.</p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
                <Button variant="outline" onClick={() => window.location.reload()}>Refresh Page</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // If we got here with a currentUser, we likely already navigated above.
  return null;
};

export default Profile;
