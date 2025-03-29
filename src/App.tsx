
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Admin from "./pages/admin/Admin";
import AdminProduto from "./pages/admin/AdminProduto";
import AdminProdutos from "./pages/admin/AdminProdutos";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminConfigList from "./pages/admin/AdminConfigList";
import AdminPix from "./pages/admin/AdminPix";
import AdminRelatorio from "./pages/admin/AdminRelatorio";
import AdminPixels from "./pages/admin/AdminPixels";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminFaqs from "./pages/admin/AdminFaqs";
import CheckoutPage from "./pages/CheckoutPage";
import PixPage from "./pages/PixPage";
import CartaoPage from "./pages/CartaoPage";
import SuccessPage from "./pages/SuccessPage";
import CustomPixPage from './pages/CustomPixPage';
import AdminPixUnified from './pages/admin/AdminPixUnified';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AdminCheckoutCustomization from './pages/admin/AdminCheckoutCustomization';

// Create a fresh query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/checkout/:slug" element={<CheckoutPage />} />
        <Route path="/checkout/:slug/pix" element={<PixPage />} />
        <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
        <Route path="/checkout/:slug/success" element={<SuccessPage />} />
        <Route path="/sucesso" element={<SuccessPage />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/produto/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProduto />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/produtos" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProdutos />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pedidos" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPedidos />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/config" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminConfigList />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/config/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminConfig />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pix/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPix />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/faqs/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminFaqs />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/relatorio" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminRelatorio />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pixels/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPixels />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/testimonials" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminTestimonials />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/checkout-customization/:id" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCheckoutCustomization />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/pix/:id" element={<CustomPixPage />} />
        <Route path="/admin/pix-unified/:id" element={<AdminPixUnified />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
