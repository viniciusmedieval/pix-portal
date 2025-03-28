
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProdutoSlugFormProps {
  slug: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateSlug: () => void;
}

export default function ProdutoSlugForm({ 
  slug, 
  onInputChange, 
  onGenerateSlug 
}: ProdutoSlugFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="slug">Slug (URL amigável)</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onGenerateSlug}
          className="text-xs"
        >
          Gerar automaticamente
        </Button>
      </div>
      <Input
        id="slug"
        name="slug"
        value={slug}
        onChange={onInputChange}
        placeholder="ex: curso-marketing-digital"
      />
      <p className="text-xs text-gray-500">
        Se não fornecido, será gerado automaticamente a partir do nome.
      </p>
    </div>
  );
}
