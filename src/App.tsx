
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layouts/AdminLayout";

// Lazy load components for better performance
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PixPage = lazy(() => import("./pages/PixPage"));
const CartaoPage = lazy(() => import("./pages/CartaoPage"));
const SuccessPage = lazy(() => import("./pages/SuccessPage"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const AdminProduto = lazy(() => import("./pages/admin/AdminProduto"));
const AdminConfig = lazy(() => import("./pages/admin/AdminConfig"));
const AdminPix = lazy(() => import("./pages/admin/AdminPix"));
const AdminPixels = lazy(() => import("./pages/admin/AdminPixels"));
const AdminPedidos = lazy(() => import("./pages/admin/AdminPedidos"));
const AdminRelatorio = lazy(() => import("./pages/admin/AdminRelatorio"));
const Login = lazy(() => import("./pages/Login"));
const AdminProdutos = lazy(() => import("./pages/admin/AdminProdutos"));

// Import ProtectedRoute normally since it's used as a wrapper
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-primary/60 mb-4"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/checkout/:slug/pix" element={<PixPage />} />
            <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
            <Route path="/checkout/:slug/success" element={<SuccessPage />} />
            <Route path="/sucesso/:id" element={<SuccessPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes - Protected and using AdminLayout */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Admin />} />
              <Route path="produtos" element={<AdminProdutos />} />
              <Route path="produto/:id" element={<AdminProduto />} />
              <Route path="produto/new" element={<AdminProduto />} />
              <Route path="config" element={<AdminConfig />} />
              <Route path="pix" element={<AdminPix />} />
              <Route path="pixels" element={<AdminPixels />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="relatorio" element={<AdminRelatorio />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
