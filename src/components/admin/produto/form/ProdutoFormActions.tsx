
import { Button } from "@/components/ui/button";

interface ProdutoFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export default function ProdutoFormActions({ 
  isLoading, 
  onCancel 
}: ProdutoFormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={onCancel}
        type="button"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar Produto'}
      </Button>
    </div>
  );
}
