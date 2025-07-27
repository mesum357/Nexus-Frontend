import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, MapPin, Users, BookOpen, GraduationCap, Phone, Mail, Check, ArrowLeft, Globe, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'

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
  courses?: string;
  specialization?: string;
  admissionStatus?: string;
  phone?: string;
  email?: string;
  owner?: string;
  website?: string;
  established?: string;
  description?: string;
}

interface Review {
  _id: string;
  institute: string;
  reviewer: {
    _id: string;
    username: string;
    email: string;
  };
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
}

export default function InstituteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [institute, setInstitute] = useState<Institute | null>(null)
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

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}${imagePath}`
  }

  // Check authentication
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

  // Fetch institute data and reviews
  useEffect(() => {
    if (!id) {
      setError('Institute ID not found')
      setIsLoading(false)
      return
    }
    
    // Fetch institute data
    fetch(`${API_BASE_URL}/api/institute/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Institute not found')
        }
        return res.json()
      })
      .then(data => {
        setInstitute(data.institute)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })

    // Fetch reviews
    fetch(`${API_BASE_URL}/api/institute/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || [])
      })
      .catch(err => {
        console.error('Error fetching reviews:', err)
      })
  }, [id])

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment for your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingReview(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newReview)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been added successfully!",
        })
        
        // Refresh reviews
        const reviewsResponse = await fetch(`${API_BASE_URL}/api/institute/${id}/reviews`)
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])
        
        // Reset form
        setNewReview({ rating: 5, comment: '' })
        setShowReviewForm(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Handle institute deletion
  const handleDeleteInstitute = async () => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete this institute.",
        variant: "destructive",
      })
      return
    }

    if (!institute || String(institute.owner) !== String(currentUser._id)) {
      toast({
        title: "Unauthorized",
        description: "You can only delete institutes you own.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Institute Deleted",
          description: "The institute has been deleted successfully.",
        })
        
        // Redirect to education page
        navigate('/education')
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete institute",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete institute. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading institute details...</p>
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
      
      <div className="pt-20">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-96"
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
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate('/education')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Institutes
          </Button>

          {/* Institute Info Overlay */}
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={getImageUrl(institute.logo) || "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=100&h=100&fit=crop&crop=face"}
                alt={`${institute.name} logo`}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">{institute.name}</h1>
                  {institute.verified && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{institute.city || institute.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {institute.rating ? institute.rating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About the Institute</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {institute.description || 'No description available for this institute.'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{institute.students || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{institute.specialization ? institute.specialization.split(', ').length : 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{institute.established || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Established</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{institute.rating || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Facilities */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {institute.specialization ? 
                        institute.specialization.split(', ').map((course, index) => (
                          <Badge key={index} variant="secondary" className="p-2 justify-center">
                            {course}
                          </Badge>
                        ))
                        :
                        <Badge variant="secondary" className="p-2 justify-center">
                          General Education
                        </Badge>
                      }
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Student Reviews */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Student Reviews ({reviews.length})</CardTitle>
                      {isAuthenticated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Review Form */}
                    {showReviewForm && (
                      <div className="border rounded-lg p-4 bg-muted/30">
                        <h4 className="font-semibold mb-3">Write Your Review</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                  className="text-2xl"
                                >
                                  <Star 
                                    className={`h-6 w-6 ${
                                      star <= newReview.rating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Comment</label>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="Share your experience with this institute..."
                              className="w-full p-3 border rounded-md resize-none"
                              rows={4}
                              maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {newReview.comment.length}/1000 characters
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSubmitReview}
                              disabled={isSubmittingReview}
                              className="flex-1"
                            >
                              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowReviewForm(false)
                                setNewReview({ rating: 5, comment: '' })
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {review.reviewer.username ? review.reviewer.username[0].toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-foreground">
                                    {review.reviewer.username || 'Anonymous'}
                                  </p>
                                  <div className="flex">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(review.createdAt)}
                                  </span>
                                  {review.isVerified && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                      <Check className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
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
                        <p className="text-sm text-muted-foreground">
                          {isAuthenticated 
                            ? "Be the first to review this institute!" 
                            : "Log in to leave a review"
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Courses
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Brochure
                  </Button>
                  
                  {/* Owner Actions */}
                  {isAuthenticated && currentUser && institute && String(institute.owner) === String(currentUser._id) && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Owner Actions</p>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate(`/education/edit/${id}`)}
                          >
                            Edit Institute
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete Institute'}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{institute.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{institute.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{institute.website || 'Not provided'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Admission Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Admission Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      institute.admissionStatus === 'Open' ? 'bg-green-500' : 
                      institute.admissionStatus === 'Closed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <span className={`font-semibold ${
                      institute.admissionStatus === 'Open' ? 'text-green-600' : 
                      institute.admissionStatus === 'Closed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {institute.admissionStatus || 'Not specified'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {institute.admissionStatus === 'Open' ? 'Applications are being accepted for the upcoming semester.' :
                     institute.admissionStatus === 'Closed' ? 'Applications are currently closed.' :
                     institute.admissionStatus === 'Limited' ? 'Limited applications are being accepted.' :
                     'Admission status not specified.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Institute</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{institute?.name}"? This action cannot be undone and will permanently remove the institute and all associated reviews.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDeleteInstitute}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
