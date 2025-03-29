
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { getProdutoBySlug, getProdutoById } from '@/services/produtoService';
import { updatePixConfig, getPixConfig } from '@/services/config/pixConfigService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Key, QrCode, Clock, Settings, LayoutTemplate, FileText, CreditCard } from 'lucide-react';

export default function AdminPixConfig() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>({
    produto_id: '',
    codigo_copia_cola: '',
    qr_code_url: '',
    mensagem_pos_pix: '',
    tempo_expiracao: 15,
    nome_beneficiario: 'Nome do Beneficiário',
    tipo_chave: 'email',
    mostrar_qrcode_mobile: true,
    titulo: 'Pagamento via PIX',
    instrucao: 'Copie o código ou use o QR Code para realizar o pagamento',
    botao_texto: 'Confirmar pagamento',
    seguranca_texto: 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.',
    compra_titulo: 'Sua Compra',
    mostrar_produto: true,
    mostrar_termos: true,
    saiba_mais_texto: 'Saiba mais sobre PIX',
    timer_texto: 'Faltam {minutos}:{segundos} para o pagamento expirar...',
    texto_copiado: 'Código copiado!',
    instrucoes_titulo: 'Para realizar o pagamento:',
    redirect_url: '',
    instrucoes: [
      'Abra o aplicativo do seu banco',
      'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
      'Confirme as informações e finalize o pagamento'
    ]
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        console.log("Fetching product with ID:", id);
        
        // First try by ID, then by slug if ID fails
        let produtoData = null;
        
        try {
          produtoData = await getProdutoById(id);
        } catch (error) {
          console.log("Error fetching by ID, trying as slug", error);
          produtoData = await getProdutoBySlug(id);
        }
        
        if (!produtoData) {
          console.error("Product not found with ID/slug:", id);
          toast({
            title: "Erro",
            description: "Produto não encontrado",
            variant: "destructive"
          });
          return;
        }
        
        console.log("Product data loaded:", produtoData);
        setProduto(produtoData);
        
        // Now fetch PIX config with the valid UUID
        console.log("Fetching PIX config for product ID:", produtoData.id);
        const pixConfig = await getPixConfig(produtoData.id);
        console.log("PIX config data:", pixConfig);
        
        // Update the form state with the fetched config
        if (pixConfig) {
          setConfig({
            ...config,
            produto_id: produtoData.id,
            codigo_copia_cola: pixConfig.codigo_copia_cola || '',
            qr_code_url: pixConfig.qr_code_url || '',
            mensagem_pos_pix: pixConfig.mensagem_pos_pix || '',
            tempo_expiracao: pixConfig.tempo_expiracao || 15,
            nome_beneficiario: pixConfig.nome_beneficiario || 'Nome do Beneficiário',
            tipo_chave: pixConfig.tipo_chave || 'email',
            mostrar_qrcode_mobile: pixConfig.mostrar_qrcode_mobile !== undefined ? pixConfig.mostrar_qrcode_mobile : true,
            titulo: pixConfig.titulo || config.titulo,
            instrucao: pixConfig.instrucao || config.instrucao,
            botao_texto: pixConfig.botao_texto || config.botao_texto,
            seguranca_texto: pixConfig.seguranca_texto || config.seguranca_texto,
            compra_titulo: pixConfig.compra_titulo || config.compra_titulo,
            mostrar_produto: pixConfig.mostrar_produto !== undefined ? pixConfig.mostrar_produto : config.mostrar_produto,
            mostrar_termos: pixConfig.mostrar_termos !== undefined ? pixConfig.mostrar_termos : config.mostrar_termos,
            saiba_mais_texto: pixConfig.saiba_mais_texto || config.saiba_mais_texto,
            timer_texto: pixConfig.timer_texto || config.timer_texto,
            texto_copiado: pixConfig.texto_copiado || config.texto_copiado,
            instrucoes_titulo: pixConfig.instrucoes_titulo || config.instrucoes_titulo,
            instrucoes: pixConfig.instrucoes || config.instrucoes,
            redirect_url: pixConfig.redirect_url || ''
          });
        } else {
          console.log("No PIX config found, using default values");
          // Set the product ID even if no PIX config exists
          setConfig(prevConfig => ({
            ...prevConfig,
            produto_id: produtoData.id
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleInstrucoesChange = (index: number, value: string) => {
    const newInstrucoes = [...config.instrucoes];
    newInstrucoes[index] = value;
    setConfig(prevConfig => ({
      ...prevConfig,
      instrucoes: newInstrucoes
    }));
  };

  const addInstrucao = () => {
    setConfig(prevConfig => ({
      ...prevConfig,
      instrucoes: [...prevConfig.instrucoes, '']
    }));
  };

  const removeInstrucao = (index: number) => {
    const newInstrucoes = [...config.instrucoes];
    newInstrucoes.splice(index, 1);
    setConfig(prevConfig => ({
      ...prevConfig,
      instrucoes: newInstrucoes
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!produto) {
        throw new Error("Produto não carregado");
      }
      
      console.log("Saving PIX config:", config);
      
      await updatePixConfig({
        ...config,
        produto_id: produto.id,
      });
      
      toast({
        title: "Sucesso",
        description: "Configurações do PIX salvas com sucesso",
      });
    } catch (error: any) {
      console.error("Error saving config:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Carregando configurações do PIX...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/produtos')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            Configuração PIX: {produto?.nome || 'Produto'}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Página PIX</CardTitle>
          <CardDescription>
            Configure todos os aspectos do pagamento PIX em um único lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dados" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="dados" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Dados PIX
              </TabsTrigger>
              <TabsTrigger value="pagina" className="flex items-center">
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Página PIX
              </TabsTrigger>
              <TabsTrigger value="instrucoes" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Instruções
              </TabsTrigger>
              <TabsTrigger value="exibicao" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Exibição
              </TabsTrigger>
            </TabsList>
            
            {/* Tab: Dados PIX */}
            <TabsContent value="dados" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome_beneficiario">Nome do Beneficiário</Label>
                    <Input
                      id="nome_beneficiario"
                      name="nome_beneficiario"
                      value={config.nome_beneficiario}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Nome que aparecerá para o cliente como recebedor do pagamento
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo_chave">Tipo de Chave PIX</Label>
                    <Select 
                      value={config.tipo_chave}
                      onValueChange={(value) => handleSelectChange('tipo_chave', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de chave" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tempo_expiracao">Tempo de Expiração (minutos)</Label>
                    <Input
                      id="tempo_expiracao"
                      name="tempo_expiracao"
                      type="number"
                      min={1}
                      value={config.tempo_expiracao}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Tempo em minutos até o pagamento expirar
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="codigo_copia_cola">Código PIX Copia e Cola</Label>
                    <Textarea
                      id="codigo_copia_cola"
                      name="codigo_copia_cola"
                      value={config.codigo_copia_cola}
                      onChange={handleInputChange}
                      className="font-mono text-sm h-24"
                      placeholder="Cole aqui o código PIX copia e cola completo"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Código PIX completo gerado pelo seu banco ou gateway de pagamento
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="qr_code_url">URL da Imagem do QR Code</Label>
                    <Input
                      id="qr_code_url"
                      name="qr_code_url"
                      value={config.qr_code_url}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/qrcode.png"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Link para a imagem do QR Code que será exibida na página
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="mensagem_pos_pix">Mensagem Pós-Pagamento</Label>
                    <Input
                      id="mensagem_pos_pix"
                      name="mensagem_pos_pix"
                      value={config.mensagem_pos_pix}
                      onChange={handleInputChange}
                      placeholder="Obrigado pelo seu pagamento!"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Mensagem exibida após o pagamento ser confirmado
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Tab: Página PIX */}
            <TabsContent value="pagina" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título Principal</Label>
                    <Input
                      id="titulo"
                      name="titulo"
                      value={config.titulo}
                      onChange={handleInputChange}
                      placeholder="Pagamento via PIX"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instrucao">Instruções Principais</Label>
                    <Textarea
                      id="instrucao"
                      name="instrucao"
                      value={config.instrucao}
                      onChange={handleInputChange}
                      placeholder="Instruções para o cliente sobre como realizar o pagamento"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timer_texto">Texto do Cronômetro</Label>
                    <Input
                      id="timer_texto"
                      name="timer_texto"
                      value={config.timer_texto}
                      onChange={handleInputChange}
                      placeholder="Faltam {minutos}:{segundos} para expirar..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use {"{minutos}"} e {"{segundos}"} como placeholders para o tempo
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="botao_texto">Texto do Botão</Label>
                    <Input
                      id="botao_texto"
                      name="botao_texto"
                      value={config.botao_texto}
                      onChange={handleInputChange}
                      placeholder="Confirmar pagamento"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="texto_copiado">Texto ao Copiar o Código</Label>
                    <Input
                      id="texto_copiado"
                      name="texto_copiado"
                      value={config.texto_copiado}
                      onChange={handleInputChange}
                      placeholder="Código copiado!"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="redirect_url">URL de Redirecionamento após Confirmação</Label>
                    <Input
                      id="redirect_url"
                      name="redirect_url"
                      value={config.redirect_url}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/obrigado"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      URL para redirecionar o cliente após confirmar o pagamento
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="compra_titulo">Título da Seção de Compra</Label>
                  <Input
                    id="compra_titulo"
                    name="compra_titulo"
                    value={config.compra_titulo}
                    onChange={handleInputChange}
                    placeholder="Sua Compra"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seguranca_texto">Texto sobre Segurança</Label>
                  <Textarea
                    id="seguranca_texto"
                    name="seguranca_texto"
                    value={config.seguranca_texto}
                    onChange={handleInputChange}
                    placeholder="Texto informativo sobre a segurança do pagamento"
                  />
                </div>
                
                <div>
                  <Label htmlFor="saiba_mais_texto">Texto do Link "Saiba Mais"</Label>
                  <Input
                    id="saiba_mais_texto"
                    name="saiba_mais_texto"
                    value={config.saiba_mais_texto}
                    onChange={handleInputChange}
                    placeholder="Saiba mais"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Tab: Instruções */}
            <TabsContent value="instrucoes" className="space-y-4">
              <div>
                <Label htmlFor="instrucoes_titulo">Título da Seção de Instruções</Label>
                <Input
                  id="instrucoes_titulo"
                  name="instrucoes_titulo"
                  value={config.instrucoes_titulo}
                  onChange={handleInputChange}
                  placeholder="Para realizar o pagamento:"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Passos para Pagamento</Label>
                {config.instrucoes.map((instrucao: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Input
                      value={instrucao}
                      onChange={(e) => handleInstrucoesChange(index, e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeInstrucao(index)}>
                      Remover
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addInstrucao} variant="outline" className="w-full">
                  Adicionar Instrução
                </Button>
              </div>
            </TabsContent>
            
            {/* Tab: Exibição */}
            <TabsContent value="exibicao" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="mostrar_qrcode_mobile">Mostrar QR Code em Dispositivos Móveis</Label>
                    <p className="text-sm text-muted-foreground">
                      Se desativado, o QR Code não será exibido em celulares e tablets
                    </p>
                  </div>
                  <Switch
                    id="mostrar_qrcode_mobile"
                    checked={config.mostrar_qrcode_mobile}
                    onCheckedChange={(checked) => handleCheckboxChange('mostrar_qrcode_mobile', checked)}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="mostrar_produto">Mostrar Resumo do Produto</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir as informações do produto na página de pagamento PIX
                    </p>
                  </div>
                  <Switch
                    id="mostrar_produto"
                    checked={config.mostrar_produto}
                    onCheckedChange={(checked) => handleCheckboxChange('mostrar_produto', checked)}
                  />
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="mostrar_termos">Mostrar Termos e Condições</Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir links para termos de uso e política de privacidade
                    </p>
                  </div>
                  <Switch
                    id="mostrar_termos"
                    checked={config.mostrar_termos}
                    onCheckedChange={(checked) => handleCheckboxChange('mostrar_termos', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
