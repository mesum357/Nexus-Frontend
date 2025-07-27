import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/Navbar'

const categories = [
  "Electronics", "Vehicles", "Property", "Furniture", "Jobs", 
  "Fashion", "Books", "Sports", "Home & Garden", "Pets"
]

const cities = [
  "Karachi", "Lahore", "Islamabad", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Rawalpindi", "Gujranwala", "Sialkot"
]

interface ProductForm {
  title: string
  description: string
  price: string
  category: string
  condition: 'new' | 'used' | 'refurbished' | ''
  city: string
  contactPhone: string
  contactEmail: string
  images: File[]
  imagePreviews: string[]
}

export default function CreateProduct() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    city: '',
    contactPhone: '',
    contactEmail: '',
    images: [],
    imagePreviews: []
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (form.images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive"
      })
      return
    }

    const newImages = [...form.images, ...files]
    const newPreviews = [...form.imagePreviews]

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        setForm(prev => ({ ...prev, imagePreviews: newPreviews }))
      }
      reader.readAsDataURL(file)
    })

    setForm(prev => ({ ...prev, images: newImages }))
  }

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title || !form.description || !form.price || !form.category || !form.condition || !form.city || !form.contactPhone) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (form.images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Product listed successfully!",
      description: "Your product is now live on the marketplace"
    })

    // Here you would typically send the data to your backend
    console.log('Product data:', form)
    navigate('/marketplace')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/marketplace')}
              className="gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                List Your Product
              </h1>
              <p className="text-xl text-muted-foreground">
                Reach thousands of potential buyers across Pakistan
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter product title"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (PKR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={form.price}
                        onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Category & City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Select value={form.city} onValueChange={(value) => setForm(prev => ({ ...prev, city: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="space-y-3">
                    <Label>Condition *</Label>
                    <RadioGroup 
                      value={form.condition} 
                      onValueChange={(value: 'new' | 'used' | 'refurbished') => setForm(prev => ({ ...prev, condition: value }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">New</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="used" id="used" />
                        <Label htmlFor="used">Used</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="refurbished" id="refurbished" />
                        <Label htmlFor="refurbished">Refurbished</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail..."
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      required
                    />
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <Label>Product Images * (Max 5 images)</Label>
                    
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Click to upload images or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {form.imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {form.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+92 300 1234567"
                        value={form.contactPhone}
                        onChange={(e) => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.contactEmail}
                        onChange={(e) => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/marketplace')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-marketplace-primary hover:bg-marketplace-primary/90"
                    >
                      List Product
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
