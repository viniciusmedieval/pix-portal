
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, CheckCircle, Lock } from "lucide-react";
import { useState, useEffect } from "react";

// Credit card validation schema with enhanced validations
const formSchema = z.object({
  nome_cartao: z.string().min(3, {
    message: "Nome no cartão deve ter pelo menos 3 caracteres.",
  }),
  numero_cartao: z.string().refine(
    (val) => {
      // Remove spaces and dashes for validation
      const digitsOnly = val.replace(/\D/g, "");
      
      // Basic Luhn algorithm check (credit card validation)
      let sum = 0;
      let shouldDouble = false;
      
      // Loop through values starting from the rightmost digit
      for (let i = digitsOnly.length - 1; i >= 0; i--) {
        let digit = parseInt(digitsOnly.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      // Card number is valid if it has 13-19 digits and sum is divisible by 10
      return digitsOnly.length >= 13 && 
             digitsOnly.length <= 19 && 
             sum % 10 === 0;
    },
    {
      message: "Número de cartão inválido. Verifique os dígitos.",
    }
  ),
  validade: z.string().refine(
    (val) => {
      // Match MM/YY format where MM can be a single digit (1-9) or double digit (01-12)
      const pattern = /^(0?[1-9]|1[0-2])\/(2\d)$/;
      
      if (!pattern.test(val)) return false;
      
      // Extract month and year
      const [month, year] = val.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      
      // Convert to numbers
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      
      // Validate that the date is in the future or current month
      return (yearNum > currentYear) || 
             (yearNum === currentYear && monthNum >= currentMonth);
    },
    {
      message: "Data de expiração inválida ou expirada.",
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
  parcelas: z.enum(["1x", "2x", "3x"]).default("1x"),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreditCardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parcelas: "1x"
    }
  });

  const validade = watch("validade");
  
  // Format expiry date as user types
  useEffect(() => {
    if (validade) {
      // Remove any non-digits
      let cleaned = validade.replace(/\D/g, "");
      
      // Format as MM/YY
      if (cleaned.length > 0) {
        // Handle single digit month (prepend 0 if it's clearly a month between 1-9)
        if (cleaned.length === 1 && parseInt(cleaned, 10) > 0) {
          if (parseInt(cleaned, 10) > 1) {
            cleaned = "0" + cleaned;
          }
        } else if (cleaned.length >= 2) {
          // Check if first two digits are a valid month
          const month = parseInt(cleaned.substring(0, 2), 10);
          if (month > 12) {
            // If month > 12, assume user meant to type "01"
            cleaned = "0" + cleaned.charAt(0) + cleaned.substring(1);
          }
        }
        
        // Add the slash after the month
        if (cleaned.length > 2) {
          cleaned = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
        } else if (cleaned.length === 2) {
          cleaned = cleaned + "/";
        }
      }
      
      // Only update if the format actually changed to prevent cursor jumping
      if (cleaned !== validade) {
        setValue("validade", cleaned);
      }
    }
  }, [validade, setValue]);

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

  // Log form submission for debugging
  const processSubmit = (data: CreditCardFormValues) => {
    console.log("CreditCardForm submit triggered with data:", { 
      ...data, 
      cvv: '***' // Don't log sensitive CVV
    });
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg flex items-center gap-3 text-sm">
        <Lock className="h-5 w-5 text-gray-500" />
        <span>Seus dados estão protegidos com criptografia SSL de 256 bits</span>
      </div>
      
      <form id="payment-form" onSubmit={handleSubmit(processSubmit)} className="space-y-5">
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
        
        <div className="space-y-2">
          <Label htmlFor="parcelas" className="text-sm font-medium">
            Parcelamento
          </Label>
          <select
            id="parcelas"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            {...register("parcelas")}
          >
            <option value="1x">1x sem juros</option>
            <option value="2x">2x sem juros</option>
            <option value="3x">3x sem juros</option>
          </select>
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
