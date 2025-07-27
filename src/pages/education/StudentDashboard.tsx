import { motion } from 'framer-motion'
import { BookOpen, Clock, MessageSquare, Bell, User, BarChart3, Calendar, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Navbar from '@/components/Navbar'

const enrolledCourses = [
  {
    id: 1,
    title: "Computer Science Fundamentals",
    instructor: "Dr. Ahmed Khan",
    progress: 75,
    nextClass: "Tomorrow 10:00 AM",
    status: "active"
  },
  {
    id: 2,
    title: "Mathematics for Engineers",
    instructor: "Prof. Fatima Ali",
    progress: 45,
    nextClass: "Friday 2:00 PM",
    status: "active"
  },
  {
    id: 3,
    title: "Business Analytics",
    instructor: "Dr. Hassan Shah",
    progress: 90,
    nextClass: "Completed",
    status: "completed"
  }
]

const upcomingClasses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    time: "10:00 AM - 11:30 AM",
    instructor: "Dr. Ahmed Khan",
    type: "live"
  },
  {
    id: 2,
    title: "Calculus II",
    time: "2:00 PM - 3:30 PM", 
    instructor: "Prof. Fatima Ali",
    type: "recorded"
  },
  {
    id: 3,
    title: "Statistics Workshop",
    time: "4:00 PM - 5:00 PM",
    instructor: "Dr. Hassan Shah",
    type: "live"
  }
]

const messages = [
  {
    id: 1,
    from: "Dr. Ahmed Khan",
    subject: "Assignment 3 Feedback",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    from: "Admin Office",
    subject: "Fee Payment Reminder",
    time: "1 day ago",
    unread: true
  },
  {
    id: 3,
    from: "Prof. Fatima Ali",
    subject: "Extra Class Schedule",
    time: "2 days ago",
    unread: false
  }
]

const notifications = [
  {
    id: 1,
    message: "New assignment posted in Computer Science",
    time: "30 minutes ago",
    type: "assignment"
  },
  {
    id: 2,
    message: "Class schedule updated for Mathematics",
    time: "2 hours ago",
    type: "schedule"
  },
  {
    id: 3,
    message: "Grade published for Business Analytics",
    time: "1 day ago",
    type: "grade"
  }
]

export default function StudentDashboard() {
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
                <h1 className="text-3xl font-bold text-foreground">Welcome back, Ahmed!</h1>
                <p className="text-muted-foreground">Continue your learning journey</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages (2)
                </Button>
                <Button variant="outline" size="sm">
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
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">70%</p>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">45h</p>
                    <p className="text-sm text-muted-foreground">Study Time</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enrolled Courses */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                        className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                          </div>
                          <Badge variant={course.status === 'completed' ? 'secondary' : 'default'}>
                            {course.status === 'completed' ? 'Completed' : 'Active'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{course.nextClass}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            Continue Learning
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Classes */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Classes
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
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
                      <AvatarFallback>AH</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-foreground">Ahmed Hassan</h3>
                    <p className="text-sm text-muted-foreground mb-4">Computer Science Student</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Messages */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{message.from}</p>
                          {message.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{message.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <p className="text-sm text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
