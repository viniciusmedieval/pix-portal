
import { Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import PixPage from './pages/PixPage';
import SuccessPage from './pages/SuccessPage';
import Admin from './pages/Admin';
import AdminConfig from './pages/admin/AdminConfig';
import AsaasSettings from './pages/admin/AsaasSettings';
import AdminPixUnified from './pages/admin/AdminPixUnified';
import AdminProduto from './pages/admin/AdminProduto';
import AdminLayout from './components/layouts/AdminLayout';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckoutPage />} />
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/checkout/:slug/pix" element={<PixPage />} />
      <Route path="/sucesso" element={<SuccessPage />} />
      
      {/* Admin routes - wrapped in AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProdutos />} />
        <Route path="config/:id" element={<AdminConfig />} />
        <Route path="pix/:id" element={<AdminPixUnified />} />
        <Route path="asaas" element={<AsaasSettings />} />
        <Route path="produto/:id" element={<AdminProduto />} />
      </Route>
    </Routes>
  );
}

export default App;
