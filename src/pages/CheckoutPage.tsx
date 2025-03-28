
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { ProdutoType } from '@/services/produtoService';
import { formatCurrency } from '@/lib/formatters';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { usePixel } from '@/hooks/usePixel';
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getCheckoutConfig } from '@/services/checkoutConfigService';
import { CheckoutConfigType } from '@/types/checkoutConfig';

const CheckoutPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [numParcelas, setNumParcelas] = React.useState<number>(1);

  // Modify the validation to be less aggressive - log the issue but don't redirect
  React.useEffect(() => {
    if (!slug) {
      console.warn("Missing slug parameter in URL. Expected format: /checkout/:slug");
      // We'll show an error message in the UI instead of redirecting
    }
  }, [slug]);

  const { data: produto, isLoading: isProdutoLoading, isError: isProdutoError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("No slug parameter provided");
      }
      return getProdutoBySlug(slug);
    },
    // Skip query if slug is undefined
    enabled: !!slug,
  });

  const { data: config, isLoading: isConfigLoading, isError: isConfigError } = useQuery({
    queryKey: ['checkoutConfig'],
    queryFn: () => getCheckoutConfig(),
  });

  // Only call usePixel if produto exists
  usePixel(produto?.id, 'InitiateCheckout');

  // Handle the case when there's no slug
  if (!slug) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Produto não encontrado</CardTitle>
            <CardDescription>O URL não contém um código de produto válido.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Por favor, verifique se o link está correto ou navegue para a lista de produtos disponíveis.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/" className="w-full">
              <Button className="w-full">Ir para Página Inicial</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isProdutoLoading || isConfigLoading) {
    return <div className="container py-8">Carregando...</div>;
  }

  if (isProdutoError || isConfigError) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Erro ao carregar produto</CardTitle>
            <CardDescription>Não foi possível carregar as informações do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Verifique se o produto existe ou tente novamente mais tarde.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/" className="w-full">
              <Button className="w-full">Ir para Página Inicial</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Produto não encontrado</CardTitle>
            <CardDescription>O produto solicitado não foi encontrado.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              O produto com o identificador "{slug}" não existe ou foi removido.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/" className="w-full">
              <Button className="w-full">Ir para Página Inicial</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleParcelaChange = (value: string) => {
    setNumParcelas(parseInt(value, 10));
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{produto.nome}</CardTitle>
              <CardDescription>Confira os detalhes do produto e finalize a compra.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img
                  src={produto.imagem_url || "/placeholder-image.png"}
                  alt={produto.nome}
                  className="w-full h-auto rounded-md"
                />
              </div>
              <p className="text-gray-600">{produto.descricao}</p>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Preço: {formatCurrency(produto.preco)}</h3>
                <p className="text-sm text-gray-500">
                  Em até:
                </p>
                <Select onValueChange={handleParcelaChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: config?.max_parcelas || 12 }, (_, i) => i + 1).map((parcela) => (
                      <SelectItem key={parcela} value={parcela.toString()}>
                        {parcela}x de {formatCurrency(produto.preco / parcela)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/checkout/${produto.slug}/pix`}>
                <Button className="w-full">
                  Continuar para Pagamento
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Checkout Configuration Details */}
        <div>
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
        </div>
      </div>
    </div>
  );
};

// Add this export as default to fix the lazy loading issue
export default CheckoutPage;
