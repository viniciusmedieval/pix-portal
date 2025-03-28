
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { criarProduto, atualizarProduto } from '@/services/produtoService';
import { ProdutoFormData } from './useFormState';

export function useFormSubmit(form: ProdutoFormData, setIsLoading: (loading: boolean) => void) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    handleSubmit,
    cancelForm
  };
}
