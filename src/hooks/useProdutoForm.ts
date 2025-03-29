
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormSubmit } from './produto/useFormSubmit';
import { useFormState } from './produto/useFormState';
import { useSlugGenerator } from './produto/useSlugGenerator';

export function useProdutoForm(productId?: string, initialData?: any) {
  const navigate = useNavigate();
  const { loading, handleCreate, handleUpdate, handleDelete } = useFormSubmit();
  const { form, setForm, isLoading, isEditing } = useFormState(initialData);
  const { generateSlug } = useSlugGenerator(form, setForm);

  // Add missing methods
  const handleSubmit = async (formData: any) => {
    if (isEditing && productId) {
      await handleUpdate(productId, formData);
    } else {
      await handleCreate(formData);
    }
  };

  const cancelForm = () => {
    navigate('/admin/produtos');
  };

  return {
    form,
    setForm,
    loading,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSubmit,
    cancelForm,
    isEditing,
    generateSlug
  };
}
