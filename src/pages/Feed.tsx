import { motion } from 'framer-motion'
import { Users, TrendingUp, Camera, Video, Newspaper, Search, Home, Plus, User, Bell, MessageSquare, Filter, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/feed/PostCard'
import CreatePost from '@/components/feed/CreatePost'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/config'
import { Textarea } from '@/components/ui/textarea'

interface PostType {
  _id: string;
  user: {
    _id: string;
    username: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserType {
  _id: string;
  username: string;
  email?: string;
  profileImage?: string;
  city?: string;
}

const cities = ['All Cities', 'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan', 'Peshawar', 'Quetta']

const sidebarMenuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Explore' },
  { icon: Users, label: 'Friends' },
  { icon: Bell, label: 'Notifications', badge: 3 },
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

const suggestedUsers = [
  {
    name: "Tech Pakistan",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
    followers: "12.5K"
  },
  {
    name: "Business Hub",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face",
    followers: "8.2K"
  },
  {
    name: "Education PK",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face",
    followers: "15.1K"
  }
]

export default function Feed() {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllCities, setShowAllCities] = useState(false)
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [quickPostContent, setQuickPostContent] = useState('')
  const [quickPostImage, setQuickPostImage] = useState<string | null>(null)
  const [quickPostFile, setQuickPostFile] = useState<File | null>(null)
  const [quickPostLoading, setQuickPostLoading] = useState(false)
  const [quickPostError, setQuickPostError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchPosts = useCallback(() => {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/feed/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUser(data.user || null))
      .catch(() => setCurrentUser(null))
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
  }, [fetchUnreadCount])

  const handleQuickImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setQuickPostFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setQuickPostImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeQuickImage = () => {
    setQuickPostImage(null)
    setQuickPostFile(null)
  }

  const handleQuickPost = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    setQuickPostLoading(true)
    setQuickPostError(null)
    try {
      const formData = new FormData()
      formData.append('content', quickPostContent)
      if (quickPostFile) {
        formData.append('image', quickPostFile)
      }
      const res = await fetch(`${API_BASE_URL}/api/feed/post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create post')
      setQuickPostContent('')
      setQuickPostImage(null)
      setQuickPostFile(null)
      fetchPosts()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setQuickPostError(err.message)
      } else {
        setQuickPostError('Failed to create post')
      }
    } finally {
      setQuickPostLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesCity = selectedCity === 'All Cities' || showAllCities || (post.user && post.user.city === selectedCity)
    const matchesSearch = (post.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.user?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCity && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Navigation Menu */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-4">Menu</h3>
                  <div className="space-y-2">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <Link to="/feed/notifications">
                        <Button variant="ghost" size="icon" className="relative">
                          <Bell className="w-6 h-6" />
                          {/* Optionally, show a badge for unread count */}
                          <span className="absolute top-0 right-0 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">{unreadCount}</span>
                        </Button>
                      </Link>
                    </div>
                    {sidebarMenuItems.map((item, index) => (
                      <Button
                        key={index}
                        variant={item.active ? "default" : "ghost"}
                        className="w-full justify-start gap-3 relative"
                        onClick={() => {
                          if (item.label === 'Home') navigate('/feed')
                          if (item.label === 'Friends') navigate('/feed/friends')
                          if (item.label === 'Notifications') navigate('/feed/notifications')
                          if (item.label === 'Profile') navigate('/feed/profile')
                          if (item.label === 'Create Post') navigate('/feed/create')
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        {item.badge && (
                          <Badge className="ml-auto bg-primary text-white text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* City Filter */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    City Filter
                  </h3>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
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
              {/* Trending Hashtags */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </h3>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="w-full justify-start cursor-pointer hover:bg-primary/10"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Suggested Users */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Suggested Users
                  </h3>
                  <div className="space-y-3">
                    {suggestedUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Follow</Button>
                      </div>
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
                {/* Quick Post Input */}
                <Card className="mt-4 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={currentUser?.profileImage} />
                        <AvatarFallback>{currentUser?.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder={currentUser ? "What's on your mind?" : "Login to share your thoughts..."}
                          value={quickPostContent}
                          onChange={e => setQuickPostContent(e.target.value)}
                          onClick={() => {
                            if (!currentUser) {
                              navigate('/login')
                            }
                          }}
                          className="min-h-12 resize-none border-none text-base placeholder:text-base cursor-pointer"
                          readOnly={!currentUser}
                        />
                        {quickPostImage && (
                          <div className="relative mt-2">
                            <img src={quickPostImage} alt="Selected" className="w-full max-h-60 object-cover rounded-lg" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                              onClick={removeQuickImage}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <label htmlFor="quick-image-upload">
                            <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" asChild>
                              <div>
                                <span role="img" aria-label="Add image">🖼️</span>
                              </div>
                            </Button>
                            <input
                              id="quick-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleQuickImageUpload}
                            />
                          </label>
                          <Button
                            size="sm"
                            className="ml-auto"
                            onClick={handleQuickPost}
                            disabled={quickPostLoading || (!quickPostContent.trim() && !quickPostImage)}
                          >
                            {quickPostLoading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                        {quickPostError && <div className="text-red-500 text-sm mt-1">{quickPostError}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* CreatePost Quick Access */}
              <CreatePost onPostCreated={fetchPosts} currentUser={currentUser} />
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
    </div>
  )
}
