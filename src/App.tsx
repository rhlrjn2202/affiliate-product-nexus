import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes (renamed from cacheTime)
    },
  },
});

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
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;