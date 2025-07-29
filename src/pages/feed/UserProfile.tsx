import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Link as LinkIcon, Users, MessageCircle, Settings, Camera, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/Navbar'
import PostCard from '@/components/feed/PostCard'
import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface UserData {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  profileImage?: string;
  city?: string;
  bio?: string;
  website?: string;
  verified?: boolean;
  followers?: string[];
  following?: string[];
  createdAt?: string;
}

interface Post {
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
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  
  // Edit profile state
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    bio: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current user
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user || null);
        if (data.user && data.user.username === username) {
          setIsOwnProfile(true);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [username]);

  // Fetch user data by username
  useEffect(() => {
    if (!username) return;
    
    setLoading(true);
    fetch(`${API_BASE_URL}/api/feed/user/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData(data.user);
        } else {
          // If user not found, create mock data for now
          setUserData({
            _id: 'mock-id',
            username: username,
            fullName: username.charAt(0).toUpperCase() + username.slice(1),
            email: `${username}@example.com`,
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            city: "Pakistan",
            bio: "User profile",
            verified: false,
            followers: [],
            following: []
          });
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock data
        setUserData({
          _id: 'mock-id',
          username: username,
          fullName: username.charAt(0).toUpperCase() + username.slice(1),
          email: `${username}@example.com`,
          profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          city: "Pakistan",
          bio: "User profile",
          verified: false,
          followers: [],
          following: []
        });
        setLoading(false);
      });
  }, [username]);

  // Handle edit profile dialog open
  const handleEditProfile = () => {
    if (userData) {
      setEditForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        city: userData.city || '',
        bio: userData.bio || '',
        website: userData.website || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setNewProfileImage(null);
      setProfileImagePreview(null);
      setShowEditDialog(true);
    }
  };

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (validatePasswordChange()) {
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('fullName', editForm.fullName);
      formData.append('email', editForm.email);
      formData.append('mobile', editForm.mobile);
      formData.append('city', editForm.city);
      formData.append('bio', editForm.bio);
      formData.append('website', editForm.website);
      
      if (editForm.currentPassword) {
        formData.append('currentPassword', editForm.currentPassword);
      }
      if (editForm.newPassword) {
        formData.append('newPassword', editForm.newPassword);
      }
      if (newProfileImage) {
        formData.append('profileImage', newProfileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/feed/profile/update`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully!' });
        setShowEditDialog(false);
        // Refresh user data
        window.location.reload();
      } else {
        toast({ title: 'Update Failed', description: data.error || 'Failed to update profile', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Network Error', description: 'Could not connect to server', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Validate password change
  const validatePasswordChange = () => {
    if (editForm.newPassword && !editForm.currentPassword) {
      return "Current password is required to change password";
    }
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      return "New password must be at least 6 characters";
    }
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      return "New passwords do not match";
    }
    return null;
  };

  // Fetch user posts
  useEffect(() => {
    if (!username) return;
    
    fetch(`${API_BASE_URL}/api/feed/posts`)
      .then(res => res.json())
      .then(data => {
        // Filter posts by the current user
        const userPosts = (data.posts || []).filter((post: Post) => 
          post.user && post.user.username === username
        );
        setPosts(userPosts);
      })
      .catch(() => {
        setPosts([]);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="text-center py-8">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">User not found</h2>
              <Button onClick={() => navigate('/feed')}>Back to Feed</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                src={userData.profileImage 
                  ? getProfileImageUrl(userData.profileImage)
                  : undefined
                }
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
                          <AvatarImage 
                            src={userData.profileImage 
                              ? getProfileImageUrl(userData.profileImage)
                              : undefined
                            } 
                          />
                          <AvatarFallback className="text-2xl">{userData.fullName?.[0] || userData.username[0]}</AvatarFallback>
                        </Avatar>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                {userData.fullName || userData.username}
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
                              {userData.city && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{userData.city}</span>
                                </div>
                              )}
                              {userData.mobile && (
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{userData.mobile}</span>
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
                                <span>Joined {new Date(userData.createdAt || '').toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4 md:mt-0">
                            {isOwnProfile ? (
                              <Button variant="outline" onClick={handleEditProfile}>
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
                            <p className="text-xl font-bold text-foreground">{userData.followers?.length || 0}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-foreground">{userData.following?.length || 0}</p>
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
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <PostCard key={post._id} post={post} index={index} currentUser={currentUser} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No posts yet</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="media" className="mt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No media posts yet</p>
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

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="space-y-4">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={profileImagePreview || (userData?.profileImage 
                      ? getProfileImageUrl(userData.profileImage)
                      : undefined)
                    } 
                  />
                  <AvatarFallback className="text-lg">
                    {userData?.fullName?.[0] || userData?.username?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter your mobile number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editForm.website}
                  onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Password Change Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={editForm.currentPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {validatePasswordChange() && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {validatePasswordChange()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdating || !!validatePasswordChange()}
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
