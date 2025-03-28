
import { ProdutoFormData } from './useFormState';

export function useSlugGenerator(form: ProdutoFormData, setForm: (form: ProdutoFormData) => void) {
  const generateSlug = () => {
    if (!form.nome) {
      console.warn('Cannot generate slug: product name is empty');
      return;
    }
    
    const slug = form.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single one
      .trim();
    
    console.log(`Generated slug: ${slug} from name: ${form.nome}`);
    setForm({ ...form, slug });
  };

  return { generateSlug };
}
