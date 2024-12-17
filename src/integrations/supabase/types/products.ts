export interface Product {
  affiliate_link: string | null;
  category: string | null;
  category_id: string | null;
  created_at: string;
  description: string | null;
  id: string;
  image: string | null;
  price: number;
  title: string;
  user_id: string | null;
}

export interface ProductInsert {
  affiliate_link?: string | null;
  category?: string | null;
  category_id?: string | null;
  created_at?: string;
  description?: string | null;
  id?: string;
  image?: string | null;
  price: number;
  title: string;
  user_id?: string | null;
}

export interface ProductUpdate {
  affiliate_link?: string | null;
  category?: string | null;
  category_id?: string | null;
  created_at?: string;
  description?: string | null;
  id?: string;
  image?: string | null;
  price?: number;
  title?: string;
  user_id?: string | null;
}