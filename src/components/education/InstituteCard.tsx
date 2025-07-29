import { motion } from 'framer-motion'
import { Star, MapPin, Users, BookOpen, GraduationCap, Phone, Mail, Check, Building2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { API_BASE_URL } from '@/lib/config'

interface Institute {
  id?: number;
  _id?: string;
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
  courses?: string;
  specialization?: string;
  admissionStatus?: string;
  phone?: string;
  email?: string;
  owner?: string;
}

interface InstituteCardProps {
  institute: Institute
  index: number
  currentUser?: { _id: string }
}

export default function InstituteCard({ institute, index, currentUser }: InstituteCardProps) {
  const navigate = useNavigate()
  const id = institute._id || institute.id;
  const [bannerError, setBannerError] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fallback images
  const defaultBanner = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=200&fit=crop"
  const defaultLogo = "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=80&h=80&fit=crop&crop=face"

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${API_BASE_URL}${imagePath}`
  }

  // Handle institute deletion
  const handleDeleteInstitute = async () => {
    if (!currentUser || String(institute.owner) !== String(currentUser._id)) {
      return
    }

    setIsDeleting(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Refresh the page to update the institutes list
        window.location.reload()
      } else {
        console.error('Failed to delete institute')
      }
    } catch (error) {
      console.error('Error deleting institute:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            onClick={() => navigate(`/education/institute/${id}`)}>
        {/* Banner with Logo Overlay */}
        <div className="relative h-48">
          <img
            src={getImageUrl(institute.banner) && !bannerError ? getImageUrl(institute.banner) : defaultBanner}
            alt={institute.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setBannerError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Logo */}
          <div className="absolute top-4 right-4">
            <img
              src={getImageUrl(institute.logo) && !logoError ? getImageUrl(institute.logo) : defaultLogo}
              alt={`${institute.name} logo`}
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
              onError={() => setLogoError(true)}
            />
          </div>

          {/* Institute Type Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white">
              {institute.type || (institute.name.includes('University') ? 'University' :
               institute.name.includes('College') ? 'College' : 'School')}
            </Badge>
          </div>

          {/* Name and Location Overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold mb-1">{institute.name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              <span>{institute.city || institute.location || 'Location not specified'}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Rating and Verification */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">{institute.rating || 'N/A'}</span>
              <span className="text-xs text-muted-foreground">(1.2k reviews)</span>
            </div>
            {institute.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Courses Offered */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Courses Offered (3 shown):</p>
            <div className="flex flex-wrap gap-1">
              {institute.specialization ?
                institute.specialization.split(', ').slice(0, 3).map((course, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {course}
                  </Badge>
                ))
                :
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  General Education
                </Badge>
              }
            </div>
          </div>

          {/* Students Count */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{institute.totalStudents || institute.students || 'N/A'}</span>
            <span className="text-xs text-muted-foreground">Total Students</span>
          </div>

          {/* Apply Button */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/education/institute/${id}`)
            }}
          >
            Apply Now
          </Button>

          {/* Owner Actions */}
          {currentUser && institute.owner && String(currentUser._id) === String(institute.owner) && (
            <div className="space-y-2">
            <Button
              variant="outline"
                className="w-full"
              onClick={e => {
                e.stopPropagation();
                navigate(`/education/edit/${id}`);
              }}
            >
              Edit Institute
            </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={e => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Institute'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Institute</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{institute.name}"? This action cannot be undone and will permanently remove the institute and all associated reviews.
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
    </motion.div>
  )
}
