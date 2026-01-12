import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BUSINESS_CATEGORIES } from '@/lib/categories'
import { COUNTRIES, CITIES_BY_COUNTRY, DEFAULT_COUNTRY } from '@/lib/countries'

// Use the same categories as the create shop section
const categories = BUSINESS_CATEGORIES.map(cat => cat.value)

interface StoreFiltersProps {
  onFilter: (filters: { country: string; city: string; category: string; search: string }) => void
}

export default function StoreFilters({ onFilter }: StoreFiltersProps) {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [availableCities, setAvailableCities] = useState(CITIES_BY_COUNTRY[DEFAULT_COUNTRY] || [])

  // Update cities when country changes
  useEffect(() => {
    if (country) {
      setAvailableCities(CITIES_BY_COUNTRY[country] || [])
      setCity('') // Reset city when country changes
      setCitySearch('')
    } else {
      // If no country selected, show all cities from all countries
      const allCities = Object.values(CITIES_BY_COUNTRY).flat()
      setAvailableCities(allCities)
    }
  }, [country])

  const handleFilterChange = () => {
    onFilter({ country, city, category, search })
  }

  const clearFilters = () => {
    setCountry('')
    setCity('')
    setCategory('')
    setSearch('')
    setCitySearch('')
    setCategorySearch('')
    setCountrySearch('')
    onFilter({ country: '', city: '', category: '', search: '' })
  }

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(c =>
    c.label.toLowerCase().includes(countrySearch.toLowerCase())
  )

  // Filter cities based on search
  const filteredCities = availableCities.filter(c =>
    c.label.toLowerCase().includes(citySearch.toLowerCase())
  )

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  )

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
                  onFilter({ country, city, category, search: e.target.value })
                }, 300)
              }}
              className="pl-10 rounded-full border-border focus:border-primary h-11 sm:h-10"
            />
          </div>

          {/* Filters Row - Stack on mobile, side by side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Country Filter */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-48"
            >
              <Select value={country} onValueChange={(value) => {
                setCountry(value)
                setTimeout(() => {
                  onFilter({ country: value, city: '', category, search })
                }, 100)
              }}>
                <SelectTrigger className="rounded-full border-border focus:border-primary h-11 sm:h-10">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {/* Country Search Input */}
                  <div className="p-2">
                    <Input
                      placeholder="Search countries..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {/* Filtered Countries */}
                  {filteredCountries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No countries found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </motion.div>

            {/* City Filter */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-48"
            >
              <Select value={city} onValueChange={(value) => {
                setCity(value)
                setTimeout(() => {
                  onFilter({ country, city: value, category, search })
                }, 100)
              }}>
                <SelectTrigger className="rounded-full border-border focus:border-primary h-11 sm:h-10">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {/* City Search Input */}
                  <div className="p-2">
                    <Input
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {/* Filtered Cities */}
                  {filteredCities.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                  {filteredCities.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No cities found
                    </div>
                  )}
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
                  onFilter({ country, city, category: value, search })
                }, 100)
              }}>
                <SelectTrigger className="rounded-full border-border focus:border-primary h-11 sm:h-10">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Category Search Input */}
                  <div className="p-2">
                    <Input
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {/* Filtered Categories */}
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  {filteredCategories.length === 0 && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No categories found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Clear Filters Button */}
            {(country || city || category || search) && (
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
