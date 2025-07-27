import { useState } from "react";
import { Search, UserPlus, UserMinus, MessageCircle, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const friends = [
    {
      id: 1,
      name: "Emma Watson",
      username: "@emmawatson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c1?w=150&h=150&fit=crop",
      isOnline: true,
      mutualFriends: 12,
      lastActive: "Active now",
    },
    {
      id: 2,
      name: "John Doe",
      username: "@johndoe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      isOnline: false,
      mutualFriends: 8,
      lastActive: "2h ago",
    },
    {
      id: 3,
      name: "Lisa Chen",
      username: "@lisachen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      isOnline: true,
      mutualFriends: 15,
      lastActive: "Active now",
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      username: "@alexr",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      isOnline: false,
      mutualFriends: 5,
      lastActive: "1d ago",
    },
  ];

  const suggestions = [
    {
      id: 5,
      name: "Sophie Turner",
      username: "@sophiet",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      mutualFriends: 3,
      reason: "Mutual friends",
    },
    {
      id: 6,
      name: "Mike Johnson",
      username: "@mikej",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      mutualFriends: 7,
      reason: "People you may know",
    },
  ];

  const requests = [
    {
      id: 7,
      name: "David Kim",
      username: "@davidkim",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop",
      mutualFriends: 2,
      time: "2d ago",
    },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriendCard = (friend: any, showActions = true) => (
    <Card key={friend.id} className="p-4 hover:shadow-soft transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback>{friend.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {friend.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{friend.name}</h3>
            {friend.isOnline && <Badge variant="secondary" className="text-xs">Online</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{friend.username}</p>
          <p className="text-xs text-muted-foreground">
            {friend.mutualFriends} mutual friends • {friend.lastActive || friend.time}
          </p>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

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
          <h1 className="text-2xl font-bold mb-4">Friends</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "friends", label: "Friends", count: friends.length },
            { id: "suggestions", label: "Suggestions", count: suggestions.length },
            { id: "requests", label: "Requests", count: requests.length },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap",
                activeTab === tab.id && "bg-gradient-social"
              )}
            >
              {tab.label} {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === "friends" && (
          <>
            {filteredFriends.map((friend) => renderFriendCard(friend))}
            {filteredFriends.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No friends found</p>
              </div>
            )}
          </>
        )}

        {activeTab === "suggestions" && (
          <>
            {suggestions.map((person) => (
              <Card key={person.id} className="p-4 hover:shadow-soft transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">{person.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {person.mutualFriends} mutual friends • {person.reason}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="bg-gradient-social">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button size="sm" variant="outline">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {activeTab === "requests" && (
          <>
            {requests.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-soft transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={request.avatar} alt={request.name} />
                    <AvatarFallback>{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{request.name}</h3>
                    <p className="text-sm text-muted-foreground">{request.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.mutualFriends} mutual friends • {request.time}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="bg-gradient-social">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No friend requests</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Friends;
