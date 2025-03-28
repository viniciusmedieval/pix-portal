
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { ProductType } from "./ProductCard";
import { CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { verificarCpfDuplicado, salvarPedido } from "@/services/pedidoService";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  cpf: z.string().min(11, {
    message: "CPF inválido.",
  }),
  telefone: z.string().optional(),
  cardName: z.string().min(3, {
    message: "Nome no cartão deve ter pelo menos 3 caracteres.",
  }),
  cardNumber: z.string().refine(
    (val) => {
      const digitsOnly = val.replace(/\D/g, "");
      return digitsOnly.length >= 13 && digitsOnly.length <= 19;
    },
    {
      message: "Número de cartão inválido.",
    }
  ),
  expiry: z.string().refine(
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
  installments: z.string(),
  payment: z.enum(["pix", "cartao"]).default("cartao"),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  product: ProductType;
  config?: any;
  onSubmit?: (data: FormValues) => void;
  onPixPayment?: () => void;
}

export function CheckoutForm({ product, config, onSubmit, onPixPayment }: CheckoutFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      installments: "1x",
      payment: "cartao"
    },
  });

  // Determinar número máximo de parcelas com base no produto
  const maxParcelas = product.parcelas || (config?.parcelas_permitidas || 12);
  
  const installmentOptions = Array.from({ length: maxParcelas }, (_, i) => i + 1).map((num) => {
    const installmentValue = product.price / num;
    return {
      value: `${num}x`,
      label: `${num}x de ${formatCurrency(installmentValue)}${num > 1 ? ' sem juros' : ''}`,
    };
  });

  const processSubmit = async (data: FormValues) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Verificar se o CPF está bloqueado
      if (config?.bloquear_cpfs?.includes(data.cpf)) {
        toast({
          title: "CPF bloqueado",
          description: "Este CPF não está autorizado a realizar esta compra.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Verificar se CPF já foi usado neste produto
      const cpfDuplicado = await verificarCpfDuplicado(data.cpf, id);
      
      if (cpfDuplicado) {
        toast({
          title: "CPF já utilizado",
          description: "Este CPF já realizou uma compra para este produto.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Salvar pedido
      const pedido = await salvarPedido({
        produto_id: id,
        nome: data.name,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        valor: product.price,
        forma_pagamento: data.payment === "pix" ? "pix" : "cartao"
      });

      // Callback custom (se fornecido)
      if (onSubmit) {
        onSubmit(data);
        return;
      }

      // Redirecionamento padrão baseado no tipo de pagamento
      if (data.payment === "pix") {
        navigate(`/checkout/${id}/pix?pedidoId=${pedido.id}`);
      } else {
        // Futuramente implementar fluxo de cartão de crédito
        toast({
          title: "Pedido realizado",
          description: "Seu pedido foi processado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      toast({
        title: "Erro ao processar pedido",
        description: "Ocorreu um erro ao processar seu pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePixButtonClick = async () => {
    if (onPixPayment) {
      onPixPayment();
      return;
    }
    
    // Implementação padrão do botão PIX quando não há callback
    const form = document.getElementById("payment-form") as HTMLFormElement;
    form.payment.value = "pix";
    form.requestSubmit();
  };

  // Aplicar cor do botão a partir da configuração
  const buttonColor = config?.cor_botao || "bg-primary hover:bg-primary/90";
  const buttonText = config?.texto_botao || "Finalizar Compra";

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="payment-form" onSubmit={handleSubmit(processSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" placeholder="Nome completo" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
              {errors.cpf && (
                <p className="text-xs text-red-500">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input id="telefone" placeholder="(00) 00000-0000" {...register("telefone")} />
              {errors.telefone && (
                <p className="text-xs text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <input type="hidden" {...register("payment")} />

            <div className="space-y-2">
              <Label htmlFor="cardName">Nome no cartão</Label>
              <Input id="cardName" placeholder="Nome como está no cartão" {...register("cardName")} />
              {errors.cardName && (
                <p className="text-xs text-red-500">{errors.cardName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do cartão</Label>
              <Input 
                id="cardNumber" 
                placeholder="1234 5678 9012 3456" 
                {...register("cardNumber")} 
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Vencimento</Label>
                <Input id="expiry" placeholder="MM/AA" {...register("expiry")} />
                {errors.expiry && (
                  <p className="text-xs text-red-500">{errors.expiry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" {...register("cvv")} />
                {errors.cvv && (
                  <p className="text-xs text-red-500">{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installments">Parcelamento</Label>
              <select
                id="installments"
                {...register("installments")}
                className="w-full p-2 border rounded-md"
              >
                {installmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">ou pague com</p>
            <Button 
              variant="outline" 
              onClick={handlePixButtonClick}
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <img src="/pix-logo.png" alt="PIX" className="h-5 w-auto" />
              <span>Pagar com PIX</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            form="payment-form"
            className={`w-full ${buttonColor}`}
            disabled={isSubmitting}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{buttonText} - {formatCurrency(product.price)}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CheckoutForm;
