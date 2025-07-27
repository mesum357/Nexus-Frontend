import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, MapPin, Hash, Image, Video, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'

const cities = [
  "Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Rawalpindi", "Gujranwala", "Sialkot"
]

const currentUser = {
  name: "You",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
}

export default function CreatePost() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [content, setContent] = useState('')
  const [city, setCity] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [location, setLocation] = useState('')
  const [media, setMedia] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please write something to post",
        variant: "destructive"
      })
      return
    }

    if (!city) {
      toast({
        title: "Missing city",
        description: "Please select your city",
        variant: "destructive"
      })
      return
    }

    const postData = {
      content,
      city,
      hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
      location,
      media,
      timestamp: new Date().toISOString()
    }

    toast({
      title: "Post created successfully!",
      description: "Your post is now live in the feed"
    })

    console.log('Post data:', postData)
    navigate('/feed')
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
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
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
                      <Label>City *</Label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(cityOption => (
                            <SelectItem key={cityOption} value={cityOption}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {cityOption}
                              </div>
                            </SelectItem>
                          ))}
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
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-hover"
                    >
                      Post
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
