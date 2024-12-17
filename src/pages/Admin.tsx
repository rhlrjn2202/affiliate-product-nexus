import { useState } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductTable />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
        </Tabs>

        <AddProductForm 
          open={showAddForm} 
          onClose={() => setShowAddForm(false)} 
          onSuccess={handleProductAdded}
        />
      </div>
    </div>
  );
};

export default Admin;