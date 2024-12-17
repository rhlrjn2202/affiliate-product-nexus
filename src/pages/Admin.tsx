import { useState } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { AnalyticsSettings } from "@/components/admin/AnalyticsSettings";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductTable />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSettings />
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