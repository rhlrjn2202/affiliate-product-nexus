export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  affiliateLink: string;
}

export interface DatabaseProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  image: string | null;
  affiliate_link: string | null;
  category_id: string | null;
  created_at: string;
  user_id: string | null;
  categories?: {
    id: string;
    name: string;
  } | null;
}

export const mapDatabaseProductToProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  title: dbProduct.title,
  description: dbProduct.description || "",
  price: dbProduct.price,
  category: dbProduct.categories?.name || dbProduct.category || "",
  image: dbProduct.image || "",
  affiliateLink: dbProduct.affiliate_link || "",
});