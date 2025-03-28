
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatters';
import { Star } from 'lucide-react';

// Testimonial interface
interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  avatar?: string;
}

interface NewCheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  config?: any;
}

// Mock testimonials
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Ricardo dos Reis de Alves',
    content: 'Ótima escolha! Qualidade do e-produto, satisfação garantida e gostei muito.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    author: 'Juliana Vasconcelos',
    content: 'Produto surpreendente de usar! Eu recomendo a qualquer um que esteja procurando algo semelhante.',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    author: 'Rafaela Gomes',
    content: 'Achei simples, satisfatório, cumpre bem o objetivo.',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const NewCheckoutContent: React.FC<NewCheckoutContentProps> = ({ 
  producto,
  config = {}
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [visitors, setVisitors] = useState(0);
  
  // Set random number of visitors
  useEffect(() => {
    if (config?.numero_aleatorio_visitas !== false) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [config?.numero_aleatorio_visitas]);

  const handleContinue = () => {
    if (activeSection === 'personal') {
      setActiveSection('payment');
    } else {
      // Handle payment submission
      navigate(`/checkout/${producto.slug || producto.id}/pix`);
    }
  };

  const handlePixPayment = () => {
    navigate(`/checkout/${producto.slug || producto.id}/pix`);
  };

  return (
    <div className="w-full bg-neutral-100 min-h-screen">
      {/* Header */}
      {config?.show_header !== false && (
        <div className="w-full py-2 px-4 text-center" 
          style={{ 
            backgroundColor: config?.header_bg_color || 'rgb(223, 32, 32)',
            color: config?.header_text_color || 'white' 
          }}>
          <p className="text-sm font-medium">
            {config?.header_message || 'Tempo restante! Garanta sua oferta'}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto p-4">
        {/* Product Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-1">
            {producto.preco >= 10000 ? 'DE 69.000,00' : 'DE R$ 69,00'}
          </h1>
          <h2 className="text-3xl font-bold text-red-700">
            {producto.preco >= 10000 ? 'POR APENAS R$ 40.000,00' : 'POR APENAS R$ 49,90'}
          </h2>
          <div className="bg-yellow-400 px-3 py-1 text-sm font-bold text-black rounded mt-2">
            PREÇO DE HOJE ACABA EM:
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-red-600 text-white p-3 text-center">
            <h3 className="font-bold">PREENCHA SEUS DADOS ABAIXO</h3>
          </div>

          {/* Form */}
          <div className="p-4">
            {activeSection === 'personal' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://cdn-icons-png.flaticon.com/512/5087/5087607.png" alt="Formulário" className="w-5 h-5" />
                  <p className="text-lg font-semibold">Dados pessoais</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input id="nome" placeholder="Digite seu nome completo" />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="Digite seu e-mail" />
                  </div>
                  
                  <div>
                    <Label htmlFor="cpf">CPF/CNPJ</Label>
                    <Input id="cpf" placeholder="Digite seu CPF ou CNPJ" />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-1/5">
                      <Label htmlFor="ddd">DDD</Label>
                      <Select defaultValue="55">
                        <SelectTrigger>
                          <SelectValue placeholder="+55" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="55">+55</SelectItem>
                          <SelectItem value="1">+1</SelectItem>
                          <SelectItem value="44">+44</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="telefone">Celular</Label>
                      <Input id="telefone" placeholder="Digite seu número de celular" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://cdn-icons-png.flaticon.com/512/126/126179.png" alt="Pagamento" className="w-5 h-5" />
                  <p className="text-lg font-semibold">Pagamento</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border p-3 rounded-lg">
                  <button className="border rounded-md p-2 flex justify-center items-center bg-blue-50 border-blue-500">
                    <img src="/placeholder.svg" alt="Cartão" className="h-5 w-5 mr-2" />
                    <span>Cartão</span>
                  </button>
                  
                  <button 
                    className="border rounded-md p-2 flex justify-center items-center"
                    onClick={handlePixPayment}
                  >
                    <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mr-2" />
                    <span>PIX</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="card_name">Nome no cartão</Label>
                    <Input id="card_name" placeholder="Digite o nome como está no cartão" />
                  </div>
                  
                  <div>
                    <Label htmlFor="card_number">Número do cartão</Label>
                    <Input id="card_number" placeholder="Digite o número do cartão" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="card_expiry">Vencimento</Label>
                      <Input id="card_expiry" placeholder="MM/AA" />
                    </div>
                    
                    <div className="col-span-1">
                      <Label htmlFor="card_cvv">CVV</Label>
                      <Input id="card_cvv" placeholder="000" />
                    </div>
                    
                    <div className="col-span-1">
                      <Label htmlFor="installments">Parcelas</Label>
                      <Select defaultValue="1x">
                        <SelectTrigger>
                          <SelectValue placeholder="1x" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1x">1x de R${(producto.preco).toFixed(2)}</SelectItem>
                          <SelectItem value="2x">2x de R${(producto.preco/2).toFixed(2)}</SelectItem>
                          <SelectItem value="3x">3x de R${(producto.preco/3).toFixed(2)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Button */}
            <div className="mt-6">
              <Button 
                className="w-full py-6 text-lg font-bold" 
                style={{
                  backgroundColor: config?.cor_botao || '#30b968',
                }}
                onClick={handleContinue}
              >
                {activeSection === 'personal' ? 'Continuar' : 'Finalizar compra'}
              </Button>
              
              <div className="text-center mt-2 text-sm text-gray-500">
                <p>Pagamento 100% seguro. Transação realizada com criptografia.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        {config?.exibir_testemunhos !== false && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {config?.testimonials_title || 'O que dizem nossos clientes'}
              </h3>
              
              <div className="space-y-4">
                {mockTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={testimonial.avatar || '/placeholder.svg'}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{testimonial.author}</p>
                        <div className="flex text-yellow-500 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < testimonial.rating ? 'currentColor' : 'none'}
                              color={i < testimonial.rating ? 'currentColor' : '#ccc'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 mt-2 text-sm">{testimonial.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Visitor Counter */}
        {config?.numero_aleatorio_visitas !== false && visitors > 0 && (
          <div className="bg-red-50 border border-red-100 rounded p-3 mt-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-700">
              <strong>{visitors}</strong> pessoas estão vendo essa página agora
            </p>
          </div>
        )}
        
        {/* Footer */}
        {config?.show_footer !== false && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>{config?.footer_text || 'Todos os direitos reservados © 2023'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCheckoutContent;
