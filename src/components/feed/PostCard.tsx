import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share, MoreHorizontal, Play, MapPin, Edit, Save, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'
import { useRef } from 'react'
import CommentSection from './CommentSection'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface PostCardProps {
  post: {
    _id: string;
    user: {
      _id: string;
      username: string;
      fullName?: string;
      email?: string;
      profileImage?: string;
      city?: string;
    };
    content: string;
    image?: string;
    city?: string;
    location?: string;
    hashtags?: string[];
    likes: string[];
    comments: string[];
    createdAt: string;
    updatedAt: string;
  };
  index: number;
  currentUser?: {
    _id: string;
    username: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
  onPostDeleted?: () => void;
}

export default function PostCard({ post, index, currentUser, onPostDeleted }: PostCardProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const commentSectionRef = useRef<{ focusInput: () => void }>(null)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  // TODO: Fetch and show comments, implement comment UI

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    // Optimistic update
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${post._id}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      setLiked(data.liked)
      setLikeCount(data.likes)
    } catch {
      // Revert on error
      setLiked(prevLiked)
      setLikeCount(prevLikeCount)
    }
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    commentSectionRef.current?.focusInput()
  }

  const handleDeletePost = async () => {
    setShowDeleteDialog(false)
    setDeleting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        })
        if (onPostDeleted) {
          onPostDeleted()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleEditPost = async () => {
    if (!editContent.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editContent.trim() })
      })
      if (res.ok) {
        toast({
          title: "Post updated",
          description: "Your post has been successfully updated.",
        })
        setEditing(false)
        // Update the post content locally
        post.content = editContent.trim()
      } else {
        toast({
          title: "Error",
          description: "Failed to update post. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setEditContent(post.content)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setSharing(true)
    
    try {
      const postUrl = `${window.location.origin}/feed/post/${post._id}`
      await navigator.clipboard.writeText(postUrl)
      
      toast({
        title: "Link copied!",
        description: "Post link has been copied to your clipboard.",
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSharing(false)
    }
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/feed/post/${post._id}`)}>
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="cursor-pointer ring-2 ring-primary/20" onClick={(e) => {
                e.stopPropagation()
                navigate(`/feed/profile/${post.user.username}`)
              }}>
                <AvatarImage src={getProfileImageUrl(post.user.profileImage)} />
                <AvatarFallback>
                  {(post.user.fullName || (post.user.username.includes('@') ? post.user.username.split('@')[0] : post.user.username))[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {post.user.fullName || (post.user.username.includes('@') ? post.user.username.split('@')[0] : post.user.username)}
                  </p>
                  {post.user.fullName && (
                    <p className="text-sm text-muted-foreground">@{post.user.username}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  {(post.city || post.user.city) && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{post.city || post.user.city}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {currentUser && post && String(post.user._id) === String(currentUser._id) ? (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditing(true); setDropdownOpen(false); }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true); setDropdownOpen(false); }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4">
            {editing ? (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEditPost(); }} disabled={saving || !editContent.trim()}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
            <div 
              className="text-foreground leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: post.content || '' 
              }}
              style={{ direction: 'ltr' }}
            />
            )}
            {post.image && (
              <div className="mt-4 rounded-xl overflow-hidden">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            {/* Location and Hashtags */}
            {(post.location || (post.hashtags && post.hashtags.length > 0)) && (
              <div className="mt-4 space-y-2">
                {post.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{post.location}</span>
                  </div>
                )}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reactions Bar */}
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-red-500">❤️</span>
                <span>{likeCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>{post.comments.length} comments</span>
              {/* <span>{post.shares} shares</span> */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2 flex-1">
              {/* Like */}
                <Button 
                  variant="ghost" 
                className={`w-full gap-2 ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  Like
                </Button>
              <Button 
                variant="ghost" 
                className="flex-1 gap-2 text-muted-foreground hover:text-primary"
                onClick={handleCommentClick}
              >
                <MessageCircle className="h-4 w-4" />
                Comment
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 gap-2 text-muted-foreground hover:text-primary"
                onClick={handleShare}
                disabled={sharing}
              >
                <Share className="h-4 w-4" />
                {sharing ? 'Copying...' : 'Share'}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection ref={commentSectionRef} postId={post._id} currentUser={currentUser} />
        </CardContent>
      </Card>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
