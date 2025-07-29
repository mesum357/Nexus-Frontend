import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, Reply, MoreHorizontal, Trash2, Edit, Heart, CornerDownRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { API_BASE_URL } from '@/lib/config'
import { getProfileImageUrl } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface UserType {
  _id: string;
  username: string;
  fullName?: string;
  profileImage?: string;
}

export interface CommentType {
  _id: string;
  user: UserType;
  content: string;
  likes: string[];
  parent: string | null;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  currentUser?: {
    _id: string;
    username: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
    city?: string;
  };
}

const CommentSection = forwardRef(function CommentSection(
  { postId, currentUser }: CommentSectionProps,
  ref: React.Ref<{ focusInput: () => void }>
) {
  const navigate = useNavigate()
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>([])
  // Notification UI state
  const [notification, setNotification] = useState<string | null>(null)
  const { toast } = useToast()
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const [commentDropdownOpen, setCommentDropdownOpen] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }))

  const fetchComments = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/feed/post/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched comments:', data.comments)
        setComments(data.comments || []);
        setOptimisticComments([])
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleAddComment = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (!commentContent.trim()) return;
    setSubmitting(true);
    // Optimistic UI
    const tempId = 'temp-' + Date.now()
    const optimisticComment: CommentType = {
      _id: tempId,
      user: currentUser || { _id: 'me', username: 'You' },
      content: commentContent,
      likes: [],
      parent: null,
      createdAt: new Date().toISOString(),
    }
    setOptimisticComments(prev => [optimisticComment, ...prev])
    setCommentContent('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${postId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: optimisticComment.content })
      });
      if (res.ok) {
        setNotification('Your comment was posted!')
        setTimeout(() => setNotification(null), 2000)
        fetchComments();
      } else {
        setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
      }
    } catch {
      setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    if (!replyContent[parentId]?.trim()) return;
    setSubmitting(true);
    const tempId = 'temp-' + Date.now()
    const optimisticReply: CommentType = {
      _id: tempId,
      user: currentUser || { _id: 'me', username: 'You' },
      content: replyContent[parentId],
      likes: [],
      parent: parentId,
      createdAt: new Date().toISOString(),
    }
    // Add to replies optimistically
    setOptimisticComments(prev => [optimisticReply, ...prev])
    setReplyContent((prev) => ({ ...prev, [parentId]: '' }));
    setReplyingTo(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feed/post/${postId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: optimisticReply.content, parentId })
      });
      if (res.ok) {
        setNotification('Your reply was posted!')
        setTimeout(() => setNotification(null), 2000)
        fetchComments();
      } else {
        setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
      }
    } catch {
      setOptimisticComments(prev => prev.filter(c => c._id !== tempId))
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    setLikeLoading(commentId);
    try {
      await fetch(`${API_BASE_URL}/api/feed/comment/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      fetchComments();
    } finally {
      setLikeLoading(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setShowDeleteDialog(null)
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
        fetchComments()
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

  const handleEditComment = async (commentId: string) => {
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
        fetchComments()
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

  const startEdit = (comment: CommentType) => {
    setEditingComment(comment._id)
    setEditContent(comment.content)
  }

  const toggleReplies = (commentId: string) => {
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

  const renderComments = (comments: CommentType[], level = 0) => (
    <div className="space-y-4">
      {comments
        .filter(comment => comment.parent === null)
        .map((comment) => {
          const replies = comments.filter(c => c.parent === comment._id)
          const hasMultipleReplies = replies.length > 1
          const isExpanded = expandedReplies.has(comment._id)
          const visibleReplies = isExpanded ? replies : replies.slice(0, 1)
          
          return (
            <div key={comment._id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getProfileImageUrl(comment.user.profileImage)} />
                <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm">
                        {comment.user.fullName || (comment.user.username.includes('@') ? comment.user.username.split('@')[0] : comment.user.username)}
                      </span>
                      {comment.user.fullName && (
                        <span className="text-xs text-muted-foreground ml-1">@{comment.user.username}</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    {currentUser && String(comment.user._id) === String(currentUser._id) ? (
                      <DropdownMenu open={commentDropdownOpen === comment._id} onOpenChange={(open) => setCommentDropdownOpen(open ? comment._id : null)}>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="gap-1 px-2">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(comment)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Comment
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setShowDeleteDialog(comment._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                  {editingComment === comment._id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Textarea
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
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`gap-1 px-2 ${likeLoading === comment._id ? 'opacity-50' : ''}`}
                      onClick={() => handleLikeComment(comment._id)}
                      disabled={likeLoading === comment._id}
                    >
                      <Heart className={`h-3 w-3 ${comment.likes.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      {comment.likes.length}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 px-2"
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    >
                      <MessageCircle className="h-3 w-3" /> Reply
                    </Button>
                  </div>
                </div>
                {replyingTo === comment._id && (
                  <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <Textarea
                      value={replyContent[comment._id] || ''}
                      onChange={e => setReplyContent(prev => ({ ...prev, [comment._id]: e.target.value }))}
                      placeholder="Write a reply..."
                      className="min-h-8 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleAddReply(comment._id); }}
                      disabled={submitting || !(replyContent[comment._id]?.trim())}
                    >
                      <CornerDownRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Render replies */}
                {replies.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {visibleReplies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-3 ml-8">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={getProfileImageUrl(reply.user.profileImage)} />
                          <AvatarFallback>{reply.user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-xs">
                                  {reply.user.fullName || (reply.user.username.includes('@') ? reply.user.username.split('@')[0] : reply.user.username)}
                                </span>
                                {reply.user.fullName && (
                                  <span className="text-xs text-muted-foreground ml-1">@{reply.user.username}</span>
                                )}
                                <span className="text-xs text-muted-foreground ml-2">{new Date(reply.createdAt).toLocaleString()}</span>
                              </div>
                              {currentUser && String(reply.user._id) === String(currentUser._id) ? (
                                <DropdownMenu open={commentDropdownOpen === reply._id} onOpenChange={(open) => setCommentDropdownOpen(open ? reply._id : null)}>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="gap-1 px-1">
                                      <MoreHorizontal className="h-2 w-2" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => startEdit(reply)}>
                                      <Edit className="h-3 w-3 mr-2" />
                                      Edit Reply
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => setShowDeleteDialog(reply._id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete Reply
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : null}
                            </div>
                            {editingComment === reply._id ? (
                              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                <Textarea
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
                              <p className="text-xs text-gray-700 mt-1">{reply.content}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`gap-1 px-1 ${likeLoading === reply._id ? 'opacity-50' : ''}`}
                                onClick={() => handleLikeComment(reply._id)}
                                disabled={likeLoading === reply._id}
                              >
                                <Heart className="h-2 w-2" />
                                {reply.likes.length}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
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
            </div>
          )
        })}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteComment(showDeleteDialog)}>
              Delete Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="mb-2 font-semibold text-foreground">Comments</div>
      {notification && <div className="mb-2 text-green-600 font-medium">{notification}</div>}
      {loading ? (
        <div className="text-muted-foreground">Loading comments...</div>
      ) : (
        <>
          {renderComments([...optimisticComments, ...comments])}
          <div className="flex gap-2 mt-4">
            <Textarea
              ref={inputRef}
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-8"
            />
            <Button
              onClick={handleAddComment}
              disabled={submitting || !commentContent.trim()}
            >
              Comment
            </Button>
          </div>
        </>
      )}
    </div>
  );
})

export default CommentSection; 