
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
import { supabase } from "@/lib/supabase";

const mockProduct: ProductType = {
  id: "checkout-item-1",
  title: "Hotmart - Checkou Cash",
  description: "Domine as técnicas de vendas online com nosso curso completo.",
  price: 19.90,
  originalPrice: 29.90,
  imageUrl: "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png",
};

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from Supabase
        // const { data: productData, error: productError } = await supabase
        //   .from('products')
        //   .select('*')
        //   .eq('id', id)
        //   .single();
        
        // if (productError) throw new Error(productError.message);
        
        // For now, use the mock data
        setProduct(mockProduct);
        setTestimonials(mockTestimonials);
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
    console.log('Payment data:', data);
    // Here we would process the payment
    // For now, simulate successful payment
    navigate(`/checkout/${id}/success`);
  };

  const handlePixPayment = () => {
    navigate(`/checkout/${id}/pix`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-burgundy-800 text-white py-3">
        <div className="container px-4 mx-auto flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            Pague até oferta terminar:
          </span>
          <Timer initialMinutes={10} className="ml-2" />
        </div>
      </header>

      {/* Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Product Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <VisitorCounter baseCount={135} />
          </div>

          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              Apenas algumas unidades disponíveis pelo preço promocional.
            </AlertDescription>
          </Alert>

          {/* Product Info */}
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

        {/* Checkout Form */}
        <CheckoutForm 
          product={product} 
          onSubmit={handleSubmitPayment}
          onPixPayment={handlePixPayment}
        />

        {/* Testimonials Section */}
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
      </div>

      {/* Footer */}
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
