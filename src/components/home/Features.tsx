
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Lock, CreditCard } from "lucide-react";

const Features = () => {
  return (
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
  );
};

export default Features;
