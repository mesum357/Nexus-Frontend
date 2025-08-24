import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Loader2, Plus, Trash2, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageCropper } from '@/components/ui/image-cropper'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'

const steps = [
  'Basic Information',
  'Contact Details',
  'Media & Branding',
  'Technicalities',
  'Review & Submit'
]

export default function EditHospital() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [currentStep, setCurrentStep] = useState(0)
  const [techs, setTechs] = useState<string[]>([])
  const [newTech, setNewTech] = useState('')
  const [form, setForm] = useState<any>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [showLogoCropper, setShowLogoCropper] = useState(false)
  const [showBannerCropper, setShowBannerCropper] = useState(false)
  const [logoCropFile, setLogoCropFile] = useState<File | null>(null)
  const [bannerCropFile, setBannerCropFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) { navigate('/hospital'); return }
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
              .then(data => fetch(`${API_BASE_URL}/api/hospital/${id}`).then(res => res.json()).then(hData => {
        if (hData.hospital) {
          const hospital = hData.hospital
          if (String(hospital.owner) !== String(data.user._id)) {
            toast({ title: 'Access Denied', description: 'You can only edit hospitals you own.', variant: 'destructive' })
            navigate('/hospital')
            return
          }
          setForm(hospital)
          const techNames = hospital.specialization ? hospital.specialization.split(', ').filter((t: string) => t.trim()) : []
          setTechs(techNames)
          if (hospital.logo) setLogoPreview(`${API_BASE_URL}${hospital.logo}`)
          if (hospital.banner) setBannerPreview(`${API_BASE_URL}${hospital.banner}`)
        }
        setIsLoading(false)
      }))
      .catch(() => { toast({ title: 'Authentication Required', description: 'Please log in to edit hospitals.', variant: 'destructive' }); navigate('/login') })
  }, [id, navigate, toast])

  const addTech = () => { if (newTech.trim()) { setTechs([...techs, newTech.trim()]); setNewTech('') } }
  const removeTech = (index: number) => setTechs(techs.filter((_, i) => i !== index))
  const nextStep = () => { if (currentStep === 3 && newTech.trim()) { addTech(); return } if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1) }
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setForm((prev: any) => ({ ...prev, [name]: value })) }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => { const file = e.target.files?.[0]; if (file) { if (type === 'logo') { setLogoCropFile(file); setShowLogoCropper(true) } else { setBannerCropFile(file); setShowBannerCropper(true) } } }
  const handleLogoCropComplete = (croppedFile: File) => { setLogoFile(croppedFile); setLogoPreview(URL.createObjectURL(croppedFile)); setShowLogoCropper(false); setLogoCropFile(null) }
  const handleBannerCropComplete = (croppedFile: File) => { setBannerFile(croppedFile); setBannerPreview(URL.createObjectURL(croppedFile)); setShowBannerCropper(false); setBannerCropFile(null) }
  const handleCloseLogoCropper = () => { setShowLogoCropper(false); setLogoCropFile(null) }
  const handleCloseBannerCropper = () => { setShowBannerCropper(false); setBannerCropFile(null) }

  const handleSubmit = async () => {
    try {
      const authResponse = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      if (!authResponse.ok) { toast({ title: 'Authentication Required', description: 'Please log in to edit hospitals.', variant: 'destructive' }); navigate('/login'); return }
    } catch (error) {
      toast({ title: 'Authentication Error', description: 'Please log in to edit hospitals.', variant: 'destructive' }); navigate('/login'); return
    }
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (!['logo','banner','_id','__v','owner','specialization'].includes(key)) {
          formData.append(key, form[key])
        }
      })
      formData.append('specialization', techs.join(', '))
      if (logoFile) formData.append('logo', logoFile)
      if (bannerFile) formData.append('banner', bannerFile)
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}`, { method: 'PUT', credentials: 'include', body: formData })
      if (response.ok) {
        toast({ title: 'Success!', description: 'Hospital updated successfully.' })
        navigate(`/hospital/${id}`)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update hospital')
      }
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to update hospital', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Hospital Name *</Label>
              <Input id="name" name="name" value={form.name || ''} onChange={handleChange} placeholder="Enter hospital name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Hospital Type *</Label>
                <Select value={form.type || ''} onValueChange={(value) => setForm((prev: any) => ({ ...prev, type: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select hospital type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Specialized">Specialized</SelectItem>
                    <SelectItem value="Clinic">Clinic</SelectItem>
                    <SelectItem value="Medical Center">Medical Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={form.city || ''} onChange={handleChange} placeholder="Enter city" required />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location/Address *</Label>
              <Textarea id="location" name="location" value={form.location || ''} onChange={handleChange} placeholder="Enter full address" required />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <RichTextEditor value={form.description || ''} onChange={(value) => setForm({ ...form, description: value })} placeholder="Describe your hospital" rows={6} maxLength={2000} />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Enter phone number" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email || ''} onChange={handleChange} placeholder="Enter email address" />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Hospital Logo</Label>
              <div className="mt-2">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input type="file" id="logo-upload" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
                    <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                  </div>
                  {(logoPreview || form.logo) && (
                    <div className="relative">
                      <img src={logoPreview || `${API_BASE_URL}${form.logo}`} alt="Logo preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                      <div className="absolute -top-2 -right-2 flex space-x-1">
                        <button type="button" onClick={() => setShowLogoCropper(true)} className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600">
                          <Upload className="h-3 w-3" />
                        </button>
                        <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null) }} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label>Hospital Banner</Label>
              <div className="mt-2">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input type="file" id="banner-upload" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" />
                    <label htmlFor="banner-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Banner
                    </label>
                  </div>
                  {(bannerPreview || form.banner) && (
                    <div className="relative">
                      <img src={bannerPreview || `${API_BASE_URL}${form.banner}`} alt="Banner preview" className="w-32 h-20 object-cover rounded border-2 border-gray-200" />
                      <div className="absolute -top-2 -right-2 flex space-x-1">
                        <button type="button" onClick={() => setShowBannerCropper(true)} className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600">
                          <Upload className="h-3 w-3" />
                        </button>
                        <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(null) }} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Technicalities</Label>
              <div className="mt-2 space-y-4">
                <div className="flex space-x-2">
                  <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Enter department or specialty" onKeyPress={(e) => e.key === 'Enter' && addTech()} />
                  <Button type="button" onClick={addTech} variant="outline"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techs.map((t, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <Stethoscope className="h-3 w-3" />
                      <span>{t}</span>
                      <button type="button" onClick={() => removeTech(index)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Review Your Hospital Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-sm font-medium text-gray-600">Name</p><p className="text-sm">{form.name}</p></div>
                <div><p className="text-sm font-medium text-gray-600">Type</p><p className="text-sm">{form.type}</p></div>
                <div><p className="text-sm font-medium text-gray-600">City</p><p className="text-sm">{form.city}</p></div>
                <div><p className="text-sm font-medium text-gray-600">Phone</p><p className="text-sm">{form.phone || 'Not provided'}</p></div>
                <div><p className="text-sm font-medium text-gray-600">Email</p><p className="text-sm">{form.email || 'Not provided'}</p></div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-sm">{form.location}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">Technicalities ({techs.length})</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {techs.map((t, index) => (<Badge key={index} variant="outline" className="text-xs"><Stethoscope className="h-3 w-3 mr-1" />{t}</Badge>))}
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading hospital data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/hospital')} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Hospital</h1>
              <p className="text-muted-foreground">Update your hospital information</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${index <= currentStep ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${index <= currentStep ? 'text-primary font-medium' : 'text-gray-500'}`}>{step}</span>
                  {index < steps.length - 1 && (<div className={`w-16 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-gray-300'}`} />)}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">{renderStepContent()}</CardContent>
          </Card>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Hospital'}</Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {showLogoCropper && logoCropFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Logo</h3>
              <Button variant="ghost" onClick={handleCloseLogoCropper}><X className="h-4 w-4" /></Button>
            </div>
            <ImageCropper file={logoCropFile} onCropComplete={handleLogoCropComplete} aspectRatio={1} onCancel={handleCloseLogoCropper} />
          </div>
        </div>
      )}

      {showBannerCropper && bannerCropFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Banner</h3>
              <Button variant="ghost" onClick={handleCloseBannerCropper}><X className="h-4 w-4" /></Button>
            </div>
            <ImageCropper file={bannerCropFile} onCropComplete={handleBannerCropComplete} aspectRatio={16/9} onCancel={handleCloseBannerCropper} />
          </div>
        </div>
      )}
    </div>
  )
}


