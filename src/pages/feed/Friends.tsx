import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, MessageCircle, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { API_BASE_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch friends data
  const fetchFriendsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/friends`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends data');
      }
      
      const data = await response.json();
      setFriends(data.friends || []);
      setSuggestions(data.suggestions || []);
      setRequests(data.requests || []);
      setSentRequests(new Set(data.sentRequests || []));
    } catch (error) {
      console.error('Error fetching friends data:', error);
      toast({
        title: "Error",
        description: "Failed to load friends data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  // Send friend request
  const handleSendRequest = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/friends/request/${userId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send friend request');
      }
      
      // Add to sent requests set
      setSentRequests(prev => new Set(prev).add(userId));
      
      toast({
        title: "Success",
        description: "Friend request sent successfully"
      });
      
      // Refresh data
      fetchFriendsData();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send friend request",
        variant: "destructive"
      });
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/friends/accept/${requestId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept friend request');
      }
      
      toast({
        title: "Success",
        description: "Friend request accepted"
      });
      
      // Refresh data
      fetchFriendsData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept friend request",
        variant: "destructive"
      });
    }
  };

  // Decline friend request
  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/friends/decline/${requestId}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to decline friend request');
      }
      
      toast({
        title: "Success",
        description: "Friend request declined"
      });
      
      // Refresh data
      fetchFriendsData();
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to decline friend request",
        variant: "destructive"
      });
    }
  };

  // Remove suggestion
  const handleRemoveSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    // Also remove from sent requests if it was there
    setSentRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(suggestionId);
      return newSet;
    });
    toast({
      title: "Success",
      description: "Suggestion removed"
    });
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <p className="text-sm text-muted-foreground">{friend.email}</p>
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
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
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
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {person.mutualFriends} mutual friends • {person.reason}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {sentRequests.has(person.id) ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled
                        className="text-muted-foreground"
                      >
                        Request sent
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="bg-gradient-social"
                        onClick={() => handleSendRequest(person.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemoveSuggestion(person.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {suggestions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No suggestions available</p>
              </div>
            )}
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
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {request.mutualFriends} mutual friends • {request.time}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-gradient-social"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
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
      )}
    </div>
    </>
  );
};

export default Friends;
