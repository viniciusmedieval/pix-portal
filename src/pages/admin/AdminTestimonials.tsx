
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/testimonialService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TestimonialType } from '@/components/TestimonialCard';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TestimonialFormValues = Omit<TestimonialType, 'id' | 'date'>;

export default function AdminTestimonials() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialType | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials(100),
  });

  const createForm = useForm<TestimonialFormValues>({
    defaultValues: {
      userName: '',
      comment: '',
      rating: 5,
      avatar: ''
    }
  });

  const editForm = useForm<TestimonialFormValues>({
    defaultValues: {
      userName: '',
      comment: '',
      rating: 5,
      avatar: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Sucesso",
        description: "Depoimento adicionado com sucesso!",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: TestimonialFormValues) => {
      if (!selectedTestimonial?.id) throw new Error('No testimonial selected');
      return updateTestimonial(selectedTestimonial.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsEditDialogOpen(false);
      setSelectedTestimonial(null);
      toast({
        title: "Sucesso",
        description: "Depoimento atualizado com sucesso!",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!selectedTestimonial?.id) throw new Error('No testimonial selected');
      return deleteTestimonial(selectedTestimonial.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsDeleteDialogOpen(false);
      setSelectedTestimonial(null);
      toast({
        title: "Sucesso",
        description: "Depoimento excluído com sucesso!",
      });
    },
  });

  const onCreateSubmit = (values: TestimonialFormValues) => {
    createMutation.mutate(values);
  };

  const onEditSubmit = (values: TestimonialFormValues) => {
    updateMutation.mutate(values);
  };

  const handleEditClick = (testimonial: TestimonialType) => {
    setSelectedTestimonial(testimonial);
    editForm.reset({
      userName: testimonial.userName,
      comment: testimonial.comment,
      rating: testimonial.rating,
      avatar: testimonial.avatar || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (testimonial: TestimonialType) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={cn(
              i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300",
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Depoimentos</h1>
          <p className="text-gray-500">Adicione, edite e exclua depoimentos de clientes</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Depoimento</DialogTitle>
              <DialogDescription>
                Preencha o formulário para adicionar um novo depoimento.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentário</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Digite o comentário do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação (1-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={5} 
                          placeholder="Avaliação de 1 a 5" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value || '5', 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem de Perfil (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Depoimentos</CardTitle>
          <CardDescription>
            Lista de todos os depoimentos de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum depoimento encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Adicionar Primeiro Depoimento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead className="w-[350px]">Comentário</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {testimonial.avatar && (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.userName} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          {testimonial.userName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RatingStars rating={testimonial.rating} />
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {testimonial.comment}
                      </TableCell>
                      <TableCell>{testimonial.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(testimonial)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(testimonial)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Depoimento</DialogTitle>
            <DialogDescription>
              Modifique as informações do depoimento.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentário</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Digite o comentário do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avaliação (1-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={5} 
                        placeholder="Avaliação de 1 a 5" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value || '5', 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem de Perfil (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este depoimento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTestimonial && (
            <div className="border rounded-md p-4 mb-4">
              <div className="flex items-start gap-3">
                {selectedTestimonial.avatar && (
                  <img 
                    src={selectedTestimonial.avatar} 
                    alt={selectedTestimonial.userName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{selectedTestimonial.userName}</h4>
                  <RatingStars rating={selectedTestimonial.rating} />
                  <p className="text-sm text-gray-700 mt-1">{selectedTestimonial.comment}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
