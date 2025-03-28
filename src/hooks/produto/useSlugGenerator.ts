
import { ProdutoFormData } from './useFormState';

export function useSlugGenerator(form: ProdutoFormData, setForm: (form: ProdutoFormData) => void) {
  const generateSlug = () => {
    const slug = form.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    setForm({ ...form, slug });
  };

  return { generateSlug };
}
