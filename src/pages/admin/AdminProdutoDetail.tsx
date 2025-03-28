
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProdutoById } from '@/services/produtoService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  BarChart3, 
  CreditCard, 
  Settings,
  Trash2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";
import { formatCurrency } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useFormSubmit } from '@/hooks/produto/useFormSubmit';

export default function AdminProdutoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { loading: actionLoading, handleDelete } = useFormSubmit();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduto = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const produtoData = await getProdutoById(id);
        
        if (!produtoData) {
          toast({
            title: "Erro",
            description: "Produto não encontrado",
            variant: "destructive"
          });
          navigate('/admin/produtos');
          return;
        }
        
        setProduto(produtoData);
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao carregar o produto",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProduto();
  }, [id, navigate, toast]);

  const onDeleteConfirm = async () => {
    if (!produto?.id) return;
    
    await handleDelete(produto.id, produto.nome);
    setShowDeleteDialog(false);
  };
  
  const copyCheckoutLink = () => {
    if (!produto) return;
    
    const checkoutSlug = produto.slug && produto.slug.trim() !== '' ? produto.slug : produto.id;
    const checkoutUrl = `${window.location.origin}/checkout/${checkoutSlug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        setLinkCopied(true);
        toast({
          title: "Link copiado!",
          description: "Link do checkout copiado para a área de transferência.",
        });
        
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
  };

  if (loading) {
    return <div className="container p-6">Carregando...</div>;
  }

  if (!produto) {
    return <div className="container p-6">Produto não encontrado</div>;
  }
  
  // Use slug for the checkout path if available and non-empty, otherwise fall back to ID
  const checkoutSlug = produto.slug && produto.slug.trim() !== '' ? produto.slug : produto.id;
  const checkoutUrl = `${window.location.origin}/checkout/${checkoutSlug}`;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{produto.nome}</h1>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/produtos/editar/${produto.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dados do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm">{produto.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm">{produto.nome}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Preço</dt>
                <dd className="mt-1 text-sm font-medium">{formatCurrency(produto.preco)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm">{produto.slug || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Badge variant={produto.ativo ? "default" : "secondary"}>
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <Link to={`/admin/config/${produto.id}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações Gerais
                </Link>
              </Button>
            </div>
            <div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <Link to={`/admin/pix-config/${produto.id}`}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Configurações do PIX
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Página de Checkout</h3>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-600 truncate flex-1 border p-2 rounded-md">
                  {checkoutUrl}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0"
                  onClick={copyCheckoutLink}
                >
                  {linkCopied ? 
                    <Check className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4" />
                  }
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0"
                  asChild
                >
                  <Link to={`/checkout/${checkoutSlug}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Página PIX</h3>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-600 truncate flex-1 border p-2 rounded-md">
                  {`${window.location.origin}/checkout/${checkoutSlug}/pix`}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/checkout/${checkoutSlug}/pix`);
                    toast({
                      title: "Link copiado!",
                      description: "Link da página PIX copiado para a área de transferência.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0"
                  asChild
                >
                  <Link to={`/checkout/${checkoutSlug}/pix`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="analytics">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {produto.descricao ? (
                  <p>{produto.descricao}</p>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma descrição disponível</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {produto.imagem_url && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Imagem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md overflow-hidden border w-full max-w-md">
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Vendas</CardTitle>
              <CardDescription>Acompanhe o desempenho deste produto</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">Estatísticas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Excluir Produto
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o produto <strong>"{produto.nome}"</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteConfirm}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Excluindo..." : "Sim, excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
