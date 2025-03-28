import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { criarOuAtualizarConfig, getConfig } from '@/services/configService';

interface AdminPixProps {
  productId?: string;
}

const pixFormSchema = z.object({
  chave_pix: z.string().min(1, { message: "Chave PIX obrigatória" }),
  qr_code: z.string().optional(),
  mensagem_pix: z.string().optional(),
  tempo_expiracao: z.coerce.number().min(1, { message: "Tempo de expiração deve ser pelo menos 1 minuto" })
});

export default function AdminPix({ productId }: AdminPixProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<z.infer<typeof pixFormSchema> | undefined>(undefined);

  const form = useForm<z.infer<typeof pixFormSchema>>({
    resolver: zodResolver(pixFormSchema),
    defaultValues: initialValues,
    mode: "onChange"
  });

  useEffect(() => {
    if (productId) {
      const fetchConfig = async () => {
        const configData = await getConfig(productId);
        if (configData) {
          setInitialValues({
            chave_pix: configData.chave_pix || '',
            qr_code: configData.qr_code || '',
            mensagem_pix: configData.mensagem_pix || '',
            tempo_expiracao: configData.tempo_expiracao || 15
          });
          form.reset({
            chave_pix: configData.chave_pix || '',
            qr_code: configData.qr_code || '',
            mensagem_pix: configData.mensagem_pix || '',
            tempo_expiracao: configData.tempo_expiracao || 15
          });
        }
      };
      fetchConfig();
    }
  }, [productId, form]);

  const handleSavePix = async (values: z.infer<typeof pixFormSchema>) => {
    setIsSubmitting(true);
    try {
      const pixConfig = {
        produto_id: productId as string,
        chave_pix: values.chave_pix,
        mensagem_pix: values.mensagem_pix,
        qr_code: values.qr_code,
        tempo_expiracao: values.tempo_expiracao
      };

      await criarOuAtualizarConfig(pixConfig);

      toast({
        title: "Sucesso",
        description: "Configurações PIX salvas com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações PIX.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações PIX</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSavePix)} className="space-y-4">
            <FormField
              control={form.control}
              name="chave_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input placeholder="Chave PIX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qr_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do QR Code (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL do QR Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mensagem_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem PIX (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensagem exibida na tela de pagamento PIX"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempo_expiracao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de expiração (minutos)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Tempo de expiração" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Configurações PIX"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
