import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  if (!product) return null;

  const handleClick = async () => {
    try {
      // Record the click in the database
      await supabase.from("clicks").insert({
        product_id: product.id,
      });
    } catch (error) {
      console.error("Error recording click:", error);
    }
    window.open(product.affiliateLink, "_blank");
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={product.image}
            alt={product.title}
            className="mb-4 h-64 w-full rounded-lg object-cover"
          />
          <p className="mb-4 text-gray-600">{product.description}</p>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          </div>
          <button
            onClick={handleClick}
            className="w-full rounded-full bg-primary py-3 text-white transition-colors hover:bg-primary/90"
          >
            View on Amazon
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};