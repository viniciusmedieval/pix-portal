
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageIcon, Settings, CreditCard, ListOrdered } from 'lucide-react';

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const tabs = [
    { id: '/admin/produtos', label: 'Produtos', icon: <PackageIcon className="w-4 h-4 mr-2" /> },
    { id: '/admin/config', label: 'Checkout', icon: <Settings className="w-4 h-4 mr-2" /> },
    { id: '/admin/pix', label: 'PIX', icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { id: '/admin/pedidos', label: 'Pedidos', icon: <ListOrdered className="w-4 h-4 mr-2" /> },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(tabId);
  };

  // If we're at /admin, redirect to /admin/produtos
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/produtos');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              PixPortal Admin
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">Voltar ao site</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 p-1">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        <Outlet />
      </div>
    </div>
  );
}
