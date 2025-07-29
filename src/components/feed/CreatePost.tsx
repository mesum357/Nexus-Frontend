import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Video, Smile, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface CreatePostProps {
  onPostCreated?: () => void;
  currentUser?: {
    _id: string;
    username: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
}

export default function CreatePost({ onPostCreated, currentUser }: CreatePostProps) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImageFile(null)
  }

  const handlePost = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('content', postContent)
      if (imageFile) {
        formData.append('image', imageFile)
      }
      const res = await fetch(`${API_BASE_URL}/api/feed/post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create post')
      setPostContent("")
      setSelectedImage(null)
      setImageFile(null)
      setIsExpanded(false)
      if (onPostCreated) onPostCreated()
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Simple Create Post Trigger */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getProfileImageUrl(currentUser?.profileImage)} />
              <AvatarFallback>{currentUser?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex-1 p-3 bg-muted rounded-full cursor-pointer hover:bg-muted/80 transition-colors">
                  <span className="text-muted-foreground">What's on your mind?</span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getProfileImageUrl(currentUser?.profileImage)} />
                      <AvatarFallback>{currentUser?.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{currentUser?.username || 'Your Name'}</p>
                      <p className="text-sm text-muted-foreground">Public</p>
                    </div>
                  </div>
                  {/* Post Content */}
                  <Textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-32 resize-none border-none text-lg placeholder:text-lg"
                  />
                  {/* Image Preview */}
                  {selectedImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full max-h-96 object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                  {/* Media Options */}
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <span className="text-sm font-medium text-foreground">Add to your post</span>
                    <div className="flex items-center gap-2">
                      <label htmlFor="image-upload">
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" asChild>
                          <div>
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-yellow-600 hover:bg-yellow-50">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {/* Post Button */}
                  <Button 
                    className="w-full" 
                    onClick={handlePost}
                    disabled={isSubmitting || (!postContent.trim() && !selectedImage)}
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </motion.div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
