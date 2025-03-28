
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const initialState: ProdutoFormData = {
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
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProdutoFormData>(initialState);

  useEffect(() => {
    const loadProduto = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const produto = await getProdutoById(id);
        if (produto) {
          setForm({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: produto.preco.toString(),
            parcelas: produto.parcelas.toString(),
            imagem_url: produto.imagem_url || '',
            estoque: produto.estoque?.toString() || '0',
            slug: produto.slug || '',
            ativo: produto.ativo
          });
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduto();
  }, [id]);

  return {
    form,
    setForm,
    isLoading,
    setIsLoading,
    isEditing: !!id
  };
}
