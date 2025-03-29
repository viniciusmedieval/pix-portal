
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormSubmit } from './produto/useFormSubmit';

export function useProdutoForm(productId?: string, initialData?: any) {
  const navigate = useNavigate();
  const { loading, handleCreate, handleUpdate, handleDelete } = useFormSubmit();
  const [isEditing, setIsEditing] = useState(!!productId);

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
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSubmit,
    cancelForm,
    isEditing
  };
}
