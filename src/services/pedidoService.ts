import { supabase } from '@/integrations/supabase/client';

export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos:produto_id(nome)')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPedidoById(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos:produto_id(nome)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function excluirPedido(id: string): Promise<boolean> {
  try {
    // First, delete any related payment records in pagamentos table
    const { error: paymentError } = await supabase
      .from('pagamentos')
      .delete()
      .eq('pedido_id', id);
    
    if (paymentError) {
      console.error('Erro ao excluir pagamentos relacionados:', paymentError);
      return false;
    }
    
    // Then delete the order
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir pedido:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    return false;
  }
}

export async function excluirTodosPedidos(): Promise<boolean> {
  try {
    // First, delete all related payment records
    const { error: paymentError } = await supabase
      .from('pagamentos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (paymentError) {
      console.error('Erro ao excluir pagamentos relacionados:', paymentError);
      return false;
    }
    
    // Then delete all orders
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (error) {
      console.error('Erro ao excluir todos os pedidos:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao excluir todos os pedidos:', error);
    return false;
  }
}

export async function salvarPedido(dadosPedido: {
  produto_id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  valor: number;
  forma_pagamento: string;
}) {
  console.log("Saving pedido with data:", dadosPedido);

  const pedido = {
    ...dadosPedido,
    status: 'pendente'
  };

  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single();

  if (error) {
    console.error("Error saving pedido:", error);
    throw error;
  }
  
  console.log("Pedido saved successfully:", data);
  return data;
}

export async function atualizarStatusPagamento(pedidoId: string, status: 'Pago' | 'Falhou'): Promise<boolean> {
  try {
    const novoStatus = status === 'Pago' ? 'pago' : 'cancelado';
    
    const { error } = await supabase
      .from('pedidos')
      .update({ status: novoStatus })
      .eq('id', pedidoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
}

export async function atualizarStatusPedido(pedidoId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pedidos')
      .update({ status })
      .eq('id', pedidoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return false;
  }
}

export async function verificarCpfDuplicado(cpf: string, produtoId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select('id')
      .eq('cpf', cpf)
      .eq('produto_id', produtoId)
      .eq('status', 'pago');

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Erro ao verificar CPF duplicado:', error);
    return false; // Em caso de erro, permitir a continuação
  }
}

export async function cancelarPedido(pedidoId: string): Promise<boolean> {
  return await atualizarStatusPedido(pedidoId, 'cancelado');
}

export async function criarPedido(dadosPedido: {
  produto_id: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente?: string;
  cpf_cliente?: string;
  valor: number;
  forma_pagamento: string;
  status: string;
}) {
  console.log("Creating pedido with data:", dadosPedido);
  
  // Map to expected column names
  const pedido = {
    produto_id: dadosPedido.produto_id,
    nome: dadosPedido.nome_cliente,
    email: dadosPedido.email_cliente,
    telefone: dadosPedido.telefone_cliente || null,
    cpf: dadosPedido.cpf_cliente || null,
    valor: dadosPedido.valor,
    forma_pagamento: dadosPedido.forma_pagamento,
    status: dadosPedido.status
  };

  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single();

  if (error) {
    console.error("Error creating pedido:", error);
    throw error;
  }

  console.log("Pedido created successfully:", data);
  return data;
}

export async function buscarPedidos(
  filtroStatus: string = 'Todos',
  filtroProduto: string = '',
  filtroCliente: string = '',
  dataInicio: string = '',
  dataFim: string = ''
) {
  console.log("Searching orders with filters:", {
    filtroStatus,
    filtroProduto,
    filtroCliente,
    dataInicio,
    dataFim
  });
  
  let query = supabase
    .from('pedidos')
    .select('*, produtos:produto_id(nome)');

  // Aplicar filtros
  if (filtroStatus !== 'Todos') {
    query = query.eq('status', filtroStatus.toLowerCase());
  }

  if (filtroProduto) {
    // Join with produtos table and filter by nome
    const { data: produtos } = await supabase
      .from('produtos')
      .select('id')
      .ilike('nome', `%${filtroProduto}%`);
      
    if (produtos && produtos.length > 0) {
      const produtoIds = produtos.map(p => p.id);
      query = query.in('produto_id', produtoIds);
    }
  }

  if (filtroCliente) {
    // Search in nome or email fields
    query = query.or(`nome.ilike.%${filtroCliente}%,email.ilike.%${filtroCliente}%`);
  }

  if (dataInicio) {
    query = query.gte('criado_em', dataInicio);
  }

  if (dataFim) {
    // Add one day to include the entire day
    const nextDay = new Date(dataFim);
    nextDay.setDate(nextDay.getDate() + 1);
    const dataFimAdjusted = nextDay.toISOString().split('T')[0];
    query = query.lt('criado_em', dataFimAdjusted);
  }

  query = query.order('criado_em', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }

  console.log("Orders found:", data?.length || 0);
  return data || [];
}

export async function gerarRelatorioVendas(
  statusPagamento: string = 'Todos', 
  dataInicio: string = '', 
  dataFim: string = ''
) {
  let query = supabase
    .from('pedidos')
    .select('*, produtos:produto_id(nome)');

  // Aplicar filtros de status de pagamento
  if (statusPagamento !== 'Todos') {
    query = query.eq('status', statusPagamento);
  }

  // Filtrar por data de início e fim
  if (dataInicio) {
    query = query.gte('criado_em', dataInicio);
  }

  if (dataFim) {
    // Add one day to include the entire day
    const nextDay = new Date(dataFim);
    nextDay.setDate(nextDay.getDate() + 1);
    const dataFimAdjusted = nextDay.toISOString().split('T')[0];
    query = query.lt('criado_em', dataFimAdjusted);
  }

  query = query.order('criado_em', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    return [];
  }

  return data || [];
}

export async function updateFormHeaderSettings(
  configId: string, 
  headerText: string,
  headerBgColor: string,
  headerTextColor: string
): Promise<boolean> {
  try {
    console.log('Updating form header settings:', {
      configId,
      headerText,
      headerBgColor,
      headerTextColor
    });
    
    const { error } = await supabase
      .from('config_checkout')
      .update({
        form_header_text: headerText,
        form_header_bg_color: headerBgColor,
        form_header_text_color: headerTextColor
      })
      .eq('id', configId);

    if (error) {
      console.error('Error updating form header settings:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateFormHeaderSettings:', error);
    return false;
  }
}
