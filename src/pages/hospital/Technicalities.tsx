import { motion } from 'framer-motion'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Stethoscope, Calendar, Users, MapPin, Building2, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'

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
  specialization?: string;
}

export default function Technicalities() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const specialization = searchParams.get('specialization')

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

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
        if (data.hospital) {
          setHospital(data.hospital)
          setIsLoading(false)
        } else {
          throw new Error('Hospital data not found in response')
        }
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [id])

  const items = hospital?.specialization ? hospital.specialization.split(', ').map(n => ({ name: n })) : []

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpec = !specialization || item.name === specialization
    return matchesSearch && matchesSpec
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading technicalities...</p>
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
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Technicalities Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The technicalities you are looking for do not exist.'}</p>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative h-64">
          <img src={getImageUrl(hospital.banner) || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=1200&h=400&fit=crop'} alt={hospital.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <Button variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20" onClick={() => navigate(`/hospital/hospital/${hospital._id}/dashboard`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-4">
              <img src={getImageUrl(hospital.logo) || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=80&h=80&fit=crop&crop=face'} alt={`${hospital.name} logo`} className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">Technicalities at {hospital.name}</h1>
                  {hospital.verified && (
                    <div className="bg-primary text-white rounded-full p-1"><Check className="h-4 w-4" /></div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{hospital.city || hospital.location || 'Location not specified'}</span></div>
                  <div className="flex items-center gap-1"><Stethoscope className="h-4 w-4" /><span className="font-medium">{items.length} item(s)</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-8">
            <Card>
              <CardContent className="p-6">
                {specialization && (
                  <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Filtering by specialization: <span className="font-semibold">{specialization}</span></span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/hospital/hospital/${id}/technicalities`)} className="text-primary hover:text-primary/80">Clear Filter</Button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input type="text" placeholder="Search technicalities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * index, duration: 0.5 }}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2"><Stethoscope className="h-4 w-4" /> {item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground text-sm">Specialized department and services related to {item.name}.</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Technicalities Found</h3>
                <p className="text-muted-foreground mb-4">{searchQuery || specialization ? 'No items match your current filters. Try adjusting your search criteria.' : 'This hospital has not added any technicalities yet.'}</p>
                {(searchQuery || specialization) && (
                  <Button variant="outline" onClick={() => { setSearchQuery('') }}>Clear Filters</Button>
                )}
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}


