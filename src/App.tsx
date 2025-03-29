import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from 'react-query';
import HomePage from './pages/HomePage';
import ProdutoPage from './pages/ProdutoPage';
import CheckoutPage from './pages/CheckoutPage';
import PixPage from './pages/PixPage';
import CartaoPage from './pages/CartaoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminProdutoForm from './pages/admin/AdminProdutoForm';
import AdminProdutoDetail from './pages/admin/AdminProdutoDetail';
import ConfigPage from './pages/admin/ConfigPage';
import AdminPix from './pages/admin/AdminPix';
import AdminPixels from './pages/admin/AdminPixels';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminRelatorio from './pages/admin/AdminRelatorio';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPixUnified from './pages/admin/AdminPixUnified';
import AdminPixConfig from './pages/admin/AdminPixConfig';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/produto/:slug" element={<ProdutoPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Checkout routes */}
              <Route path="/checkout/:slug" element={<CheckoutPage />} />
              <Route path="/checkout/:slug/pix" element={<PixPage />} />
              <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="produtos" element={<AdminProdutos />} />
                <Route path="produtos/novo" element={<AdminProdutoForm />} />
                <Route path="produtos/editar/:id" element={<AdminProdutoForm />} />
                <Route path="produtos/:id" element={<AdminProdutoDetail />} />
                <Route path="config/:id" element={<ConfigPage />} />
                <Route path="pix/:id" element={<AdminPix />} />
                <Route path="pix-unified/:id" element={<AdminPixUnified />} />
                <Route path="pix-config/:id" element={<AdminPixConfig />} />
                <Route path="pixels/:id" element={<AdminPixels />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="relatorio" element={<AdminRelatorio />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                {/* Add more admin routes here */}
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </div>
  );
}

export default App;
