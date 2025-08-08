import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { getProfileImageUrl } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface CreatePostProps {
  currentUser?: {
    _id: string;
    username: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
}

export default function CreatePost({ currentUser }: CreatePostProps) {
  const navigate = useNavigate()

  return (
    <>
      {/* Simple Create Post Trigger */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getProfileImageUrl(currentUser?.profileImage)} />
              <AvatarFallback>{currentUser?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div 
              className="flex-1 p-3 bg-muted rounded-full cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => {
                if (!currentUser) {
                  navigate('/login')
                } else {
                  navigate('/feed/create')
                }
              }}
            >
              <span className="text-muted-foreground">What's on your mind?</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
