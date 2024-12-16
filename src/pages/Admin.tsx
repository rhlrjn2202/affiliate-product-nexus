import { useState } from "react";
import { ProductTable } from "@/components/admin/ProductTable";
import { AddProductForm } from "@/components/admin/AddProductForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Admin = () => {
  const [showAddForm, setShowAddForm] = useState(false);

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

        <ProductTable />
        <AddProductForm open={showAddForm} onClose={() => setShowAddForm(false)} />
      </div>
    </div>
  );
};

export default Admin;