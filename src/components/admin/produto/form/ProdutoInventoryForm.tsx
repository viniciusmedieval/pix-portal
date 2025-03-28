
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProdutoInventoryFormProps {
  estoque: string;
  ativo: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (checked: boolean) => void;
}

export default function ProdutoInventoryForm({ 
  estoque, 
  ativo, 
  onInputChange, 
  onSwitchChange 
}: ProdutoInventoryFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="estoque">Estoque</Label>
        <Input
          id="estoque"
          name="estoque"
          type="number"
          min="0"
          value={estoque}
          onChange={onInputChange}
          placeholder="Ex: 100"
        />
      </div>
      
      <div className="space-y-2 flex items-center">
        <div className="flex-1">
          <Label htmlFor="ativo" className="mb-2 block">Produto ativo</Label>
          <div className="flex items-center">
            <Switch
              id="ativo"
              checked={ativo}
              onCheckedChange={onSwitchChange}
            />
            <Label htmlFor="ativo" className="ml-2">
              {ativo ? 'Sim' : 'Não'}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
