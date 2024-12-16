import { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    title: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    affiliateLink: "https://amazon.com/example-1",
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch",
    price: 149.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    affiliateLink: "https://amazon.com/example-2",
  },
  {
    id: "3",
    title: "Portable Power Bank",
    description: "20000mAh high-capacity portable charger",
    price: 49.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    affiliateLink: "https://amazon.com/example-3",
  },
  {
    id: "4",
    title: "Wireless Gaming Mouse",
    description: "Professional gaming mouse with RGB lighting",
    price: 79.99,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    affiliateLink: "https://amazon.com/example-4",
  },
];

export const categories = [...new Set(products.map((p) => p.category))];