
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { HelpCircle } from 'lucide-react';
import { getFaqs } from '@/services/faqService';

interface FaqItem {
  question: string;
  answer: string;
}

export default function PixFaqSection({ productId }: { productId: string }) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setLoading(true);
        const faqData = await getFaqs(productId);
        // Se não tiver FAQs específicas, use as padrão
        if (!faqData || faqData.length === 0) {
          setFaqs(defaultFaqs);
        } else {
          setFaqs(faqData);
        }
      } catch (error) {
        console.error('Erro ao carregar FAQs:', error);
        setFaqs(defaultFaqs);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, [productId]);

  if (loading) {
    return null; // Não mostra nada enquanto carrega
  }

  if (faqs.length === 0) {
    return null; // Se não houver FAQs, não mostra a seção
  }

  return (
    <Card className="w-full max-w-4xl mt-8 shadow-md border-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
          Perguntas Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

// FAQs padrão caso não tenha no banco de dados
const defaultFaqs: FaqItem[] = [
  {
    question: 'Como funciona o pagamento via PIX?',
    answer: 'O PIX é um meio de pagamento instantâneo. Basta copiar o código ou escanear o QR Code com o app do seu banco, confirmar o valor e finalizar a transação. O pagamento é processado em segundos, 24 horas por dia, todos os dias da semana.'
  },
  {
    question: 'O pagamento é processado instantaneamente?',
    answer: 'Sim, o PIX é um meio de pagamento instantâneo. Após confirmar a transação, o pagamento é processado em segundos e você receberá a confirmação de compra.'
  },
  {
    question: 'É seguro pagar com PIX?',
    answer: 'Sim, o PIX é um meio de pagamento regulamentado pelo Banco Central do Brasil e segue rigorosos protocolos de segurança. Todas as transações são criptografadas e protegidas.'
  },
  {
    question: 'O que fazer se o pagamento não for confirmado?',
    answer: 'Se o pagamento não for confirmado automaticamente, clique no botão "Confirmar Pagamento". Se ainda assim não funcionar, verifique se a transação foi concluída no app do seu banco e entre em contato com nosso suporte.'
  }
];
