import { motion } from 'framer-motion'
import { ArrowLeft, Users, UserPlus, UserMinus, UserCheck, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl, cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface User {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
  city?: string;
  followerCount?: number;
}

const Followers = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch current user
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  // Fetch followers data
  const fetchFollowersData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Fetch followers
      try {
        const followersResponse = await fetch(`${API_BASE_URL}/api/follow/followers/${currentUser._id}`, {
          credentials: 'include'
        });
        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowers(followersData.followers || []);
        } else {
          console.error('Failed to fetch followers:', followersResponse.status);
          setFollowers([]);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
        setFollowers([]);
      }
      
      // Fetch following
      try {
        const followingResponse = await fetch(`${API_BASE_URL}/api/follow/following/${currentUser._id}`, {
          credentials: 'include'
        });
        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowing(followingData.following || []);
        } else {
          console.error('Failed to fetch following:', followingResponse.status);
          setFollowing([]);
        }
      } catch (error) {
        console.error('Error fetching following:', error);
        setFollowing([]);
      }
      
      // Fetch suggestions
      try {
        const suggestionsResponse = await fetch(`${API_BASE_URL}/api/follow/suggestions`, {
          credentials: 'include'
        });
        if (suggestionsResponse.ok) {
          const suggestionsData = await suggestionsResponse.json();
          setSuggestions(suggestionsData.suggestions || []);
        } else {
          console.error('Failed to fetch suggestions:', suggestionsResponse.status);
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
      
    } catch (error) {
      console.error('Error fetching followers data:', error);
      toast({
        title: "Error",
        description: "Failed to load some followers data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchFollowersData();
    }
  }, [currentUser]);

  // Follow a user
  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/follow/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to follow user');
      }
      
      toast({
        title: "Success",
        description: "Successfully followed user"
      });
      
      // Refresh data
      fetchFollowersData();
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive"
      });
    }
  };

  // Unfollow a user
  const handleUnfollow = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/follow/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unfollow user');
      }
      
      toast({
        title: "Success",
        description: "Successfully unfollowed user"
      });
      
      // Refresh data
      fetchFollowersData();
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive"
      });
    }
  };

  // Check if current user is following a specific user
  const checkFollowStatus = async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/follow/check/${userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data.isFollowing;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  const renderUserCard = (user: User, showFollowButton = true, isFollowing = false) => (
    <Card key={user._id} className="p-3 sm:p-4 hover:shadow-soft transition-all duration-200">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
          <AvatarImage src={getProfileImageUrl(user.profileImage)} alt={user.fullName || user.username} />
          <AvatarFallback>{user.fullName?.[0] || user.username[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base">{user.fullName || user.username}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
          {user.city && (
            <p className="text-xs text-muted-foreground">{user.city}</p>
          )}
        </div>
        
        {showFollowButton && (
          <div className="flex gap-1 sm:gap-2">
            {isFollowing ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleUnfollow(user._id)}
                className="text-xs px-2 sm:px-3"
              >
                <UserMinus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Unfollow</span>
                <span className="sm:hidden">Unfollow</span>
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="default" 
                className="bg-gradient-social text-xs px-2 sm:px-3"
                onClick={() => handleFollow(user._id)}
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Follow</span>
                <span className="sm:hidden">Follow</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  const filteredFollowers = followers.filter(user =>
    (user.fullName || user.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowing = following.filter(user =>
    (user.fullName || user.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(user =>
    (user.fullName || user.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 animate-fade-in">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/feed")}
            className="mb-4 -ml-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
          
          {/* Header */}
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Followers</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "followers", label: "Followers", count: followers.length, icon: Users },
            { id: "following", label: "Following", count: following.length, icon: Users },
            { id: "suggestions", label: "Suggestions", count: suggestions.length, icon: UserPlus },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap text-xs px-2 sm:px-3 flex-shrink-0",
                activeTab === tab.id && "bg-gradient-social"
              )}
              title={tab.label}
            >
              <tab.icon className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">{tab.label}</span>
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
        {activeTab === "followers" && (
          <>
            {filteredFollowers.map((user) => renderUserCard(user, false))}
            {filteredFollowers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No followers yet</p>
              </div>
            )}
          </>
        )}

        {activeTab === "following" && (
          <>
            {filteredFollowing.map((user) => renderUserCard(user, true, true))}
            {filteredFollowing.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Not following anyone yet</p>
              </div>
            )}
          </>
        )}

        {activeTab === "suggestions" && (
          <>
            {filteredSuggestions.map((user) => renderUserCard(user, true, false))}
            {filteredSuggestions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No suggestions available</p>
              </div>
            )}
          </>
        )}
        </div>
      )}
    </div>
    </>
  );
};

export default Followers; 