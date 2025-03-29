
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Users, CreditCard, BarChart3, Settings } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Pedidos",
      description: "Gerencie seus pedidos",
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      path: "/admin/pedidos"
    },
    {
      title: "Produtos",
      description: "Cadastre e edite produtos",
      icon: <CreditCard className="h-8 w-8 text-green-500" />,
      path: "/admin/produtos"
    },
    {
      title: "Relatórios",
      description: "Acompanhe sua performance",
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      path: "/admin/relatorio"
    },
    {
      title: "Configurações",
      description: "Personalize seu checkout",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      path: "/admin/config"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo ao painel administrativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {card.icon}
                <span>{card.title}</span>
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(card.path)}
              >
                Acessar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
