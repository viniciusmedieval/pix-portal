import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getConfig, criarOuAtualizarConfig } from '@/services/configService';
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  showTestimonials: z.boolean().default(false).optional(),
  showVisitorCounter: z.boolean().default(false).optional(),
  blockedCpfs: z.string().optional(),
});

export default function AdminConfig() {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const [configData, setConfigData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundColor: '',
      buttonColor: '',
      buttonText: '',
      pixMessage: '',
      qrCodeUrl: '',
      pixKey: '',
      showTestimonials: false,
      showVisitorCounter: false,
      blockedCpfs: ''
    },
  });

  useEffect(() => {
    if (productId) {
      getConfig(productId)
        .then(data => {
          setConfigData(data);
          if (data) {
            form.reset({
              backgroundColor: data.cor_fundo || '',
              buttonColor: data.cor_botao || '',
              buttonText: data.texto_botao || '',
              pixMessage: data.mensagem_pix || '',
              qrCodeUrl: data.qr_code || '',
              pixKey: data.chave_pix || '',
              showTestimonials: data.exibir_testemunhos !== false,
              showVisitorCounter: data.numero_aleatorio_visitas !== false,
              blockedCpfs: data.bloquear_cpfs?.join(", ") || ''
            });
          }
        })
        .catch(error => {
          console.error("Error fetching config:", error);
          toast({
            title: "Erro ao carregar configuração",
            description: "Ocorreu um erro ao carregar os dados da configuração.",
            variant: "destructive",
          });
        });
    }
  }, [productId, form]);

  const handleSaveConfig = async (data: z.infer<typeof formSchema>) => {
  setIsSaving(true);
  try {
    const configData = {
      produto_id: productId as string, // Ensure produto_id is set properly
      cor_fundo: data.backgroundColor,
      cor_botao: data.buttonColor,
      texto_botao: data.buttonText,
      mensagem_pix: data.pixMessage,
      qr_code: data.qrCodeUrl,
      chave_pix: data.pixKey,
      exibir_testemunhos: data.showTestimonials,
      numero_aleatorio_visitas: data.showVisitorCounter,
      bloquear_cpfs: data.blockedCpfs?.split(",").map(cpf => cpf.trim()) || []
    };

    await criarOuAtualizarConfig(configData);

    toast({
      title: "Configuração salva!",
      description: "As configurações foram salvas com sucesso.",
    });
  } catch (error) {
    console.error("Error saving config:", error);
    toast({
      title: "Erro ao salvar configuração",
      description: "Ocorreu um erro ao salvar as configurações.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveConfig)} className="space-y-4">
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo</FormLabel>
                  <FormControl>
                    <Input placeholder="Cor de fundo (ex: #f0f0f0)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cor de fundo da página de checkout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Botão</FormLabel>
                  <FormControl>
                    <Input placeholder="Cor do botão (ex: #007bff)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cor do botão de compra.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Botão</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto do botão (ex: Comprar agora)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Texto exibido no botão de compra.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pixMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem PIX</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensagem exibida na página de pagamento PIX"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mensagem exibida para o cliente na página de pagamento PIX.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qrCodeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do QR Code</FormLabel>
                  <FormControl>
                    <Input placeholder="URL da imagem do QR Code PIX" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL da imagem do QR Code para pagamento PIX.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pixKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input placeholder="Chave PIX para pagamento" {...field} />
                  </FormControl>
                  <FormDescription>
                    Chave PIX para pagamentos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showTestimonials"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Exibir Testemunhos</FormLabel>
                    <FormDescription>
                      Exibir depoimentos de clientes na página de checkout.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showVisitorCounter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Exibir Contador de Visitas</FormLabel>
                    <FormDescription>
                      Exibir contador de visitantes na página de checkout.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blockedCpfs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPFs Bloqueados</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lista de CPFs bloqueados, separados por vírgula"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Lista de CPFs que não podem realizar a compra.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
