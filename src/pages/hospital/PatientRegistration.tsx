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
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'

interface Hospital {
  _id: string;
  name: string;
  city?: string;
  type?: string;
  logo?: string;
  banner?: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export default function PatientRegistration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    symptoms: '',
    preferredDate: '',
    treatmentType: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch current user and hospital data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setCurrentUser(userData.user)
        } else {
          toast({ title: 'Authentication Required', description: 'Please log in to register as a patient.', variant: 'destructive' })
          navigate('/login')
          return
        }

                 // Fetch hospital data
         if (id) {
           const hospitalResponse = await fetch(`${API_BASE_URL}/api/hospital/${id}`)
           if (hospitalResponse.ok) {
             const hospitalData = await hospitalResponse.json()
             console.log('🏥 Hospital data received:', hospitalData.hospital)
             console.log('🏥 Specialization:', hospitalData.hospital.specialization)
             console.log('🏥 Departments:', hospitalData.hospital.departments)
             setHospital(hospitalData.hospital)
           } else {
             toast({ title: 'Error', description: 'Hospital not found.', variant: 'destructive' })
             navigate('/hospital')
             return
           }
         }

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({ title: 'Error', description: 'Failed to load registration form.', variant: 'destructive' })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, navigate, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientAge.trim()) {
      newErrors.patientAge = 'Age is required'
    } else if (isNaN(Number(formData.patientAge)) || Number(formData.patientAge) < 1 || Number(formData.patientAge) > 120) {
      newErrors.patientAge = 'Please enter a valid age (1-120)'
    }

    if (!formData.patientGender) {
      newErrors.patientGender = 'Gender is required'
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number'
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'Please enter a valid emergency contact number'
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required'
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required'
    }

    if (!formData.treatmentType) {
      newErrors.treatmentType = 'Treatment type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!currentUser || !hospital) {
      toast({ title: 'Error', description: 'User or hospital data not available.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/patient-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
                 body: JSON.stringify({
           patientName: currentUser.fullName || currentUser.username || 'Unknown',
           patientAge: parseInt(formData.patientAge),
           patientGender: formData.patientGender,
           contactNumber: formData.contactNumber,
           emergencyContact: formData.emergencyContact,
           medicalHistory: formData.medicalHistory,
           symptoms: formData.symptoms,
           preferredDate: formData.preferredDate,
           treatmentType: formData.treatmentType
         })
      })

      const data = await response.json()

      if (response.ok) {
                 toast({ 
           title: 'Registration Successful!', 
           description: 'Your patient registration has been submitted successfully. Redirecting you to your dashboard...',
           variant: 'default'
         })
         
         // Reset form
         setFormData({
           patientAge: '',
           patientGender: '',
           contactNumber: '',
           emergencyContact: '',
           medicalHistory: '',
           symptoms: '',
           preferredDate: '',
           treatmentType: ''
         })
         
                   // Navigate to the patient dashboard
          setTimeout(() => {
            navigate(`/hospital/${id}/patient-dashboard`)
          }, 2000)
      } else {
        throw new Error(data.error || 'Failed to submit registration')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast({ 
        title: 'Registration Failed', 
        description: error.message || 'Failed to submit registration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading registration form...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Patient Registration</h1>
              <p className="text-muted-foreground">
                Register as a patient at {hospital.name}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Hospital Name</Label>
                    <p className="text-foreground font-medium">{hospital.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <p className="text-foreground">{hospital.type || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">City</Label>
                    <p className="text-foreground">{hospital.city || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Registration Status</Label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Open for Registration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registration Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                                 <CardTitle className="flex items-center gap-2">
                   <User className="h-5 w-5" />
                   Patient Information
                 </CardTitle>
                 <p className="text-sm text-muted-foreground">
                   Your name and profile photo will be automatically filled from your account details. Please select the specific treatment type that matches your medical needs.
                 </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Auto-filled user info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-foreground font-medium">
                        {currentUser.fullName || currentUser.username || 'Not available'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-foreground">{currentUser.email || 'Not available'}</p>
                    </div>
                  </div>

                  {/* Patient Age and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientAge">Age *</Label>
                      <Input
                        id="patientAge"
                        type="number"
                        value={formData.patientAge}
                        onChange={(e) => handleInputChange('patientAge', e.target.value)}
                        placeholder="Enter your age"
                        className={errors.patientAge ? 'border-destructive' : ''}
                      />
                      {errors.patientAge && (
                        <p className="text-sm text-destructive mt-1">{errors.patientAge}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="patientGender">Gender *</Label>
                      <Select value={formData.patientGender} onValueChange={(value) => handleInputChange('patientGender', value)}>
                        <SelectTrigger className={errors.patientGender ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.patientGender && (
                        <p className="text-sm text-destructive mt-1">{errors.patientGender}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        placeholder="Enter contact number"
                        className={errors.contactNumber ? 'border-destructive' : ''}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.contactNumber}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                      <Input
                        id="emergencyContact"
                        type="tel"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Enter emergency contact"
                        className={errors.emergencyContact ? 'border-destructive' : ''}
                      />
                      {errors.emergencyContact && (
                        <p className="text-sm text-destructive mt-1">{errors.emergencyContact}</p>
                      )}
                    </div>
                  </div>

                                     {/* Medical Information */}
                   <div>
                     <Label htmlFor="symptoms">Symptoms Description *</Label>
                     <Textarea
                       id="symptoms"
                       value={formData.symptoms}
                       onChange={(e) => handleInputChange('symptoms', e.target.value)}
                       placeholder="Describe your symptoms in detail"
                       rows={4}
                       className={errors.symptoms ? 'border-destructive' : ''}
                     />
                     {errors.symptoms && (
                       <p className="text-sm text-destructive mt-1">{errors.symptoms}</p>
                     )}
                   </div>

                   {/* Treatment Type Selection */}
                   <div>
                     <Label htmlFor="treatmentType">Treatment Type *</Label>
                     <Select value={formData.treatmentType} onValueChange={(value) => handleInputChange('treatmentType', value)}>
                       <SelectTrigger className={errors.treatmentType ? 'border-destructive' : ''}>
                         <SelectValue placeholder="Select the type of treatment you need" />
                       </SelectTrigger>
                       <SelectContent>
                         {hospital.specialization ? (
                           hospital.specialization.split(', ').map((tech, index) => (
                             <SelectItem key={index} value={tech.trim()}>
                               {tech.trim()}
                             </SelectItem>
                           ))
                         ) : hospital.departments && hospital.departments.length > 0 ? (
                           hospital.departments.map((dept, index) => (
                             <SelectItem key={index} value={dept}>
                               {dept}
                             </SelectItem>
                           ))
                         ) : (
                           <SelectItem value="general">General Healthcare</SelectItem>
                         )}
                       </SelectContent>
                     </Select>
                     {errors.treatmentType && (
                       <p className="text-sm text-destructive mt-1">{errors.treatmentType}</p>
                     )}
                     <p className="text-xs text-muted-foreground mt-1">
                       Select the specific treatment type that matches your medical needs
                     </p>
                     {/* Debug info - remove in production */}
                     {process.env.NODE_ENV === 'development' && (
                       <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                         <p>Debug: specialization = {hospital.specialization || 'null'}</p>
                         <p>Debug: departments = {JSON.stringify(hospital.departments) || 'null'}</p>
                       </div>
                     )}
                   </div>

                  <div>
                    <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                    <Textarea
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      placeholder="Any relevant medical history, allergies, or current medications"
                      rows={3}
                    />
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <Label htmlFor="preferredDate">Preferred Appointment Date *</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.preferredDate ? 'border-destructive' : ''}
                    />
                    {errors.preferredDate && (
                      <p className="text-sm text-destructive mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[150px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        'Submit Registration'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
