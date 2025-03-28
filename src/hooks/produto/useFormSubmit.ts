
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { criarProduto, atualizarProduto } from '@/services/produtoService';
import { ProdutoFormData } from './useFormState';
import { generateSlug } from './useSlugGenerator';

export function useFormSubmit(form: ProdutoFormData, setIsLoading: (loading: boolean) => void) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (formData: ProdutoFormData) => {
    setIsLoading(true);
    console.log('Submitting form with data:', formData);

    try {
      // If slug is empty, generate one before saving
      let finalSlug = formData.slug?.trim();
      
      if (!finalSlug && formData.nome) {
        finalSlug = generateSlug(formData.nome);
        console.log(`Generated slug for product "${formData.nome}": ${finalSlug}`);
      }
      
      if (!finalSlug) {
        console.error('Cannot save product without a slug or product name');
        toast({
          title: "Erro",
          description: "O produto precisa ter um nome para gerar o slug automaticamente",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
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

      console.log('Saving product with data:', produtoData);

      if (id) {
        await atualizarProduto(id, produtoData);
        console.log('Product updated successfully');
      } else {
        await criarProduto(produtoData);
        console.log('Product created successfully');
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
