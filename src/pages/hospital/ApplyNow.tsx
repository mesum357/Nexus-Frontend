import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'

interface Hospital {
  _id: string
  name: string
  type?: string
  city?: string
  specialization?: string
}

interface Department {
  _id?: string
  name: string
}

export default function HospitalApplyNow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Form fields
  const [patientName, setPatientName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [cnic, setCnic] = useState('')
  const [city, setCity] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    // Fetch current user data
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { 
        setCurrentUser(data.user || null)
        // Auto-fill patient name from current user
        if (data.user?.fullName) {
          setPatientName(data.user.fullName)
        }
      })
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    if (id) {
      fetchHospital()
    }
  }, [id])

  const fetchHospital = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}`)
      if (response.ok) {
        const data = await response.json()
        setHospital(data.institute)
        
        // Extract departments from specialization
        if (data.institute.specialization) {
          const deptList = data.institute.specialization.split(', ').map((dept: string) => ({ name: dept.trim() }))
          setDepartments(deptList)
        }
        
        setLoading(false)
      } else {
        toast({ title: 'Error', description: 'Failed to fetch hospital details', variant: 'destructive' })
        navigate('/hospital')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch hospital details', variant: 'destructive' })
      navigate('/hospital')
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!patientName || !fatherName || !cnic || !city || !selectedDepartment) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/patient-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          patientName,
          fatherName,
          cnic,
          city,
          department: selectedDepartment
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast({ title: 'Success!', description: 'Application submitted successfully!' })
        
        // Navigate to patient dashboard with application data
        const payload = {
          patient: { 
            name: patientName, 
            cnic, 
            city, 
            profileImage: currentUser?.profileImage || null 
          },
          department: selectedDepartment,
          hospital: hospital
        }
                 navigate(`/hospital/${id}/patient-dashboard`, { state: payload, replace: true })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to submit application', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Button variant="ghost" onClick={() => navigate(`/hospital/${id}`)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hospital
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Patient Registration{hospital ? ` - ${hospital.name}` : ''}</h1>
            <p className="text-sm text-muted-foreground">Fill in your details to register at this hospital.</p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Registration Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div>
                     <Label htmlFor="patientName">Patient's Name *</Label>
                     <Input 
                       id="patientName" 
                       value={patientName} 
                       onChange={(e) => setPatientName(e.target.value)} 
                       required 
                       readOnly
                       className="bg-muted"
                     />
                   </div>
                  <div>
                    <Label htmlFor="fatherName">Father's Name *</Label>
                    <Input 
                      id="fatherName" 
                      value={fatherName} 
                      onChange={(e) => setFatherName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnic">B-Form/CNIC Number *</Label>
                    <Input 
                      id="cnic" 
                      value={cnic} 
                      onChange={(e) => setCnic(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label>Department *</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={departments.length ? 'Select a department' : 'No departments available'} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept, index) => (
                        <SelectItem key={index} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                

                <div className="pt-2">
                  <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
