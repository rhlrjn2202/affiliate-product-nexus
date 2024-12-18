import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SEOSettings } from "@/components/admin/SEOSettings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast.error("Error logging out: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-4">
            <div className="mb-4">
              <Button onClick={() => setIsAddProductOpen(true)}>
                Add Product
              </Button>
            </div>
            <ProductTable />
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <CategoryManager />
          </TabsContent>
          <TabsContent value="seo" className="mt-4">
            <SEOSettings />
          </TabsContent>
        </Tabs>

        <AddProductForm 
          open={isAddProductOpen} 
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={() => {
            setIsAddProductOpen(false);
            // Invalidate the products query to refresh the table
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
};

export default Admin;