
export interface FlavorProfile {
  strength: number; // Độ mạnh (0-100)
  sweetness: number; // Độ ngọt (0-100)
  healthBenefit: number; // Bồi bổ (0-100)
  aroma: number; // Hương thơm (0-100)
  smoothness: number; // Độ êm (0-100)
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  volume: string;
  strength: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  sku: string;
  tags?: string[];
  flavorProfile?: FlavorProfile;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 'Tất cả' | 'Rượu Sâm' | 'Rượu Nấm' | 'Rượu Ba Kích' | 'Rượu Đông Trùng' | 'Rượu Trái Cây' | 'Quà Biếu' | 'Cao Cấp';
export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';
