import { motion } from 'framer-motion'
import { Star, MapPin, Users, Building2, Check, Trash2, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { API_BASE_URL } from '@/lib/config'

interface HospitalType {
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
  patients?: string;
  totalPatients?: string;
  technicalities?: string;
  specialization?: string;
  owner?: string;
}

interface HospitalCardProps {
  hospital: HospitalType
  index: number
  currentUser?: { _id: string }
}

export default function HospitalCard({ hospital, index, currentUser }: HospitalCardProps) {
  const navigate = useNavigate()
  const id = hospital._id || hospital.id
  
  // Debug logging
  console.log(`🏥 HospitalCard ${index + 1} - ${hospital.name}:`, {
    _id: hospital._id,
    id: hospital.id,
    finalId: id,
    name: hospital.name
  });
  
  const [bannerError, setBannerError] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

  const handleDeleteHospital = async () => {
    if (!currentUser || String(hospital.owner) !== String(currentUser._id)) return
    setIsDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/institute/${id}`, { method: 'DELETE', credentials: 'include' })
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      // noop
    } finally {
        setIsDeleting(false)
        setShowDeleteConfirm(false)
    }
  }

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index, duration: 0.6 }}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1" onClick={() => navigate(`/hospital/${id}`)}>
        <div className="relative h-40 sm:h-48">
          {hospital.banner ? (
            <img
              src={getImageUrl(hospital.banner)}
              alt={hospital.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-blue-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            {hospital.logo ? (
              <img
                src={getImageUrl(hospital.logo)}
                alt={`${hospital.name} logo`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg bg-white/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <Badge className="bg-primary text-white text-xs">
              {hospital.type || 'Hospital'}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
            <h3 className="text-base sm:text-lg font-bold mb-1 line-clamp-2">{hospital.name}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{hospital.city || hospital.location || 'Location not specified'}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-xs sm:text-sm">{hospital.rating || 'N/A'}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">(reviews)</span>
            </div>
            {hospital.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <p className="text-xs text-muted-foreground mb-2">Technicalities (3 shown):</p>
            <div className="flex flex-wrap gap-1">
              {hospital.specialization ? (
                hospital.specialization.split(', ').slice(0, 3).map((item, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    <Stethoscope className="h-3 w-3 mr-1" />{item}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Building2 className="h-3 w-3 mr-1" />
                  General Healthcare
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium">{hospital.totalPatients || hospital.patients || 'N/A'}</span>
            <span className="text-xs text-muted-foreground">Total Patients</span>
          </div>
          <div className="space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base h-9 sm:h-10"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/hospital/${id}`)
              }}
            >
              View Details
            </Button>
            <Button 
              variant="outline"
              className="w-full text-sm h-9 sm:h-10"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/hospital/${id}/patient-dashboard`)
              }}
            >
              Patient Dashboard
            </Button>
          </div>
          {currentUser && hospital.owner && String(currentUser._id) === String(hospital.owner) && (
            <div className="space-y-2 mt-3">
              <Button
                variant="outline"
                className="w-full text-sm h-9 sm:h-10"
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/hospital/edit/${id}`);
                }}
              >
                Edit Hospital
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-sm h-8 sm:h-9"
                onClick={e => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Hospital'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-4 sm:p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Hospital</h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Are you sure you want to delete "{hospital.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDeleteHospital} disabled={isDeleting} className="flex-1 text-sm">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 text-sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}


