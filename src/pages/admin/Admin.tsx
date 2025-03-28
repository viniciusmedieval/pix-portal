
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  CreditCard, 
  BarChart3, 
  ShoppingCart,
  LogOut,
  PieChart
} from "lucide-react";

export default function Admin() {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Painel Admin</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin" ? "bg-gray-200" : ""
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/produtos"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/produtos" ? "bg-gray-200" : ""
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/pedidos"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/pedidos" ? "bg-gray-200" : ""
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span>Pedidos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/pix"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/pix" ? "bg-gray-200" : ""
                }`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Configuração de PIX</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/pixels"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/pixels" ? "bg-gray-200" : ""
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                <span>Pixels e Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/relatorio"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/relatorio" ? "bg-gray-200" : ""
                }`}
              >
                <PieChart className="w-5 h-5 mr-3" />
                <span>Relatórios</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/config"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors ${
                  location.pathname === "/admin/config" ? "bg-gray-200" : ""
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span>Configurações</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-3 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
