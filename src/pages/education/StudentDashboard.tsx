import { motion } from 'framer-motion'
import { BookOpen, Clock, MessageSquare, Bell, User, BarChart3, Calendar, Play, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

// Interface for student application
interface StudentApplication {
  _id: string;
  institute: {
    _id: string;
    name: string;
    logo?: string;
    city?: string;
    type?: string;
  };
  studentName: string;
  courseName: string;
  courseDuration?: string;
  status: 'submitted' | 'review' | 'accepted' | 'rejected';
  createdAt: string;
}

// Interface for notification
interface Notification {
  id: string;
  message: string;
  time: string;
  type: string;
}

// Interface for message
interface Message {
  id: string;
  from: string;
  subject: string;
  time: string;
  unread: boolean;
}

export default function StudentDashboard() {
  const location = useLocation() as any
  const navigate = useNavigate()
  const appliedData = location.state || null
  const student = appliedData?.student
  const selectedCourse = appliedData?.course
  const institute = appliedData?.institute
  
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMessagesDialog, setShowMessagesDialog] = useState(false)
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false)
  const [todayTasks, setTodayTasks] = useState<{ id: string; title: string; description: string; type: 'theory'|'practical'|'listing'|'reading'; instituteName?: string; time: string }[]>([])
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
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
  
  // Fetch user's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/institute/applications/my`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
        } else {
          console.error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Fetch current user for profile edit
  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user || null)
      })
      .catch(() => setCurrentUser(null))
  }, [])

  // Fetch notifications and messages
  useEffect(() => {
    console.log('StudentDashboard: institute data =', institute); // DEBUG
    console.log('StudentDashboard: institute?.id =', institute?.id); // DEBUG
    
    if (institute?.id) {
      console.log('StudentDashboard: Fetching messages for institute ID:', institute.id); // DEBUG
      
      fetch(`${API_BASE_URL}/api/institute/${institute.id}/notifications`)
        .then(res => res.json())
        .then(data => setNotifications((data.notifications || []).map((n: any) => ({ 
          id: String(n._id || ''), 
          message: n.message, 
          time: new Date(n.createdAt).toLocaleString(), 
          type: n.title || 'notice' 
        }))))
        .catch(() => {})
      
      fetch(`${API_BASE_URL}/api/institute/${institute.id}/messages`)
        .then(res => {
          console.log('StudentDashboard: Messages response status:', res.status); // DEBUG
          return res.json();
        })
        .then(data => {
          console.log('StudentDashboard: Raw messages response:', data); // DEBUG
          console.log('StudentDashboard: Messages array:', data.messages); // DEBUG
          
          const mappedMessages = (data.messages || []).map((m: any) => ({ 
            id: String(m._id || ''), 
            from: m.senderName, 
            subject: m.message, 
            time: new Date(m.createdAt).toLocaleString(), 
            unread: true 
          }));
          
          console.log('StudentDashboard: Mapped messages:', mappedMessages); // DEBUG
          setMessages(mappedMessages);
        })
        .catch((error) => {
          console.error('StudentDashboard: Error fetching messages:', error); // DEBUG
        })
    } else {
      console.log('StudentDashboard: No institute ID available, fetching my messages'); // DEBUG

      // Fetch messages across all institutes the current user applied to
      fetch(`${API_BASE_URL}/api/institute/messages/my`, { credentials: 'include' })
        .then(res => {
          console.log('StudentDashboard: My messages response status:', res.status); // DEBUG
          return res.json();
        })
        .then(data => {
          console.log('StudentDashboard: Raw my messages response:', data); // DEBUG
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
          console.error('StudentDashboard: Error fetching my messages:', error); // DEBUG
        })
    }
  }, [institute?.id])

  // After applications are fetched, load notifications for all relevant institutes
  useEffect(() => {
    if (applications.length === 0) {
      setNotifications([])
      return
    }

    fetch(`${API_BASE_URL}/api/institute/notifications/my`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setNotifications((data.notifications || []).map((n: any) => ({
        id: String(n._id || ''),
        message: n.message,
        time: new Date(n.createdAt).toLocaleString(),
        type: n.title || (n.institute?.name ? `Notice - ${n.institute.name}` : 'notice')
      }))))
      .catch(() => {})
  }, [applications])

  // Fetch today's tasks
  useEffect(() => {
    // If a specific institute id is available (navigated from institute page), fetch for that one
    if (institute?.id) {
      fetch(`${API_BASE_URL}/api/institute/${institute.id}/tasks`)
        .then(res => res.json())
        .then(data => {
          const items = (data.tasks || []).map((t: any) => ({
            id: String(t._id || ''),
            title: t.title,
            description: t.description,
            type: t.type,
            instituteName: institute?.name,
            time: new Date(t.createdAt).toLocaleTimeString()
          }));
          setTodayTasks(items);
        })
        .catch(() => setTodayTasks([]));
      return;
    }
    // Otherwise, fetch for all institutes the student applied to
    fetch(`${API_BASE_URL}/api/institute/tasks/my/today`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const items = (data.tasks || []).map((t: any) => ({
          id: String(t._id || ''),
          title: t.title,
          description: t.description,
          type: t.type,
          instituteName: t.institute?.name,
          time: new Date(t.createdAt).toLocaleTimeString()
        }));
        setTodayTasks(items);
      })
      .catch(() => setTodayTasks([]));
  }, [institute?.id]);

  // Calculate stats from real data
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
  const pendingApplications = applications.filter(app => app.status === 'submitted' || app.status === 'review').length;
  const avgProgress = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

  // Convert applications to course format for display
  const enrolledCourses = applications.map(app => ({
    id: app._id,
    title: app.courseName,
    instructor: app.institute.name,
    progress: app.status === 'accepted' ? 100 : app.status === 'review' ? 50 : 25,
    nextClass: app.status === 'accepted' ? 'Enrolled' : app.status === 'review' ? 'Under Review' : 'Submitted',
    status: app.status === 'accepted' ? 'active' : app.status === 'rejected' ? 'completed' : 'active'
  }));

  // Generate upcoming classes based on accepted applications
  const upcomingClasses = applications
    .filter(app => app.status === 'accepted')
    .map((app, index) => ({
      id: app._id,
      title: app.courseName,
      time: `${9 + index}:00 AM - ${10 + index}:30 AM`,
      instructor: app.institute.name,
      type: index % 2 === 0 ? 'live' : 'recorded'
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome{student?.name ? `, ${student.name}` : ' back'}!</h1>
                <p className="text-muted-foreground">
                  {selectedCourse?.name ? `You applied for ${selectedCourse.name}` : 'Track your educational applications'}
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Overview */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card>
                  <CardContent className="p-6 text-center">
                     <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                     <p className="text-2xl font-bold text-foreground">{totalApplications}</p>
                     <p className="text-sm text-muted-foreground">Total Applications</p>
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
                    <p className="text-2xl font-bold text-foreground">{pendingApplications}</p>
                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Applications/Courses */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>My Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-8">Loading applications...</div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications yet</p>
                        <p className="text-sm text-muted-foreground">Start by applying to institutes and courses</p>
                      </div>
                    ) : (
                      applications.map((application, index) => (
                        <motion.div
                          key={application._id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.4 }}
                          className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">{application.courseName}</h3>
                              <p className="text-sm text-muted-foreground">at {application.institute.name}</p>
                            </div>
                            <Badge variant={
                              application.status === 'accepted' ? 'default' : 
                              application.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }>
                              {application.status === 'accepted' ? 'Accepted' : 
                               application.status === 'rejected' ? 'Rejected' : 
                               application.status === 'review' ? 'Under Review' : 'Submitted'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {application.status === 'accepted' ? 100 : 
                                 application.status === 'review' ? 50 : 25}%
                              </span>
                            </div>
                            <Progress 
                              value={application.status === 'accepted' ? 100 : 
                                     application.status === 'review' ? 50 : 25} 
                              className="h-2" 
                            />
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Classes - Only show if there are accepted applications */}
              {acceptedApplications > 0 && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Enrolled Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingClasses.map((classItem, index) => (
                        <motion.div
                          key={classItem.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.4 }}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              classItem.type === 'live' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {classItem.type === 'live' ? (
                                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{classItem.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {classItem.time} • {classItem.instructor}
                              </p>
                            </div>
                          </div>
                          <Button size="sm">
                            {classItem.type === 'live' ? 'Join Live' : 'Watch'}
                          </Button>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Today's Tasks */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Today's Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todayTasks.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground text-sm">No tasks for today</div>
                    ) : (
                      todayTasks.map((t, index) => (
                        <motion.div
                          key={t.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.05 * index, duration: 0.4 }}
                          className="p-4 border border-border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">{t.type}</Badge>
                              <h4 className="font-medium text-foreground">{t.title}</h4>
                            </div>
                            <span className="text-xs text-muted-foreground">{t.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                          {t.instituteName && (
                            <p className="text-[11px] text-muted-foreground mt-1">{t.instituteName}</p>
                          )}
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
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
                        <AvatarImage src={student?.profileImage} />
                        <AvatarFallback>{student?.name?.charAt(0) || 'S'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{student?.name || 'Student'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {applications.length} application{applications.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accepted:</span>
                        <span className="font-medium">{acceptedApplications}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pending:</span>
                        <span className="font-medium">{pendingApplications}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rejected:</span>
                        <span className="font-medium">{applications.filter(app => app.status === 'rejected').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" size="sm" onClick={() => navigate('/education')}>
                      Browse Institutes
                    </Button>
                    <Button variant="outline" className="w-full" size="sm" onClick={() => navigate('/education/applications')}>
                      View All Applications
                    </Button>
                    <Button variant="outline" className="w-full" size="sm" onClick={() => {
                      if (currentUser) {
                        setEditForm({
                          fullName: currentUser.fullName || '',
                          email: currentUser.email || '',
                          mobile: currentUser.mobile || '',
                          city: currentUser.city || '',
                          bio: currentUser.bio || '',
                          website: currentUser.website || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        })
                        setProfileImagePreview(currentUser.profileImage || null)
                      }
                      setShowProfileDialog(true)
                    }}>
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Dialog */}
      <Dialog open={showMessagesDialog} onOpenChange={setShowMessagesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Messages</DialogTitle>
            <DialogDescription>
              This dialog shows messages sent by your institute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No messages yet</p>
            ) : (
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

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              This dialog shows notifications sent by your institute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>Update your personal information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profileImagePreview || currentUser?.profileImage} />
                <AvatarFallback>{currentUser?.fullName?.charAt(0) || 'S'}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-image">Profile Image</Label>
                <Input id="profile-image" type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setNewProfileImage(file)
                    const reader = new FileReader()
                    reader.onload = () => setProfileImagePreview(reader.result as string)
                    reader.readAsDataURL(file)
                  }
                }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Full Name</Label>
                <Input value={editForm.fullName} onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={editForm.mobile} onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={editForm.city} onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label>Website</Label>
              <Input value={editForm.website} onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))} />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea value={editForm.bio} onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Current Password</Label>
                <Input type="password" value={editForm.currentPassword} onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))} />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" value={editForm.newPassword} onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))} />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={editForm.confirmPassword} onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button disabled={isUpdating} onClick={async () => {
                if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
                  toast({ title: 'Validation', description: 'New password and confirm password do not match', variant: 'destructive' })
                  return
                }
                setIsUpdating(true)
                try {
                  const formData = new FormData()
                  formData.append('fullName', editForm.fullName)
                  formData.append('email', editForm.email)
                  formData.append('mobile', editForm.mobile)
                  formData.append('city', editForm.city)
                  formData.append('bio', editForm.bio)
                  formData.append('website', editForm.website)
                  if (editForm.currentPassword) formData.append('currentPassword', editForm.currentPassword)
                  if (editForm.newPassword) formData.append('newPassword', editForm.newPassword)
                  if (newProfileImage) formData.append('profileImage', newProfileImage)

                  const response = await fetch(`${API_BASE_URL}/api/feed/profile/update`, {
                    method: 'PUT',
                    body: formData,
                    credentials: 'include',
                  })
                  const data = await response.json()
                  if (!response.ok) throw new Error(data.error || 'Failed to update profile')
                  toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully!' })
                  setShowProfileDialog(false)
                } catch (error: any) {
                  toast({ title: 'Error', description: error?.message || 'Failed to update profile', variant: 'destructive' })
                } finally {
                  setIsUpdating(false)
                }
              }} className="flex-1">{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="outline" onClick={() => setShowProfileDialog(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
