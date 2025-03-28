
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
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
  );
};

export default CTA;
