
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export function ColorPicker({ value, onChange, label, id }: ColorPickerProps) {
  const [color, setColor] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input 
          id={id}
          type="text" 
          value={color} 
          onChange={(e) => handleChange(e)} 
          className="flex-1"
          placeholder="#000000"
        />
        <div className="relative">
          <Input
            type="color"
            value={color}
            onChange={handleChange}
            className="w-10 h-10 p-1 rounded-md border overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
