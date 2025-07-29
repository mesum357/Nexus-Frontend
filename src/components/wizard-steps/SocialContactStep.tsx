import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';
import { ShopData } from '@/types/shop';

interface SocialContactStepProps {
  data: ShopData;
  updateData: (updates: Partial<ShopData>) => void;
}

const SocialContactStep: React.FC<SocialContactStepProps> = ({ data, updateData }) => {
  const socialLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp Business Number',
      icon: MessageCircle,
      placeholder: '+92 300 1234567',
      value: data.whatsappNumber,
      onChange: (value: string) => updateData({ whatsappNumber: value }),
      required: true,
      description: 'Your WhatsApp number for customer inquiries (required)'
    },
    {
      id: 'facebook',
      label: 'Facebook Page URL',
      icon: Facebook,
      placeholder: 'https://facebook.com/yourpage',
      value: data.facebookUrl,
      onChange: (value: string) => updateData({ facebookUrl: value }),
      required: false,
      description: 'Link to your Facebook business page (optional)'
    },
    {
      id: 'instagram',
      label: 'Instagram Handle',
      icon: Instagram,
      placeholder: '@yourbusiness',
      value: data.instagramHandle,
      onChange: (value: string) => updateData({ instagramHandle: value }),
      required: false,
      description: 'Your Instagram username (with or without @) (optional)'
    },
    {
      id: 'website',
      label: 'Website URL',
      icon: Globe,
      placeholder: 'https://yourwebsite.com',
      value: data.websiteUrl,
      onChange: (value: string) => updateData({ websiteUrl: value }),
      required: false,
      description: 'Your business website (optional)'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <p className="text-muted-foreground">
          Connect your social media accounts and provide contact information to help customers reach you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          
          return (
            <Card
              key={link.id}
              className="transition-all duration-200 hover:shadow-md border-border hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      link.id === 'facebook' ? 'bg-blue-100 text-blue-600' :
                      link.id === 'instagram' ? 'bg-pink-100 text-pink-600' :
                      link.id === 'whatsapp' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={link.id} className="text-sm font-medium">
                        {link.label}
                        {link.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>

                  <Input
                    id={link.id}
                    placeholder={link.placeholder}
                    value={link.value}
                    onChange={(e) => link.onChange(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Information Preview */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <Label className="text-sm font-medium mb-4 block">Contact Preview</Label>
          <div className="space-y-3">
            {data.whatsappNumber && (
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">WhatsApp:</span>
                <span className="text-muted-foreground">{data.whatsappNumber}</span>
              </div>
            )}
            
            {data.facebookUrl && (
              <div className="flex items-center gap-3 text-sm">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Facebook:</span>
                <a 
                  href={data.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {data.facebookUrl}
                </a>
              </div>
            )}
            
            {data.instagramHandle && (
              <div className="flex items-center gap-3 text-sm">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span className="font-medium">Instagram:</span>
                <span className="text-muted-foreground">
                  {data.instagramHandle.startsWith('@') ? data.instagramHandle : `@${data.instagramHandle}`}
                </span>
              </div>
            )}
            
            {data.websiteUrl && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Website:</span>
                <a 
                  href={data.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  {data.websiteUrl}
                </a>
              </div>
            )}
            
            {!data.whatsappNumber && !data.facebookUrl && !data.instagramHandle && !data.websiteUrl && (
              <p className="text-muted-foreground text-sm italic">
                No contact information provided yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialContactStep;
