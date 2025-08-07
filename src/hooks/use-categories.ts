import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

export interface Category {
  _id: string;
  value: string;
  label: string;
  icon: string;
  section: string;
  isActive: boolean;
  order: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.categories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoriesBySection = (section: string) => {
    return categories.filter(cat => cat.section === section);
  };

  const getCategoryByValue = (value: string) => {
    return categories.find(cat => cat.value === value);
  };

  return {
    categories,
    loading,
    error,
    getCategoriesBySection,
    getCategoryByValue
  };
}
