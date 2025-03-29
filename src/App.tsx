
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PixPage from './pages/PixPage';
import CartaoPage from './pages/CartaoPage';
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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public routes */}
          <Route path="/checkout/:slug/pix" element={<PixPage />} />
          <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="produto/:id" element={<AdminProduto />} />
            <Route path="produto/novo" element={<AdminProduto />} />
            <Route path="relatorio" element={<AdminRelatorio />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="pix-config/:id" element={<AdminPixConfig />} />
            <Route path="pix-unified/:id" element={<AdminPixConfig />} />
            
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
