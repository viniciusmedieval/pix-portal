
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listarProdutos } from "@/services/produtoService";
import { getConfig, criarOuAtualizarConfig } from "@/services/configService";

// Schema para validação do formulário
const formSchema = z.object({
  produto_id: z.string().min(1, { message: "Produto é obrigatório" }),
  cor_fundo: z.string().optional(),
  cor_botao: z.string().optional(),
  texto_botao: z.string().optional(),
  texto_topo: z.string().optional(),
  mensagem_pix: z.string().optional(),
  chave_pix: z.string().optional(),
  qr_code: z.string().optional(),
  exibir_testemunhos: z.boolean().default(true),
  numero_aleatorio_visitas: z.boolean().default(true),
  visitantes_min: z.coerce.number().min(1).default(10),
  visitantes_max: z.coerce.number().min(10).default(100),
  bloquear_cpfs: z.string().optional().transform(val => 
    val ? val.split(",").map(cpf => cpf.trim()) : []
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminConfig() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exibir_testemunhos: true,
      numero_aleatorio_visitas: true,
      visitantes_min: 10,
      visitantes_max: 100,
    }
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

  // Carregar configuração quando o produto for selecionado
  useEffect(() => {
    if (!produtoId) return;

    async function fetchConfig() {
      setLoading(true);
      try {
        const configData = await getConfig(produtoId);
        
        if (configData) {
          // Preencher o formulário com os dados existentes
          Object.entries(configData).forEach(([key, value]) => {
            // @ts-ignore
            if (key !== "id" && key !== "created_at" && value !== null) {
              if (key === "bloquear_cpfs" && Array.isArray(value)) {
                setValue(key as any, (value as string[]).join(", "));
              } else {
                setValue(key as any, value as any);
              }
            }
          });
          
          setSelectedProduto(produtoId);
          setPreviewUrl(`/checkout/${produtoId}`);
        } else {
          // Resetar o formulário para os valores padrão
          reset({
            produto_id: produtoId,
            exibir_testemunhos: true,
            numero_aleatorio_visitas: true,
            visitantes_min: 10,
            visitantes_max: 100,
          });
          
          setSelectedProduto(produtoId);
          setPreviewUrl(`/checkout/${produtoId}`);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a configuração do produto selecionado.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [produtoId, reset, setValue, toast]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      // Enviar arquivos para armazenamento, se fornecidos
      let qrCodeUrl = data.qr_code;
      
      const fileInput = document.getElementById('qrCodeFile') as HTMLInputElement;
      if (fileInput?.files?.length) {
        const file = fileInput.files[0];
        const fileName = `qrcode-${Date.now()}`;
        
        const { data: uploadResult, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrl } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        qrCodeUrl = publicUrl.publicUrl;
      }

      // Preparar dados para salvar
      const configData = {
        ...data,
        qr_code: qrCodeUrl,
      };
      
      await criarOuAtualizarConfig(configData);
      
      toast({
        title: "Configuração salva",
        description: "As configurações do checkout foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Configuração do Checkout</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
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
                  <Label htmlFor="cor_fundo">Cor de Fundo (#hex)</Label>
                  <Input id="cor_fundo" {...register("cor_fundo")} placeholder="#123456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor_botao">Cor do Botão (#hex)</Label>
                  <Input id="cor_botao" {...register("cor_botao")} placeholder="#123456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="texto_botao">Texto do Botão</Label>
                  <Input id="texto_botao" {...register("texto_botao")} placeholder="Finalizar Compra" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="texto_topo">Texto do Topo</Label>
                  <Input id="texto_topo" {...register("texto_topo")} placeholder="Pague até oferta terminar:" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuração do PIX</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chave_pix">Chave PIX (copia e cola)</Label>
                  <textarea
                    id="chave_pix"
                    {...register("chave_pix")}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="Cole aqui o código copia e cola do PIX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr_code">URL do QR Code (ou faça upload)</Label>
                  <Input id="qr_code" {...register("qr_code")} placeholder="https://example.com/qrcode.png" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qrCodeFile">Upload do QR Code</Label>
                  <Input id="qrCodeFile" type="file" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem_pix">Mensagem Pós-PIX</Label>
                  <textarea
                    id="mensagem_pix"
                    {...register("mensagem_pix")}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Mensagem a ser exibida após o pagamento PIX"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="exibir_testemunhos">Exibir Testemunhos</Label>
                  <Switch
                    id="exibir_testemunhos"
                    {...register("exibir_testemunhos")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="numero_aleatorio_visitas">Exibir Contador de Visitas</Label>
                  <Switch
                    id="numero_aleatorio_visitas"
                    {...register("numero_aleatorio_visitas")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitantes_min">Mínimo de Visitantes</Label>
                  <Input
                    id="visitantes_min"
                    type="number"
                    {...register("visitantes_min")}
                    min={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitantes_max">Máximo de Visitantes</Label>
                  <Input
                    id="visitantes_max"
                    type="number"
                    {...register("visitantes_max")}
                    min={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloquear_cpfs">CPFs Bloqueados (separados por vírgula)</Label>
                  <textarea
                    id="bloquear_cpfs"
                    {...register("bloquear_cpfs")}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="123.456.789-10, 987.654.321-00"
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </div>
        
        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview do Checkout</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] border rounded-md"
                />
              ) : (
                <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Selecione um produto para visualizar o preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
