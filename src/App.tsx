
import { Routes, Route } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import PixPage from './pages/PixPage';
import SuccessPage from './pages/SuccessPage';
import Admin from './pages/Admin';
import AdminConfig from './pages/admin/AdminConfig';
import AsaasSettings from './pages/admin/AsaasSettings';
import AdminPixUnified from './pages/admin/AdminPixUnified';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckoutPage />} />
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/checkout/:slug/pix" element={<PixPage />} />
      <Route path="/sucesso" element={<SuccessPage />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/config/:id" element={<AdminConfig />} />
      <Route path="/admin/pix/:id" element={<AdminPixUnified />} />
      <Route path="/admin/asaas" element={<AsaasSettings />} />
    </Routes>
  );
}

export default App;
