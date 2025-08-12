import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'

interface Course {
  _id?: string;
  name: string;
  description?: string;
  duration?: string;
  fee?: number;
  category?: string;
}

interface Institute {
  _id: string;
  name: string;
  courses?: Course[];
  city?: string;
}

export default function ApplyNow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [institute, setInstitute] = useState<Institute | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const [studentName, setStudentName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [cnic, setCnic] = useState('')
  const [city, setCity] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [courseDuration, setCourseDuration] = useState('')
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return
    const fetchInstitute = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/institute/${id}`)
        const data = await res.json()
        if (data.institute) {
          setInstitute(data.institute)
          setCourses(data.institute.courses || [])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchInstitute()
  }, [id])

  useEffect(() => {
    const course = courses.find(c => String(c._id || c.name) === selectedCourseId)
    setCourseDuration(course?.duration || '')
  }, [selectedCourseId, courses])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setProfileImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !institute) return
    const selectedCourse = courses.find(c => String(c._id || c.name) === selectedCourseId)
    if (!selectedCourse) {
      toast({ title: 'Select Course', description: 'Please select a course to apply.', variant: 'destructive' })
      return
    }

    const formData = new FormData()
    formData.append('studentName', studentName)
    formData.append('fatherName', fatherName)
    formData.append('cnic', cnic)
    formData.append('city', city)
    formData.append('courseName', selectedCourse.name)
    formData.append('courseDuration', selectedCourse.duration || '')
    if (profileImageFile) formData.append('profileImage', profileImageFile)

    try {
      const res = await fetch(`${API_BASE_URL}/api/institute/${id}/apply`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }
      toast({ title: 'Application Submitted', description: 'Your application has been submitted successfully.' })
      const payload = {
        student: {
          name: studentName,
          fatherName,
          cnic,
          city,
          profileImage: data.application?.profileImage || profileImagePreview || '',
        },
        course: { name: selectedCourse.name, duration: selectedCourse.duration || '' },
        institute: { id: institute._id, name: institute.name, city: institute.city },
      }
      navigate('/education/dashboard', { state: payload, replace: true })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to submit application', variant: 'destructive' })
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Apply Now{institute ? ` - ${institute.name}` : ''}</h1>
            <p className="text-sm text-muted-foreground">Fill in your details to apply to this institute.</p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-6 text-center text-muted-foreground">Loading...</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentName">Student's Name</Label>
                      <Input id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input id="fatherName" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnic">B-Form/CNIC Number</Label>
                      <Input id="cnic" value={cnic} onChange={(e) => setCnic(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Course</Label>
                      <Select
                        value={selectedCourseId}
                        onValueChange={setSelectedCourseId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={courses.length ? 'Select a course' : 'No courses available'} />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={String(course._id || course.name)} value={String(course._id || course.name)}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input id="duration" value={courseDuration} readOnly placeholder="Auto-filled" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profilePic">Profile Picture</Label>
                    <Input id="profilePic" type="file" accept="image/*" onChange={handleImageChange} />
                    {profileImagePreview && (
                      <img src={profileImagePreview} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-full" />
                    )}
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full sm:w-auto">Submit Application</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


