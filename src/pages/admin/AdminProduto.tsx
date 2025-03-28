
import { useProdutoForm } from '@/hooks/useProdutoForm';
import ProdutoForm from '@/components/admin/produto/ProdutoForm';
import ProdutoHeader from '@/components/admin/produto/ProdutoHeader';

export default function AdminProduto() {
  const { 
    form, 
    isLoading, 
    isEditing, 
    handleSubmit, 
    cancelForm, 
    generateSlug 
  } = useProdutoForm();

  return (
    <div className="container max-w-3xl py-6">
      <ProdutoHeader isEditing={isEditing} />
      <ProdutoForm 
        initialData={form}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={cancelForm}
        generateSlug={generateSlug}
      />
    </div>
  );
}
