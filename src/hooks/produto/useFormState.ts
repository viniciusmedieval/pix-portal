
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getProdutoById } from '@/services/produtoService';

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

export const defaultFormData: ProdutoFormData = {
  nome: '',
  descricao: '',
  preco: '',
  parcelas: '1',
  imagem_url: '',
  estoque: '0',
  slug: '',
  ativo: true
};

export function useFormState() {
  const { id } = useParams();
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

  return {
    form,
    setForm,
    isLoading,
    setIsLoading,
    isEditing: !!id
  };
}
