
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PixPage from './pages/PixPage';
import CartaoPage from './pages/CartaoPage';
import AdminLayout from './layouts/AdminLayout';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPixConfig from './pages/admin/AdminPixConfig';

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
            <Route path="relatorio" element={<AdminRelatorio />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="pix-config/:id" element={<AdminPixConfig />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
