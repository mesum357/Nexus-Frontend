import { useEffect, useState } from "react";
import { Heart, MessageCircle, UserPlus, Camera, Clock, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from '@/lib/config';

const Notifications = ({ currentUser }) => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feed/notifications`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setLoading(false);
        // Mark as read
        fetch(`${API_BASE_URL}/api/feed/notifications/read`, { method: 'POST', credentials: 'include' });
      })
      .catch(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-primary" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case "reply":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Camera className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "likes") return notif.type === "like";
    if (filter === "comments") return notif.type === "comment" || notif.type === "reply";
    if (filter === "follows") return notif.type === "follow";
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 animate-fade-in">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/feed")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
          
          {/* Header */}
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "likes", label: "Likes" },
            { id: "comments", label: "Comments" },
            { id: "follows", label: "Follows" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "whitespace-nowrap",
                filter === tab.id && "bg-gradient-social"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={cn(
              "p-4 hover:shadow-soft transition-all duration-200 cursor-pointer",
              !notification.isRead && "border-l-4 border-l-primary bg-blue-light/30"
            )}
            onClick={() => {
              if (notification.post?._id) {
                let url = `/feed/post/${notification.post._id}`
                if (notification.comment?._id) url += `#comment-${notification.comment._id}`
                navigate(url)
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={notification.fromUser?.avatar || "https://via.placeholder.com/150"} alt={notification.fromUser?.username || "User"} />
                  <AvatarFallback>{notification.fromUser?.username?.split(' ').map(n => n[0]).join('') || "U"}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                  {getIcon(notification.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.fromUser?.username || "User"}</span>
                    <span className="text-muted-foreground ml-1">{notification.message}</span>
                  </p>
                  {!notification.isRead && (
                    <Badge variant="default" className="h-2 w-2 p-0 rounded-full bg-primary" />
                  )}
                </div>
                
                {notification.content && (
                  <p className="text-sm text-muted-foreground mb-2 bg-muted p-2 rounded-lg">
                    {notification.content}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{notification.time}</span>
                </div>
              </div>
              
              {notification.type === "follow" && !notification.isRead && (
                <div className="flex gap-2">
                  <Button size="sm" variant="default" className="bg-gradient-social">
                    Follow Back
                  </Button>
                  <Button size="sm" variant="outline">
                    Ignore
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! Check back later for new activity.
          </p>
        </div>
      )}
    </div>
    </>
  );
};

export default Notifications;
