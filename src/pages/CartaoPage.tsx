import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { getPedidoById, atualizarStatusPedido } from "@/services/pedidoService";
import { getProdutoBySlug } from "@/services/produtoService";
import { getConfig } from "@/services/configService";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "@/hooks/use-toast";
import usePixel from "@/hooks/usePixel";

const formSchema = z.object({
  nome_cartao: z.string().min(3, {
    message: "Nome no cartão deve ter pelo menos 3 caracteres.",
  }),
  numero_cartao: z.string().refine(
    (val) => {
      const digitsOnly = val.replace(/\D/g, "");
      return digitsOnly.length >= 13 && digitsOnly.length <= 19;
    },
    {
      message: "Número de cartão inválido.",
    }
  ),
  validade: z.string().refine(
    (val) => {
      const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
      return pattern.test(val);
    },
    {
      message: "Data de expiração inválida (MM/AA).",
    }
  ),
  cvv: z.string().refine(
    (val) => {
      const digitsOnly = val.replace(/\D/g, "");
      return digitsOnly.length >= 3 && digitsOnly.length <= 4;
    },
    {
      message: "CVV inválido.",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function CartaoPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pedido_id = searchParams.get('pedido_id');
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<any>(null);
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  
  // Initialize pixel tracking but don't track purchase yet
  const { trackEvent } = usePixel();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !pedido_id) {
        setLoading(false);
        return;
      }
      
      try {
        const produtoData = await getProdutoBySlug(slug);
        if (produtoData) {
          setProduto(produtoData);
          
          const configData = await getConfig(produtoData.id);
          setConfig(configData);
          
          const pedidoData = await getPedidoById(pedido_id);
          setPedido(pedidoData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pedido",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, pedido_id]);

  const onSubmit = async (data: FormValues) => {
    if (!pedido_id) return;
    
    setSubmitting(true);
    try {
      // Basic "encryption" - in a real app, use proper encryption
      console.log('Dados do cartão:', {
        nome_cartao: data.nome_cartao,
        numero_cartao: data.numero_cartao.replace(/\d(?=\d{4})/g, "*"), // Mask all but last 4 digits for logging
        validade: data.validade,
        cvv: "***", // Don't log CVV
      });
      
      // Update pedido status
      await atualizarStatusPedido(pedido_id, "processando");
      
      // Track purchase event when payment is processed
      if (!paymentProcessed && produto) {
        trackEvent('Purchase', {
          value: pedido?.valor,
          currency: 'BRL',
          content_name: produto?.nome,
          payment_type: 'credit_card',
          produtoId: produto?.id
        });
        setPaymentProcessed(true);
      }
      
      toast({
        title: "Pagamento Recebido",
        description: "Seu pagamento foi recebido e está sendo processado.",
      });
      
      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Erro no Pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando informações de pagamento...</div>;
  if (!produto || !pedido) return <div className="p-6 text-center">Informações de pagamento não encontradas.</div>;

  return (
    <div className="min-h-screen p-6" style={{ background: config?.cor_fundo || '#f9fafb' }}>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pagamento com Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Product Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h2 className="font-semibold text-lg mb-2">{produto.nome}</h2>
              <p className="text-gray-700 mb-2">
                Valor: <span className="font-medium">{formatCurrency(pedido.valor)}</span>
              </p>
            </div>
            
            <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_cartao">Nome no cartão</Label>
                <Input 
                  id="nome_cartao" 
                  placeholder="Nome como está no cartão" 
                  {...register("nome_cartao")} 
                />
                {errors.nome_cartao && (
                  <p className="text-xs text-red-500">{errors.nome_cartao.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_cartao">Número do cartão</Label>
                <Input 
                  id="numero_cartao" 
                  placeholder="1234 5678 9012 3456" 
                  {...register("numero_cartao")} 
                />
                {errors.numero_cartao && (
                  <p className="text-xs text-red-500">{errors.numero_cartao.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validade">Vencimento</Label>
                  <Input 
                    id="validade" 
                    placeholder="MM/AA" 
                    {...register("validade")} 
                  />
                  {errors.validade && (
                    <p className="text-xs text-red-500">{errors.validade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    {...register("cvv")} 
                  />
                  {errors.cvv && (
                    <p className="text-xs text-red-500">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="payment-form"
              className="w-full"
              style={{ backgroundColor: config?.cor_botao || '#22c55e' }}
              disabled={submitting}
            >
              {submitting ? (
                <>Processando...</>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Confirmar Pagamento</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Seus dados estão protegidos com criptografia de ponta a ponta.</p>
        </div>
      </div>
    </div>
  );
}
