import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Link as LinkIcon, Users, MessageCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/feed/PostCard'

// Mock data - in real app, fetch based on username
const userData = {
  name: "Ahmad Hassan",
  username: "ahmadhassan",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  coverPhoto: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop",
  bio: "Entrepreneur & Tech Enthusiast | Building the future of e-commerce in Pakistan 🇵🇰 | Founder @PakistanOnline",
  location: "Lahore, Pakistan",
  joinDate: "Joined March 2020",
  website: "www.pakistanonline.pk",
  verified: true,
  followers: 1250,
  following: 890,
  posts: 156
}

const userPosts = [
  {
    id: 1,
    user: {
      name: "Ahmad Hassan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      verified: true,
      city: "Lahore"
    },
    timestamp: "2 hours ago",
    location: "DHA Phase 5, Lahore",
    content: "Just launched my new online store on Pakistan Online! 🎉 Excited to serve customers across the country.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    likes: 23,
    comments: 8,
    shares: 3,
    reactions: { heart: 15, laugh: 5, wow: 3 },
    type: "post" as const
  },
  {
    id: 2,
    user: {
      name: "Ahmad Hassan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      verified: true,
      city: "Lahore"
    },
    timestamp: "1 day ago",
    location: "DHA Phase 5, Lahore",
    content: "Amazing sunset view from my office today. Pakistan is truly beautiful! 🌅",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    likes: 45,
    comments: 12,
    shares: 5,
    reactions: { heart: 30, laugh: 8, wow: 7 },
    type: "post" as const
  }
]

const userMedia = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop"
]

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const isOwnProfile = username === 'ahmadhassan' // In real app, check against current user

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/feed')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </motion.div>
        </div>

        {/* Cover Photo & Profile */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-64 md:h-80 bg-gradient-to-r from-primary to-secondary">
              <img
                src={userData.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Profile Info Overlay */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-16 md:-mt-20">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                          <AvatarImage src={userData.avatar} />
                          <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                {userData.name}
                              </h1>
                              {userData.verified && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white rounded-full" />
                                </div>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">@{userData.username}</p>
                            
                            {userData.bio && (
                              <p className="text-foreground mb-4 max-w-2xl">{userData.bio}</p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {userData.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{userData.location}</span>
                                </div>
                              )}
                              {userData.website && (
                                <div className="flex items-center gap-1">
                                  <LinkIcon className="h-4 w-4" />
                                  <span className="text-primary">{userData.website}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{userData.joinDate}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4 md:mt-0">
                            {isOwnProfile ? (
                              <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Profile
                              </Button>
                            ) : (
                              <>
                                <Button>
                                  <Users className="h-4 w-4 mr-2" />
                                  Follow
                                </Button>
                                <Button variant="outline">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{userData.posts}</p>
                            <p className="text-sm text-muted-foreground">Posts</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{userData.followers.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{userData.following}</p>
                            <p className="text-sm text-muted-foreground">Following</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-6 mt-6">
                {userPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </TabsContent>
              
              <TabsContent value="media" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userMedia.map((media, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={media}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="likes" className="mt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Liked posts will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
