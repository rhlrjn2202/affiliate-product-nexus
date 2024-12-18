import { Product } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const handleClick = async () => {
    try {
      // Record click in database
      await supabase.from("clicks").insert({
        product_id: product.id,
      });
    } catch (error) {
      console.error("Error recording click:", error);
    }
    onSelect(product);
  };

  return (
    <Card 
      className="overflow-hidden transition-transform hover:scale-105 cursor-pointer bg-white shadow-lg hover:shadow-xl"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
      </CardContent>
    </Card>
  );
};