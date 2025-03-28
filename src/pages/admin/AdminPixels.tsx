import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getPixel, criarOuAtualizarPixel } from '@/services/pixelService';
import { getProdutoById } from '@/services/produtoService';

const formSchema = z.object({
  facebookPixel: z.string().optional(),
  googleTag: z.string().optional(),
  customScript: z.string().optional()
});

export default function AdminPixels() {
  const { id: productId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixelData, setPixelData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(productId);
  const [productName, setProductName] = useState<string | undefined>('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebookPixel: '',
      googleTag: '',
      customScript: ''
    }
  });

  useEffect(() => {
    if (selectedProduct) {
      getPixel(selectedProduct)
        .then(data => setPixelData(data))
        .catch(error => console.error("Erro ao buscar pixels:", error));

      getProdutoById(selectedProduct)
        .then(product => setProductName(product?.nome))
        .catch(error => console.error("Erro ao buscar produto:", error));
    }
  }, [selectedProduct]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const pixelData = {
        produto_id: selectedProduct,
        facebook_pixel_id: data.facebookPixel || undefined,
        gtm_id: data.googleTag || undefined,
        custom_script: data.customScript || undefined
      };

      await criarOuAtualizarPixel(pixelData);

      toast({
        title: "Sucesso",
        description: "Pixels atualizados com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar pixels:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar pixels. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update form values when pixel data changes
  useEffect(() => {
    if (pixelData) {
      form.reset({
        facebookPixel: pixelData.facebook_pixel_id || '',
        googleTag: pixelData.gtm_id || '',
        customScript: pixelData.custom_script || ''
      });
    } else {
      form.reset({
        facebookPixel: '',
        googleTag: '',
        customScript: ''
      });
    }
  }, [pixelData, form]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link to="/admin/pixels" className="text-blue-500 hover:underline flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold">Editar Pixels</h1>
          {productName && <p className="text-gray-500">Editando pixels do produto: {productName}</p>}
        </div>
      </div>
      <Separator className="mb-4" />

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Configuração de Pixels</h2>
          <p className="text-sm text-gray-500">Configure os pixels de rastreamento para este produto.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="facebookPixel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o ID do Facebook Pixel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="googleTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Tag Manager ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira o ID do Google Tag Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customScript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Script Personalizado</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Insira um script personalizado (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
