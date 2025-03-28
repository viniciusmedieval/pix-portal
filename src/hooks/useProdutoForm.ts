
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getProdutoById, criarProduto, atualizarProduto } from '@/services/produtoService';

export interface ProdutoFormData {
  nome: string;
  descricao: string;
  preco: string;
  parcelas: string;
  imagem_url: string;
  estoque: string;
  slug: string;
  ativo: boolean;
}

const defaultFormData: ProdutoFormData = {
  nome: '',
  descricao: '',
  preco: '',
  parcelas: '1',
  imagem_url: '',
  estoque: '0',
  slug: '',
  ativo: true
};

export function useProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProdutoFormData>(defaultFormData);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const produto = await getProdutoById(id);
        
        if (produto) {
          setForm({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: produto.preco.toString(),
            parcelas: produto.parcelas?.toString() || '1',
            imagem_url: produto.imagem_url || '',
            estoque: produto.estoque?.toString() || '0',
            slug: produto.slug || '',
            ativo: produto.ativo !== false
          });
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduto();
  }, [id, toast]);

  const generateSlug = () => {
    const slug = form.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (formData: ProdutoFormData) => {
    setIsLoading(true);

    try {
      // If slug is empty, generate one before saving
      const finalSlug = formData.slug || formData.nome.toLowerCase().replace(/\s+/g, '-');
      
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        parcelas: parseInt(formData.parcelas),
        imagem_url: formData.imagem_url || null,
        estoque: parseInt(formData.estoque || '0'),
        slug: finalSlug,
        ativo: formData.ativo
      };

      if (id) {
        await atualizarProduto(id, produtoData);
      } else {
        await criarProduto(produtoData);
      }

      toast({
        title: "Sucesso",
        description: `Produto ${id ? 'atualizado' : 'criado'} com sucesso!`,
      });
      
      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${id ? 'atualizar' : 'criar'} o produto`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelForm = () => {
    navigate('/admin/produtos');
  };

  return {
    form,
    isLoading,
    isEditing: !!id,
    handleSubmit,
    cancelForm,
    generateSlug
  };
}
