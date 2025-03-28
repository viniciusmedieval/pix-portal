
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function AdminConfigList() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('nome');
          
        if (error) throw error;
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProdutos();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Configurações de Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-4">Nenhum produto cadastrado.</p>
            <Button asChild>
              <Link to="/admin/produtos">Cadastrar um produto</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-4">
              Selecione um produto para configurar seu checkout:
            </p>
            <div className="divide-y">
              {produtos.map((produto) => (
                <div key={produto.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{produto.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {produto.ativo ? 'Ativo' : 'Inativo'} • 
                      Preço: R$ {parseFloat(produto.preco).toFixed(2)}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/admin/config/${produto.id}`}>Configurar</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
