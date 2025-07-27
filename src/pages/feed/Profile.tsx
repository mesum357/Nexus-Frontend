import { useState } from "react";
import { Settings, Grid, Heart, Bookmark, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  
  const stats = [
    { label: "Posts", value: "42" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "234" },
  ];

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=400&h=400&fit=crop`,
    likes: Math.floor(Math.random() * 100) + 10,
  }));

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Profile Header */}
      <Card className="p-6 mb-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-32 h-32 border-4 border-blue-light">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b5c1?w=300&h=300&fit=crop" alt="Profile" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">Sarah Miller</h1>
              <div className="flex gap-2 justify-center md:justify-start">
                <Button variant="default" size="sm" className="bg-gradient-social hover:opacity-90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-start gap-8 mb-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-bold text-lg">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <p className="text-foreground mb-2">
                ✨ Content Creator & Designer
              </p>
              <p className="text-muted-foreground text-sm">
                Sharing moments that matter 📸 | Coffee enthusiast ☕ | Living life one adventure at a time 🌟
              </p>
            </div>
            
            <div className="flex gap-2 justify-center md:justify-start">
              <Badge variant="secondary">Designer</Badge>
              <Badge variant="secondary">Creator</Badge>
              <Badge variant="secondary">Travel</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex justify-center gap-8">
          {[
            { id: "posts", label: "Posts", icon: Grid },
            { id: "liked", label: "Liked", icon: Heart },
            { id: "saved", label: "Saved", icon: Bookmark },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 py-3 px-1 border-b-2 transition-colors",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="aspect-square p-0 overflow-hidden cursor-pointer group hover:shadow-soft transition-all duration-200 hover:scale-105"
          >
            <div className="relative w-full h-full">
              <img
                src={`https://images.unsplash.com/photo-${1500000000000 + post.id * 100000}?w=400&h=400&fit=crop`}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
