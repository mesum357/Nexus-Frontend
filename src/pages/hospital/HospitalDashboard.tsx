import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Star,
  MapPin,
  Users,
  Phone,
  Mail,
  Check,
  ArrowLeft,
  Calendar,
  Building2,
  Plus,
  X,
  Edit3,
  Trash2,
  Upload,
  Eye,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Bell as BellIcon,
  MessageSquare,
  Stethoscope,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { RichTextDisplay } from '@/components/ui/rich-text-display'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  patients?: string;
  totalPatients?: string;
  specialization?: string; // comma-separated technicalities
  phone?: string;
  email?: string;
  owner?: string | { _id: string; username?: string; fullName?: string; email?: string; profileImage?: string };
  website?: string;
  description?: string;
  gallery?: string[];
  doctors?: Doctor[];
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface Doctor {
  _id?: string;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  image?: string;
}

interface Task {
  _id?: string;
  title: string;
  description: string;
  type: 'appointment' | 'medication' | 'test' | 'followup';
  createdAt?: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
}

export default function HospitalDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const { toast } = useToast()

  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    position: '',
    qualification: '',
    experience: '',
    image: null as File | null
  })
  const [doctorImagePreview, setDoctorImagePreview] = useState<string | null>(null)

  const [notifications, setNotifications] = useState<{ _id?: string; title?: string; message: string; createdAt?: string }[]>([])
  const [newNotification, setNewNotification] = useState({ title: '', message: '' })

  const [messages, setMessages] = useState<{ _id?: string; senderName: string; message: string; createdAt?: string }[]>([])
  const [newMessage, setNewMessage] = useState({ senderName: '', message: '' })

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Task>({ title: '', description: '', type: 'appointment' })
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)

  // Patient Applications
  const [patientApplications, setPatientApplications] = useState<any[]>([])
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [applicationNotes, setApplicationNotes] = useState('')

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setCurrentUser(data.user) })
      .catch(() => { setCurrentUser(null) })
  }, [])

  useEffect(() => {
    if (!id) { setError('Hospital ID not found'); setIsLoading(false); return }

    fetch(`${API_BASE_URL}/api/hospital/${id}`)
      .then(res => { if (!res.ok) throw new Error('Hospital not found'); return res.json() })
      .then(data => {
        console.log('🏥 Hospital data received:', data);
        if (data.hospital) {
          console.log('🏥 Setting hospital data:', data.hospital);
          console.log('🏥 Current gallery images:', data.hospital.gallery || []);
          setHospital(data.hospital)
          setGalleryImages(data.hospital.gallery || [])
          setIsLoading(false)
        } else {
          throw new Error('Hospital data not found in response')
        }
      })
      .catch(err => { setError(err.message); setIsLoading(false) })

    fetch(`${API_BASE_URL}/api/hospital/${id}/notifications`).then(res => res.json()).then(data => setNotifications(data.notifications || [])).catch(() => setNotifications([]))
    fetch(`${API_BASE_URL}/api/hospital/${id}/messages`).then(res => res.json()).then(data => setMessages(data.messages || [])).catch(() => setMessages([]))
    fetch(`${API_BASE_URL}/api/hospital/${id}/tasks`).then(res => res.json()).then(data => setTasks(data.tasks || [])).catch(() => setTasks([]))
  }, [id])

  // Separate useEffect for patient applications to ensure it runs when currentUser is available
  useEffect(() => {
    console.log('Patient applications useEffect triggered:', { id, currentUser: currentUser?._id })
    if (id && currentUser) {
          console.log('Fetching patient applications from:', `${API_BASE_URL}/api/hospital/${id}/patient-applications`)
    fetch(`${API_BASE_URL}/api/hospital/${id}/patient-applications`, { credentials: 'include' })
        .then(res => {
          console.log('Patient applications response status:', res.status)
          return res.json()
        })
        .then(data => {
          console.log('Patient applications fetched:', data)
          setPatientApplications(data.applications || [])
        })
        .catch((error) => {
          console.error('Error fetching patient applications:', error)
          setPatientApplications([])
        })
    }
  }, [id, currentUser])

  useEffect(() => {
    console.log('🏥 Owner check useEffect:', { 
      hospitalOwner: hospital?.owner, 
      currentUserId: currentUser?._id,
      hospitalId: hospital?._id,
      hospitalName: hospital?.name,
      currentUser: currentUser?._id 
    })
    if (hospital && currentUser) {
      const isOwnerCheck = String(hospital.owner._id || hospital.owner) === String(currentUser._id)
      console.log('🏥 Setting isOwner to:', isOwnerCheck)
      console.log('🏥 Hospital owner ID:', hospital.owner)
      console.log('🏥 Current user ID:', currentUser._id)
      setIsOwner(isOwnerCheck)
    } else {
      console.log('🏥 Missing data for owner check:', { hasHospital: !!hospital, hasCurrentUser: !!currentUser })
    }
  }, [hospital, currentUser])

  // Clear any existing gallery images on component mount (for development/testing)
  useEffect(() => {
    if (hospital && hospital.gallery && hospital.gallery.length > 0) {
      console.log('🏥 Found existing gallery images:', hospital.gallery);
      // Uncomment the next line to automatically clear existing gallery images
      // clearAllGalleryImages();
    }
  }, [hospital])

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const input = e.currentTarget
    setUploadingImage(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('gallery', file))
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/gallery`, { method: 'POST', credentials: 'include', body: formData })
      const data = await response.json()
      if (response.ok) {
        console.log('🏥 Gallery upload response:', data);
        // The backend returns the updated gallery array
        if (data.gallery && Array.isArray(data.gallery)) {
          setGalleryImages(data.gallery)
          toast({ title: 'Success', description: `Gallery updated successfully!` })
        } else {
          throw new Error('Invalid response format from server')
        }
        if (input) { input.value = '' }
      } else { throw new Error(data.error || 'Failed to upload image(s)') }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to upload image(s) to gallery.', variant: 'destructive' })
    } finally { setUploadingImage(false) }
  }

  const removeGalleryImage = async (imageUrl: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/gallery`, { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl }) })
      if (response.ok) {
        setGalleryImages(prev => prev.filter(img => img !== imageUrl))
        toast({ title: 'Success', description: 'Image removed from gallery successfully!' })
      } else { throw new Error('Failed to remove image') }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove image from gallery.', variant: 'destructive' })
    }
  }

  const clearAllGalleryImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/gallery/clear`, { method: 'DELETE', credentials: 'include' })
      if (response.ok) {
        setGalleryImages([])
        toast({ title: 'Success', description: 'All gallery images cleared successfully!' })
      } else { throw new Error('Failed to clear gallery') }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear gallery images.', variant: 'destructive' })
    }
  }

  const handleDoctorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewDoctor(prev => ({ ...prev, image: file }))
      setDoctorImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.position || !newDoctor.qualification || !newDoctor.experience) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' })
      return
    }
    
    if (!hospital) {
      toast({ title: 'Error', description: 'Hospital data not loaded', variant: 'destructive' })
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('name', newDoctor.name)
      formData.append('position', newDoctor.position)
      formData.append('qualification', newDoctor.qualification)
      formData.append('experience', newDoctor.experience)
      if (newDoctor.image) formData.append('image', newDoctor.image)
      
      console.log('Adding doctor with data:', {
        name: newDoctor.name,
        position: newDoctor.position,
        qualification: newDoctor.qualification,
        experience: newDoctor.experience,
        hasImage: !!newDoctor.image
      })
      
      console.log('Current hospital state:', hospital)
      console.log('Current doctors count:', hospital.doctors?.length || 0)
      
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/doctors`, { 
        method: 'POST', 
        credentials: 'include', 
        body: formData 
      })
      
      console.log('Doctor creation response status:', response.status)
      
      const data = await response.json()
      console.log('Doctor creation response data:', data)
      
      if (response.ok && data.doctors) {
        console.log('🏥 Doctor creation response:', data);
        // Update the hospital state with the new doctors array
        setHospital(prev => {
          if (prev) {
            const updatedHospital = {
              ...prev,
              doctors: data.doctors // Use the doctors array from response
            }
            console.log('🏥 Updated hospital state:', updatedHospital)
            console.log('🏥 New doctors count:', updatedHospital.doctors?.length || 0)
            return updatedHospital
          }
          return prev
        })
        
        // Reset the form
        setNewDoctor({ name: '', position: '', qualification: '', experience: '', image: null })
        setDoctorImagePreview(null)
        setShowAddDoctor(false)
        
        toast({ title: 'Success', description: 'Doctor added successfully!' })
      } else {
        throw new Error(data.error || data.message || 'Failed to add doctor')
      }
    } catch (error: any) {
      console.error('Doctor creation error:', error)
      toast({ title: 'Error', description: error?.message || 'Failed to add doctor.', variant: 'destructive' })
    }
  }

  const removeDoctor = async (doctorId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hospital/${id}/doctors/${doctorId}`, { method: 'DELETE', credentials: 'include' })
      const data = await response.json()
      if (response.ok) {
        setHospital(prev => prev ? { ...prev, doctors: prev.doctors?.filter(d => d._id !== doctorId) || [] } : null)
        toast({ title: 'Success', description: 'Doctor removed successfully!' })
      } else { throw new Error(data.error || 'Failed to remove doctor') }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to remove doctor.', variant: 'destructive' })
    }
  }

  const handleCreateNotification = async () => {
    if (!newNotification.message.trim()) { toast({ title: 'Validation', description: 'Notification message is required', variant: 'destructive' }); return }
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/notifications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(newNotification) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create notification')
      setNotifications(prev => [data.notification, ...prev])
      setNewNotification({ title: '', message: '' })
      toast({ title: 'Sent', description: 'Notification sent to patients.' })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to send notification', variant: 'destructive' })
    }
  }

  const handleCreateMessage = async () => {
    if (!newMessage.senderName.trim() || !newMessage.message.trim()) { toast({ title: 'Validation', description: 'Sender name and message are required', variant: 'destructive' }); return }
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(newMessage) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create message')
      if (data.message && data.message._id) {
        setMessages(prev => [data.message, ...prev])
        setNewMessage({ senderName: '', message: '' })
        toast({ title: 'Sent', description: 'Message sent to patient inbox.' })
      } else { throw new Error('Invalid response structure from server') }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to send message', variant: 'destructive' })
    }
  }

  const openEditTask = (task: Task) => { if (!task._id) return; setEditingTask(task); setShowEditTaskDialog(true) }

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.type) { 
      toast({ title: 'Validation', description: 'Title, description and type are required', variant: 'destructive' }); 
      return 
    }
    
    // Validate task type
    const allowedTypes = ['appointment', 'medication', 'test', 'followup'];
    if (!allowedTypes.includes(newTask.type)) {
      toast({ title: 'Validation Error', description: 'Invalid task type selected', variant: 'destructive' });
      return;
    }
    
    console.log('Creating task with data:', newTask);
    
    try {
      const taskData = {
        ...newTask,
        date: new Date().toISOString().split('T')[0] // Add current date in YYYY-MM-DD format
      };
      
      console.log('Task data being sent:', taskData);
      
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/tasks`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include', 
        body: JSON.stringify(taskData) 
      })
      
      console.log('Task creation response status:', res.status);
      
      const data = await res.json()
      console.log('Task creation response data:', data);
      
      if (!res.ok) throw new Error(data.error || 'Failed to create task')
      
      setTasks(prev => [data.task, ...prev])
      setNewTask({ title: '', description: '', type: 'appointment' })
      toast({ title: 'Saved', description: "Today's tasks updated." })
    } catch (error: any) {
      console.error('Task creation error:', error);
      toast({ title: 'Error', description: error?.message || 'Failed to add task', variant: 'destructive' })
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask._id) return
    if (!editingTask.title.trim() || !editingTask.description.trim()) { toast({ title: 'Validation', description: 'Title and description are required', variant: 'destructive' }); return }
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/tasks/${editingTask._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: editingTask.title, description: editingTask.description, type: editingTask.type }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update task')
      setTasks(prev => prev.map(t => t._id === editingTask._id ? data.task : t))
      setShowEditTaskDialog(false)
      setEditingTask(null)
      toast({ title: 'Updated', description: 'Task updated successfully.' })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to update task', variant: 'destructive' })
    }
  }

  const handleDeleteTask = async (taskId?: string) => {
    if (!taskId) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/tasks/${taskId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to delete task')
      setTasks(prev => prev.filter(t => t._id !== taskId))
      toast({ title: 'Deleted', description: 'Task removed.' })
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to delete task', variant: 'destructive' })
    }
  }

  // Handle patient application status update
  const handleApplicationStatusUpdate = async (applicationId: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/patient-applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, notes: applicationNotes })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update application')
      
      // Update local state
      setPatientApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status, notes: applicationNotes } : app
      ))
      
      setShowApplicationDialog(false)
      setSelectedApplication(null)
      setApplicationNotes('')
      
      const statusText = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : status
      toast({ 
        title: 'Success', 
        description: `Patient application ${statusText} successfully!` 
      })
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error?.message || 'Failed to update application', 
        variant: 'destructive' 
      })
    }
  }

  const openApplicationDialog = (application: any) => {
    setSelectedApplication(application)
    setApplicationNotes(application.notes || '')
    setShowApplicationDialog(true)
  }

  const refreshPatientApplications = async () => {
    if (id && currentUser) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/hospital/${id}/patient-applications`, { credentials: 'include' })
        const data = await res.json()
        if (res.ok) {
          setPatientApplications(data.applications || [])
          toast({ title: 'Refreshed', description: 'Patient applications list updated.' })
        }
      } catch (error) {
        console.error('Error refreshing patient applications:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading hospital dashboard...</p>
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
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Hospital Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The hospital you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/hospital')}>Back to Hospitals</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96">
                     {hospital.banner ? (
             <img src={getImageUrl(hospital.banner)} alt={hospital.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
               <Building2 className="h-32 w-32 text-blue-400" />
             </div>
           )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <Button variant="ghost" className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white hover:bg-white/20 text-xs sm:text-sm" onClick={() => navigate(`/hospital/${hospital._id}`)}>
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Hospital</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                             {hospital.logo ? (
                 <img src={getImageUrl(hospital.logo)} alt={`${hospital.name} logo`} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-4 border-white shadow-lg object-cover" />
               ) : (
                 <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-4 border-white shadow-lg bg-white/20 flex items-center justify-center">
                   <Building2 className="h-6 w-6 sm:w-8 sm:h-8 text-white" />
                 </div>
               )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold truncate">{hospital.name}</h1>
                  {hospital.verified && (
                    <div className="bg-primary text-white rounded-full p-1 flex-shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /><span className="truncate">{hospital.city || hospital.location || 'Location not specified'}</span></div>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" /><span className="font-medium">{hospital.rating ? hospital.rating.toFixed(1) : 'N/A'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6"><CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl"><Building2 className="h-4 w-4 sm:h-5 sm:w-5" />About the Hospital</CardTitle></CardHeader>
                  <CardContent className="pt-0">
                    <RichTextDisplay content={hospital.description || 'No description available for this hospital.'} className="text-muted-foreground leading-relaxed" />
                    <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {hospital.phone && (<div className="flex items-center gap-2"><Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" /><span className="text-xs sm:text-sm truncate">{hospital.phone}</span></div>)}
                      {hospital.email && (<div className="flex items-center gap-2"><Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" /><span className="text-xs sm:text-sm truncate">{hospital.email}</span></div>)}
                      {hospital.website && (<div className="flex items-center gap-2"><Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" /><a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-primary hover:underline truncate">{hospital.website}</a></div>)}
                    </div>
                    {(hospital.facebook || hospital.instagram || hospital.twitter || hospital.linkedin) && (
                      <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                        {hospital.facebook && (<a href={hospital.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700"><Facebook className="h-4 w-4 sm:h-5 sm:w-5" /></a>)}
                        {hospital.instagram && (<a href={hospital.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700"><Instagram className="h-4 w-4 sm:h-5 sm:w-5" /></a>)}
                        {hospital.twitter && (<a href={hospital.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500"><Twitter className="h-4 w-4 sm:h-5 sm:w-5" /></a>)}
                        {hospital.linkedin && (<a href={hospital.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800"><Linkedin className="h-4 w-4 sm:h-5 sm:w-5" /></a>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      Gallery
                      {isOwner && (
                        <Badge variant="secondary" className="ml-2">Owner Access</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-muted-foreground p-2 bg-muted rounded mb-4">
                                                  Debug: isOwner={String(isOwner)}, currentUser={currentUser?._id || 'null'}, hospital.owner.id={hospital?.owner?._id || hospital?.owner || 'null'}
                      </div>
                    )}
                                         {isOwner && (
                       <div className="mb-4 sm:mb-6">
                         <div className="flex items-center justify-between mb-3">
                           <Label htmlFor="gallery-upload" className="cursor-pointer">
                             <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors">
                               <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                               <p className="text-sm sm:text-base text-muted-foreground">Click to upload image(s) to gallery</p>
                               <p className="text-xs sm:text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                             </div>
                           </Label>
                         </div>
                         <input id="gallery-upload" type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploadingImage} />
                         {galleryImages.length > 0 && (
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={clearAllGalleryImages}
                             className="w-full mt-2"
                             disabled={uploadingImage}
                           >
                             <X className="h-3 w-3 mr-2" />
                             Clear All Gallery Images
                           </Button>
                         )}
                       </div>
                     )}
                    {galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                        {galleryImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img src={getImageUrl(image)} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                            {isOwner && (
                              <button onClick={() => removeGalleryImage(image)} className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">No images in gallery yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl"><Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />Technicalities</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-4 sm:mb-6">
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{hospital.specialization ? hospital.specialization.split(', ').length : 0} item(s) available</p>
                      <Button onClick={() => navigate(`/hospital/${hospital._id}/technicalities`)} className="w-full sm:w-auto text-sm sm:text-base">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        View All Technicalities
                      </Button>
                    </div>
                    {hospital.specialization && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {hospital.specialization.split(', ').slice(0, 4).map((item, index) => (
                          <div key={index} className="border rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{item}</h4>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
                        <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                        Our Doctors
                        {isOwner && (
                          <Badge variant="secondary" className="ml-2">Owner Access</Badge>
                        )}
                      </CardTitle>
                      {isOwner && (
                        <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto text-xs sm:text-sm"><Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />Add Doctor</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md mx-4">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">Add New Doctor</DialogTitle>
                              <DialogDescription className="text-sm text-muted-foreground">Fill in the details below to add a new doctor to your hospital.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 sm:space-y-4">
                              <div>
                                <Label htmlFor="doctor-name" className="text-sm sm:text-base">Name *</Label>
                                <Input id="doctor-name" value={newDoctor.name} onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))} placeholder="Full Name" className="text-sm sm:text-base" />
                              </div>
                              <div>
                                <Label htmlFor="doctor-position" className="text-sm sm:text-base">Position/Specialty *</Label>
                                <Input id="doctor-position" value={newDoctor.position} onChange={(e) => setNewDoctor(prev => ({ ...prev, position: e.target.value }))} placeholder="e.g., Cardiologist" className="text-sm sm:text-base" />
                              </div>
                              <div>
                                <Label htmlFor="doctor-qualification" className="text-sm sm:text-base">Qualification *</Label>
                                <Input id="doctor-qualification" value={newDoctor.qualification} onChange={(e) => setNewDoctor(prev => ({ ...prev, qualification: e.target.value }))} placeholder="e.g., MBBS, FCPS" className="text-sm sm:text-base" />
                              </div>
                              <div>
                                <Label htmlFor="doctor-experience" className="text-sm sm:text-base">Experience *</Label>
                                <Input id="doctor-experience" value={newDoctor.experience} onChange={(e) => setNewDoctor(prev => ({ ...prev, experience: e.target.value }))} placeholder="e.g., 10 years" className="text-sm sm:text-base" />
                              </div>
                              <div>
                                <Label htmlFor="doctor-image" className="text-sm sm:text-base">Profile Photo</Label>
                                <Input id="doctor-image" type="file" accept="image/*" onChange={handleDoctorImageChange} className="text-sm sm:text-base" />
                                {doctorImagePreview && (
                                  <div className="mt-2"><img src={doctorImagePreview} alt="Preview" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" /></div>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                <Button onClick={handleAddDoctor} className="flex-1 text-sm sm:text-base">Add Doctor</Button>
                                <Button variant="outline" onClick={() => setShowAddDoctor(false)} className="text-sm sm:text-base">Cancel</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                                                             {hospital.doctors && hospital.doctors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {hospital.doctors.map((member, index) => (
                          <div key={index} className="border rounded-lg p-4 sm:p-5 transform transition-transform hover:scale-105">
                            <div className="flex items-center gap-4 sm:gap-5">
                              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                                <AvatarImage src={getImageUrl(member.image)} />
                                <AvatarFallback className="text-lg sm:text-xl">{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-foreground text-base sm:text-lg truncate">{member.name}</h4>
                                <p className="text-sm sm:text-base text-primary font-medium truncate">{member.position}</p>
                                <p className="text-sm text-muted-foreground truncate">{member.qualification}</p>
                                <p className="text-sm text-muted-foreground truncate">{member.experience} experience</p>
                              </div>
                              {isOwner && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0"><Edit3 className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => removeDoctor(member._id || '')}><Trash2 className="h-4 w-4 mr-2" />Remove</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8 sm:py-10 text-base sm:text-lg">No doctors listed yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Patient Applications Section - Center Column */}
              {isOwner && (
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative">
                  <Card>
                    <CardHeader className="pb-4 sm:pb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl">
                          <Users className="h-5 w-5 sm:h-6 sm:w-6" /> Patient Applications ({patientApplications.length})
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={refreshPatientApplications}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Debug info */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="text-xs text-muted-foreground p-2 bg-muted rounded mb-4">
                          Debug: isOwner={String(isOwner)}, currentUser={currentUser?._id || 'null'}, hospital.owner.id={hospital?.owner?._id || hospital?.owner || 'null'}
                        </div>
                      )}
                      
                      {patientApplications.length > 0 ? (
                        <div className="space-y-4">
                          {patientApplications.map((app) => (
                            <div key={app._id} className="border rounded-lg p-4 sm:p-5 transform transition-transform hover:scale-105 bg-card">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                                    <AvatarImage src={app.user?.profileImage} />
                                    <AvatarFallback className="text-lg sm:text-xl">{app.patientName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground text-base sm:text-lg truncate">{app.patientName}</h4>
                                    <p className="text-sm sm:text-base text-primary font-medium truncate">{app.treatmentType || app.department}</p>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                                      <Badge 
                                        variant={
                                          app.status === 'approved' ? 'default' : 
                                          app.status === 'rejected' ? 'destructive' : 
                                          app.status === 'pending' ? 'secondary' : 'outline'
                                        }
                                        className="text-xs capitalize w-fit"
                                      >
                                        {app.status === 'pending' ? 'pending' : app.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Father:</span> {app.fatherName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">CNIC:</span> {app.cnic}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">City:</span> {app.city}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Gender:</span> {app.patientGender || app.gender}
                                  </p>
                                  {app.notes && (
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium text-foreground">Notes:</span> {app.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {app.status === 'pending' && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => openApplicationDialog(app)}
                                    className="flex-1"
                                  >
                                    Review Application
                                  </Button>
                                </div>
                              )}
                              
                              {app.status === 'pending' && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApplicationStatusUpdate(app._id, 'approved')}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleApplicationStatusUpdate(app._id, 'rejected')}
                                    className="flex-1"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}

                              {app.status === 'approved' && (
                                <div className="flex items-center gap-2 text-green-600 p-3 bg-green-50 rounded-lg">
                                  <Check className="h-4 w-4" />
                                  <span className="text-sm font-medium">Application Approved</span>
                                </div>
                              )}

                              {app.status === 'rejected' && (
                                <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 rounded-lg">
                                  <X className="h-4 w-4" />
                                  <span className="text-sm font-medium">Application Rejected</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-10">
                          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">No Patient Applications</h3>
                          <p className="text-muted-foreground">When patients register, their applications will appear here for review.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6"><CardTitle className="text-base sm:text-lg">Quick Stats</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between"><span className="text-xs sm:text-sm text-muted-foreground">Total Patients</span><span className="font-semibold text-sm sm:text-base">{hospital.totalPatients || hospital.patients || 'N/A'}</span></div>
                    <div className="flex items-center justify-between"><span className="text-xs sm:text-sm text-muted-foreground">Technicalities</span><span className="font-semibold text-sm sm:text-base">{hospital.specialization ? hospital.specialization.split(', ').length : 0}</span></div>
                                         <div className="flex items-center justify-between"><span className="text-xs sm:text-sm text-muted-foreground">Doctors</span><span className="font-semibold text-sm sm:text-base">{hospital.doctors?.length || 0}</span></div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4"><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><BellIcon className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {isOwner && (
                      <div className="space-y-2">
                        <Input placeholder="Title (optional)" value={newNotification.title} onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))} />
                        <Textarea placeholder="Write a notification..." value={newNotification.message} onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))} />
                        <Button onClick={handleCreateNotification} size="sm">Send Notification</Button>
                      </div>
                    )}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n._id} className="p-3 border rounded-lg">
                          {n.title && <p className="font-semibold">{n.title}</p>}
                          <p className="text-sm text-muted-foreground">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4"><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Calendar className="h-4 w-4" /> Today's Tasks</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {isOwner && (
                      <div className="space-y-2">
                        <Input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))} />
                        <Textarea placeholder="Task details" value={newTask.description} onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))} />
                        <div className="flex items-center gap-2">
                          <Select value={newTask.type} onValueChange={(val) => setNewTask(prev => ({ ...prev, type: val as any }))}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appointment">Appointment</SelectItem>
                              <SelectItem value="medication">Medication</SelectItem>
                              <SelectItem value="test">Medical Test</SelectItem>
                              <SelectItem value="followup">Follow-up</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleCreateTask} size="sm">Add Task</Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tasks.map((t) => (
                        <div key={t._id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">{t.title}</p>
                              <Badge variant="outline" className="text-xs capitalize">{t.type}</Badge>
                            </div>
                            {isOwner && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0">•••</Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditTask(t)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteTask(t._id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</p>
                        </div>
                      ))}
                      {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks added for today.</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>Update the details for this task.</DialogDescription>
                  </DialogHeader>
                  {editingTask && (
                    <div className="space-y-3">
                      <Input placeholder="Title" value={editingTask.title} onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : prev)} />
                      <Textarea placeholder="Task details" value={editingTask.description} onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : prev)} />
                      <Select value={editingTask.type} onValueChange={(val) => setEditingTask(prev => prev ? { ...prev, type: val as any } : prev)}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="test">Medical Test</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleUpdateTask} className="flex-1">Save</Button>
                        <Button variant="outline" onClick={() => setShowEditTaskDialog(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="relative">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4"><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><MessageSquare className="h-4 w-4" /> Messages</CardTitle></CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {isOwner && (
                      <div className="space-y-2">
                        <Input placeholder="Sender name" value={newMessage.senderName} onChange={(e) => setNewMessage(prev => ({ ...prev, senderName: e.target.value }))} />
                        <Textarea placeholder="Write a message to patients..." value={newMessage.message} onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))} />
                        <Button onClick={handleCreateMessage} size="sm">Send Message</Button>
                      </div>
                    )}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {messages.map((m) => (
                        <div key={m._id} className="p-3 border rounded-lg">
                          <p className="text-sm font-semibold">{m.senderName}</p>
                          <p className="text-sm text-muted-foreground">{m.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</p>
                        </div>
                      ))}
                      {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Review Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Review Patient Application</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Review the application details and add notes before approving or rejecting the application.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              {/* Patient Info Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={selectedApplication.user?.profileImage} />
                    <AvatarFallback className="text-lg">{selectedApplication.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base truncate">{selectedApplication.patientName}</p>
                    <p className="text-sm text-muted-foreground truncate">{selectedApplication.department}</p>
                  </div>
                </div>
                
                {/* Patient Details Grid */}
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-border/50">
                      <span className="font-medium text-foreground">Father:</span> 
                      <span className="text-muted-foreground text-right">{selectedApplication.fatherName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/50">
                      <span className="font-medium text-foreground">CNIC:</span> 
                      <span className="text-muted-foreground text-right">{selectedApplication.cnic}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/50">
                      <span className="font-medium text-foreground">City:</span> 
                      <span className="text-muted-foreground text-right">{selectedApplication.city}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-foreground">Applied:</span> 
                      <span className="text-muted-foreground text-right">
                        {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this application..."
                  value={applicationNotes}
                  onChange={(e) => setApplicationNotes(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={() => handleApplicationStatusUpdate(selectedApplication._id, 'approved')}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Application
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleApplicationStatusUpdate(selectedApplication._id, 'rejected')}
                  className="w-full"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowApplicationDialog(false)}
                  className="w-full"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


