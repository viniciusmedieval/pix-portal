
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar } from "lucide-react";

interface FiltrosPedidosProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  produtoFilter: string;
  setProdutoFilter: (value: string) => void;
  clienteFilter: string;
  setClienteFilter: (value: string) => void;
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

const FiltrosPedidos: React.FC<FiltrosPedidosProps> = ({
  statusFilter,
  setStatusFilter,
  produtoFilter,
  setProdutoFilter,
  clienteFilter,
  setClienteFilter,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onSearch,
  onClearFilters,
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
                onChange={(e) => setProdutoFilter(e.target.value)}
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
                onChange={(e) => setClienteFilter(e.target.value)}
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
                onChange={(e) => setDataInicio(e.target.value)}
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
                onChange={(e) => setDataFim(e.target.value)}
                className="border-0"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={onClearFilters}
          >
            Limpar Filtros
          </Button>
          <Button 
            onClick={onSearch}
          >
            Buscar Pedidos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(FiltrosPedidos);
