
import { Check } from "lucide-react";

const Benefits = () => {
  return (
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
  );
};

export default Benefits;
