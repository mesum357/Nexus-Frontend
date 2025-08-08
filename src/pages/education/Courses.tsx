import { motion } from 'framer-motion'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Users, 
  Clock, 
  MapPin,
  Building2,
  Star,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'

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
  courses?: Course[];
}

interface Course {
  _id?: string;
  name: string;
  description?: string;
  duration?: string;
  fee?: number;
  category?: string;
  seats?: number;
  startDate?: string;
  endDate?: string;
  level?: string;
  mode?: string;
}

export default function Courses() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [institute, setInstitute] = useState<Institute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get specialization from URL query params
  const specialization = searchParams.get('specialization')

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

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
          setIsLoading(false)
        } else {
          throw new Error('Institute data not found in response')
        }
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [id])

  // Get unique categories from courses
  const categories = institute?.courses 
    ? [...new Set(institute.courses.map(course => course.category).filter(Boolean))]
    : []

  // Filter courses based on search, category, and specialization
  const filteredCourses = institute?.courses?.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesSpecialization = !specialization || course.category === specialization
    return matchesSearch && matchesCategory && matchesSpecialization
  }) || []

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
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
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Courses Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The courses you are looking for do not exist.'}</p>
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
          className="relative h-64"
        >
          <img
            src={getImageUrl(institute.banner) || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop"}
            alt={institute.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            className="absolute top-4 left-4 text-white hover:bg-white/20"
            onClick={() => navigate(`/education/institute/${institute._id}/dashboard`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Institute Info Overlay */}
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(institute.logo) || "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=80&h=80&fit=crop&crop=face"}
                alt={`${institute.name} logo`}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">Courses at {institute.name}</h1>
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
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">
                      {institute.courses?.length || 0} course(s) available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                {/* Specialization Filter Indicator */}
                {specialization && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          Filtering by specialization: <span className="font-semibold">{specialization}</span>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/education/institute/${id}/courses`)}
                        className="text-primary hover:text-primary/80"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Courses
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id || index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{course.name}</CardTitle>
                            {course.category && (
                              <Badge variant="secondary" className="mb-2">
                                {course.category}
                              </Badge>
                            )}
                          </div>
                          {course.level && (
                            <Badge variant="outline">
                              {course.level}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {course.description && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {course.description}
                          </p>
                        )}
                        
                        <div className="space-y-3">
                          {course.duration && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                          )}
                          
                          {course.fee && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="h-4 w-4" />
                              <span>${course.fee}</span>
                            </div>
                          )}
                          
                          {course.seats && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{course.seats} seats available</span>
                            </div>
                          )}
                          
                          {course.mode && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{course.mode}</span>
                            </div>
                          )}
                        </div>
                        
                        {course.startDate && course.endDate && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'No courses match your current filters. Try adjusting your search criteria.'
                    : 'This institute has not added any courses yet.'
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card>
            )}
          </motion.div>

          {/* Course Statistics */}
          {institute.courses && institute.courses.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{institute.courses.length}</div>
                      <div className="text-sm text-muted-foreground">Total Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {categories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {institute.courses.filter(c => c.fee && c.fee > 0).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Paid Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {institute.courses.filter(c => c.seats && c.seats > 0).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Available Seats</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
