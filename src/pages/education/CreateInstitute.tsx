import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, X, Crop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { ImageCropper } from '@/components/ui/image-cropper'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

const steps = [
  "Basic Information",
  "Contact Details", 
  "Media & Branding",
  "Courses & Programs",
  "Review & Submit"
]

export default function CreateInstitute() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [currentStep, setCurrentStep] = useState(0)
  const [courses, setCourses] = useState<string[]>([])
  const [newCourse, setNewCourse] = useState("")
  const [form, setForm] = useState<any>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const { toast } = useToast();
  const [courseError, setCourseError] = useState<string | null>(null);
  
  // Image cropper states
  const [showLogoCropper, setShowLogoCropper] = useState(false)
  const [showBannerCropper, setShowBannerCropper] = useState(false)
  const [tempLogoFile, setTempLogoFile] = useState<File | null>(null)
  const [tempBannerFile, setTempBannerFile] = useState<File | null>(null)

  // Fetch institute data if editing
  useEffect(() => {
    // Check authentication
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .catch(() => navigate('/login'));
    if (id) {
      fetch(`${API_BASE_URL}/api/institute/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.institute) {
            setForm(data.institute)
            // Convert course objects back to strings for display
            const courseNames = (data.institute.courses || []).map((course: any) => 
              typeof course === 'string' ? course : course.name || course
            );
            setCourses(courseNames)
          }
        })
    } else {
      // Set default values for required fields
      setForm((prev: any) => ({
        color: '#000000',
        admissionStatus: 'Open',
        province: 'Punjab',
        ...prev,
      }));
    }
  }, [id, navigate])

  const addCourse = () => {
    if (newCourse.trim()) {
      setCourses([...courses, newCourse.trim()]);
      setNewCourse("");
      setCourseError(null);
    } else {
      setCourseError('Course name cannot be empty');
    }
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    // If on the courses step and newCourse is not empty, add it
    if (currentStep === 3 && newCourse.trim()) {
      addCourse();
      return; // Wait for the next click to actually go to the next step
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Update form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'logo') {
        setTempLogoFile(file);
        setShowLogoCropper(true);
      }
      if (type === 'banner') {
        setTempBannerFile(file);
        setShowBannerCropper(true);
      }
    }
  }

  // Handle cropped logo
  const handleLogoCropComplete = (croppedFile: File) => {
    setLogoFile(croppedFile);
    setLogoPreview(URL.createObjectURL(croppedFile));
    setTempLogoFile(null);
    setShowLogoCropper(false);
  }

  // Handle cropped banner
  const handleBannerCropComplete = (croppedFile: File) => {
    setBannerFile(croppedFile);
    setBannerPreview(URL.createObjectURL(croppedFile));
    setTempBannerFile(null);
    setShowBannerCropper(false);
  }

  // Handle editing existing logo
  const handleEditLogo = () => {
    if (logoFile) {
      setTempLogoFile(logoFile);
      setShowLogoCropper(true);
    }
  }

  // Handle editing existing banner
  const handleEditBanner = () => {
    if (bannerFile) {
      setTempBannerFile(bannerFile);
      setShowBannerCropper(true);
    }
  }

  // Close cropper without applying
  const handleCloseLogoCropper = () => {
    setShowLogoCropper(false);
    setTempLogoFile(null);
  }

  const handleCloseBannerCropper = () => {
    setShowBannerCropper(false);
    setTempBannerFile(null);
  }

  // Submit handler
  const handleSubmit = async () => {
    // If on the courses step and newCourse is not empty, add it and block submit
    if (currentStep === 3 && newCourse.trim()) {
      addCourse();
      setCourseError('Please click Add to add your course before submitting.');
      return;
    }
    
    // Clear previous course errors
    setCourseError(null);
    
    // Debug: log form state and files
    console.log('Submitting form:', form);
    console.log('logoFile:', logoFile);
    console.log('bannerFile:', bannerFile);
    console.log('courses:', courses);
    
    // Enhanced validation with specific error messages
    const missingFields = [];
    
    if (!form.name) missingFields.push('Institute Name');
    if (!form.type) missingFields.push('Institute Type');
    if (!form.city) missingFields.push('City');
    if (!form.province) missingFields.push('Province');
    if (!form.description) missingFields.push('Description');
    if (!form.phone) missingFields.push('Phone Number');
    if (!form.email) missingFields.push('Email Address');
    if (!form.address) missingFields.push('Address');
    if (!form.specialization) missingFields.push('Main Specialization');
    if (!logoFile) missingFields.push('Logo Image');
    if (!bannerFile) missingFields.push('Banner Image');
    if (courses.length === 0) {
      missingFields.push('At least one course');
      setCourseError('Please add at least one course');
    }
    
    if (missingFields.length > 0) {
      toast({ 
        title: 'Missing Required Fields', 
        description: `Please provide: ${missingFields.join(', ')}`, 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      
      // Add all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'banner' && value) {
          formData.append(key, value as string)
        }
      })
      
      // Convert course strings to course objects matching the backend schema
      const courseObjects = courses.map(courseName => ({
        name: courseName,
        description: '',
        duration: '',
        fee: 0,
        category: ''
      }));
      
      // Add courses as JSON string
      formData.append('courses', JSON.stringify(courseObjects))
      
      // Add files
      if (logoFile) formData.append('logo', logoFile)
      if (bannerFile) formData.append('banner', bannerFile)
      
      // Determine method and URL
      const method = id ? 'PUT' : 'POST'
      const url = id ? `${API_BASE_URL}/api/institute/${id}` : `${API_BASE_URL}/api/institute/create`
      
      console.log('Making request to:', url);
      console.log('Method:', method);
      
      const res = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      })
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const responseData = await res.json();
        console.log('Success response:', responseData);
        toast({ 
          title: 'Success!', 
          description: id ? 'Institute updated successfully!' : 'Institute created successfully!', 
          variant: 'default' 
        });
        navigate('/education');
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        toast({ 
          title: 'Error', 
          description: errorData.error || errorData.message || 'Failed to submit institute', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      toast({ 
        title: 'Network Error', 
        description: 'Failed to connect to server. Please check your connection and try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Institute Name *</Label>
                <Input id="name" placeholder="Enter institute name" value={form.name || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="type">Institute Type *</Label>
                <Select value={form.type} onValueChange={value => setForm({ ...form, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="School">School</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <RichTextEditor
                value={form.description || ''}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="Describe your institute, its mission, and what makes it unique"
                rows={6}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="establishedYear">Year Established</Label>
                <Input id="establishedYear" type="number" placeholder="e.g. 1984" value={form.establishedYear || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="totalStudents">Number of Students</Label>
                <Input id="totalStudents" placeholder="e.g. 5000" value={form.totalStudents || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+92-xxx-xxxxxxx" value={form.phone || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="contact@institute.edu.pk" value={form.email || ''} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea 
                id="address" 
                placeholder="Enter complete address with city and postal code"
                className="min-h-24"
                value={form.address || ''}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">City *</Label>
                <Select value={form.city} onValueChange={value => setForm({ ...form, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                    <SelectItem value="multan">Multan</SelectItem>
                    <SelectItem value="peshawar">Peshawar</SelectItem>
                    <SelectItem value="quetta">Quetta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="province">Province *</Label>
                <Select value={form.province} onValueChange={value => setForm({ ...form, province: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Sindh">Sindh</SelectItem>
                    <SelectItem value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</SelectItem>
                    <SelectItem value="Balochistan">Balochistan</SelectItem>
                    <SelectItem value="Islamabad Capital Territory">Islamabad Capital Territory</SelectItem>
                    <SelectItem value="Gilgit-Baltistan">Gilgit-Baltistan</SelectItem>
                    <SelectItem value="Azad Kashmir">Azad Kashmir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-3 pb-1">
            <div>
              <Label>Institute Logo *</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-3 text-center">
                {logoPreview ? (
                  <div className="space-y-1">
                    <img src={logoPreview} alt="Logo Preview" className="mx-auto w-16 h-16 object-cover rounded-full" />
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={handleEditLogo}
                      >
                        <Crop className="h-3 w-3 mr-1" />
                        Adjust & Crop
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-1">Upload your institute logo</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button variant="outline" className="mt-2" onClick={() => document.getElementById('logo-upload')?.click()}>
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label>Banner Image *</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-3 text-center">
                {bannerPreview ? (
                  <div className="space-y-1">
                    <img src={bannerPreview} alt="Banner Preview" className="mx-auto w-full max-w-lg h-16 object-cover rounded-lg" />
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={handleEditBanner}
                      >
                        <Crop className="h-3 w-3 mr-1" />
                        Adjust & Crop
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview(null);
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-1">Upload a banner image of your institute</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (Recommended: 1200x600px)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'banner')}
                      className="hidden"
                      id="banner-upload"
                    />
                    <Button variant="outline" className="mt-2" onClick={() => document.getElementById('banner-upload')?.click()}>
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Brand Color</Label>
                <Input id="color" type="color" className="h-10" value={form.color || '#000000'} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Your institute's tagline" value={form.tagline || ''} onChange={handleChange} />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Courses & Programs *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="Enter course name"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCourse(); } }}
                />
                <Button onClick={addCourse} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {courseError && <div className="text-xs text-red-500 mt-1">{courseError}</div>}
              {courses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {courses.map((course, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {course}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCourse(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="specialization">Main Specialization *</Label>
                <Input id="specialization" placeholder="e.g. Engineering, Business, Medicine" value={form.specialization || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="admission-status">Admission Status</Label>
                <Select value={form.admissionStatus} onValueChange={value => setForm({ ...form, admissionStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="facilities">Facilities</Label>
              <Textarea 
                id="facilities" 
                placeholder="List your institute's facilities (Library, Labs, Sports, etc.)"
                className="min-h-24"
                value={form.facilities || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Review Your Information</h3>
              <p className="text-muted-foreground">
                Please review all the information before submitting your institute
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Basic Information</h4>
                    <p className="text-muted-foreground">Institute details and description</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Contact Details</h4>
                    <p className="text-muted-foreground">Phone, email, and address information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Media & Branding</h4>
                    <p className="text-muted-foreground">Logo, banner, and brand elements</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Courses & Programs</h4>
                    <p className="text-muted-foreground">{courses.length} courses added</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                By submitting this form, you agree to our terms and conditions. 
                Your institute will be reviewed by our team before being published.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/education')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Institute Profile</h1>
              <p className="text-muted-foreground">Share your educational institute with students</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pb-6">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-between mt-8"
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Institute'}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Image Cropper Components */}
      <ImageCropper
        isOpen={showLogoCropper}
        onClose={handleCloseLogoCropper}
        imageFile={tempLogoFile}
        imageSrc={tempLogoFile ? undefined : logoPreview || undefined}
        onCropComplete={handleLogoCropComplete}
        aspectRatio={1}
        title="Crop Logo"
      />
      
      <ImageCropper
        isOpen={showBannerCropper}
        onClose={handleCloseBannerCropper}
        imageFile={tempBannerFile}
        imageSrc={tempBannerFile ? undefined : bannerPreview || undefined}
        onCropComplete={handleBannerCropComplete}
        aspectRatio={2}
        title="Crop Banner"
      />
    </div>
  )
}
