
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConfigDetailsProps {
  config: {
    titulo?: string;
    descricao?: string;
    cor_primaria?: string;
    cor_secundaria?: string;
    fonte?: string;
    max_parcelas?: number;
  } | null;
}

const ConfigDetails: React.FC<ConfigDetailsProps> = ({ config }) => {
  if (!config) return null;
  
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="checkout-config">
        <AccordionTrigger>Configurações do Checkout</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Configuração</CardTitle>
              <CardDescription>Informações sobre a configuração do checkout.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Título:</Label>
                  <Input type="text" value={config?.titulo || "N/A"} readOnly />
                </div>
                <div>
                  <Label>Descrição:</Label>
                  <Input type="text" value={config?.descricao || "N/A"} readOnly />
                </div>
                <div>
                  <Label>Cor Primária:</Label>
                  <Input type="color" value={config?.cor_primaria || "#FFFFFF"} readOnly />
                </div>
                <div>
                  <Label>Cor Secundária:</Label>
                  <Input type="color" value={config?.cor_secundaria || "#FFFFFF"} readOnly />
                </div>
                <div>
                  <Label>Fonte:</Label>
                  <Input type="text" value={config?.fonte || "N/A"} readOnly />
                </div>
                <div>
                  <Label>Máximo de Parcelas:</Label>
                  <Input type="number" value={config?.max_parcelas?.toString() || "N/A"} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ConfigDetails;
