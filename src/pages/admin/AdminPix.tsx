
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminPix() {
  const { register, handleSubmit, setValue } = useForm();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('id, nome').order('nome');
      setProdutos(data || []);
    }
    carregarProdutos();
  }, []);

  const onSubmit = async (form: any) => {
    try {
      await supabase.from('pagina_pix').insert({
        produto_id: selectedProdutoId,
        codigo_copia_cola: form.codigo_copia_cola,
        qr_code_url: form.qr_code_url,
        mensagem_pos_pix: form.mensagem_pos_pix,
        tempo_expiracao: parseInt(form.tempo_expiracao || "15"),
      });

      toast({
        title: "Configuração PIX salva",
        description: "A configuração da página PIX foi salva com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar configuração PIX:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração PIX",
        variant: "destructive",
      });
    }
  };

  const handleProdutoChange = (value: string) => {
    setSelectedProdutoId(value);
    setValue("produto_id", value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuração da Página PIX</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do PIX</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Select onValueChange={handleProdutoChange} value={selectedProdutoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input {...register("produto_id")} type="hidden" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo_copia_cola">Código PIX Copia e Cola</Label>
              <Textarea 
                {...register("codigo_copia_cola")} 
                placeholder="Cole aqui o código PIX copia e cola" 
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr_code_url">URL da Imagem do QR Code</Label>
              <Input {...register("qr_code_url")} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem_pos_pix">Mensagem Após Pagamento</Label>
              <Textarea 
                {...register("mensagem_pos_pix")} 
                placeholder="Ex: Obrigado pelo seu pagamento! Você receberá um email com as instruções de acesso." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempo_expiracao">Tempo de Expiração (minutos)</Label>
              <Input 
                {...register("tempo_expiracao")} 
                type="number" 
                placeholder="15" 
                defaultValue={15}
              />
            </div>

            <Button type="submit" className="w-full">Salvar Configuração PIX</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
