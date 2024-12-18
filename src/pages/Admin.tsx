import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SEOSettings } from "@/components/admin/SEOSettings";

const Admin = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <ProductTable />
        </TabsContent>
        <TabsContent value="add-product" className="mt-4">
          <AddProductForm />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <CategoryManager />
        </TabsContent>
        <TabsContent value="seo" className="mt-4">
          <SEOSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;