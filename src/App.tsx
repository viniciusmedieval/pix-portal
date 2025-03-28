
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// Import all pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
import CheckoutPage from "./pages/CheckoutPage";
import PixPage from "./pages/PixPage";
import CartaoPage from "./pages/CartaoPage";
import SuccessPage from "./pages/SuccessPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Checkout Routes */}
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/checkout/:slug/pix" element={<PixPage />} />
      <Route path="/checkout/:slug/cartao" element={<CartaoPage />} />
      <Route path="/sucesso" element={<SuccessPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout>
            <Admin />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/produto/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminProduto />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/produtos" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminProdutos />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/pedidos" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPedidos />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/config" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminConfigList />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/config/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminConfig />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/pix/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPix />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/relatorio" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminRelatorio />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/pixels/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPixels />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/testimonials" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminTestimonials />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
