export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  lineTotal: number;
}

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}
