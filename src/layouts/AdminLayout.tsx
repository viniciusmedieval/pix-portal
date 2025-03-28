
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Settings, CreditCard, BarChart2, Layout } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);

  const navItems = [
    { path: '/admin', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/admin/produtos', icon: <Package size={20} />, label: 'Produtos' },
    { path: '/admin/pedidos', icon: <ShoppingCart size={20} />, label: 'Pedidos' },
    { path: '/admin/relatorio', icon: <BarChart2 size={20} />, label: 'Relatórios' },
    { path: '/admin/config', icon: <Settings size={20} />, label: 'Configurações' },
    { path: '/admin/pix', icon: <CreditCard size={20} />, label: 'Página Pix' },
    { path: '/admin/testimonials', icon: <Layout size={20} />, label: 'Depoimentos' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded hover:bg-gray-800 ${
                    isActive(item.path) ? 'bg-gray-800' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
