import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { ProductTableRow } from "./ProductTableRow";
import { ProductEditDialog } from "./ProductEditDialog";

export const ProductTable = () => {
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories:category_id (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch click counts for each product
      const clickCounts = await Promise.all(
        productsData.map(async (product) => {
          const { count, error } = await supabase
            .from("clicks")
            .select("*", { count: "exact" })
            .eq("product_id", product.id);

          return {
            productId: product.id,
            clicks: count || 0,
          };
        })
      );

      return productsData.map((product) => ({
        ...product,
        clicks: clickCounts.find((c) => c.productId === product.id)?.clicks || 0,
      }));
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setProductToDelete(product.id)}
            />
          ))}
        </TableBody>
      </Table>

      <ProductEditDialog
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          setEditingProduct(null);
        }}
      />
    </div>
  );
};