
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listarProdutos } from "@/services/produtoService";
import { getConfig, criarOuAtualizarConfig } from "@/services/configService";

// Schema para validação do formulário
const formSchema = z.object({
  produto_id: z.string().min(1, { message: "Produto é obrigatório" }),
  chave_pix: z.string().optional(),
  mensagem_pix: z.string().optional(),
  tempo_expiracao: z.coerce.number().min(1).default(15),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPix() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tempo_expiracao: 15,
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
          setValue("chave_pix", configData.chave_pix || "");
          setValue("mensagem_pix", configData.mensagem_pix || "");
          setValue("tempo_expiracao", configData.tempo_expiracao || 15);
          
          // Configurar URL de preview
          setPreviewUrl(`/checkout/${produtoId}/pix`);
        } else {
          // Resetar o formulário para os valores padrão
          reset({
            produto_id: produtoId,
            tempo_expiracao: 15,
          });
          
          setPreviewUrl(`/checkout/${produtoId}/pix`);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração PIX:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a configuração PIX do produto selecionado.",
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
      // Enviar QR Code para armazenamento, se fornecido
      let qrCodeUrl = undefined;
      
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
        produto_id: data.produto_id,
        chave_pix: data.chave_pix,
        mensagem_pix: data.mensagem_pix,
        tempo_expiracao: data.tempo_expiracao,
      };
      
      if (qrCodeUrl) {
        configData.qr_code = qrCodeUrl;
      }
      
      await criarOuAtualizarConfig(configData);
      
      toast({
        title: "Configuração PIX salva",
        description: "As configurações do PIX foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configuração PIX:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração PIX. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Configuração do PIX</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do PIX</CardTitle>
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
                  <Label htmlFor="qrCodeFile">Upload do QR Code</Label>
                  <Input id="qrCodeFile" type="file" />
                  <p className="text-xs text-gray-500">Upload da imagem do QR Code (opcional)</p>
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

                <div className="space-y-2">
                  <Label htmlFor="tempo_expiracao">Tempo de Expiração (minutos)</Label>
                  <Input
                    id="tempo_expiracao"
                    type="number"
                    {...register("tempo_expiracao")}
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Salvar Configurações PIX"}
            </Button>
          </form>
        </div>
        
        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview da Página PIX</CardTitle>
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
