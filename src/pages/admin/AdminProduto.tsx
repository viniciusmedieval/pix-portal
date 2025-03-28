
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdminProduto() {
  const { register, handleSubmit, reset } = useForm();
  const [produtos, setProdutos] = useState<any[]>([]);
  const { toast } = useToast();

  async function carregarProdutos() {
    const { data } = await supabase.from('produtos').select('*').order('criado_em', { ascending: false });
    setProdutos(data || []);
  }

  useEffect(() => { carregarProdutos(); }, []);

  const onSubmit = async (form: any) => {
    try {
      await supabase.from('produtos').insert({
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        parcelas: parseInt(form.parcelas),
      });
      
      reset();
      carregarProdutos();
      
      toast({
        title: "Produto salvo",
        description: "O produto foi salvo com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Produtos</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Novo Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input {...register("nome", { required: true })} placeholder="Nome do produto" />
              </div>
              <div>
                <Textarea {...register("descricao")} placeholder="Descrição" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...register("preco", { required: true })} placeholder="Preço" type="number" step="0.01" />
                <Input {...register("parcelas", { required: true })} placeholder="Parcelas" type="number" defaultValue={1} />
              </div>
              <Button type="submit" className="w-full">Salvar Produto</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Parcelas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                    <TableCell>{p.parcelas}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
