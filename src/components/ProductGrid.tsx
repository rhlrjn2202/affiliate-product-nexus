import { ProductCard } from "./ProductCard";
import { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  trackClicks?: boolean;
}

export const ProductGrid = ({ products, onSelectProduct, trackClicks = false }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          trackClicks={trackClicks}
        />
      ))}
    </div>
  );
};