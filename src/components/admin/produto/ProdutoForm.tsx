
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface ProdutoFormData {
  nome: string;
  descricao: string;
  preco: string;
  parcelas: string;
  imagem_url: string;
  estoque: string;
  slug: string;
  ativo: boolean;
}

interface ProdutoFormProps {
  initialData: ProdutoFormData;
  isLoading: boolean;
  onSubmit: (formData: ProdutoFormData) => void;
  onCancel: () => void;
  generateSlug: () => void;
}

export default function ProdutoForm({ 
  initialData, 
  isLoading, 
  onSubmit, 
  onCancel,
  generateSlug
}: ProdutoFormProps) {
  const [form, setForm] = useState<ProdutoFormData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, ativo: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="produto-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do produto *</Label>
            <Input
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Curso de Marketing Digital"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva seu produto em detalhes"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                value={form.preco}
                onChange={handleChange}
                placeholder="Ex: 97.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parcelas">Parcelas</Label>
              <Input
                id="parcelas"
                name="parcelas"
                type="number"
                min="1"
                value={form.parcelas}
                onChange={handleChange}
                placeholder="Ex: 12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                name="estoque"
                type="number"
                min="0"
                value={form.estoque}
                onChange={handleChange}
                placeholder="Ex: 100"
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex-1">
                <Label htmlFor="ativo" className="mb-2 block">Produto ativo</Label>
                <div className="flex items-center">
                  <Switch
                    id="ativo"
                    checked={form.ativo}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="ativo" className="ml-2">
                    {form.ativo ? 'Sim' : 'Não'}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da imagem</Label>
            <Input
              id="imagem_url"
              name="imagem_url"
              value={form.imagem_url}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="slug">Slug (URL amigável)</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateSlug}
                className="text-xs"
              >
                Gerar automaticamente
              </Button>
            </div>
            <Input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="ex: curso-marketing-digital"
            />
            <p className="text-xs text-gray-500">
              Se não fornecido, será gerado automaticamente a partir do nome.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="produto-form"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </CardFooter>
    </Card>
  );
}
