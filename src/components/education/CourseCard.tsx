import { motion } from 'framer-motion'
import { Clock, Users, BookOpen, Star, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

interface Course {
  id: number
  title: string
  description: string
  duration: string
  students: number
  rating: number
  price: string
  instructor: string
  level: string
  image: string
  hasVideo: boolean
}

interface CourseCardProps {
  course: Course
  index: number
}

export default function CourseCard({ course, index }: CourseCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/education/course/${course.id}`)}>
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {course.hasVideo && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/20">
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-primary text-white">
            {course.level}
          </Badge>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <div 
            className="text-muted-foreground mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: course.description || '' 
            }}
            style={{ direction: 'ltr' }}
          />

          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{course.price}</p>
              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
