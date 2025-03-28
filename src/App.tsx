import { Routes, Route } from "react-router-dom";
import {
  Index,
  Login,
  NotFound,
  Admin,
  AdminProduto,
  AdminProdutos,
  AdminPedidos,
  AdminConfig,
  AdminPix,
  AdminRelatorio,
  AdminPixels,
  AdminTestimonials,
  PixPage,
  CartaoPage,
  SuccessPage,
} from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminCheckoutCustomization from "./pages/admin/AdminCheckoutCustomization";
import AdminCheckoutConfig from "./pages/admin/AdminCheckoutConfig";

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
      <Route path="/admin/checkout-customization/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminCheckoutCustomization />
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/checkout-config/:id" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminCheckoutConfig />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
