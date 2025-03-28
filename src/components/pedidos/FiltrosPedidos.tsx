
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar } from "lucide-react";

interface FiltrosPedidosProps {
  statusFilter: string;
  produtoFilter: string;
  clienteFilter: string;
  dataInicio: string;
  dataFim: string;
  onChangeStatusFilter: (value: string) => void;
  onChangeProdutoFilter: (value: string) => void;
  onChangeClienteFilter: (value: string) => void;
  onChangeDataInicio: (value: string) => void;
  onChangeDataFim: (value: string) => void;
  onLimparFiltros: () => void;
  onBuscar: () => void;
}

const FiltrosPedidos: React.FC<FiltrosPedidosProps> = ({
  statusFilter,
  produtoFilter,
  clienteFilter,
  dataInicio,
  dataFim,
  onChangeStatusFilter,
  onChangeProdutoFilter,
  onChangeClienteFilter,
  onChangeDataInicio,
  onChangeDataFim,
  onLimparFiltros,
  onBuscar
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filtros de Busca</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => onChangeStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Produto</label>
            <div className="flex items-center border rounded-md">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <Input
                placeholder="Buscar por produto"
                value={produtoFilter}
                onChange={(e) => onChangeProdutoFilter(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <div className="flex items-center border rounded-md">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <Input
                placeholder="Buscar por cliente"
                value={clienteFilter}
                onChange={(e) => onChangeClienteFilter(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Data Início</label>
            <div className="flex items-center border rounded-md">
              <Calendar className="w-4 h-4 text-gray-400 ml-2" />
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => onChangeDataInicio(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Data Fim</label>
            <div className="flex items-center border rounded-md">
              <Calendar className="w-4 h-4 text-gray-400 ml-2" />
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => onChangeDataFim(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={onLimparFiltros}
          >
            Limpar Filtros
          </Button>
          <Button 
            onClick={onBuscar}
          >
            Buscar Pedidos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(FiltrosPedidos);
