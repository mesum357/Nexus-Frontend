import { motion } from 'framer-motion'
import { BookOpen, Clock, MessageSquare, Bell, User, BarChart3, Calendar, Play, Stethoscope, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

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
  specialization?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  gallery?: string[];
  faculty?: Doctor[];
}

interface Doctor {
  _id?: string;
  name: string;
  position: string;
  qualification: string;
  experience: string;
  image?: string;
}

interface PatientRegistration {
  _id: string;
  hospital: {
    _id: string;
    name: string;
    logo?: string;
    city?: string;
    type?: string;
  };
  patientName: string;
  department: string;
  visitType?: string;
  status: 'submitted' | 'review' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  type: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  time: string;
  unread: boolean;
}

export default function HospitalPatientDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() as any
  const appliedData = location.state || null
  const patient = appliedData?.patient
  const selectedDepartment = appliedData?.department
  const hospitalFromState = appliedData?.hospital
  
  console.log('Location state:', location.state);
  console.log('Applied data:', appliedData);
  console.log('Patient:', patient);
  console.log('Department:', selectedDepartment);
  
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<PatientRegistration[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessagesDialog, setShowMessagesDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)
  const [todayTasks, setTodayTasks] = useState<{ id: string; title: string; description: string; type: 'appointment'|'medication'|'test'|'followup'; hospitalName?: string; time: string }[]>([])
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    bio: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setCurrentUser(data.user || null) })
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    if (!id) { setError('Hospital ID not found'); setIsLoading(false); return }

    // Fetch hospital details
    fetch(`${API_BASE_URL}/api/institute/${id}`)
      .then(res => { if (!res.ok) throw new Error('Hospital not found'); return res.json() })
      .then(data => {
        const h = data.institute || data.hospital
        if (h) {
          setHospital(h)
          setIsLoading(false)
        } else {
          throw new Error('Hospital data not found in response')
        }
      })
      .catch(err => { setError(err.message); setIsLoading(false) })

    // Fetch patient's applications for this hospital
    if (currentUser) {
      fetch(`${API_BASE_URL}/api/institute/${id}/applications/me`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          const apps = (data.applications || []).map((app: any) => ({
            _id: app._id,
            hospital: { _id: app.institute?._id, name: app.institute?.name, logo: app.institute?.logo, city: app.institute?.city, type: app.institute?.type },
            patientName: app.patientName || app.studentName,
            department: app.departmentName || app.courseName,
            visitType: app.visitType || app.courseDuration,
            status: app.status,
            createdAt: app.createdAt,
          }))
          setRegistrations(apps)
        })
        .catch(() => setRegistrations([]))
    }
  }, [id, currentUser])

  useEffect(() => {
    if (hospital?._id && id) {
      console.log('Fetching data for hospital:', hospital._id, 'with ID:', id);
      
      // Fetch notifications for this hospital
      fetch(`${API_BASE_URL}/api/institute/${id}/notifications`)
        .then(res => {
          console.log('Notifications response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Notifications data:', data);
          const mappedNotifications = (data.notifications || []).map((n: any) => ({ 
            id: String(n._id || ''), 
            message: n.message, 
            time: new Date(n.createdAt).toLocaleString(), 
            type: n.title || 'notice' 
          }));
          setNotifications(mappedNotifications);
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
        })

      // Fetch messages for this hospital
      fetch(`${API_BASE_URL}/api/institute/${id}/messages`)
        .then(res => {
          console.log('Messages response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Messages data:', data);
          const mappedMessages = (data.messages || []).map((m: any) => ({ 
            id: String(m._id || ''), 
            from: m.senderName, 
            subject: m.message, 
            time: new Date(m.createdAt).toLocaleString(), 
            unread: true 
          }));
          setMessages(mappedMessages);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
          setMessages([]);
        })

      // Fetch tasks for this hospital
      fetch(`${API_BASE_URL}/api/institute/${id}/tasks`)
        .then(res => {
          console.log('Tasks response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Tasks data:', data);
          const items = (data.tasks || []).map((t: any) => ({ 
            id: String(t._id || ''), 
            title: t.title, 
            description: t.description, 
            type: t.type, 
            hospitalName: hospital?.name, 
            time: new Date(t.createdAt).toLocaleTimeString() 
          }));
          setTodayTasks(items);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setTodayTasks([]);
        });
    }
  }, [hospital?._id, id]);

  const totalRegistrations = registrations.length;
  const acceptedRegistrations = registrations.filter(r => r.status === 'accepted').length;
  const pendingRegistrations = registrations.filter(r => r.status === 'submitted' || r.status === 'review').length;
  const avgProgress = totalRegistrations > 0 ? Math.round((acceptedRegistrations / totalRegistrations) * 100) : 0;

  const upcomingVisits = registrations
    .filter(r => r.status === 'accepted')
    .map((r, index) => ({ id: r._id, title: r.department, time: `${9 + index}:00 AM - ${10 + index}:30 AM`, instructor: r.hospital.name, type: index % 2 === 0 ? 'live' : 'recorded' }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading patient dashboard...</p>
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
            <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-8">
            <div className="flex items-center justify-between">
                             <div>
                 <h1 className="text-3xl font-bold text-foreground">Welcome{patient?.name ? `, ${patient.name}` : ' to ' + hospital.name}!</h1>
                 <p className="text-muted-foreground">
                   {selectedDepartment ? `You registered for ${selectedDepartment}` : 'Track your hospital registrations and stay updated'}
                 </p>
               </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowMessagesDialog(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowNotificationsDialog(true)}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{totalRegistrations}</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
                    <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{pendingRegistrations}</p>
                    <p className="text-sm text-muted-foreground">Pending Registrations</p>
                  </CardContent>
                </Card>
              </motion.div>

              {acceptedRegistrations > 0 && (
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Upcoming Visits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingVisits.map((visit, index) => (
                        <motion.div key={visit.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 * index, duration: 0.4 }} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${visit.type === 'live' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {visit.type === 'live' ? (
                                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{visit.title}</h4>
                              <p className="text-sm text-muted-foreground">{visit.time} • {visit.instructor}</p>
                            </div>
                          </div>
                          <Button size="sm">{visit.type === 'live' ? 'Join' : 'View'}</Button>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

                             <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }}>
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <BookOpen className="h-5 w-5" />
                       Today's Tasks
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     {todayTasks.length === 0 ? (
                       <div className="text-center py-6 text-muted-foreground text-sm">No tasks for today</div>
                     ) : (
                       todayTasks.map((t, index) => (
                         <motion.div key={t.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * index, duration: 0.4 }} className="p-4 border border-border rounded-lg">
                           <div className="flex items-center justify-between mb-1">
                             <div className="flex items-center gap-2">
                               <Badge variant="outline" className="capitalize">{t.type}</Badge>
                               <h4 className="font-medium text-foreground">{t.title}</h4>
                             </div>
                             <span className="text-xs text-muted-foreground">{t.time}</span>
                           </div>
                           <p className="text-sm text-muted-foreground">{t.description}</p>
                           {t.hospitalName && (<p className="text-[11px] text-muted-foreground mt-1">{t.hospitalName}</p>)}
                         </motion.div>
                       ))
                     )}
                   </CardContent>
                 </Card>
               </motion.div>

               <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Stethoscope className="h-5 w-5" />
                       My Registrations
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {registrations.length === 0 ? (
                       <div className="text-center py-8 text-muted-foreground">
                         <Stethoscope className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                         <p className="text-sm">No registrations yet</p>
                         <p className="text-xs text-muted-foreground mt-1">Apply for treatment to see your registrations here</p>
                       </div>
                     ) : (
                       registrations.map((registration, index) => (
                         <motion.div 
                           key={registration._id} 
                           initial={{ x: -20, opacity: 0 }} 
                           animate={{ x: 0, opacity: 1 }} 
                           transition={{ delay: 0.05 * index, duration: 0.4 }} 
                           className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                         >
                           <div className="flex items-start justify-between mb-3">
                             <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                   <Stethoscope className="h-5 w-5 text-primary" />
                                 </div>
                                 <div>
                                   <h4 className="font-semibold text-foreground">{registration.department}</h4>
                                   <p className="text-sm text-muted-foreground">{registration.hospital.name}</p>
                                 </div>
                               </div>
                               <div className="grid grid-cols-2 gap-4 text-sm">
                                 <div>
                                   <span className="text-muted-foreground">Patient:</span>
                                   <span className="ml-2 font-medium">{registration.patientName}</span>
                                 </div>
                                 {registration.visitType && (
                                   <div>
                                     <span className="text-muted-foreground">Visit Type:</span>
                                     <span className="ml-2 font-medium">{registration.visitType}</span>
                                   </div>
                                 )}
                                 <div>
                                   <span className="text-muted-foreground">Applied:</span>
                                   <span className="ml-2 font-medium">
                                     {new Date(registration.createdAt).toLocaleDateString()}
                                   </span>
                                 </div>
                                 <div>
                                   <span className="text-muted-foreground">Status:</span>
                                   <Badge 
                                     variant={
                                       registration.status === 'accepted' ? 'default' :
                                       registration.status === 'rejected' ? 'destructive' :
                                       registration.status === 'review' ? 'secondary' : 'outline'
                                     }
                                     className="ml-2 capitalize"
                                   >
                                     {registration.status}
                                   </Badge>
                                 </div>
                               </div>
                             </div>
                           </div>
                           
                           {registration.status === 'accepted' && (
                             <div className="mt-3 pt-3 border-t border-border">
                               <div className="flex items-center gap-2 text-sm text-green-600">
                                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                 <span className="font-medium">Treatment Approved!</span>
                               </div>
                               <p className="text-xs text-muted-foreground mt-1">
                                 Contact the hospital for appointment scheduling and further instructions.
                               </p>
                             </div>
                           )}
                           
                           {registration.status === 'rejected' && (
                             <div className="mt-3 pt-3 border-t border-border">
                               <div className="flex items-center gap-2 text-sm text-red-600">
                                 <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                 <span className="font-medium">Application Rejected</span>
                               </div>
                               <p className="text-xs text-muted-foreground mt-1">
                                 You may contact the hospital for more information or apply again.
                               </p>
                             </div>
                           )}
                           
                           {registration.status === 'review' && (
                             <div className="mt-3 pt-3 border-t border-border">
                               <div className="flex items-center gap-2 text-sm text-yellow-600">
                                 <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                 <span className="font-medium">Under Review</span>
                               </div>
                               <p className="text-xs text-muted-foreground mt-1">
                                 Your application is being reviewed by hospital staff.
                               </p>
                             </div>
                           )}
                           
                           {registration.status === 'submitted' && (
                             <div className="mt-3 pt-3 border-t border-border">
                               <div className="flex items-center gap-2 text-sm text-blue-600">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                 <span className="font-medium">Application Submitted</span>
                               </div>
                               <p className="text-xs text-muted-foreground mt-1">
                                 Your application has been received and will be processed soon.
                               </p>
                             </div>
                           )}
                         </motion.div>
                       ))
                     )}
                   </CardContent>
                 </Card>
               </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                                         <div className="flex items-center gap-3">
                       <Avatar className="h-12 w-12">
                         <AvatarImage src={patient?.profileImage || currentUser?.profileImage} />
                         <AvatarFallback>{(patient?.name || currentUser?.fullName || 'P').charAt(0)}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h4 className="font-medium">{patient?.name || currentUser?.fullName || 'Patient'}</h4>
                         <p className="text-sm text-muted-foreground">{registrations.length} registration{registrations.length !== 1 ? 's' : ''}</p>
                       </div>
                     </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Accepted:</span><span className="font-medium">{acceptedRegistrations}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pending:</span><span className="font-medium">{pendingRegistrations}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rejected:</span><span className="font-medium">{registrations.filter(r => r.status === 'rejected').length}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

                             <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
                 <Card>
                   <CardHeader>
                     <CardTitle>Quick Actions</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <Button className="w-full" size="sm" onClick={() => navigate(`/hospital/${id}/apply`)}>Apply for Treatment</Button>
                     <Button variant="outline" className="w-full" size="sm" onClick={() => navigate(`/hospital/hospital/${id}`)}>View Hospital Details</Button>
                     <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/hospital')}>Browse Other Hospitals</Button>
                   </CardContent>
                 </Card>
               </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showMessagesDialog} onOpenChange={setShowMessagesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
            <DialogDescription>This dialog shows messages sent by your hospital.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {messages.length === 0 ? (<p className="text-muted-foreground text-center py-4">No messages yet</p>) : (
              messages.map((message) => (
                <div key={message.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{message.from}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm">{message.subject}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>This dialog shows notifications sent by your hospital.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.length === 0 ? (<p className="text-muted-foreground text-center py-4">No notifications yet</p>) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    <Badge variant="outline" className="text-xs">{notification.type}</Badge>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
