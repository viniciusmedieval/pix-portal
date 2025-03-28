
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Lock, CreditCard, Check } from "lucide-react";
import ProdutoCard from "@/components/ProdutoCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtoService";

const Index = () => {
  const navigate = useNavigate();
  
  const { data: produtos, isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: getProdutos
  });

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
            Confira nossos produtos em destaque e veja como podem transformar seus processos de venda online.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-48 w-64 rounded-lg bg-gray-200 mb-4"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : produtos && produtos.length > 0 ? (
              produtos.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  id={produto.id}
                  nome={produto.nome}
                  descricao={produto.descricao || ""}
                  preco={produto.preco}
                  imagem_url={produto.imagem_url}
                  slug={produto.slug}
                  estoque={produto.estoque}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum produto encontrado. Adicione produtos no painel administrativo.</p>
                <Link to="/admin/produtos" className="inline-block mt-4">
                  <Button variant="outline">
                    Ir para administração de produtos
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section (New) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Benefícios de usar o PixPortal
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Aumento na Taxa de Conversão</h3>
                <p className="text-gray-600">
                  Nossos clientes relatam um aumento médio de 30% nas taxas de conversão após implementar nossa solução de checkout.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Baixas Taxas de Abandono</h3>
                <p className="text-gray-600">
                  Reduza o abandono do carrinho com um processo de checkout rápido e sem complicações.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integração Fácil</h3>
                <p className="text-gray-600">
                  Integre nosso sistema facilmente aos seus produtos e comece a vender em minutos.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Suporte Técnico Especializado</h3>
                <p className="text-gray-600">
                  Nossa equipe está disponível para ajudar com qualquer dúvida ou problema que você possa ter.
                </p>
              </div>
            </div>
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
