import { useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import { SearchBar } from "@/components/SearchBar";
import { Product, mapDatabaseProductToProduct } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const { ref, inView } = useInView();

  const { data: categories } = useQuery({
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

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();
      if (error) throw error;
      return data as Database["public"]["Tables"]["settings"]["Row"];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories:category_id (
            id,
            name
          )
        `);

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(mapDatabaseProductToProduct);
    },
  });

  useEffect(() => {
    if (settings?.ga_tag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_tag}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', settings.ga_tag);
    }
  }, [settings?.ga_tag]);

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    if (inView && filteredProducts.length > displayedProducts.length) {
      setDisplayedProducts(prev => [
        ...prev,
        ...filteredProducts.slice(prev.length, prev.length + 12)
      ]);
    }
  }, [inView, filteredProducts]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, 12));
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with reduced height */}
      <div className="relative bg-secondary px-6 py-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Discover Amazing Products
          </h1>
          <p className="mb-4 text-lg text-gray-300">
            Handpicked selection of the best products from Amazon, curated just for you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <>
            <ProductGrid products={displayedProducts} onSelectProduct={setSelectedProduct} />
            <div ref={ref} className="h-10" />
          </>
        )}
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-gray-600">
            This website contains affiliate links. When you click on these links and make a purchase, we may earn a commission.
            The products featured on this site have been independently selected and reviewed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

declare global {
  interface Window {
    dataLayer: any[];
  }
}