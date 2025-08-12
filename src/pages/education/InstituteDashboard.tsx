import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  Mail, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  Upload,
  Eye,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Bell as BellIcon,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { RichTextDisplay } from '@/components/ui/rich-text-display'
import { Textarea } from '@/components/ui/textarea'

// Interface for Institute data
interface Institute {
  _id: string;
  name: string;
  location?: string;
  city?: string;
  type?: string;
  logo?: string;
  banner?: string;
  rating?: number;
  verified?: boolean;
  students?: string;
  totalStudents?: string;
  courses?: Course[];
  specialization?: string;
  admissionStatus?: string;
  phone?: string;
  email?: string;
  owner?: string;
  website?: string;
  established?: string;
  establishedYear?: number;
  description?: string;
  gallery?: string[];
  faculty?: FacultyMember[];
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface Course {
  _id?: string;
  name: string;
  description?: string;
  duration?: string;
  fee?: number;
  category?: string;
}

interface FacultyMember {
  _id?: string;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  image?: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
}

export default function InstituteDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [institute, setInstitute] = useState<Institute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const { toast } = useToast()

  // Gallery management states
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  // Faculty management states
  const [showAddFaculty, setShowAddFaculty] = useState(false)
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    position: '',
    qualification: '',
    experience: '',
    image: null as File | null
  })
  const [facultyImagePreview, setFacultyImagePreview] = useState<string | null>(null)
  // Notifications state
  const [notifications, setNotifications] = useState<{ _id?: string; title?: string; message: string; createdAt?: string }[]>([])
  const [newNotification, setNewNotification] = useState({ title: '', message: '' })

  // Messages state
  const [messages, setMessages] = useState<{ _id?: string; senderName: string; message: string; createdAt?: string }[]>([])
  const [newMessage, setNewMessage] = useState({ senderName: '', message: '' })

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

  // Check authentication and ownership
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user)
      })
      .catch(() => {
        // Allow viewing the dashboard without login; only owner actions require auth
        setCurrentUser(null)
      })
  }, [])

  // Fetch institute data
  useEffect(() => {
    if (!id) {
      setError('Institute ID not found')
      setIsLoading(false)
      return
    }
    
    fetch(`${API_BASE_URL}/api/institute/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Institute not found')
        }
        return res.json()
      })
      .then(data => {
        if (data.institute) {
          setInstitute(data.institute)
          setGalleryImages(data.institute.gallery || [])
          setIsLoading(false)
        } else {
          throw new Error('Institute data not found in response')
        }
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })

    // Load notifications
    fetch(`${API_BASE_URL}/api/institute/${id}/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))

    // Load messages
    fetch(`${API_BASE_URL}/api/institute/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => setMessages([]))
  }, [id])

  // Check ownership when both institute and currentUser are available
  useEffect(() => {
    if (institute && currentUser) {
      setIsOwner(String(institute.owner) === String(currentUser._id))
    }
  }, [institute, currentUser])

  // Handle gallery image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Store the input element to reset it later
    const input = e.currentTarget;

    setUploadingImage(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('gallery', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/gallery`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        const added = (data.images as string[]) || (data.imageUrl ? [data.imageUrl] : []);
        setGalleryImages((prev) => [...prev, ...added]);
        toast({
          title: 'Success',
          description: `${added.length || 1} image(s) uploaded to gallery successfully!`,
        });
        // Reset input value so selecting the same files again will trigger change
        if (input) {
          input.value = '';
        }
      } else {
        throw new Error(data.error || 'Failed to upload image(s)');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to upload image(s) to gallery.',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove gallery image
  const removeGalleryImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/gallery`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      })

      if (response.ok) {
        setGalleryImages(prev => prev.filter(img => img !== imageUrl))
        toast({
          title: "Success",
          description: "Image removed from gallery successfully!",
        })
      } else {
        throw new Error('Failed to remove image')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image from gallery.",
        variant: "destructive",
      })
    }
  }

  // Handle faculty image upload
  const handleFacultyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewFaculty(prev => ({ ...prev, image: file }))
      setFacultyImagePreview(URL.createObjectURL(file))
    }
  }

  // Create Notification
  const handleCreateNotification = async () => {
    if (!newNotification.message.trim()) {
      toast({ title: 'Validation', description: 'Notification message is required', variant: 'destructive' })
      return
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/institute/${id}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newNotification)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create notification')
      setNotifications(prev => [data.notification, ...prev])
      setNewNotification({ title: '', message: '' })
      toast({ title: 'Sent', description: 'Notification sent to students.' })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to send notification', variant: 'destructive' })
    }
  }

  // Create Message
  const handleCreateMessage = async () => {
    if (!newMessage.senderName.trim() || !newMessage.message.trim()) {
      toast({ title: 'Validation', description: 'Sender name and message are required', variant: 'destructive' })
      return
    }
    
    console.log('Sending message:', newMessage); // DEBUG
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/institute/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newMessage)
      })
      
      console.log('Message response status:', res.status); // DEBUG
      
      const data = await res.json()
      console.log('Message response data:', data); // DEBUG
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create message')
      }
      
      // Check if data.message exists and has the expected structure
      if (data.message && data.message._id) {
        setMessages(prev => [data.message, ...prev])
        setNewMessage({ senderName: '', message: '' })
        toast({ title: 'Sent', description: 'Message sent to student inbox.' })
      } else {
        console.error('Invalid message response structure:', data);
        throw new Error('Invalid response structure from server')
      }
    } catch (error: any) {
      console.error('Error creating message:', error); // DEBUG
      toast({ title: 'Error', description: error?.message || 'Failed to send message', variant: 'destructive' })
    }
  }

  // Add new faculty member
  const handleAddFaculty = async () => {
    if (!newFaculty.name || !newFaculty.position || !newFaculty.qualification || !newFaculty.experience) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('name', newFaculty.name)
    formData.append('position', newFaculty.position)
    formData.append('qualification', newFaculty.qualification)
    formData.append('experience', newFaculty.experience)
    if (newFaculty.image) {
      formData.append('image', newFaculty.image)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/faculty`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        setInstitute(prev => prev ? {
          ...prev,
          faculty: [...(prev.faculty || []), data.faculty]
        } : null)
        
        // Reset form
        setNewFaculty({
          name: '',
          position: '',
          qualification: '',
          experience: '',
          image: null
        })
        setFacultyImagePreview(null)
        setShowAddFaculty(false)
        
        toast({
          title: "Success",
          description: "Faculty member added successfully!",
        })
      } else {
        throw new Error(data.error || 'Failed to add faculty member')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add faculty member.",
        variant: "destructive",
      })
    }
  }

  // Remove faculty member
  const removeFacultyMember = async (facultyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/faculty/${facultyId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      if (response.ok) {
        setInstitute(prev => prev ? {
          ...prev,
          faculty: prev.faculty?.filter(f => f._id !== facultyId) || []
        } : null)
        
        toast({
          title: "Success",
          description: "Faculty member removed successfully!",
        })
      } else {
        throw new Error(data.error || 'Failed to remove faculty member')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to remove faculty member.",
        variant: "destructive",
      })
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading institute dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !institute) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Institute Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The institute you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/education')}>
              Back to Institutes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 sm:pt-20">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96"
        >
          <img
            src={getImageUrl(institute.banner) || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop"}
            alt={institute.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white hover:bg-white/20 text-xs sm:text-sm"
            onClick={() => navigate('/education')}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Institutes</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Institute Info Overlay */}
          <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
              <img
                src={getImageUrl(institute.logo) || "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=100&h=100&fit=crop&crop=face"}
                alt={`${institute.name} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-4 border-white shadow-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold truncate">{institute.name}</h1>
                  {institute.verified && (
                    <div className="bg-primary text-white rounded-full p-1 flex-shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{institute.city || institute.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-medium">
                      {institute.rating ? institute.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
              {/* About */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      About the Institute
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RichTextDisplay
                      content={institute.description || 'No description available for this institute.'}
                      className="text-muted-foreground leading-relaxed"
                    />
                    
                    {/* Contact Information */}
                    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {institute.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{institute.phone}</span>
                        </div>
                      )}
                      {institute.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{institute.email}</span>
                        </div>
                      )}
                      {institute.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <a href={institute.website} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary hover:underline truncate">
                            {institute.website}
                          </a>
                        </div>
                      )}
                      {institute.establishedYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm">Est. {institute.establishedYear}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Media Links */}
                    {(institute.facebook || institute.instagram || institute.twitter || institute.linkedin) && (
                      <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                        {institute.facebook && (
                          <a href={institute.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                        {institute.instagram && (
                          <a href={institute.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                            <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                        {institute.twitter && (
                          <a href={institute.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                            <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                        {institute.linkedin && (
                          <a href={institute.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800">
                            <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Gallery Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {isOwner && (
                      <div className="mb-4 sm:mb-6">
                        <Label htmlFor="gallery-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors">
                            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm sm:text-base text-muted-foreground">Click to upload image(s) to gallery</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                          </div>
                        </Label>
                        <input
                          id="gallery-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </div>
                    )}

                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={getImageUrl(image)}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {isOwner && (
                              <button
                                onClick={() => removeGalleryImage(image)}
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">No images in gallery yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                      Courses Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-4 sm:mb-6">
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                        {institute.courses && institute.courses.length > 0 
                          ? `${institute.courses.length} course(s) available`
                          : 'No courses listed yet'
                        }
                      </p>
                      <Button 
                        onClick={() => navigate(`/education/institute/${institute._id}/courses`)}
                        className="w-full sm:w-auto text-sm sm:text-base"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        View All Courses
                      </Button>
                    </div>

                    {institute.courses && institute.courses.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {institute.courses.slice(0, 4).map((course, index) => (
                          <div key={index} className="border rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{course.name}</h4>
                            {course.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{course.description}</p>
                            )}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              {course.duration && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 flex-shrink-0" />
                                  {course.duration}
                                </span>
                              )}
                              {course.fee && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 flex-shrink-0" />
                                  ${course.fee}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Faculty Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                        Our Faculty
                      </CardTitle>
                      {isOwner && (
                        <Dialog open={showAddFaculty} onOpenChange={setShowAddFaculty}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Add Faculty
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md mx-4">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">Add New Faculty Member</DialogTitle>
                              <DialogDescription className="text-sm text-muted-foreground">
                                Fill in the details below to add a new faculty member to your institute.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 sm:space-y-4">
                              <div>
                                <Label htmlFor="faculty-name" className="text-sm sm:text-base">Name *</Label>
                                <Input
                                  id="faculty-name"
                                  value={newFaculty.name}
                                  onChange={(e) => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="Full Name"
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="faculty-position" className="text-sm sm:text-base">Position *</Label>
                                <Input
                                  id="faculty-position"
                                  value={newFaculty.position}
                                  onChange={(e) => setNewFaculty(prev => ({ ...prev, position: e.target.value }))}
                                  placeholder="e.g., Professor, Lecturer"
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="faculty-qualification" className="text-sm sm:text-base">Qualification *</Label>
                                <Input
                                  id="faculty-qualification"
                                  value={newFaculty.qualification}
                                  onChange={(e) => setNewFaculty(prev => ({ ...prev, qualification: e.target.value }))}
                                  placeholder="e.g., PhD, Masters"
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="faculty-experience" className="text-sm sm:text-base">Experience *</Label>
                                <Input
                                  id="faculty-experience"
                                  value={newFaculty.experience}
                                  onChange={(e) => setNewFaculty(prev => ({ ...prev, experience: e.target.value }))}
                                  placeholder="e.g., 5 years"
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="faculty-image" className="text-sm sm:text-base">Profile Photo</Label>
                                <Input
                                  id="faculty-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFacultyImageChange}
                                  className="text-sm sm:text-base"
                                />
                                {facultyImagePreview && (
                                  <div className="mt-2">
                                    <img
                                      src={facultyImagePreview}
                                      alt="Preview"
                                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                <Button onClick={handleAddFaculty} className="flex-1 text-sm sm:text-base">
                                  Add Faculty
                                </Button>
                                <Button variant="outline" onClick={() => setShowAddFaculty(false)} className="text-sm sm:text-base">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {institute.faculty && institute.faculty.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {institute.faculty.map((member, index) => (
                          <div key={index} className="border rounded-lg p-4 sm:p-5 transform transition-transform hover:scale-105">
                            <div className="flex items-center gap-4 sm:gap-5">
                              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                                <AvatarImage src={getImageUrl(member.image)} />
                                <AvatarFallback className="text-lg sm:text-xl">{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground text-base sm:text-lg truncate">{member.name}</h4>
                                <p className="text-sm sm:text-base text-primary font-medium truncate">{member.position}</p>
                                <p className="text-sm text-muted-foreground truncate">{member.qualification}</p>
                                <p className="text-sm text-muted-foreground truncate">{member.experience} experience</p>
                              </div>
                              {isOwner && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => removeFacultyMember(member._id || '')}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8 sm:py-10 text-base sm:text-lg">No faculty members listed yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Notifications Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><BellIcon className="h-4 w-4" /> Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {isOwner && (
                      <div className="space-y-2">
                        <Input placeholder="Title (optional)" value={newNotification.title} onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))} />
                        <Textarea placeholder="Write a notification..." value={newNotification.message} onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))} />
                        <Button onClick={handleCreateNotification} size="sm">Send Notification</Button>
                      </div>
                    )}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n._id} className="p-3 border rounded-lg">
                          {n.title && <p className="font-semibold">{n.title}</p>}
                          <p className="text-sm text-muted-foreground">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Messages Section */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><MessageSquare className="h-4 w-4" /> Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {isOwner && (
                      <div className="space-y-2">
                        <Input placeholder="Sender name" value={newMessage.senderName} onChange={(e) => setNewMessage(prev => ({ ...prev, senderName: e.target.value }))} />
                        <Textarea placeholder="Write a message to students..." value={newMessage.message} onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))} />
                        <Button onClick={handleCreateMessage} size="sm">Send Message</Button>
                      </div>
                    )}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {messages.map((m) => (
                        <div key={m._id} className="p-3 border rounded-lg">
                          <p className="text-sm font-semibold">{m.senderName}</p>
                          <p className="text-sm text-muted-foreground">{m.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</p>
                        </div>
                      ))}
                      {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Quick Stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Total Students</span>
                      <span className="font-semibold text-sm sm:text-base">{institute.totalStudents || institute.students || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Total Courses</span>
                      <span className="font-semibold text-sm sm:text-base">{institute.courses?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Faculty Members</span>
                      <span className="font-semibold text-sm sm:text-base">{institute.faculty?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Admission Status</span>
                      <Badge variant={institute.admissionStatus === 'Open' ? 'default' : 'secondary'} className="text-xs">
                        {institute.admissionStatus || 'N/A'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Institute Type */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center">
                      <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary mx-auto mb-2 sm:mb-3" />
                      <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{institute.type || 'Institute'}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {institute.specialization || 'General Education'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
