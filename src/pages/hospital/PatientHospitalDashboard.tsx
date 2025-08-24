import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  Stethoscope,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'

interface Hospital {
  _id: string;
  name: string;
  city?: string;
  type?: string;
  logo?: string;
  banner?: string;
  phone?: string;
  email?: string;
  specialization?: string;
}

interface PatientApplication {
  _id: string;
  hospital: string;
  patient: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  contactNumber: string;
  emergencyContact: string;
  medicalHistory?: string;
  symptoms: string;
  treatmentType: string;
  preferredDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export default function PatientHospitalDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [patientApplication, setPatientApplication] = useState<PatientApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user, hospital data, and patient application
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUser(userData.user)
        } else {
          toast({ title: 'Authentication Required', description: 'Please log in to view your dashboard.', variant: 'destructive' })
          navigate('/login')
          return
        }

        // Fetch hospital data
        if (id) {
          const hospitalResponse = await fetch(`${API_BASE_URL}/api/hospital/${id}`)
          if (hospitalResponse.ok) {
            const hospitalData = await hospitalResponse.json()
            setHospital(hospitalData.hospital)
          } else {
            toast({ title: 'Error', description: 'Hospital not found.', variant: 'destructive' })
            navigate('/hospital')
            return
          }

          // Fetch patient application for this hospital
          const applicationResponse = await fetch(`${API_BASE_URL}/api/hospital/patient/applications`, {
            credentials: 'include'
          })
          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json()
            const hospitalApplication = applicationData.applications?.find((app: any) => 
              app.hospital === id || app.hospital._id === id
            )
            if (hospitalApplication) {
              setPatientApplication(hospitalApplication)
            }
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({ title: 'Error', description: 'Failed to load dashboard.', variant: 'destructive' })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, navigate, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser || !hospital) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">Please log in to access this page.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
                               <Button 
                     variant="ghost" 
                     onClick={() => navigate(`/hospital/${id}`)}
                     className="mb-4"
                   >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospital
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {currentUser.fullName || currentUser.username}!
              </p>
            </div>
          </motion.div>

          {/* Hospital Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    {hospital.logo ? (
                      <img src={hospital.logo} alt={`${hospital.name} logo`} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{hospital.name}</h3>
                      <p className="text-muted-foreground">{hospital.type || 'Healthcare Facility'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{hospital.city || 'Location not specified'}</span>
                    </div>
                    {hospital.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{hospital.phone}</span>
                      </div>
                    )}
                    {hospital.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{hospital.email}</span>
                      </div>
                    )}
                  </div>

                                     <div className="space-y-2">
                     <h4 className="font-medium">Specializations</h4>
                     <div className="flex flex-wrap gap-2">
                       {hospital.specialization ? (
                         hospital.specialization.split(', ').map((spec, index) => (
                           <Badge key={index} variant="secondary" className="text-xs">
                             {spec.trim()}
                           </Badge>
                         ))
                       ) : hospital.departments && hospital.departments.length > 0 ? (
                         hospital.departments.map((dept, index) => (
                           <Badge key={index} variant="secondary" className="text-xs">
                             {dept}
                           </Badge>
                         ))
                       ) : (
                         <Badge variant="secondary" className="text-xs">General Healthcare</Badge>
                       )}
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Patient Application Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Registration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patientApplication ? (
                  <div className="space-y-6">
                    {/* Status Header */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(patientApplication.status)} border`}>
                          {getStatusIcon(patientApplication.status)}
                          <span className="ml-2 capitalize">{patientApplication.status}</span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Registered on {new Date(patientApplication.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                                             <Button 
                         variant="outline" 
                         onClick={() => navigate(`/hospital/${id}/apply`)}
                       >
                        Update Registration
                      </Button>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-lg">Personal Information</h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                            <p className="font-medium">{patientApplication.patientName}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                              <p className="font-medium">{patientApplication.patientAge} years</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                              <p className="font-medium capitalize">{patientApplication.patientGender}</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Contact Number</Label>
                            <p className="font-medium">{patientApplication.contactNumber}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Emergency Contact</Label>
                            <p className="font-medium">{patientApplication.emergencyContact}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-lg">Medical Information</h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Treatment Type</Label>
                            <p className="font-medium">{patientApplication.treatmentType}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Symptoms</Label>
                            <p className="text-sm">{patientApplication.symptoms}</p>
                          </div>
                          {patientApplication.medicalHistory && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Medical History</Label>
                              <p className="text-sm">{patientApplication.medicalHistory}</p>
                            </div>
                          )}
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Preferred Date</Label>
                            <p className="font-medium">{new Date(patientApplication.preferredDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {patientApplication.notes && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-lg mb-3">Hospital Notes</h4>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm">{patientApplication.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Next Steps */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-lg mb-3">Next Steps</h4>
                      <div className="space-y-2">
                        {patientApplication.status === 'pending' && (
                          <p className="text-sm text-muted-foreground">
                            Your registration is currently under review. The hospital will contact you soon with further instructions.
                          </p>
                        )}
                        {patientApplication.status === 'approved' && (
                          <p className="text-sm text-muted-foreground">
                            Congratulations! Your registration has been approved. Please contact the hospital to schedule your appointment.
                          </p>
                        )}
                        {patientApplication.status === 'rejected' && (
                          <p className="text-sm text-muted-foreground">
                            Your registration was not approved at this time. Please contact the hospital for more information or update your registration.
                          </p>
                        )}
                        {patientApplication.status === 'completed' && (
                          <p className="text-sm text-muted-foreground">
                            Your treatment has been completed. Thank you for choosing {hospital.name}!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Registration Found</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for treatment at this hospital yet.
                    </p>
                                         <Button onClick={() => navigate(`/hospital/${id}/apply`)}>
                      Register Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <Button 
                     variant="outline" 
                     className="h-auto p-4 flex flex-col items-center gap-2"
                     onClick={() => navigate(`/hospital/${id}`)}
                   >
                    <Building2 className="h-6 w-6" />
                    <span>View Hospital Details</span>
                  </Button>
                  
                                     <Button 
                     variant="outline" 
                     className="h-auto p-4 flex flex-col items-center gap-2"
                     onClick={() => navigate(`/hospital/${id}/technicalities`)}
                   >
                    <Stethoscope className="h-6 w-6" />
                    <span>View Specializations</span>
                  </Button>
                  
                                     <Button 
                     variant="outline" 
                     className="h-auto p-4 flex flex-col items-center gap-2"
                     onClick={() => navigate(`/hospital/${id}/apply`)}
                   >
                    <FileText className="h-6 w-6" />
                    <span>Update Registration</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
