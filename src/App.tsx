
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import PixPage from "./pages/PixPage";
import Admin from "./pages/admin/Admin";
import AdminProduto from "./pages/admin/AdminProduto";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminPix from "./pages/admin/AdminPix";
import AdminPedidos from "./pages/admin/AdminPedidos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/checkout/:id/pix" element={<PixPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />}>
            <Route path="produtos" element={<AdminProduto />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="pix" element={<AdminPix />} />
            <Route path="pedidos" element={<AdminPedidos />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
