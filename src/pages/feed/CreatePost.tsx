import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, MapPin, Hash, Image, Video, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'

const cities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
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

interface User {
  _id: string;
  username: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
  city?: string;
}

export default function CreatePost() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [city, setCity] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [location, setLocation] = useState('')
  const [media, setMedia] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [citySearch, setCitySearch] = useState('')

  // Fetch current user
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
          setCurrentUser(data.user || data || null);
        } else {
          console.log('User not authenticated, redirecting to login');
          navigate('/login');
          return;
        }
      } catch (error) {
        console.log('Error fetching current user:', error);
        navigate('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (media.length + files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload maximum 5 files",
        variant: "destructive"
      })
      return
    }

    const newMedia = [...media, ...files]
    const newPreviews = [...mediaPreviews]

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        setMediaPreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    })

    setMedia(newMedia)
  }

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Filter cities based on search
  const filteredCities = cities.filter(cityName =>
    cityName.toLowerCase().includes(citySearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive"
      })
      return
    }
    
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please write something to post",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('content', content)
      
      // Add city if selected
      if (city) {
        formData.append('city', city)
      }
      
      // Add location if provided
      if (location) {
        formData.append('location', location)
      }
      
      // Add hashtags if provided
      if (hashtags) {
        formData.append('hashtags', hashtags)
      }
      
      // Add image if uploaded
      if (media.length > 0) {
        formData.append('image', media[0]) // Backend currently supports single image
      }
      
      const response = await fetch(`${API_BASE_URL}/api/feed/post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }
      
      const data = await response.json()
      
      toast({
        title: "Post created successfully!",
        description: "Your post is now live in the feed"
      })
      
      // Reset form
      setContent('')
      setCity('')
      setHashtags('')
      setLocation('')
      setMedia([])
      setMediaPreviews([])
      
      // Navigate to feed with a refresh parameter to trigger trending hashtags update
      navigate('/feed?refresh=true')
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

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
              <h2 className="text-xl font-semibold mb-4">Please log in to create a post</h2>
              <Button onClick={() => navigate('/login')}>Go to Login</Button>
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Create New Post
              </h1>
              <p className="text-xl text-muted-foreground">
                Share what's on your mind with your community
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getProfileImageUrl(currentUser.profileImage)} />
                    <AvatarFallback>{currentUser.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  Create a Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Main Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">What's on your mind? *</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, experiences, or updates..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={5}
                      className="resize-none"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      {content.length}/1000 characters
                    </p>
                  </div>

                  {/* City & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>City (Optional)</Label>
                                             <Select 
                         value={city} 
                         onValueChange={setCity}
                         onOpenChange={(open) => {
                           if (!open) {
                             setCitySearch('')
                           }
                         }}
                       >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
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
                            {filteredCities.map(cityOption => (
                              <SelectItem key={cityOption} value={cityOption}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {cityOption}
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location (Optional)</Label>
                      <Input
                        id="location"
                        placeholder="e.g., DHA Phase 5, Gulberg"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags (Optional)</Label>
                    <Input
                      id="hashtags"
                      placeholder="#pakistan #business #technology"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Separate hashtags with spaces. Each hashtag should start with #
                    </p>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-4">
                    <Label>Add Photos or Videos (Optional)</Label>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleMediaUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <Image className="h-8 w-8 text-muted-foreground" />
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          Click to upload photos or videos
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG, MP4 up to 50MB each (Max 5 files)
                        </p>
                      </label>
                    </div>

                    {/* Media Previews */}
                    {mediaPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            {media[index]?.type.startsWith('video/') ? (
                              <video
                                src={preview}
                                className="w-full h-24 object-cover rounded-lg"
                                controls={false}
                              />
                            ) : (
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMedia(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/feed')}
                      className="flex-1"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-hover"
                      disabled={submitting}
                    >
                      {submitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
