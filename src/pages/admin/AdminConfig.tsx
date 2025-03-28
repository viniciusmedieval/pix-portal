
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminConfig() {
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
      let logoUrl = null;
      let bannerUrl = null;

      if (form.logo && form.logo[0]) {
        const fileName = `logo-${Date.now()}`;
        const { data: logoUpload, error: logoError } = await supabase.storage
          .from('public')
          .upload(fileName, form.logo[0]);

        if (logoError) throw logoError;
        logoUrl = supabase.storage.from('public').getPublicUrl(logoUpload?.path!).data.publicUrl;
      }

      if (form.banner && form.banner[0]) {
        const fileName = `banner-${Date.now()}`;
        const { data: bannerUpload, error: bannerError } = await supabase.storage
          .from('public')
          .upload(fileName, form.banner[0]);

        if (bannerError) throw bannerError;
        bannerUrl = supabase.storage.from('public').getPublicUrl(bannerUpload?.path!).data.publicUrl;
      }

      await supabase.from('checkout_config').insert({
        produto_id: selectedProdutoId,
        cor_primaria: form.cor_primaria,
        cor_secundaria: form.cor_secundaria,
        texto_topo: form.texto_topo,
        texto_botao: form.texto_botao,
        visitantes_min: parseInt(form.visitantes_min || "1"),
        visitantes_max: parseInt(form.visitantes_max || "100"),
        logo_url: logoUrl,
        banner_url: bannerUrl,
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações do checkout foram salvas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
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
      <h1 className="text-2xl font-bold mb-6">Configuração do Checkout</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personalização Visual</CardTitle>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cor_primaria">Cor Primária</Label>
                <Input {...register("cor_primaria")} type="color" placeholder="Cor Primária" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                <Input {...register("cor_secundaria")} type="color" placeholder="Cor Secundária" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="texto_topo">Texto do Topo</Label>
              <Input {...register("texto_topo")} placeholder="Ex: Oferta exclusiva por tempo limitado!" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="texto_botao">Texto do Botão</Label>
              <Input {...register("texto_botao")} placeholder="Ex: Garantir minha vaga" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input {...register("logo")} type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner">Banner</Label>
                <Input {...register("banner")} type="file" accept="image/*" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contador de Visitantes</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("visitantes_min")} placeholder="Mínimo" type="number" defaultValue={1} />
                <Input {...register("visitantes_max")} placeholder="Máximo" type="number" defaultValue={100} />
              </div>
            </div>

            <Button type="submit" className="w-full">Salvar Configurações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
