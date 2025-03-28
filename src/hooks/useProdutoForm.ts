
import { useFormState, ProdutoFormData } from './produto/useFormState';
import { useSlugGenerator } from './produto/useSlugGenerator';
import { useFormSubmit } from './produto/useFormSubmit';

export type { ProdutoFormData } from './produto/useFormState';

export function useProdutoForm() {
  const { form, setForm, isLoading, setIsLoading, isEditing } = useFormState();
  const { generateSlug } = useSlugGenerator(form, setForm);
  const { handleSubmit, cancelForm } = useFormSubmit(form, setIsLoading);

  return {
    form,
    isLoading,
    isEditing,
    handleSubmit,
    cancelForm,
    generateSlug
  };
}
