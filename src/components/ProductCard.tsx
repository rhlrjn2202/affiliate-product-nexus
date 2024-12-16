import { Product } from "@/lib/types";
import { trackClick } from "@/lib/tracking";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    trackClick(product.id);
    window.open(product.affiliateLink, "_blank");
    toast({
      title: "Opening product page",
      description: "Redirecting you to Amazon...",
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.title}</h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">${product.price}</span>
          <button
            onClick={handleClick}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            View on Amazon
          </button>
        </div>
      </div>
      <button
        onClick={() => onSelect(product)}
        className="absolute inset-0 z-10 bg-black/0 transition-colors hover:bg-black/5"
        aria-label="View details"
      />
    </div>
  );
};