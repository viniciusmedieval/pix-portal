
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProdutoPricingFormProps {
  preco: string;
  parcelas: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProdutoPricingForm({ 
  preco, 
  parcelas, 
  onInputChange 
}: ProdutoPricingFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="preco">Preço (R$) *</Label>
        <Input
          id="preco"
          name="preco"
          type="number"
          step="0.01"
          value={preco}
          onChange={onInputChange}
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
          value={parcelas}
          onChange={onInputChange}
          placeholder="Ex: 12"
        />
      </div>
    </div>
  );
}
