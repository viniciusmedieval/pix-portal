import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Clock, Users, AlertTriangle } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import TestimonialCard, { TestimonialType } from "@/components/TestimonialCard";
import Timer from "@/components/Timer";
import VisitorCounter from "@/components/VisitorCounter";
import { formatCurrency } from "@/lib/formatters";
import { ProductType } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { getProdutoBySlug } from "@/services/produtoService";
import { getConfig } from "@/services/configService";
import { getPixel } from "@/services/pixelService";
import usePixel from "@/hooks/usePixel";

const mockTestimonials: TestimonialType[] = [
  {
    id: "1",
    userName: "Reinaldo Martins da Silva",
    rating: 5,
    comment: "Estou muito satisfeito com o serviço, reaimente entregam o que prometem.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    userName: "Juliana Nascimento",
    rating: 5,
    comment: "Muito interessante que foi, tenho rotina na saúde fiz e o celular por um valor imbatível, recomendo que vocês comprem logo.",
    date: "ontem",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "3",
    userName: "Rafael Pires",
    rating: 5,
    comment: "Estava precisando, esse aplicativo, muito bom!",
    date: "hoje",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
  },
];

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  
  const { trackEvent } = usePixel(product?.id, 'InitiateCheckout');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) throw new Error("ID não fornecido");
        
        let produtoData;
        try {
          produtoData = await getProdutoBySlug(id);
        } catch (error) {
          try {
            const { data } = await supabase
              .from('produtos')
              .select('*')
              .eq('id', id)
              .single();
            produtoData = data;
          } catch (idError) {
            throw new Error("Produto não encontrado");
          }
        }
        
        if (!produtoData) throw new Error("Produto não encontrado");
        
        const configData = await getConfig(produtoData.id);
        
        setProduct({
          id: produtoData.id,
          title: produtoData.nome,
          description: produtoData.descricao || "",
          price: produtoData.preco,
          imageUrl: produtoData.imagem || "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png",
          parcelas: produtoData.parcelas_permitidas,
          imagem: produtoData.imagem,
          slug: produtoData.slug
        });
        
        setConfig(configData);
        
        if (configData?.exibir_testemunhos !== false) {
          setTestimonials(mockTestimonials);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError('Não foi possível carregar os dados do produto.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitPayment = (data: any) => {
    trackEvent('Lead', {
      content_name: product?.title
    });
    
    if (config?.bloquear_cpfs?.includes(data.cpf)) {
      alert('Este CPF não está autorizado a realizar esta compra.');
      return;
    }
    
    console.log('Payment data:', data);
    
    if (data.forma_pagamento === 'pix') {
      navigate(`/checkout/${id}/pix?pedido_id=${data.pedido_id}`);
    } else if (data.forma_pagamento === 'cartao') {
      navigate(`/checkout/${id}/cartao?pedido_id=${data.pedido_id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando checkout...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error || 'Produto não encontrado.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const primaryColor = config?.cor_primaria || 'bg-burgundy-800';
  const buttonColor = config?.cor_botao || 'bg-primary';
  const buttonText = config?.texto_botao || 'Finalizar Compra';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`${primaryColor} text-white py-3`}>
        <div className="container px-4 mx-auto flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {config?.texto_topo || "Pague até oferta terminar:"}
          </span>
          <Timer initialMinutes={10} className="ml-2" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <VisitorCounter 
              useConfig={true} 
              config={config} 
            />
          </div>

          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              Apenas algumas unidades disponíveis pelo preço promocional.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-center mb-6">
            <div className="max-w-xs">
              <img 
                src={product.imageUrl || "https://placehold.co/400x300"} 
                alt={product.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-100 rounded-lg inline-block mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        <CheckoutForm 
          product={product}
          config={config}
          onSubmit={handleSubmitPayment}
        />

        {testimonials.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Depoimentos</h3>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  userName={testimonial.userName}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                  avatar={testimonial.avatar}
                  date={testimonial.date}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="py-6 bg-gray-100 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} PixPortal. Todos os direitos reservados.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-600 hover:text-primary mx-2">Termos de Uso</a>
            <a href="#" className="text-gray-600 hover:text-primary mx-2">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;
