
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

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
}

export default function CreditCardForm({ onSubmit, submitting, buttonColor }: CreditCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreditCardFormValues>({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
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
      <Button 
        type="submit" 
        form="payment-form"
        className="w-full mt-4"
        style={{ backgroundColor: buttonColor || '#22c55e' }}
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
    </>
  );
}
