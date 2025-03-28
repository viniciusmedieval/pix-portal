
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const faqs = [
  {
    question: "Quando receberei meu produto após o pagamento?",
    answer: "Você receberá os dados de acesso por e-mail em até 15 minutos após a confirmação do PIX. Caso não encontre, verifique sua caixa de spam ou entre em contato conosco via WhatsApp: [número]."
  },
  {
    question: "E se o pagamento demorar para ser confirmado?",
    answer: "Alguns bancos podem levar até 30 minutos para processar. Se o status não atualizar, envie o comprovante para [e-mail] ou WhatsApp."
  },
  {
    question: "Como saberei se o PIX foi aprovado?",
    answer: "Você receberá um e-mail de confirmação, e nossa equipe entrará em contato para auxiliar na instalação do sistema."
  },
  {
    question: "O que fazer se o QR Code não funcionar?",
    answer: "Copie o código PIX manualmente (Vinicius@mail.com) ou tente novamente com a câmera em outro ambiente bem iluminado."
  },
  {
    question: "É seguro pagar com PIX?",
    answer: "Sim! O PIX é um método 100% seguro e aprovado pelo Banco Central. Não compartilhe seu comprovante com terceiros."
  },
  {
    question: "Posso cancelar após o pagamento?",
    answer: "Em caso de arrependimento, entre em contato em até 7 dias para reembolso, conforme nosso Termos de Compra."
  }
];

const PixFaqSection = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b pb-3 pt-3">
        <CardTitle className="text-lg flex items-center">
          <HelpCircle className="mr-2 h-5 w-5 text-purple-500" />
          Perguntas Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm text-gray-600">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PixFaqSection;
