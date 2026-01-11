export interface ShopData {
  shopName: string;
  country?: string;
  city: string;
  shopType: 'Product Seller' | 'Service Provider' | '';
  shopDescription: string;
  address?: string;
  categories: string[];
  shopLogo: File | null;
  shopBanner: File | null;
  ownerProfilePhoto: File | null;
  logoPreview: string;
  bannerPreview: string;
  ownerProfilePreview: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    images: File[];
    imagePreviews: string[];
    uploadingImages: boolean[];
    category: string;
    discountPercentage: number;
  }>;
  whatsappNumber: string;
  facebookUrl: string;
  instagramHandle: string;
  websiteUrl: string;
  acceptTerms: boolean;
}
