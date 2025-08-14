import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  Check, 
  ArrowLeft, 
  Building2, 
  ChevronDown, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  Stethoscope 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { RichTextDisplay } from '@/components/ui/rich-text-display'

interface Hospital {
  _id: string;
  name: string;
  location?: string;
  city?: string;
  type?: string;
  logo?: string;
  banner?: string;
  rating?: number;
  verified?: boolean;
  patients?: string;
  totalPatients?: string;
  specialization?: string; // used for technicalities list
  status?: string;
  phone?: string;
  email?: string;
  owner?: string;
  website?: string;
  establishedYear?: number;
  description?: string;
}

interface Review {
  _id: string;
  hospital: string;
  reviewer: {
    _id: string;
    username: string;
    fullName?: string;
    email: string;
    profileImage?: string;
    city?: string;
  };
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
}

export default function HospitalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [doctors, setDoctors] = useState<{ _id?: string; name: string; specialty: string; qualification: string; experience: string; image?: string }[]>([])

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user)
        setIsAuthenticated(true)
      })
      .catch(() => {
        setCurrentUser(null)
        setIsAuthenticated(false)
      })
  }, [])

  useEffect(() => {
    if (!id) {
      setError('Hospital ID not found')
      setIsLoading(false)
      return
    }

    fetch(`${API_BASE_URL}/api/institute/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Hospital not found')
        return res.json()
      })
      .then(data => {
        if (data.institute) {
          setHospital(data.institute)
          setIsLoading(false)
        } else {
          throw new Error('Institute data not found in response')
        }
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })

    fetch(`${API_BASE_URL}/api/institute/${id}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(() => {})

    fetch(`${API_BASE_URL}/api/institute/${id}/gallery`)
      .then(res => res.json())
      .then(data => setGalleryImages(data.gallery || []))
      .catch(() => setGalleryImages([]))

    fetch(`${API_BASE_URL}/api/institute/${id}/faculty`)
      .then(res => res.json())
      .then(data => setDoctors((data.faculty || []).map((f: any) => ({
        _id: f._id,
        name: f.name,
        specialty: f.position,
        qualification: f.qualification,
        experience: f.experience,
        image: f.image,
      }))))
      .catch(() => setDoctors([]))
  }, [id])

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Authentication Required', description: 'Please log in to leave a review.', variant: 'destructive' })
      return
    }
    if (!newReview.comment.trim()) {
      toast({ title: 'Comment Required', description: 'Please enter a comment for your review.', variant: 'destructive' })
      return
    }
    setIsSubmittingReview(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newReview)
      })
      const data = await response.json()
      if (response.ok) {
        toast({ title: 'Review Submitted', description: 'Your review has been added successfully!' })
        const reviewsResponse = await fetch(`${API_BASE_URL}/api/institute/${id}/reviews`)
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])
        setNewReview({ rating: 5, comment: '' })
        setShowReviewForm(false)
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to submit review', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit review. Please try again.', variant: 'destructive' })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleDeleteHospital = async () => {
    if (!isAuthenticated || !currentUser) {
      toast({ title: 'Authentication Required', description: 'Please log in to delete this hospital.', variant: 'destructive' })
      return
    }
    if (!hospital || String(hospital.owner) !== String(currentUser._id)) {
      toast({ title: 'Unauthorized', description: 'You can only delete hospitals you own.', variant: 'destructive' })
      return
    }
    setIsDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}`, { method: 'DELETE', credentials: 'include' })
      const data = await response.json()
      if (response.ok) {
        toast({ title: 'Hospital Deleted', description: 'The hospital has been deleted successfully.' })
        navigate('/hospital')
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete hospital', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete hospital. Please try again.', variant: 'destructive' })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading hospital details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Hospital Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The hospital you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/hospital')}>Back to Hospitals</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative h-96">
          <img src={getImageUrl(hospital.banner) || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=1200&h=600&fit=crop'} alt={hospital.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <Button variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20" onClick={() => navigate('/hospital')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hospitals
          </Button>
          <Button variant="default" className="absolute top-4 right-4 bg-primary text-white hover:bg-primary/90 shadow-lg" onClick={() => navigate(`/hospital/hospital/${hospital._id}/dashboard`)}>
            <Building2 className="h-4 w-4 mr-2" />
            Hospital Dashboard
          </Button>
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <img src={getImageUrl(hospital.logo) || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop&crop=face'} alt={`${hospital.name} logo`} className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">{hospital.name}</h1>
                      {hospital.verified && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{hospital.city || hospital.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{hospital.rating ? hospital.rating.toFixed(1) : 'N/A'}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>About the Hospital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichTextDisplay content={hospital.description || 'No description available for this hospital.'} className="text-muted-foreground leading-relaxed" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{hospital.totalPatients || hospital.patients || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Patients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{hospital.specialization ? hospital.specialization.split(', ').length : 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Technicalities</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{hospital.establishedYear || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Established</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{hospital.rating || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Technicalities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {hospital.specialization ? (
                        hospital.specialization.split(', ').map((tech, index) => (
                          <Badge key={index} variant="secondary" className="p-2 justify-center">{tech}</Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="p-2 justify-center">General Healthcare</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="h-4 w-4" />Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {galleryImages.map((img, idx) => (
                          <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No gallery images yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Stethoscope className="h-4 w-4" />Doctors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {doctors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctors.map((doc, index) => (
                          <div key={doc._id || index} className="flex items-center gap-3 border rounded-lg p-3">
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={doc.image} />
                              <AvatarFallback>{doc.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.specialty}</p>
                              <p className="text-xs text-muted-foreground">{doc.qualification}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No doctors added yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Patient Reviews ({reviews.length})</CardTitle>
                      {isAuthenticated && (
                        <Button variant="outline" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {showReviewForm && (
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-semibold mb-3">Write Your Review</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setNewReview(prev => ({ ...prev, rating: star }))} className="text-2xl">
                                  <Star className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Comment</label>
                            <textarea value={newReview.comment} onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))} placeholder="Share your experience with this hospital..." className="w-full p-3 border rounded-md resize-none" rows={4} maxLength={1000} />
                            <p className="text-xs text-muted-foreground mt-1">{newReview.comment.length}/1000 characters</p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSubmitReview} disabled={isSubmittingReview} className="flex-1">{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</Button>
                            <Button variant="outline" onClick={() => { setShowReviewForm(false); setNewReview({ rating: 5, comment: '' }) }}>Cancel</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{(review.reviewer.fullName || review.reviewer.username)?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-foreground">{review.reviewer.fullName || review.reviewer.username || 'Anonymous'}</p>
                                  <div className="flex">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                  {review.isVerified && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs"><Check className="h-3 w-3 mr-1" />Verified</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No reviews yet</p>
                        <p className="text-sm text-muted-foreground">{isAuthenticated ? 'Be the first to review this hospital!' : 'Log in to leave a review'}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => navigate(`/hospital/${id}/apply`)}>
                    Register Now
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View Technicalities
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => navigate(`/hospital/hospital/${id}/technicalities`)}>All Technicalities</DropdownMenuItem>
                      {hospital.specialization && hospital.specialization.split(', ').map((tech, index) => (
                        <DropdownMenuItem key={index} onClick={() => navigate(`/hospital/hospital/${id}/technicalities?specialization=${tech}`)}>
                          {tech}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {hospital && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Contact</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{hospital.phone || 'Not provided'}</span></div>
                        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{hospital.email || 'Not provided'}</span></div>
                      </div>
                    </div>
                  )}

                  {isAuthenticated && currentUser && hospital && String(hospital.owner) === String(currentUser._id) && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Owner Actions</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={() => navigate(`/hospital/edit/${id}`)}>Edit Hospital</Button>
                        <Button variant="destructive" className="w-full" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Hospital'}</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Hospital</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to delete "{hospital?.name}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDeleteHospital} disabled={isDeleting} className="flex-1">{isDeleting ? 'Deleting...' : 'Delete'}</Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


