import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Upload, Plus, X, Crop, Stethoscope, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchableSelect } from '@/components/ui/searchable-select'
import Navbar from '@/components/Navbar'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { ImageCropper } from '@/components/ui/image-cropper'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import PaymentSection from '@/components/PaymentSection'
import TermsAndPolicies from '@/components/ui/TermsAndPolicies'
import { PAKISTAN_CITIES } from '@/lib/cities'

const steps = [
  'Basic Information',
  'Contact Details',
  'Media & Branding',
  'Technicalities',
  'Payment Section',
  'Review & Submit'
]

interface TechInput { name: string; }

export default function CreateHospital() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const [currentStep, setCurrentStep] = useState(0)
  const [techs, setTechs] = useState<TechInput[]>([])
  const [newTech, setNewTech] = useState('')
  const [form, setForm] = useState<any>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const { toast } = useToast()
  const [techError, setTechError] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [createdHospital, setCreatedHospital] = useState<any>(null)

  const [showLogoCropper, setShowLogoCropper] = useState(false)
  const [showBannerCropper, setShowBannerCropper] = useState(false)
  const [tempLogoFile, setTempLogoFile] = useState<File | null>(null)
  const [tempBannerFile, setTempBannerFile] = useState<File | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .catch(() => navigate('/login'))
    // Set defaults similar to institute create when creating a new hospital
    if (!id) {
      setForm((prev: any) => ({
        color: '#000000',
        admissionStatus: 'Open',
        province: 'Punjab',
        ...prev,
      }))
    }
  }, [navigate])

  const addTech = () => {
    if (newTech.trim()) {
      setTechs([...techs, { name: newTech.trim() }])
      setNewTech('')
      setTechError(null)
    } else {
      setTechError('Technicality name cannot be empty')
    }
  }

  const removeTech = (index: number) => setTechs(techs.filter((_, i) => i !== index))

  const handlePaymentComplete = async (paymentData: any) => {
    // Payment is now handled directly in PaymentSection component
    // This function is called after successful payment submission
    setPaymentCompleted(true);
    console.log('Payment completed:', paymentData);
    
    toast({ 
      title: 'Payment Submitted Successfully', 
      description: 'Your payment request has been submitted to the admin panel for review. You can now proceed to review your hospital details.' 
    });
  }

  const handleAcceptTerms = () => {
    setAcceptTerms(true);
  };

  const nextStep = () => {
    if (currentStep === 3 && newTech.trim()) {
      addTech()
      return
    }
    
    // If trying to go to review step (step 5) without completing payment
    if (currentStep === 4 && !paymentCompleted) {
      toast({ 
        title: 'Payment Required', 
        description: 'Please complete the payment section before proceeding to review.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (type === 'logo') { setTempLogoFile(file); setShowLogoCropper(true) }
      if (type === 'banner') { setTempBannerFile(file); setShowBannerCropper(true) }
    }
  }

  const handleLogoCropComplete = (croppedFile: File) => {
    setLogoFile(croppedFile)
    setLogoPreview(URL.createObjectURL(croppedFile))
    setTempLogoFile(null)
    setShowLogoCropper(false)
  }

  const handleBannerCropComplete = (croppedFile: File) => {
    setBannerFile(croppedFile)
    setBannerPreview(URL.createObjectURL(croppedFile))
    setTempBannerFile(null)
    setShowBannerCropper(false)
  }

  const handleCloseLogoCropper = () => { setShowLogoCropper(false); setTempLogoFile(null) }
  const handleCloseBannerCropper = () => { setShowBannerCropper(false); setTempBannerFile(null) }

  const handleSubmit = async () => {
    // Hospital is already created in handlePaymentComplete, just navigate to success
    toast({ 
      title: 'Hospital Creation Complete!', 
      description: 'Your hospital has been created successfully and payment submitted. It is now pending admin approval!' 
    });
    navigate('/hospital');
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Hospital Name *</Label>
                <Input id="name" placeholder="Enter hospital name" value={form.name || ''} onChange={handleChange} className="h-10 sm:h-10" />
              </div>
              <div>
                <Label htmlFor="type" className="text-sm sm:text-base">Hospital Type *</Label>
                 <Select value={form.type} onValueChange={value => setForm({ ...form, type: value })}>
                   <SelectTrigger className="h-10 sm:h-10"><SelectValue placeholder="Select hospital type" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Hospital">Hospital</SelectItem>
                     <SelectItem value="General">General</SelectItem>
                     <SelectItem value="Specialized">Specialized</SelectItem>
                     <SelectItem value="Clinic">Clinic</SelectItem>
                     <SelectItem value="Medical Center">Medical Center</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="establishedYear" className="text-sm sm:text-base">Year Established</Label>
              <Input id="establishedYear" type="number" placeholder="e.g. 1995" value={form.establishedYear || ''} onChange={handleChange} className="h-10 sm:h-10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="totalPatients" className="text-sm sm:text-base">Number of Patients</Label>
                <Input id="totalPatients" placeholder="e.g. 120000" value={form.totalPatients || ''} onChange={handleChange} className="h-10 sm:h-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm sm:text-base">Description *</Label>
              <RichTextEditor value={form.description || ''} onChange={(value) => setForm({ ...form, description: value })} placeholder="Describe your hospital, departments, and services" rows={6} maxLength={2000} />
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
                <Input id="email" type="email" placeholder="contact@hospital.pk" value={form.email || ''} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea id="address" placeholder="Enter complete address" className="min-h-24" value={form.address || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">City *</Label>
                <SearchableSelect
                  value={form.city}
                  onValueChange={(value) => setForm({ ...form, city: value })}
                  placeholder="Select city"
                  options={PAKISTAN_CITIES}
                />
              </div>
              <div>
                <Label htmlFor="province">Province *</Label>
                <Select value={form.province} onValueChange={value => setForm({ ...form, province: value })}>
                  <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
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
              <Label>Hospital Logo *</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-3 text-center">
                {logoPreview ? (
                  <div className="space-y-1">
                    <img src={logoPreview} alt="Logo Preview" className="mx-auto w-16 h-16 object-cover rounded-full" />
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={() => setShowLogoCropper(true)}>
                        <Crop className="h-3 w-3 mr-1" />
                        Adjust & Crop
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={() => { setLogoFile(null); setLogoPreview(null) }}>
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-1">Upload your hospital logo</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" id="logo-upload" />
                    <Button variant="outline" className="mt-2" onClick={() => document.getElementById('logo-upload')?.click()}>Choose File</Button>
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
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={() => setShowBannerCropper(true)}>
                        <Crop className="h-3 w-3 mr-1" />
                        Adjust & Crop
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={() => { setBannerFile(null); setBannerPreview(null) }}>
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-1">Upload a banner image of your hospital</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (Recommended: 1200x600px)</p>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" id="banner-upload" />
                    <Button variant="outline" className="mt-2" onClick={() => document.getElementById('banner-upload')?.click()}>Choose File</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Technicalities *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-2">
                <div className="sm:col-span-5">
                  <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="Enter department or specialty" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }} />
                </div>
              </div>
              <div className="mt-2"><Button onClick={addTech} type="button"><Plus className="h-4 w-4" /></Button></div>
              {techError && <div className="text-xs text-red-500 mt-1">{techError}</div>}
              {techs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {techs.map((t, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-2 py-1 text-xs bg-secondary rounded">
                      <Stethoscope className="h-3 w-3" />
                      {t.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTech(index)} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 4:
        return (
                  <PaymentSection 
          entityType="hospital"
          onPaymentComplete={handlePaymentComplete}
          isRequired={true}
          isSubmitting={isSubmitting}
        />
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Review Your Information</h3>
              <p className="text-muted-foreground">Please review all the information before submitting your hospital</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div><h4 className="font-semibold text-foreground">Basic Information</h4><p className="text-muted-foreground">Hospital details and description</p></div>
                  <div><h4 className="font-semibold text-foreground">Contact Details</h4><p className="text-muted-foreground">Phone, email, and address information</p></div>
                  <div><h4 className="font-semibold text-foreground">Media & Branding</h4><p className="text-muted-foreground">Logo, banner, and brand elements</p></div>
                  <div><h4 className="font-semibold text-foreground">Technicalities</h4><p className="text-muted-foreground">{techs.length} item(s) added</p></div>
                  <div><h4 className="font-semibold text-foreground">Payment Status</h4><p className={`${paymentCompleted ? 'text-green-600' : 'text-red-600'} font-medium`}>{paymentCompleted ? '✓ Payment Completed' : '✗ Payment Required'}</p></div>
                </div>
              </CardContent>
            </Card>
            {/* Terms and Conditions */}
            <Card className={`transition-all duration-200 ${acceptTerms ? 'border-marketplace-success/30 bg-marketplace-success/5' : ''}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                        I accept the Terms and Conditions <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By creating this hospital profile, you agree to our terms of service, 
                        privacy policy, and healthcare institution guidelines. You confirm that all information 
                        provided is accurate and that you have the right to represent this hospital.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTerms(true)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Read Full Terms & Policies
                    </Button>
                    
                    {acceptTerms && (
                      <div className="flex items-center gap-2 text-marketplace-success text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Terms Accepted</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">By submitting this form, you agree to our terms and conditions. Your hospital will be reviewed before being published.</p>
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
      <div className="pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button variant="ghost" onClick={() => navigate('/hospital')} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create Hospital Profile</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Share your hospital with patients</p>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1 w-full sm:w-auto">
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                    ${index <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-2 sm:ml-3 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`${index < currentStep ? 'bg-primary' : 'bg-muted'} h-0.5 flex-1 mx-2 sm:mx-4 hidden sm:block`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <Card>
              <CardHeader className="pb-4"><CardTitle className="text-lg sm:text-xl">{steps[currentStep]}</CardTitle></CardHeader>
              <CardContent className="p-4 sm:p-6">{renderStepContent()}</CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="w-full sm:w-auto order-2 sm:order-1">Previous</Button>
            {currentStep === steps.length - 1 ? (
              <Button 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2" 
                onClick={handleSubmit} 
                disabled={isSubmitting || !paymentCompleted || !acceptTerms}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Hospital'}
              </Button>
            ) : (
              <Button onClick={nextStep} className="w-full sm:w-auto order-1 sm:order-2">Next</Button>
            )}
          </motion.div>
        </div>
      </div>

      <ImageCropper isOpen={showLogoCropper} onClose={handleCloseLogoCropper} imageFile={tempLogoFile} imageSrc={tempLogoFile ? undefined : logoPreview || undefined} onCropComplete={handleLogoCropComplete} aspectRatio={1} title="Crop Logo" />
      <ImageCropper isOpen={showBannerCropper} onClose={handleCloseBannerCropper} imageFile={tempBannerFile} imageSrc={tempBannerFile ? undefined : bannerPreview || undefined} onCropComplete={handleBannerCropComplete} aspectRatio={2} title="Crop Banner" />

      {/* Terms and Policies Popup */}
      <TermsAndPolicies
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        title="Hospital Creation Terms"
      />
    </div>
  )
}


