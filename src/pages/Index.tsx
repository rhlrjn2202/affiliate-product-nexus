import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import { SearchBar } from "@/components/SearchBar";
import { Product, mapDatabaseProductToProduct } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet";

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
        .eq("id", 1)
        .single();
      if (error) {
        console.error("Error fetching settings:", error);
        return null;
      }
      return data;
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
      // Remove any existing GA scripts
      const existingScripts = document.querySelectorAll('script[src*="googletagmanager"]');
      existingScripts.forEach(script => script.remove());

      // Add new GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_tag}`;
      document.head.appendChild(script);

      // Initialize GA
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
      <Helmet>
        <title>{settings?.meta_title || "Discover Amazing Products | Your Shopping Destination"}</title>
        <meta name="description" content={settings?.meta_description || "Discover amazing products curated just for you."} />
        <meta name="keywords" content={settings?.meta_keywords || "products, shopping"} />
        <meta property="og:title" content={settings?.meta_title || "Discover Amazing Products"} />
        <meta property="og:description" content={settings?.meta_description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Hero Section with gradient background */}
      <div className="relative bg-gradient-to-r from-primary to-secondary px-6 py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-gray-100">
            Handpicked selection of the best products, curated just for you.
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
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow"
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
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ProductGrid products={displayedProducts} onSelectProduct={setSelectedProduct} />
            <div ref={ref} className="h-10" />
          </>
        )}
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>

      {/* Footer with gradient background */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 mt-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-gray-300">
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