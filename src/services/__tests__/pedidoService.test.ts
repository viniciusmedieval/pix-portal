
import { excluirPedido, listarPedidos } from '../pedidoService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }
}));

describe('pedidoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('excluirPedido', () => {
    it('should successfully delete a pedido', async () => {
      // Setup the mock to return success
      const mockDelete = jest.fn().mockReturnValue({
        error: null
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: jest.fn().mockReturnThis(),
      });

      const result = await excluirPedido('test-id');
      
      expect(supabase.from).toHaveBeenCalledWith('pedidos');
      expect(result).toBe(true);
    });

    it('should return false when there is an error', async () => {
      // Setup the mock to return an error
      const mockDelete = jest.fn().mockReturnValue({
        error: { message: 'Error deleting pedido' }
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: jest.fn().mockReturnThis(),
      });

      const result = await excluirPedido('test-id');
      
      expect(supabase.from).toHaveBeenCalledWith('pedidos');
      expect(result).toBe(false);
    });
  });

  describe('listarPedidos', () => {
    it('should return a list of pedidos', async () => {
      const mockPedidos = [
        { id: '1', nome: 'Test Pedido 1' },
        { id: '2', nome: 'Test Pedido 2' }
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        data: mockPedidos,
        error: null
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        order: jest.fn().mockReturnThis(),
      });

      const result = await listarPedidos();
      
      expect(supabase.from).toHaveBeenCalledWith('pedidos');
      expect(result).toEqual(mockPedidos);
    });

    it('should throw an error when there is a problem', async () => {
      const mockError = new Error('Failed to fetch pedidos');
      
      const mockSelect = jest.fn().mockReturnValue({
        data: null,
        error: mockError
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        order: jest.fn().mockReturnThis(),
      });

      await expect(listarPedidos()).rejects.toThrow();
    });
  });
});
