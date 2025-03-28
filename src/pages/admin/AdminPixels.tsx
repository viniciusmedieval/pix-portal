
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { listarProdutos } from "@/services/produtoService";
import { getPixel, criarOuAtualizarPixel } from "@/services/pixelService";

// Schema para validação do formulário
const formSchema = z.object({
  produto_id: z.string().min(1, { message: "Produto é obrigatório" }),
  facebook_pixel: z.string().optional(),
  google_tag: z.string().optional(),
  custom_script: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPixels() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const produtoId = watch("produto_id");

  // Carregar lista de produtos
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await listarProdutos();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de produtos.",
          variant: "destructive",
        });
      }
    }

    fetchProdutos();
  }, [toast]);

  // Carregar pixel quando o produto for selecionado
  useEffect(() => {
    if (!produtoId) return;

    async function fetchPixel() {
      setLoading(true);
      try {
        const pixelData = await getPixel(produtoId);
        
        if (pixelData) {
          // Preencher o formulário com os dados existentes
          setValue("facebook_pixel", pixelData.facebook_pixel || "");
          setValue("google_tag", pixelData.google_tag || "");
          setValue("custom_script", pixelData.custom_script || "");
        } else {
          // Resetar o formulário para os valores padrão
          reset({
            produto_id: produtoId,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar pixels:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os pixels do produto selecionado.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPixel();
  }, [produtoId, reset, setValue, toast]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      await criarOuAtualizarPixel({
        produto_id: data.produto_id,
        facebook_pixel: data.facebook_pixel,
        google_tag: data.google_tag,
        custom_script: data.custom_script,
      });
      
      toast({
        title: "Pixels salvos",
        description: "Os pixels de rastreamento foram salvos com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar pixels:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os pixels. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Configuração de Pixels</h2>
      
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pixels de Rastreamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto_id">Produto</Label>
                <select
                  id="produto_id"
                  {...register("produto_id")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
                {errors.produto_id && (
                  <p className="text-xs text-red-500">{errors.produto_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook_pixel">Facebook Pixel ID</Label>
                <Input 
                  id="facebook_pixel" 
                  {...register("facebook_pixel")} 
                  placeholder="Ex: 123456789012345" 
                />
                <p className="text-xs text-gray-500">
                  Insira apenas o ID do pixel, sem código adicional.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_tag">Google Tag/Analytics ID</Label>
                <Input 
                  id="google_tag" 
                  {...register("google_tag")} 
                  placeholder="Ex: G-XXXXXXXXXX ou UA-XXXXXXXX-X" 
                />
                <p className="text-xs text-gray-500">
                  Insira o ID do Google Analytics ou Tag Manager.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom_script">Script Personalizado</Label>
                <Textarea
                  id="custom_script"
                  {...register("custom_script")}
                  className="font-mono text-sm"
                  rows={6}
                  placeholder="<!-- Insira outros scripts de rastreamento aqui -->"
                />
                <p className="text-xs text-gray-500">
                  Insira qualquer script personalizado de rastreamento (meta, TikTok, etc).
                </p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Pixels"}
          </Button>
        </form>
      </div>
    </div>
  );
}
