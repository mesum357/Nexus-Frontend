import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE_URL } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProfileImageUrl(profileImage?: string): string | undefined {
  if (!profileImage) return undefined;
  
  // If already an absolute URL (e.g., Cloudinary), return as-is
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
    return profileImage;
  }

  if (profileImage.startsWith('/uploads/')) {
    return `${API_BASE_URL}${profileImage}`;
  }
  
  return `${API_BASE_URL}/uploads/${profileImage}`;
}
