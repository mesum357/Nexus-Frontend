export interface Category {
  value: string;
  label: string;
  icon: string;
}

export const BUSINESS_CATEGORIES: Category[] = [
  // Food & Beverages
  { value: "Restaurants & Cafes", label: "Restaurants & Cafes", icon: "🍽️" },
  { value: "Fast Food", label: "Fast Food", icon: "🍔" },
  { value: "Bakery & Pastries", label: "Bakery & Pastries", icon: "🥐" },
  { value: "Coffee & Tea", label: "Coffee & Tea", icon: "☕" },
  { value: "Ice Cream & Desserts", label: "Ice Cream & Desserts", icon: "🍦" },
  { value: "Street Food", label: "Street Food", icon: "🌮" },
  { value: "Catering Services", label: "Catering Services", icon: "🍱" },
  { value: "Food Delivery", label: "Food Delivery", icon: "🚚" },

  // Fashion & Clothing
  { value: "Men's Clothing", label: "Men's Clothing", icon: "👔" },
  { value: "Women's Clothing", label: "Women's Clothing", icon: "👗" },
  { value: "Kids & Baby Clothing", label: "Kids & Baby Clothing", icon: "👶" },
  { value: "Shoes & Footwear", label: "Shoes & Footwear", icon: "👟" },
  { value: "Jewelry & Accessories", label: "Jewelry & Accessories", icon: "💍" },
  { value: "Bags & Handbags", label: "Bags & Handbags", icon: "👜" },
  { value: "Watches", label: "Watches", icon: "⌚" },
  { value: "Traditional Wear", label: "Traditional Wear", icon: "👘" },

  // Electronics & Technology
  { value: "Mobile Phones", label: "Mobile Phones", icon: "📱" },
  { value: "Computers & Laptops", label: "Computers & Laptops", icon: "💻" },
  { value: "Gaming & Consoles", label: "Gaming & Consoles", icon: "🎮" },
  { value: "Audio & Speakers", label: "Audio & Speakers", icon: "🔊" },
  { value: "Cameras & Photography", label: "Cameras & Photography", icon: "📷" },
  { value: "TV & Home Entertainment", label: "TV & Home Entertainment", icon: "📺" },
  { value: "Smart Home Devices", label: "Smart Home Devices", icon: "🏠" },
  { value: "Computer Accessories", label: "Computer Accessories", icon: "🖱️" },

  // Home & Garden
  { value: "Furniture", label: "Furniture", icon: "🪑" },
  { value: "Home Decor", label: "Home Decor", icon: "🖼️" },
  { value: "Kitchen & Dining", label: "Kitchen & Dining", icon: "🍴" },
  { value: "Bedding & Bath", label: "Bedding & Bath", icon: "🛏️" },
  { value: "Garden & Outdoor", label: "Garden & Outdoor", icon: "🌱" },
  { value: "Lighting", label: "Lighting", icon: "💡" },
  { value: "Storage & Organization", label: "Storage & Organization", icon: "📦" },
  { value: "Tools & Hardware", label: "Tools & Hardware", icon: "🔧" },

  // Beauty & Personal Care
  { value: "Skincare", label: "Skincare", icon: "🧴" },
  { value: "Makeup & Cosmetics", label: "Makeup & Cosmetics", icon: "💄" },
  { value: "Hair Care", label: "Hair Care", icon: "💇‍♀️" },
  { value: "Fragrances", label: "Fragrances", icon: "🌸" },
  { value: "Beauty Tools", label: "Beauty Tools", icon: "✂️" },
  { value: "Salon Services", label: "Salon Services", icon: "💅" },
  { value: "Spa & Wellness", label: "Spa & Wellness", icon: "🧖‍♀️" },
  { value: "Personal Hygiene", label: "Personal Hygiene", icon: "🧼" },

  // Sports & Outdoors
  { value: "Sports Equipment", label: "Sports Equipment", icon: "⚽" },
  { value: "Fitness & Gym", label: "Fitness & Gym", icon: "💪" },
  { value: "Outdoor Recreation", label: "Outdoor Recreation", icon: "🏕️" },
  { value: "Cycling", label: "Cycling", icon: "🚴" },
  { value: "Swimming", label: "Swimming", icon: "🏊" },
  { value: "Hiking & Camping", label: "Hiking & Camping", icon: "⛰️" },
  { value: "Water Sports", label: "Water Sports", icon: "🏄" },
  { value: "Winter Sports", label: "Winter Sports", icon: "⛷️" },

  // Books & Media
  { value: "Books & Literature", label: "Books & Literature", icon: "📚" },
  { value: "Magazines & Newspapers", label: "Magazines & Newspapers", icon: "📰" },
  { value: "Music & Instruments", label: "Music & Instruments", icon: "🎵" },
  { value: "Movies & DVDs", label: "Movies & DVDs", icon: "🎬" },
  { value: "Educational Materials", label: "Educational Materials", icon: "📖" },
  { value: "Art Supplies", label: "Art Supplies", icon: "🎨" },
  { value: "Stationery", label: "Stationery", icon: "✏️" },
  { value: "Gaming & Toys", label: "Gaming & Toys", icon: "🧸" },

  // Automotive
  { value: "Cars & Vehicles", label: "Cars & Vehicles", icon: "🚗" },
  { value: "Motorcycles", label: "Motorcycles", icon: "🏍️" },
  { value: "Auto Parts", label: "Auto Parts", icon: "🔧" },
  { value: "Auto Services", label: "Auto Services", icon: "🔧" },
  { value: "Car Wash", label: "Car Wash", icon: "🚿" },
  { value: "Fuel Stations", label: "Fuel Stations", icon: "⛽" },
  { value: "Tires & Wheels", label: "Tires & Wheels", icon: "🛞" },
  { value: "Auto Accessories", label: "Auto Accessories", icon: "🎵" },

  // Health & Wellness
  { value: "Pharmacy", label: "Pharmacy", icon: "💊" },
  { value: "Medical Equipment", label: "Medical Equipment", icon: "🏥" },
  { value: "Health Supplements", label: "Health Supplements", icon: "💊" },
  { value: "Fitness & Nutrition", label: "Fitness & Nutrition", icon: "🥗" },
  { value: "Mental Health", label: "Mental Health", icon: "🧠" },
  { value: "Alternative Medicine", label: "Alternative Medicine", icon: "🌿" },
  { value: "Dental Care", label: "Dental Care", icon: "🦷" },
  { value: "Optical Services", label: "Optical Services", icon: "👓" },

  // Education & Training
  { value: "Schools & Universities", label: "Schools & Universities", icon: "🎓" },
  { value: "Tutoring Services", label: "Tutoring Services", icon: "📝" },
  { value: "Language Learning", label: "Language Learning", icon: "🗣️" },
  { value: "Online Courses", label: "Online Courses", icon: "💻" },
  { value: "Vocational Training", label: "Vocational Training", icon: "🔨" },
  { value: "Music Lessons", label: "Music Lessons", icon: "🎼" },
  { value: "Art Classes", label: "Art Classes", icon: "🎨" },
  { value: "Sports Training", label: "Sports Training", icon: "⚽" },

  // Professional Services
  { value: "Legal Services", label: "Legal Services", icon: "⚖️" },
  { value: "Accounting & Tax", label: "Accounting & Tax", icon: "💰" },
  { value: "Consulting", label: "Consulting", icon: "💼" },
  { value: "Real Estate", label: "Real Estate", icon: "🏠" },
  { value: "Insurance", label: "Insurance", icon: "🛡️" },
  { value: "Banking & Finance", label: "Banking & Finance", icon: "🏦" },
  { value: "Marketing & Advertising", label: "Marketing & Advertising", icon: "📢" },
  { value: "IT & Software", label: "IT & Software", icon: "💻" },

  // Entertainment
  { value: "Cinemas & Theaters", label: "Cinemas & Theaters", icon: "🎭" },
  { value: "Gaming Centers", label: "Gaming Centers", icon: "🎮" },
  { value: "Amusement Parks", label: "Amusement Parks", icon: "🎢" },
  { value: "Event Planning", label: "Event Planning", icon: "🎉" },
  { value: "Photography Services", label: "Photography Services", icon: "📸" },
  { value: "DJ & Music", label: "DJ & Music", icon: "🎧" },
  { value: "Party Supplies", label: "Party Supplies", icon: "🎈" },
  { value: "Karaoke", label: "Karaoke", icon: "🎤" },

  // Travel & Tourism
  { value: "Hotels & Accommodation", label: "Hotels & Accommodation", icon: "🏨" },
  { value: "Travel Agencies", label: "Travel Agencies", icon: "✈️" },
  { value: "Tourist Attractions", label: "Tourist Attractions", icon: "🗺️" },
  { value: "Transportation", label: "Transportation", icon: "🚌" },
  { value: "Car Rental", label: "Car Rental", icon: "🚗" },
  { value: "Tour Guides", label: "Tour Guides", icon: "👥" },
  { value: "Adventure Tours", label: "Adventure Tours", icon: "🧗" },
  { value: "Cultural Tours", label: "Cultural Tours", icon: "🏛️" },

  // Pet Services
  { value: "Pet Food & Supplies", label: "Pet Food & Supplies", icon: "🐕" },
  { value: "Pet Grooming", label: "Pet Grooming", icon: "✂️" },
  { value: "Veterinary Services", label: "Veterinary Services", icon: "🐾" },
  { value: "Pet Training", label: "Pet Training", icon: "🎾" },
  { value: "Pet Boarding", label: "Pet Boarding", icon: "🏠" },
  { value: "Pet Accessories", label: "Pet Accessories", icon: "🦴" },
  { value: "Aquarium & Fish", label: "Aquarium & Fish", icon: "🐠" },
  { value: "Bird Supplies", label: "Bird Supplies", icon: "🦜" },

  // Religious & Cultural
  { value: "Religious Items", label: "Religious Items", icon: "🕯️" },
  { value: "Islamic Centers", label: "Islamic Centers", icon: "🕌" },
  { value: "Cultural Events", label: "Cultural Events", icon: "🎭" },
  { value: "Traditional Crafts", label: "Traditional Crafts", icon: "🧵" },
  { value: "Religious Services", label: "Religious Services", icon: "🙏" },
  { value: "Cultural Workshops", label: "Cultural Workshops", icon: "🎨" },
  { value: "Festival Supplies", label: "Festival Supplies", icon: "🎊" },
  { value: "Traditional Clothing", label: "Traditional Clothing", icon: "👘" },

  // Miscellaneous
  { value: "Gift Shops", label: "Gift Shops", icon: "🎁" },
  { value: "Antiques & Collectibles", label: "Antiques & Collectibles", icon: "🏺" },
  { value: "Thrift Stores", label: "Thrift Stores", icon: "🛍️" },
  { value: "Repair Services", label: "Repair Services", icon: "🔧" },
  { value: "Cleaning Services", label: "Cleaning Services", icon: "🧹" },
  { value: "Security Services", label: "Security Services", icon: "🔒" },
  { value: "Printing & Copying", label: "Printing & Copying", icon: "🖨️" },
  { value: "Other", label: "Other", icon: "📋" }
];
