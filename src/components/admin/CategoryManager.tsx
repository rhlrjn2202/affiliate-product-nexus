import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategory.trim() }]);

      if (error) throw error;

      toast.success("Category added successfully!");
      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast.error("Failed to add category: " + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error: any) {
      toast.error("Failed to delete category: " + error.message);
    } finally {
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="flex gap-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="max-w-xs"
        />
        <Button type="submit">Add Category</Button>
      </form>

      <div className="grid gap-2">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span>{category.name}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCategoryToDelete(category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};