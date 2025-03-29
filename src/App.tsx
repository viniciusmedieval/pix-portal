import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import PixPage from './pages/PixPage';
import CartaoPage from './pages/CartaoPage';
import Index from './pages/Index';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPixConfig from './pages/admin/AdminPixConfig';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminProduto from './pages/admin/AdminProduto';
import AdminConfig from './pages/admin/AdminConfig';
import AdminCheckoutConfig from './pages/admin/AdminCheckoutConfig';
import AdminCheckoutCustomization from './pages/admin/AdminCheckoutCustomization';
import CheckoutPage from './pages/CheckoutPage';
import AdminPixUnified from './pages/admin/AdminPixUnified';
import PaymentFailedPage from './pages/PaymentFailedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCapturedCards from './pages/admin/AdminCapturedCards';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          {/* Home route */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Public routes */}
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
          <Route path="/checkout/:slug/pix" element={<PixPage />} />
          <Route path="/checkout/:slug/payment-failed/:pedidoId?" element={<PaymentFailedPage />} />
          
          {/* Admin routes - protected by authentication */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/pedidos" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="produto/:id" element={<AdminProduto />} />
            <Route path="produto/novo" element={<AdminProduto />} />
            <Route path="relatorio" element={<AdminRelatorio />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="cartoes-capturados" element={<AdminCapturedCards />} />
            <Route path="pix-config/:id" element={<AdminPixConfig />} />
            <Route path="pix-unified/:id" element={<AdminPixUnified />} />
            
            {/* Config routes */}
            <Route path="config/:id" element={<AdminConfig />} />
            <Route path="checkout-config/:id" element={<AdminCheckoutConfig />} />
            <Route path="checkout-customization/:id" element={<AdminCheckoutCustomization />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
