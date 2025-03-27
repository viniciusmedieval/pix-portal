
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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
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
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  product: ProductType;
  onSubmit: (data: FormValues) => void;
  onPixPayment: () => void;
}

export function CheckoutForm({ product, onSubmit, onPixPayment }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      installments: "1x",
    },
  });

  const installmentOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
    const installmentValue = product.price / num;
    return {
      value: `${num}x`,
      label: `${num}x de ${formatCurrency(installmentValue)}${num > 1 ? ' sem juros' : ''}`,
    };
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do titular</Label>
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
              onClick={onPixPayment}
              className="w-full flex items-center justify-center gap-2"
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
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Finalizar Compra - {formatCurrency(product.price)}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CheckoutForm;
