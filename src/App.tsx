
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import PixPage from "./pages/PixPage";
import CartaoPage from "./pages/CartaoPage";
import SuccessPage from "./pages/SuccessPage";
import Admin from "./pages/admin/Admin";
import AdminProduto from "./pages/admin/AdminProduto";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminPix from "./pages/admin/AdminPix";
import AdminPixels from "./pages/admin/AdminPixels";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminRelatorio from "./pages/admin/AdminRelatorio";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
          <Route path="/checkout/:slug/pix" element={<PixPage />} />
          <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
          <Route path="/checkout/:slug/success" element={<SuccessPage />} />
          <Route path="/sucesso/:id" element={<SuccessPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
            <Route path="produtos" element={<AdminProduto />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="pix" element={<AdminPix />} />
            <Route path="pixels" element={<AdminPixels />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="relatorio" element={<AdminRelatorio />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
