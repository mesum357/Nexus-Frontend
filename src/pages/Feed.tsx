import React from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Camera, Video, Newspaper, Search, Home, Plus, User, Bell, MessageSquare, Filter, MapPin, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/feed/PostCard'
import CreatePost from '@/components/feed/CreatePost'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'

interface PostType {
  _id: string;
  user: {
    _id: string;
    username: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
  content: string;
  image?: string;
  city?: string;
  location?: string;
  hashtags?: string[];
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserType {
  _id: string;
  username: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
  city?: string;
  fullName?: string;
  bio?: string;
}

interface SuggestedUser {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
  city?: string;
  followerCount?: number;
}

const cities = [
  'All Cities', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Sheikhupura', 'Mardan', 'Gujrat', 'Kasur', 'Dera Ghazi Khan',
  'Sahiwal', 'Nawabshah', 'Mingora', 'Burewala', 'Jhelum',
  'Kamoke', 'Hafizabad', 'Khanewal', 'Vehari', 'Dera Ismail Khan',
  'Nowshera', 'Charsadda', 'Jhang', 'Mandi Bahauddin', 'Ahmadpur East',
  'Kamalia', 'Gojra', 'Mansehra', 'Kabirwala', 'Okara', 'Gilgit',
  'Mirpur Khas', 'Rahim Yar Khan', 'Leiah', 'Muzaffargarh', 'Khanpur',
  'Jampur', 'Dadu', 'Khairpur', 'Pakpattan', 'Bahawalnagar',
  'Tando Adam', 'Tando Allahyar', 'Mirpur Mathelo', 'Shikarpur', 'Jacobabad',
  'Ghotki', 'Mehar', 'Tando Muhammad Khan', 'Dera Allahyar', 'Shahdadkot',
  'Matiari', 'Gambat', 'Nasirabad', 'Mehrabpur', 'Rohri', 'Pano Aqil',
  'Sakrand', 'Umerkot', 'Chhor', 'Kunri', 'Pithoro', 'Samaro',
  'Goth Garelo', 'Ranipur', 'Dokri', 'Lakhi', 'Dingro', 'Kandhkot',
  'Kashmore', 'Ubauro', 'Sadiqabad', 'Liaquatpur', 'Uch Sharif',
  'Alipur', 'Jatoi', 'Taunsa', 'Kot Addu', 'Layyah', 'Chobara',
  'Kot Sultan', 'Bhakkar', 'Darya Khan', 'Kallur Kot', 'Mankera',
  'Dullewala', 'Daud Khel', 'Pindi Gheb', 'Fateh Jang', 'Gujar Khan',
  'Kallar Syedan', 'Taxila', 'Wah Cantonment', 'Murree', 'Kahuta',
  'Kotli Sattian', 'Chakwal', 'Attock', 'Abbottabad', 'Haripur',
  'Batagram', 'Shangla', 'Swat', 'Buner', 'Malakand',
  'Dir', 'Chitral', 'Kohistan', 'Torghar', 'Bannu', 'Tank',
  'Kohat', 'Hangu', 'Karak', 'Lakki Marwat', 'Dera Ismail Khan'
]

const sidebarMenuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Explore' },
  { icon: Users, label: 'Followers' },
  { icon: Bell, label: 'Notifications' },
  { icon: MessageSquare, label: 'Messages', badge: 2 },
  { icon: User, label: 'Profile' }
]

const trendingTopics = [
  "#PakistanOnline",
  "#SmallBusiness",
  "#Education",
  "#TechStartups",
  "#Karachi",
  "#Lahore"
]

export default function Feed() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllCities, setShowAllCities] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonMessage, setComingSoonMessage] = useState('')
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [currentSuggestionsIndex, setCurrentSuggestionsIndex] = useState(0)
  const [allSuggestedUsers, setAllSuggestedUsers] = useState<SuggestedUser[]>([])
  const [lastSuggestionsFetch, setLastSuggestionsFetch] = useState<number>(0)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string | null>(null)

  const fetchTrendingHashtags = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/feed/trending-hashtags`);
      if (response.ok) {
        const data = await response.json();
        setTrendingHashtags(data.hashtags || trendingTopics);
      } else {
        setTrendingHashtags(trendingTopics);
      }
    } catch (error) {
      console.error('Error fetching trending hashtags:', error);
      setTrendingHashtags(trendingTopics);
    }
  }, []);

  const fetchPosts = useCallback(() => {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/feed/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || [])
        setLoading(false)
        // Refresh trending hashtags after fetching posts
        fetchTrendingHashtags()
      })
      .catch(() => setLoading(false))
  }, [fetchTrendingHashtags])

  const fetchSuggestedUsers = useCallback(async () => {
    if (!currentUser) return;
    
    const now = Date.now();
    const fiveHoursInMs = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    
    // Check if we need to refresh (5 hours have passed or no previous fetch)
    if (lastSuggestionsFetch > 0 && (now - lastSuggestionsFetch) < fiveHoursInMs) {
      // If we have cached suggestions and 5 hours haven't passed, just use them
      return;
    }
    
    try {
      setLoadingSuggestions(true);
      console.log('Fetching suggested users from:', `${API_BASE_URL}/api/follow/suggestions`);
      
      const response = await fetch(`${API_BASE_URL}/api/follow/suggestions`, {
        credentials: 'include'
      });
      
      console.log('Suggested users response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Suggested users data:', data);
        const allUsers = data.suggestions || [];
        setAllSuggestedUsers(allUsers);
        
        // Get first 2 suggestions
        const firstTwo = allUsers.slice(0, 2);
        setSuggestedUsers(firstTwo);
        setCurrentSuggestionsIndex(0);
        
        // Update the last fetch timestamp
        setLastSuggestionsFetch(now);
        
        console.log('Set suggested users:', firstTwo);
      } else {
        console.error('Failed to fetch suggested users, status:', response.status);
        // Fallback to mock data for testing
        const mockUsers = [
          {
            _id: 'mock1',
            username: 'john_doe',
            fullName: 'John Doe',
            profileImage: '',
            city: 'Lahore',
            followerCount: 150
          },
          {
            _id: 'mock2',
            username: 'jane_smith',
            fullName: 'Jane Smith',
            profileImage: '',
            city: 'Karachi',
            followerCount: 89
          }
        ];
        setSuggestedUsers(mockUsers);
        setAllSuggestedUsers(mockUsers);
        console.log('Using mock suggested users:', mockUsers);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      // Fallback to mock data for testing
      const mockUsers = [
        {
          _id: 'mock1',
          username: 'john_doe',
          fullName: 'John Doe',
          profileImage: '',
          city: 'Lahore',
          followerCount: 150
        },
        {
          _id: 'mock2',
          username: 'jane_smith',
          fullName: 'Jane Smith',
          profileImage: '',
          city: 'Karachi',
          followerCount: 89
        }
      ];
      setSuggestedUsers(mockUsers);
      setAllSuggestedUsers(mockUsers);
      console.log('Using mock suggested users due to error:', mockUsers);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [currentUser, lastSuggestionsFetch]);

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/follow/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh suggested users
        fetchSuggestedUsers();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const rotateSuggestions = useCallback(() => {
    if (allSuggestedUsers.length <= 2) return;
    
    setCurrentSuggestionsIndex(prevIndex => {
      const nextIndex = (prevIndex + 2) % allSuggestedUsers.length;
      const newSuggestions = allSuggestedUsers.slice(nextIndex, nextIndex + 2);
      setSuggestedUsers(newSuggestions);
      return nextIndex;
    });
  }, [allSuggestedUsers]);

  const refreshSuggestions = useCallback(() => {
    // Force refresh by resetting the timestamp
    setLastSuggestionsFetch(0);
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  const getTimeUntilRefresh = useCallback(() => {
    if (lastSuggestionsFetch === 0) return null;
    
    const now = Date.now();
    const fiveHoursInMs = 5 * 60 * 60 * 1000;
    const timeElapsed = now - lastSuggestionsFetch;
    const timeRemaining = fiveHoursInMs - timeElapsed;
    
    if (timeRemaining <= 0) return null;
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  }, [lastSuggestionsFetch]);

  const handleHashtagClick = (hashtag: string) => {
    setSearchTerm(hashtag);
    // Filter posts to show only those containing the hashtag
    const hashtagWithoutHash = hashtag.replace(/^#/, '');
    const postsWithHashtag = posts.filter(post => {
      // Check if hashtag is in post content
      const contentHasHashtag = post.content && post.content.toLowerCase().includes(hashtag.toLowerCase());
      // Check if hashtag is in post hashtags array
      const hashtagsHasHashtag = post.hashtags && post.hashtags.some(tag => 
        tag.toLowerCase().includes(hashtagWithoutHash.toLowerCase())
      );
      return contentHasHashtag || hashtagsHasHashtag;
    });
    // You can implement a more sophisticated filtering system here
  };

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Handle refresh parameter from CreatePost
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('refresh') === 'true') {
      // Clear the refresh parameter
      navigate(location.pathname, { replace: true });
      // Refresh trending hashtags
      fetchTrendingHashtags();
    }
  }, [location.search, navigate, location.pathname, fetchTrendingHashtags]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Current user data received:', data);
          setCurrentUser(data.user || data || null);
        } else {
          console.log('User not authenticated, response status:', response.status);
          setCurrentUser(null);
        }
      } catch (error) {
        console.log('Error fetching current user:', error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [])

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(() => {
    fetch(`${API_BASE_URL}/api/feed/notifications`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const count = (data.notifications || []).filter(n => !n.isRead).length
        setUnreadCount(count)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Check every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount])

  useEffect(() => {
    fetchTrendingHashtags()
    console.log('Feed useEffect - currentUser:', currentUser);
    if (currentUser) {
      console.log('Calling fetchSuggestedUsers with currentUser:', currentUser.username);
      fetchSuggestedUsers()
    } else {
      console.log('No currentUser, skipping fetchSuggestedUsers');
    }
  }, [fetchTrendingHashtags, fetchSuggestedUsers, currentUser])

  useEffect(() => {
    const interval = setInterval(rotateSuggestions, 10000) // Rotate every 10 seconds
    return () => clearInterval(interval);
  }, [rotateSuggestions])

  useEffect(() => {
    const updateTimeDisplay = () => {
      const timeUntil = getTimeUntilRefresh();
      setTimeUntilRefresh(timeUntil);
    };

    updateTimeDisplay();
    const interval = setInterval(updateTimeDisplay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [getTimeUntilRefresh])

  // Filter cities based on search
  const filteredCities = cities.filter(cityName =>
    cityName.toLowerCase().includes(citySearch.toLowerCase())
  )

  const filteredPosts = posts.filter(post => {
    // Filter by city - check both post.city and user.city for backward compatibility
    const matchesCity = selectedCity === 'All Cities' || showAllCities || 
                       (post.city === selectedCity) || 
                       (post.user && post.user.city === selectedCity)
    
    const matchesSearch = (post.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCity && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {sidebarMenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      if (item.label === 'Home') navigate('/feed')
                      if (item.label === 'Explore') {
                        setComingSoonMessage('Explore feature is coming soon! Discover trending topics, hashtags, and popular posts from across Pakistan.')
                        setShowComingSoon(true)
                      }
                      if (item.label === 'Followers') navigate('/feed/followers')
                      if (item.label === 'Notifications') navigate('/feed/notifications')
                      if (item.label === 'Messages') {
                        setComingSoonMessage('Messages feature is coming soon! Connect with other users through private messaging.')
                        setShowComingSoon(true)
                      }
                      if (item.label === 'Profile') {
                        console.log('Mobile Profile clicked, currentUser:', currentUser);
                        if (currentUser && currentUser.username) {
                          console.log('Mobile Navigating to:', `/feed/profile/${currentUser.username}`);
                          navigate(`/feed/profile/${currentUser.username}`);
                        } else {
                          console.log('Mobile No currentUser or username, navigating to /feed/profile');
                          navigate('/feed/profile');
                        }
                        // 
                      }
                      if (item.label === 'Create Post') navigate('/feed/create')
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.label === 'Notifications' && unreadCount > 0 && (
                      <Badge className="ml-auto bg-primary text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                    {item.badge && item.label !== 'Notifications' && (
                      <Badge className="ml-auto bg-primary text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Sidebar Navigation */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block lg:col-span-1 space-y-6"
            >
              {/* HELLLO */}
              {/* Navigation Menu */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Menu</h3>
                  
                  <div className="space-y-2">
                    {sidebarMenuItems.map((item, index) => (
                      <Button
                        key={index}
                        variant={item.active ? "default" : "ghost"}
                        className="w-full justify-start gap-3 relative"
                        onClick={() => {
                          if (item.label === 'Home') navigate('/feed')
                          if (item.label === 'Explore') {
                            setComingSoonMessage('Explore feature is coming soon! Discover trending topics, hashtags, and popular posts from across Pakistan.')
                            setShowComingSoon(true)
                          }
                          if (item.label === 'Followers') navigate('/feed/followers')
                          if (item.label === 'Notifications') navigate('/feed/notifications')
                          if (item.label === 'Messages') {
                            setComingSoonMessage('Messages feature is coming soon! Connect with other users through private messaging.')
                            setShowComingSoon(true)
                          }
                          if (item.label === 'Profile') {
                            console.log('Profile clicked, currentUser:', currentUser);
                            if (currentUser && currentUser.username) {
                              console.log('Navigating to:', `/feed/profile/${currentUser.username}`);
                              navigate(`/feed/profile/${currentUser.username}`);
                            } else {
                              console.log('No currentUser or username, navigating to /feed/profile');
                              navigate('/feed/profile');
                            }
                          }
                          if (item.label === 'Create Post') navigate('/feed/create')
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        {item.label === 'Notifications' && unreadCount > 0 && (
                          <Badge className="ml-auto bg-primary text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                        {item.badge && item.label !== 'Notifications' && (
                          <Badge className="ml-auto bg-primary text-white text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Profile Section */}
              {currentUser && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-4">Your Profile</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={getProfileImageUrl(currentUser.profileImage)} 
                        />
                        <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {currentUser.fullName || currentUser.username}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          @{currentUser.username}
                        </p>
                        {currentUser.city && (
                          <p className="text-xs text-muted-foreground truncate">
                            📍 {currentUser.city}
                          </p>
                        )}
                        {currentUser.mobile && (
                          <p className="text-xs text-muted-foreground truncate">
                            📱 {currentUser.mobile}
                          </p>
                        )}
                      </div>
                    </div>
                    {currentUser.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {currentUser.bio}
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/feed/profile/${currentUser.username}`)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
              {/* City Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    City Filter
                  </h3>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    onOpenChange={(open) => {
                      if (!open) {
                        setCitySearch('')
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Search Input */}
                      <div className="flex items-center px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                          placeholder="Search cities..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      {/* City Options */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCities.map(city => (
                          <SelectItem key={city} value={city}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {city}
                            </div>
                          </SelectItem>
                        ))}
                        {filteredCities.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            No cities found
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox 
                      id="all-cities" 
                      checked={showAllCities}
                      onCheckedChange={(checked) => setShowAllCities(checked === true)}
                    />
                    <label htmlFor="all-cities" className="text-sm text-muted-foreground">
                      Show posts from all cities
                    </label>
                  </div>
                </CardContent>
              </Card>
              {/* Trending Section */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingHashtags.slice(0, 6).map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 text-xs"
                        onClick={() => handleHashtagClick(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Main Feed */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-3"
            >
              {/* Feed Header with Search */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Pakistan Community Feed</h1>
                    <p className="text-muted-foreground">
                      {selectedCity !== 'All Cities' && !showAllCities 
                        ? `Posts from ${selectedCity}` 
                        : 'Posts from all cities across Pakistan'}
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      if (!currentUser) {
                        navigate('/login')
                      } else {
                        navigate('/feed/create')
                      }
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>

                {/* Mobile Trending & Suggested Users */}
                <div className="lg:hidden mt-4">
                  <Card>
                    <CardContent className="p-4">
                      {/* Mobile Trending Section */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Trending
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {trendingHashtags.slice(0, 4).map((topic, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/10 text-xs"
                              onClick={() => handleHashtagClick(topic)}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>


                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Search Bar */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search posts by city, hashtag, or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* CreatePost Quick Access */}
              <CreatePost currentUser={currentUser} />
              {/* Posts Feed */}
              <div className="space-y-6">
                {loading ? (
                  <Card><CardContent className="p-8 text-center">Loading...</CardContent></Card>
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <PostCard key={post._id} post={post} index={index} currentUser={currentUser} onPostDeleted={fetchPosts} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or city filter to see more posts.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🚀 Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              {comingSoonMessage}
            </p>
            <Button onClick={() => setShowComingSoon(false)} className="w-full">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
