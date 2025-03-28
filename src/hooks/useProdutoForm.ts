
import { useFormState } from './produto/useFormState';
import { useFormSubmit } from './produto/useFormSubmit';
import { useSlugGenerator } from './produto/useSlugGenerator';

export function useProdutoForm() {
  const { form, setForm, isLoading, setIsLoading, isEditing } = useFormState();
  const { handleSubmit, cancelForm } = useFormSubmit(form, setIsLoading);
  const { generateSlug } = useSlugGenerator(form, setForm);

  return {
    form,
    setForm,
    isLoading,
    isEditing,
    handleSubmit,
    cancelForm,
    generateSlug
  };
}
