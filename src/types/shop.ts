export interface ShopData {
  shopName: string;
  city: string;
  shopType: 'Product Seller' | 'Service Provider' | '';
  shopDescription: string;
  categories: string[];
  shopLogo: File | null;
  shopBanner: File | null;
  logoPreview: string;
  bannerPreview: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    image: File | null;
    imagePreview: string;
    category: string;
    discountPercentage: number;
  }>;
  whatsappNumber: string;
  facebookUrl: string;
  instagramHandle: string;
  websiteUrl: string;
  acceptTerms: boolean;
}
