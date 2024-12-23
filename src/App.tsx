import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

const SEOWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings?.ga_tag) {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.ga_tag}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', settings.ga_tag);
    }
  }, [settings?.ga_tag]);

  return (
    <>
      <Helmet>
        {settings?.meta_title && <title>{settings.meta_title}</title>}
        {settings?.meta_description && <meta name="description" content={settings.meta_description} />}
        {settings?.meta_keywords && <meta name="keywords" content={settings.meta_keywords} />}
        {settings?.meta_title && <meta property="og:title" content={settings.meta_title} />}
        {settings?.meta_description && <meta property="og:description" content={settings.meta_description} />}
      </Helmet>
      {children}
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Log any auth errors to help with debugging
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      // Invalidate queries when auth state changes
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <SEOWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Index />} /> {/* Catch all route */}
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </SEOWrapper>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;