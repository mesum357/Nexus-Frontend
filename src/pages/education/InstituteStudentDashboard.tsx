import { motion } from 'framer-motion'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  Mail, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  Bell as BellIcon,
  MessageSquare,
  RefreshCw,
  User,
  BookOpen as BookOpenIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'

// Interface for Institute data
interface Institute {
  _id: string;
  name: string;
  location?: string;
  city?: string;
  type?: string;
  logo?: string;
  banner?: string;
  rating?: number;
  verified?: boolean;
  students?: string;
  totalStudents?: string;
  courses?: Course[];
  specialization?: string;
  admissionStatus?: string;
  phone?: string;
  email?: string;
  owner?: string;
  website?: string;
  established?: string;
  establishedYear?: number;
  description?: string;
  gallery?: string[];
  faculty?: FacultyMember[];
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface Course {
  _id?: string;
  name: string;
  description?: string;
  duration?: string;
  fee?: number;
  category?: string;
}

interface FacultyMember {
  _id?: string;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  image?: string;
}

interface Notification {
  _id: string;
  title?: string;
  message: string;
  createdAt: string;
}

interface Message {
  _id: string;
  senderName: string;
  message: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  type: 'theory' | 'practical' | 'listing' | 'reading';
  date: string;
  createdAt: string;
}

interface StudentApplication {
  _id: string;
  status: 'submitted' | 'review' | 'accepted' | 'rejected';
  courseName: string;
  courseDuration?: string;
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  username?: string;
  email?: string;
  profileImage?: string;
}

export default function InstituteStudentDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [institute, setInstitute] = useState<Institute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const { toast } = useToast()

  // Data states
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [myApplication, setMyApplication] = useState<StudentApplication | null>(null)
  const [loadingData, setLoadingData] = useState(false)

  // Dialog states
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)
  const [showMessagesDialog, setShowMessagesDialog] = useState(false)
  const [showTasksDialog, setShowTasksDialog] = useState(false)

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    return imagePath
  }

  // Check authentication
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user)
      })
      .catch(() => {
        setCurrentUser(null)
      })
  }, [])

  // Fetch institute data
  useEffect(() => {
    if (!id) {
      setError('Institute ID not found')
      setIsLoading(false)
      return
    }
    
    fetch(`${API_BASE_URL}/api/institute/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Institute not found')
        }
        return res.json()
      })
      .then(data => {
        if (data.institute) {
          setInstitute(data.institute)
          setIsLoading(false)
        } else {
          throw new Error('Institute data not found in response')
        }
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [id])

  // Fetch student-specific data
  useEffect(() => {
    if (!id || !currentUser) return

    setLoadingData(true)
    
    // Fetch student's application for this institute
    fetch(`${API_BASE_URL}/api/institute/${id}/applications/me`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const apps = data.applications || []
        if (apps.length > 0) {
          setMyApplication(apps[0])
          setIsEnrolled(true)
        }
      })
      .catch(() => {
        setIsEnrolled(false)
      })

    // Fetch notifications
    fetch(`${API_BASE_URL}/api/institute/${id}/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]))

    // Fetch messages
    fetch(`${API_BASE_URL}/api/institute/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => setMessages([]))

    // Fetch today's tasks
    fetch(`${API_BASE_URL}/api/institute/${id}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoadingData(false))
  }, [id, currentUser])

  // Refresh data
  const refreshData = () => {
    if (!id || !currentUser) return
    
    setLoadingData(true)
    
    Promise.all([
      fetch(`${API_BASE_URL}/api/institute/${id}/notifications`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/institute/${id}/messages`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/institute/${id}/tasks`).then(res => res.json())
    ])
      .then(([notifData, msgData, taskData]) => {
        setNotifications(notifData.notifications || [])
        setMessages(msgData.messages || [])
        setTasks(taskData.tasks || [])
      })
      .catch(() => {})
      .finally(() => setLoadingData(false))
  }

  // Get status badge for application
  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-600">Accepted</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'review':
        return <Badge variant="secondary">Under Review</Badge>
      default:
        return <Badge variant="outline">Submitted</Badge>
    }
  }

  // Get task type badge
  const getTaskTypeBadge = (type: string) => {
    const variants = {
      theory: 'default',
      practical: 'secondary',
      listing: 'outline',
      reading: 'destructive'
    }
    return <Badge variant={variants[type as keyof typeof variants] || 'outline'} className="capitalize">{type}</Badge>
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading institute student dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !institute) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Institute Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The institute you are looking for does not exist.'}</p>
            <Button onClick={() => navigate('/education')}>
              Back to Institutes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 sm:pt-20">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96"
        >
          <img
            src={getImageUrl(institute.banner) || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop"}
            alt={institute.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            className="absolute top-2 sm:top-4 left-2 sm:left-4 text-white hover:bg-white/20 text-xs sm:text-sm"
            onClick={() => navigate('/education')}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Institutes</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Institute Info Overlay */}
          <div className="absolute bottom-4 sm:bottom-8 left-2 sm:left-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
              <img
                src={getImageUrl(institute.logo) || "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=100&h=100&fit=crop&crop=face"}
                alt={`${institute.name} logo`}
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-4 border-white shadow-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold truncate">{institute.name}</h1>
                  {institute.verified && (
                    <div className="bg-primary text-white rounded-full p-1 flex-shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{institute.city || institute.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-medium">
                      {institute.rating ? institute.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
                             {/* Student Profile & Application Status */}
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
                 className="relative"
               >
                 <Card>
                   <CardHeader className="pb-3 sm:pb-6">
                     <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                       <User className="h-4 w-4 sm:h-5 sm:w-5" />
                       My Profile & Application
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                       <Avatar className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0">
                         <AvatarImage src={getImageUrl(currentUser?.profileImage)} />
                         <AvatarFallback className="text-lg sm:text-xl">
                           {currentUser?.fullName?.[0] || currentUser?.username?.[0] || 'S'}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                           <h4 className="font-semibold text-foreground text-base sm:text-lg">
                             {currentUser?.fullName || currentUser?.username || 'Student'}
                           </h4>
                           {currentUser?.email && (
                             <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                           )}
                         </div>
                         
                         {myApplication ? (
                           <div className="space-y-2">
                             <div className="flex items-center gap-2">
                               <span className="text-sm font-medium">Course:</span>
                               <span className="text-sm text-muted-foreground">{myApplication.courseName}</span>
                               {getApplicationStatusBadge(myApplication.status)}
                             </div>
                             {myApplication.courseDuration && (
                               <div className="flex items-center gap-2">
                                 <span className="text-sm font-medium">Duration:</span>
                                 <span className="text-sm text-muted-foreground">{myApplication.courseDuration}</span>
                               </div>
                             )}
                             <div className="flex items-center gap-2">
                               <span className="text-sm font-medium">Applied on:</span>
                               <span className="text-sm text-muted-foreground">
                                 {new Date(myApplication.createdAt).toLocaleDateString()}
                               </span>
                             </div>
                           </div>
                         ) : (
                           <div className="text-sm text-muted-foreground">
                             <p>No application submitted yet.</p>
                             <Button 
                               size="sm" 
                               className="mt-2"
                               onClick={() => navigate(`/education/institute/${id}/apply`)}
                             >
                               Apply Now
                             </Button>
                           </div>
                         )}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>

              {/* Today's Tasks */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                        Today's Class Tasks
                        {tasks.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {tasks.length}
                          </Badge>
                        )}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowTasksDialog(true)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {loadingData ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Loading tasks...</p>
                      </div>
                    ) : tasks.length > 0 ? (
                      <div className="space-y-3">
                        {tasks.slice(0, 3).map((task) => (
                          <div key={task._id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{task.title}</p>
                                {getTaskTypeBadge(task.type)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(task.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-base text-muted-foreground mb-2">No tasks for today</p>
                        <p className="text-sm text-muted-foreground">
                          Check back later for new class assignments.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Notifications */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                        <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        Recent Notifications
                        {notifications.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {notifications.length}
                          </Badge>
                        )}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNotificationsDialog(true)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {loadingData ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.slice(0, 3).map((notification) => (
                          <div key={notification._id} className="p-3 border rounded-lg">
                            {notification.title && (
                              <p className="font-semibold text-sm mb-1">{notification.title}</p>
                            )}
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BellIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-base text-muted-foreground mb-2">No notifications yet</p>
                        <p className="text-sm text-muted-foreground">
                          You'll see important updates from your institute here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Button
                      onClick={() => setShowTasksDialog(true)}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Tasks
                    </Button>
                    <Button
                      onClick={() => setShowNotificationsDialog(true)}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <BellIcon className="h-4 w-4 mr-2" />
                      View All Notifications
                    </Button>
                    <Button
                      onClick={() => setShowMessagesDialog(true)}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View All Messages
                    </Button>
                    <Button
                      onClick={refreshData}
                      className="w-full justify-start"
                      variant="outline"
                      disabled={loadingData}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
                      Refresh Data
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Institute Info */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center">
                      <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary mx-auto mb-2 sm:mb-3" />
                      <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">{institute.type || 'Institute'}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {institute.specialization || 'General Education'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative"
              >
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    {institute.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate">{institute.phone}</span>
                      </div>
                    )}
                    {institute.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate">{institute.email}</span>
                      </div>
                    )}
                    {institute.website && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={institute.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                          {institute.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Notifications</DialogTitle>
            <DialogDescription>
              Important updates and announcements from {institute.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className="p-3 border rounded-lg">
                {notification.title && (
                  <p className="font-semibold text-sm mb-1">{notification.title}</p>
                )}
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No notifications available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Messages Dialog */}
      <Dialog open={showMessagesDialog} onOpenChange={setShowMessagesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Messages</DialogTitle>
            <DialogDescription>
              Messages from {institute.name} faculty and staff
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message._id} className="p-3 border rounded-lg">
                <p className="font-semibold text-sm mb-1">From: {message.senderName}</p>
                <p className="text-sm text-muted-foreground">{message.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No messages available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tasks Dialog */}
      <Dialog open={showTasksDialog} onOpenChange={setShowTasksDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Tasks</DialogTitle>
            <DialogDescription>
              Today's class assignments and tasks from {institute.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{task.title}</p>
                    {getTaskTypeBadge(task.type)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No tasks available for today.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
