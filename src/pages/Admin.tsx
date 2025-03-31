
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Settings, 
  CreditCard, 
  Package, 
  Users, 
  BarChart, 
  PlusCircle 
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

// Mock data
const recentOrders = [
  { id: "ORD001", customer: "Maria Silva", product: "Checkout Cash", date: "2023-07-12", amount: 19.90, status: "completed" },
  { id: "ORD002", customer: "João Oliveira", product: "Checkout Cash", date: "2023-07-11", amount: 19.90, status: "completed" },
  { id: "ORD003", customer: "Ana Pereira", product: "Checkout Cash", date: "2023-07-10", amount: 19.90, status: "pending" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-primary">PixPortal Admin</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/admin" 
                  className="flex items-center px-4 py-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  <BarChart className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/produto/1" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <Package className="h-5 w-5 mr-3" />
                  Produtos
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/pedidos" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Pedidos
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/pix/1" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Configurações PIX
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/config/1" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Configurações
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/asaas" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Asaas (Pagamentos)
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <header className="bg-white border-b p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </header>

          <main className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(1250.90)}</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 12% desde o último mês
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 8% desde o último mês
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 15% desde o último mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <Link to="/admin/pedidos">
                    <Button variant="outline" size="sm">
                      Ver todos
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Lista dos últimos pedidos recebidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3 font-medium">ID</th>
                        <th className="text-left pb-3 font-medium">Cliente</th>
                        <th className="text-left pb-3 font-medium">Produto</th>
                        <th className="text-left pb-3 font-medium">Data</th>
                        <th className="text-right pb-3 font-medium">Valor</th>
                        <th className="text-right pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{order.customer}</td>
                          <td className="py-3">{order.product}</td>
                          <td className="py-3">{order.date}</td>
                          <td className="py-3 text-right">{formatCurrency(order.amount)}</td>
                          <td className="py-3 text-right">
                            <span 
                              className={`inline-flex text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Acesse rapidamente as funções mais utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/admin/produto/new">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-4"
                  >
                    <PlusCircle className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Novo Produto</div>
                      <div className="text-xs text-gray-500">Adicione um produto ao checkout</div>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/checkout/checkout-item-1">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-4"
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Ver Checkout</div>
                      <div className="text-xs text-gray-500">Visualize a página de checkout</div>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/admin/config/1">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto py-4"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Configurações</div>
                      <div className="text-xs text-gray-500">Ajuste as configurações do sistema</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
