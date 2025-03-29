
import { useParams } from 'react-router-dom';
import { useProdutoForm } from '@/hooks/useProdutoForm';
import ProdutoForm from '@/components/admin/produto/ProdutoForm';
import ProdutoHeader from '@/components/admin/produto/ProdutoHeader';

export default function AdminProduto() {
  const { id } = useParams();
  const { 
    form, 
    setForm,
    isLoading, 
    isEditing, 
    handleSubmit, 
    cancelForm, 
    generateSlug 
  } = useProdutoForm(id);

  console.log('AdminProduto rendering with form:', form);

  return (
    <div className="container max-w-3xl py-6">
      <ProdutoHeader isEditing={isEditing} />
      <ProdutoForm 
        initialData={form}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={cancelForm}
        generateSlug={generateSlug}
        onChange={setForm}
      />
    </div>
  );
}
