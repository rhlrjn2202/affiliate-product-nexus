import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ProductTableRowProps {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductTableRow = ({ product, onEdit, onDelete }: ProductTableRowProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <img
          src={product.image}
          alt={product.title}
          className="h-12 w-12 rounded-md object-cover"
        />
      </TableCell>
      <TableCell>{product.title}</TableCell>
      <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
      <TableCell>{product.categories?.name}</TableCell>
      <TableCell>{product.clicks}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};