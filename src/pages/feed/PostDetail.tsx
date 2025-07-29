import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Share, MoreHorizontal, ArrowLeft, Send, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '@/lib/config'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getProfileImageUrl } from '@/lib/utils'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const commentRefs = useRef({})
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyContent, setReplyContent] = useState({})
  const [replyingTo, setReplyingTo] = useState(null)
  const [likeLoading, setLikeLoading] = useState({})
  const [optimisticComments, setOptimisticComments] = useState([])
  const pollingRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)
  const { toast } = useToast()
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [commentDropdownOpen, setCommentDropdownOpen] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/feed/post/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            setPost(null)
            setLoading(false)
            return
          }
          throw new Error('Failed to fetch post')
        }
        return res.json()
      })
      .then(data => {
        console.log('Fetched post data:', data)
        setPost(data.post || null)
        setLoading(false)
      })
      .catch(() => {
        setPost(null)
        setLoading(false)
      })
    
    fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (window.location.hash.startsWith('#comment-')) {
      const commentId = window.location.hash.replace('#comment-', '')
      const el = commentRefs.current[commentId]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-primary')
        setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 2000)
      }
    }
  }, [])

  useEffect(() => {
    const fetchAllComments = () => {
      fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
        .then(res => res.json())
        .then(data => setComments(data.comments || []))
        .catch(() => {})
    }
    fetchAllComments()
    if (!submitting && !Object.values(replyContent).some(Boolean) && !commentContent) {
      pollingRef.current = setInterval(fetchAllComments, 10000)
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [id, submitting, replyContent, commentContent])

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUser(data.user || null))
      .catch(() => setCurrentUser(null))
  }, [])

  const handleAddComment = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (!commentContent.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${id}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent })
      })
      if (res.ok) {
        setCommentContent('')
        // Refresh comments
        fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
          .then(res => res.json())
          .then(data => setComments(data.comments || []))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (parentId) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (!replyContent[parentId]?.trim()) return
    setSubmitting(true)
    const tempId = 'temp-' + Date.now()
    const optimisticReply = {
      _id: tempId,
      user: currentUser || post.user,
      content: replyContent[parentId],
      likes: [],
      parent: parentId,
      createdAt: new Date().toISOString(),
    }
    setOptimisticComments(prev => [optimisticReply, ...prev])
    setReplyContent(prev => ({ ...prev, [parentId]: '' }))
    setReplyingTo(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${id}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: optimisticReply.content, parentId })
      })
      if (res.ok) {
        fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
          .then(res => res.json())
          .then(data => {
            setComments(data.comments || [])
            setOptimisticComments([])
          })
      } else {
        setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
      }
    } catch {
      setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    setLikeLoading(prev => ({ ...prev, [commentId]: true }))
    // Optimistically update likes
    setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: c.likes.concat([post.user._id]) } : c))
    try {
      await fetch(`${API_BASE_URL}/api/feed/comment/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
        .then(res => res.json())
        .then(data => setComments(data.comments || []))
    } catch {
      // Revert optimistic like
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: c.likes.filter(uid => uid !== post.user._id) } : c))
    } finally {
      setLikeLoading(prev => ({ ...prev, [commentId]: false }))
    }
  }

  const handleDeletePost = async () => {
    setShowDeleteDialog(false)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast({
          title: "Post deleted",
          description: "Your post has been successfully deleted.",
        })
        navigate('/feed')
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
    }
  }

  const handleDeleteComment = async (commentId) => {
    setDeleteCommentId(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/comment/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast({
          title: "Comment deleted",
          description: "Your comment has been successfully deleted.",
        })
        fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
          .then(res => res.json())
          .then(data => setComments(data.comments || []))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/comment/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editContent.trim() })
      })
      if (res.ok) {
        toast({
          title: "Comment updated",
          description: "Your comment has been successfully updated.",
        })
        setEditingComment(null)
        setEditContent('')
        fetch(`${API_BASE_URL}/api/feed/post/${id}/comments`)
          .then(res => res.json())
          .then(data => setComments(data.comments || []))
      } else {
        toast({
          title: "Error",
          description: "Failed to update comment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const startEdit = (comment) => {
    setEditingComment(comment._id)
    setEditContent(comment.content)
  }

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  // Helper to render comments and their replies recursively
  function renderComments(comments, parentId = null, level = 0) {
    return comments
      .filter(comment => comment.parent === parentId)
      .map(comment => {
        const replies = comments.filter(c => c.parent === comment._id)
        const hasMultipleReplies = replies.length > 1
        const isExpanded = expandedReplies.has(comment._id)
        const visibleReplies = isExpanded ? replies : replies.slice(0, 1)
        
        return (
          <motion.div
            key={comment._id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * level, duration: 0.4 }}
            ref={el => commentRefs.current[comment._id] = el}
            className={`flex items-start gap-3${level > 0 ? ' ml-8' : ''}`}
          >
            <Avatar>
              <AvatarImage src={getProfileImageUrl(comment.user.profileImage)} />
              <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <p className="font-semibold text-foreground text-sm mb-1">
                  {comment.user.username}
                </p>
                              {editingComment === comment._id ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEditComment(comment._id); }} disabled={saving || !editContent.trim()}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }} disabled={saving}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                  <p className="text-foreground">{comment.content}</p>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{comment.timestamp}</span>
                <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment._id)} disabled={likeLoading[comment._id]}>Like ({comment.likes.length})</Button>
                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment._id)}>Reply</Button>
                {currentUser && String(comment.user._id) === String(currentUser._id) ? (
                  <DropdownMenu open={commentDropdownOpen === comment._id} onOpenChange={(open) => setCommentDropdownOpen(open ? comment._id : null)}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEdit(comment)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Comment
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteCommentId(comment._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Comment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>
                          {replyingTo === comment._id && (
              <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                <Input 
                  value={replyContent[comment._id] || ''} 
                  onChange={e => setReplyContent(prev => ({ ...prev, [comment._id]: e.target.value }))} 
                  placeholder="Write a reply..." 
                  onClick={(e) => e.stopPropagation()}
                />
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleReply(comment._id); }} disabled={submitting || !replyContent[comment._id]?.trim()}>{submitting ? 'Posting...' : 'Reply'}</Button>
              </div>
            )}
              
              {/* Render replies */}
              {replies.length > 0 && (
                <div className="mt-3 space-y-3">
                  {visibleReplies.map((reply) => (
                    <motion.div
                      key={reply._id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="flex items-start gap-3 ml-8"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getProfileImageUrl(reply.user.profileImage)} />
                        <AvatarFallback>{reply.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="font-semibold text-foreground text-xs mb-1">
                            {reply.user.username}
                          </p>
                          {editingComment === reply._id ? (
                            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="min-h-[40px] text-xs"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleEditComment(reply._id); }} disabled={saving || !editContent.trim()}>
                                  {saving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }} disabled={saving}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-foreground text-xs">{reply.content}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Button variant="ghost" size="sm" onClick={() => handleLikeComment(reply._id)} disabled={likeLoading[reply._id]}>
                              Like ({reply.likes.length})
                            </Button>
                            {currentUser && String(reply.user._id) === String(currentUser._id) ? (
                              <DropdownMenu open={commentDropdownOpen === reply._id} onOpenChange={(open) => setCommentDropdownOpen(open ? reply._id : null)}>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-2 w-2" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => startEdit(reply)}>
                                    <Edit className="h-3 w-3 mr-2" />
                                    Edit Reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => setDeleteCommentId(reply._id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Delete Reply
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Show more/less replies button */}
                  {hasMultipleReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplies(comment._id)}
                      className="ml-8 text-xs text-blue-500 hover:text-blue-700"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Show less replies
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Show {replies.length - 1} more replies
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )
      })
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (!post) return <div className="text-center py-20">Post not found.</div>
  
  console.log('Rendering post:', post)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/feed')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </motion.div>

          {/* Main Post */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getProfileImageUrl(post.user?.profileImage)} />
                      <AvatarFallback>{post.user?.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-lg">
                          {post.user?.fullName || (post.user?.username?.includes('@') ? post.user.username.split('@')[0] : post.user?.username) || 'Unknown User'}
                        </p>
                        {post.user?.fullName && (
                          <p className="text-sm text-muted-foreground">@{post.user.username}</p>
                        )}
                        {post.user?.verified && (
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {currentUser && post && String(post.user._id) === String(currentUser._id) ? (
                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-6">
                  <p className="text-foreground leading-relaxed text-lg mb-4">
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={post.image.startsWith('/uploads/') ? `${API_BASE_URL}${post.image}` : post.image}
                        alt="Post image"
                        className="w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between py-3 border-y border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.likes?.length || 0} likes</span>
                    <span>{comments.length} comments</span>
                    <span>0 shares</span>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-red-500">
                      <Heart className="h-5 w-5" />
                      Like
                    </Button>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-5 w-5" />
                      Comment
                    </Button>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                      <Share className="h-5 w-5" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">Comments</h3>
                
                {/* Add Comment */}
                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-border">
                  <Avatar>
                    <AvatarImage src={getProfileImageUrl(currentUser?.profileImage)} />
                    <AvatarFallback>{currentUser?.username?.[0] || 'You'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      className="flex-1"
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddComment} disabled={submitting || !commentContent.trim()}>
                      {submitting ? 'Posting...' : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {renderComments([...optimisticComments, ...comments])}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
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
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteCommentId} onOpenChange={() => setDeleteCommentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCommentId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteComment(deleteCommentId)}>
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
