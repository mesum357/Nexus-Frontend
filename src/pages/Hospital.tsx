import { motion } from 'framer-motion'
import { Hospital as HospitalIcon, Plus, MapPin, Star, Search, Filter, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import HospitalCard from '@/components/hospital/HospitalCard'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import Logo from '@/assets/Logo.png'
import bgImage from '@/assets/hospital.avif' // Hospital background image

interface HospitalType {
  _id: string;
  name: string;
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
  status?: string;
  phone?: string;
  email?: string;
  owner?: string;
}

interface CurrentUser {
  _id: string;
  email?: string;
  username?: string;
}

export default function Hospital() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [hospitals, setHospitals] = useState<HospitalType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const fetchHospitals = () => {
    setIsLoading(true)
    // Use the dedicated hospital endpoint to fetch approved hospitals
    fetch(`${API_BASE_URL}/api/hospital/all`)
      .then(res => res.json())
      .then(data => {
        console.log('🏥 Hospitals data received:', data);
        console.log('🏥 Number of hospitals:', data.hospitals ? data.hospitals.length : 0);
        
        if (data.hospitals && data.hospitals.length > 0) {
          data.hospitals.forEach((hospital, index) => {
            console.log(`🏥 Hospital ${index + 1}:`, {
              _id: hospital._id,
              name: hospital.name,
              type: hospital.type,
              city: hospital.city,
              approvalStatus: hospital.approvalStatus
            });
          });
        }
        
        setHospitals((data.hospitals || []) as any)
        setIsLoading(false)
      })
      .catch((error) => { 
        console.error('❌ Error fetching hospitals:', error);
        setIsLoading(false) 
      })
  }

  useEffect(() => {
    fetchHospitals()
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUser(data.user || null))
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      fetchHospitals()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan']
  const hospitalTypes = ['General', 'Specialized', 'Clinic', 'Medical Center']

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = (hospital.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (hospital.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === 'all' || (hospital.city || '').includes(selectedCity)
    const matchesType = selectedType === 'all' || (hospital.type || '').toLowerCase().includes(selectedType.toLowerCase())
    return matchesSearch && matchesCity && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative pt-16 sm:pt-20 pb-12 sm:pb-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                <img 
                  src={Logo} 
                  alt="E Duniya Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-4 border-primary shadow-lg mb-4 sm:mb-0 sm:mr-4"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground">
                    Find Local <span className="text-primary">Hospitals & Healthcare Services</span>
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm sm:text-base">Pakistan</span>
                    </div>
                    <div className="flex items-center gap-1 sm:ml-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs sm:text-sm text-muted-foreground ml-1">(4.8)</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Locate nearby hospitals, clinics and healthcare professionals you can trust. View facility details, specialties, patient reviews, and contact or book appointments directly
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button onClick={() => navigate('/hospital/create')} className="bg-primary hover:bg-primary/90 w-full sm:w-auto" size="lg">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Create Hospital
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-6 sm:py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hospitals, departments, or specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 sm:h-10"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="w-full sm:w-48 h-11 sm:h-10">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full sm:w-48 h-11 sm:h-10">
                        <SelectValue placeholder="Hospital Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {hospitalTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="h-11 sm:h-10 w-full sm:w-auto">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {isLoading ? (
                <div className="col-span-full text-center py-8">Loading...</div>
              ) : filteredHospitals.map((hospital, index) => (
                <HospitalCard key={hospital._id} hospital={hospital} index={index} currentUser={currentUser} />
              ))}
            </div>
            {filteredHospitals.length === 0 && !isLoading && (
              <div className="text-center py-12 sm:py-16">
                <HospitalIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No hospitals found</h3>
                <p className="text-muted-foreground text-sm sm:text-base">Try adjusting your search criteria</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}


