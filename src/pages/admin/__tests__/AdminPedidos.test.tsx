
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPedidos from '../AdminPedidos';
import { buscarPedidos } from '@/services/pedidoService';

// Mock the pedidoService methods
jest.mock('@/services/pedidoService', () => ({
  buscarPedidos: jest.fn(),
  atualizarStatusPagamento: jest.fn(),
  excluirPedido: jest.fn(),
  cancelarPedido: jest.fn(),
}));

// Mock toast component
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AdminPedidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (buscarPedidos as jest.Mock).mockResolvedValue([
      {
        id: '1',
        produto_id: 'prod-1',
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '123.456.789-00',
        valor: 99.90,
        forma_pagamento: 'pix',
        status: 'pendente',
        criado_em: '2023-06-01T10:00:00Z',
        produtos: { nome: 'Curso de Marketing' }
      }
    ]);
  });

  it('renders the admin pedidos page with filters', async () => {
    render(<AdminPedidos />);
    
    // Wait for the initial data to load
    await waitFor(() => {
      expect(buscarPedidos).toHaveBeenCalled();
    });
    
    // Check if the title is rendered
    expect(screen.getByText('Gerenciar Pedidos')).toBeInTheDocument();
    
    // Check if filters are rendered
    expect(screen.getByText('Filtros de Busca')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Produto')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    
    // Check if the table is rendered with the mocked data
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Curso de Marketing')).toBeInTheDocument();
    });
  });

  it('updates filters and triggers search', async () => {
    render(<AdminPedidos />);
    
    // Wait for the initial data to load
    await waitFor(() => {
      expect(buscarPedidos).toHaveBeenCalled();
    });
    
    // Change status filter
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pago' } });
    
    // Change product filter
    const produtoInput = screen.getByPlaceholderText('Buscar por produto');
    fireEvent.change(produtoInput, { target: { value: 'marketing' } });
    
    // Click the search button
    const searchButton = screen.getByText('Buscar Pedidos');
    fireEvent.click(searchButton);
    
    // Verify the buscarPedidos function is called with updated filters
    await waitFor(() => {
      expect(buscarPedidos).toHaveBeenCalledWith(
        'pago',
        'marketing',
        '',
        '',
        ''
      );
    });
  });

  it('clears filters when reset button is clicked', async () => {
    render(<AdminPedidos />);
    
    // Wait for the initial data to load
    await waitFor(() => {
      expect(buscarPedidos).toHaveBeenCalled();
    });
    
    // Change filters
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'pago' } });
    
    const produtoInput = screen.getByPlaceholderText('Buscar por produto');
    fireEvent.change(produtoInput, { target: { value: 'marketing' } });
    
    // Click the reset button
    const resetButton = screen.getByText('Limpar Filtros');
    fireEvent.click(resetButton);
    
    // Check if filters are reset
    expect(statusSelect).toHaveValue('Todos');
    expect(produtoInput).toHaveValue('');
    
    // Verify buscarPedidos is called with reset values
    await waitFor(() => {
      expect(buscarPedidos).toHaveBeenCalledWith(
        'Todos',
        '',
        '',
        '',
        ''
      );
    });
  });
});
