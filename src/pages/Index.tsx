
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Lock, CreditCard, Check } from "lucide-react";
import ProductCard, { ProductType } from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";

const mockProduct: ProductType = {
  id: "checkout-item-1",
  title: "Hotmart - Checkout Cash",
  description: "Domine as técnicas de vendas online com nosso curso completo.",
  price: 19.90,
  originalPrice: 29.90,
  imageUrl: "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png"
};

const Index = () => {
  const navigate = useNavigate();
  
  const handleProductSelect = (product: ProductType) => {
    navigate(`/checkout/${product.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">PixPortal</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-primary">Recursos</a>
            <a href="#products" className="text-gray-600 hover:text-primary">Produtos</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Checkout profissional para aumentar suas vendas
              </h1>
              
              <p className="text-lg text-gray-600">
                Transforme visitantes em clientes com uma página de checkout otimizada 
                e integrada com PIX para aumentar sua taxa de conversão.
              </p>
              
              <div className="flex items-center gap-4 pt-4">
                <Link to="/checkout/checkout-item-1">
                  <Button className="bg-primary hover:bg-primary/90">
                    Ver demonstração <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to="/admin">
                  <Button variant="outline">
                    Acessar Admin
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img
                src="/lovable-uploads/5bdb8fb7-f326-411c-9013-3ab40582f119.png"
                alt="PixPortal Checkout"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recursos que impulsionam suas vendas
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Checkout Otimizado</h3>
                <p className="text-gray-600">
                  Interface limpa e focada em conversão, projetada para maximizar suas vendas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <CreditCard className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pagamento PIX</h3>
                <p className="text-gray-600">
                  Ofereça pagamentos instantâneos por PIX para reduzir o abandono e aumentar a conversão.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-primary mb-4">
                  <Lock className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança Total</h3>
                <p className="text-gray-600">
                  Todas as transações são seguras e protegidas com criptografia de ponta a ponta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Nossos Produtos
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Confira nosso produto principal e veja como pode transformar seus processos de venda online.
          </p>
          
          <div className="max-w-sm mx-auto">
            <ProductCard 
              product={mockProduct}
              onSelect={handleProductSelect}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para aumentar suas vendas?
          </h2>
          <p className="text-lg mb-8">
            Comece a usar o PixPortal hoje mesmo e veja a diferença em suas taxas de conversão.
          </p>
          <div className="flex justify-center">
            <Link to="/checkout/checkout-item-1">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Testar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">PixPortal</h3>
              <p className="mb-4">
                Soluções de checkout e pagamento para aumentar suas vendas online.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Início</a></li>
                <li><a href="#features" className="hover:text-white">Recursos</a></li>
                <li><a href="#products" className="hover:text-white">Produtos</a></li>
                <li><Link to="/admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Contato</h4>
              <p>contato@pixportal.com.br</p>
              <p className="mt-2">São Paulo, Brasil</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} PixPortal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
