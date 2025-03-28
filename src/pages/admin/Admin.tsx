
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageIcon, Settings, CreditCard, LineChart, ListOrdered } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [produtos, setProdutos] = useState<any[]>([]);

  const tabs = [
    { id: '/admin/produtos', label: 'Produtos', icon: <PackageIcon className="w-4 h-4 mr-2" /> },
    { id: '/admin/config', label: 'Checkout', icon: <Settings className="w-4 h-4 mr-2" /> },
    { id: '/admin/pix', label: 'PIX', icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { id: '/admin/pixels', label: 'Pixels', icon: <LineChart className="w-4 h-4 mr-2" /> },
    { id: '/admin/pedidos', label: 'Pedidos', icon: <ListOrdered className="w-4 h-4 mr-2" /> },
  ];

  useEffect(() => {
    supabase.from('produtos').select('*').then(({ data }) => setProdutos(data || []));
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(tabId);
  };

  // If we're at /admin, redirect to /admin/produtos
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/produtos');
    } else {
      setActiveTab(location.pathname);
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
