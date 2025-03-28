
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
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
  );
};

export default Hero;
