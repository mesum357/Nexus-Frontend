import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Peshawar", "Quetta", "Multan", "Gujranwala", "Sialkot",
  "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Larkana"
]

const categories = [
  "Garments", "Electronics", "Food", "Plumbing", "Carpentry", 
  "Services", "Beauty", "Health", "Education", "Automotive"
]

interface StoreFiltersProps {
  onFilter: (filters: { city: string; category: string; search: string }) => void
}

export default function StoreFilters({ onFilter }: StoreFiltersProps) {
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  const handleFilterChange = () => {
    onFilter({ city, category, search })
  }

  const clearFilters = () => {
    setCity('')
    setCategory('')
    setSearch('')
    onFilter({ city: '', category: '', search: '' })
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input - Full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for shops or vendors..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setTimeout(() => {
                  onFilter({ city, category, search: e.target.value })
                }, 300)
              }}
              className="pl-10 rounded-full border-border focus:border-primary h-11 sm:h-10"
            />
          </div>

          {/* Filters Row - Stack on mobile, side by side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* City Filter */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-48"
            >
              <Select value={city} onValueChange={(value) => {
                setCity(value)
                setTimeout(() => {
                  onFilter({ city: value, category, search })
                }, 100)
              }}>
                <SelectTrigger className="rounded-full border-border focus:border-primary h-11 sm:h-10">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-48"
            >
              <Select value={category} onValueChange={(value) => {
                setCategory(value)
                setTimeout(() => {
                  onFilter({ city, category: value, search })
                }, 100)
              }}>
                <SelectTrigger className="rounded-full border-border focus:border-primary h-11 sm:h-10">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Clear Filters Button */}
            {(city || category || search) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-full px-6 hover:bg-accent h-11 sm:h-10 w-full sm:w-auto"
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
