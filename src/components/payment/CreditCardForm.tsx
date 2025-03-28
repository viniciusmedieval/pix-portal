
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Lock } from "lucide-react";
import { useState } from "react";

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

export type CreditCardFormValues = z.infer<typeof formSchema>;

interface CreditCardFormProps {
  onSubmit: (data: CreditCardFormValues) => void;
  submitting: boolean;
  buttonColor?: string;
  buttonText?: string;
}

export default function CreditCardForm({ 
  onSubmit, 
  submitting, 
  buttonColor = '#22c55e',
  buttonText = 'Confirmar Pagamento' 
}: CreditCardFormProps) {
  const [focused, setFocused] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditCardFormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleFocus = (field: string) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-4 py-3 rounded-lg border transition-all duration-200";
    
    if (errors[fieldName as keyof CreditCardFormValues]) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
    }
    
    if (focused === fieldName) {
      return `${baseClass} border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20`;
    }
    
    return `${baseClass} border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg flex items-center gap-3 text-sm">
        <Lock className="h-5 w-5 text-gray-500" />
        <span>Seus dados estão protegidos com criptografia SSL de 256 bits</span>
      </div>
      
      <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="nome_cartao" className="text-sm font-medium">
            Nome no cartão
          </Label>
          <Input 
            id="nome_cartao" 
            placeholder="Nome como está no cartão" 
            className={getInputClassName("nome_cartao")}
            {...register("nome_cartao")} 
            onFocus={() => handleFocus("nome_cartao")}
            onBlur={handleBlur}
          />
          {errors.nome_cartao && (
            <p className="text-xs text-red-500 mt-1">{errors.nome_cartao.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero_cartao" className="text-sm font-medium">
            Número do cartão
          </Label>
          <Input 
            id="numero_cartao" 
            placeholder="1234 5678 9012 3456" 
            className={getInputClassName("numero_cartao")}
            {...register("numero_cartao")} 
            onFocus={() => handleFocus("numero_cartao")}
            onBlur={handleBlur}
          />
          {errors.numero_cartao && (
            <p className="text-xs text-red-500 mt-1">{errors.numero_cartao.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="validade" className="text-sm font-medium">
              Vencimento
            </Label>
            <Input 
              id="validade" 
              placeholder="MM/AA" 
              className={getInputClassName("validade")}
              {...register("validade")} 
              onFocus={() => handleFocus("validade")}
              onBlur={handleBlur}
            />
            {errors.validade && (
              <p className="text-xs text-red-500 mt-1">{errors.validade.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm font-medium">
              CVV
            </Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              className={getInputClassName("cvv")}
              {...register("cvv")} 
              onFocus={() => handleFocus("cvv")}
              onBlur={handleBlur}
            />
            {errors.cvv && (
              <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </form>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          form="payment-form"
          className="w-full h-14 text-base font-medium rounded-lg transition-transform active:scale-[0.98]"
          style={{ backgroundColor: buttonColor }}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
        <span>Processamento seguro de pagamentos</span>
      </div>
    </div>
  );
}
