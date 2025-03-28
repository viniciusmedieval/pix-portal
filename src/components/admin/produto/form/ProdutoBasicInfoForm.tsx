
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProdutoBasicInfoFormProps {
  nome: string;
  descricao: string;
  imagem_url: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ProdutoBasicInfoForm({ 
  nome, 
  descricao, 
  imagem_url,
  onInputChange 
}: ProdutoBasicInfoFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do produto *</Label>
        <Input
          id="nome"
          name="nome"
          value={nome}
          onChange={onInputChange}
          placeholder="Ex: Curso de Marketing Digital"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={onInputChange}
          placeholder="Descreva seu produto em detalhes"
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imagem_url">URL da imagem</Label>
        <Input
          id="imagem_url"
          name="imagem_url"
          value={imagem_url}
          onChange={onInputChange}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
    </>
  );
}
