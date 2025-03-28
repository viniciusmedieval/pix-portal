import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { updatePixConfig } from '@/services/config/pixConfigService';
import { getConfig } from '@/services/config/configService';
import { getProdutoBySlug } from '@/services/produtoService';
import { toast } from '@/hooks/use-toast';

export default function AdminPix() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>({
    produto_id: '',
    codigo_copia_cola: '',
    qr_code_url: '',
    mensagem_pos_pix: '',
    tempo_expiracao: 15,
    nome_beneficiario: '',
    tipo_chave: 'email',
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
        
        // Fetch the product info first to get the proper UUID
        const produtoData = await getProdutoBySlug(id);
        if (!produtoData) {
          toast({
            title: "Erro",
            description: "Produto não encontrado",
            variant: "destructive"
          });
          return;
        }
        
        setProduto(produtoData);
        
        // Now fetch config with the valid UUID
        const configData = await getConfig(produtoData.id);
        
        // Update the form state with the fetched config
        if (configData) {
          setConfig({
            ...config,
            produto_id: produtoData.id,
            codigo_copia_cola: configData.chave_pix || '',
            qr_code_url: configData.qr_code || '',
            mensagem_pos_pix: configData.mensagem_pix || '',
            tempo_expiracao: configData.tempo_expiracao || 15,
            nome_beneficiario: configData.nome_beneficiario || '',
            tipo_chave: configData.tipo_chave || 'email',
            titulo: configData.pix_titulo || config.titulo,
            instrucao: configData.pix_subtitulo || config.instrucao,
            botao_texto: configData.pix_botao_texto || config.botao_texto,
            seguranca_texto: configData.pix_seguranca_texto || config.seguranca_texto,
            compra_titulo: configData.pix_compra_titulo || config.compra_titulo,
            mostrar_produto: configData.pix_mostrar_produto !== undefined ? configData.pix_mostrar_produto : config.mostrar_produto,
            mostrar_termos: configData.pix_mostrar_termos !== undefined ? configData.pix_mostrar_termos : config.mostrar_termos,
            saiba_mais_texto: configData.pix_saiba_mais_texto || config.saiba_mais_texto,
            timer_texto: configData.pix_timer_texto || config.timer_texto,
            texto_copiado: configData.pix_texto_copiado || config.texto_copiado,
            instrucoes_titulo: configData.pix_instrucoes_titulo || config.instrucoes_titulo,
            instrucoes: configData.pix_instrucoes || config.instrucoes
          });
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
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Página PIX</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="geral" className="space-y-4">
            <TabsList>
              <TabsTrigger value="geral">Geral</TabsTrigger>
              <TabsTrigger value="texto">Textos</TabsTrigger>
              <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
            </TabsList>
            <TabsContent value="geral" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_beneficiario">Nome do Beneficiário</Label>
                  <Input
                    type="text"
                    id="nome_beneficiario"
                    name="nome_beneficiario"
                    value={config.nome_beneficiario}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_chave">Tipo de Chave PIX</Label>
                  <Select onValueChange={(value) => handleSelectChange('tipo_chave', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de chave" defaultValue={config.tipo_chave} />
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
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo_copia_cola">Código Copia e Cola</Label>
                  <Textarea
                    id="codigo_copia_cola"
                    name="codigo_copia_cola"
                    value={config.codigo_copia_cola}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="qr_code_url">URL do QR Code</Label>
                  <Input
                    type="text"
                    id="qr_code_url"
                    name="qr_code_url"
                    value={config.qr_code_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tempo_expiracao">Tempo de Expiração (minutos)</Label>
                  <Input
                    type="number"
                    id="tempo_expiracao"
                    name="tempo_expiracao"
                    value={config.tempo_expiracao}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="mensagem_pos_pix">Mensagem Pós PIX</Label>
                  <Input
                    type="text"
                    id="mensagem_pos_pix"
                    name="mensagem_pos_pix"
                    value={config.mensagem_pos_pix}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mostrar_produto">Mostrar Produto</Label>
                  <Switch
                    id="mostrar_produto"
                    checked={config.mostrar_produto}
                    onCheckedChange={(checked) => handleCheckboxChange('mostrar_produto', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="mostrar_termos">Mostrar Termos</Label>
                  <Switch
                    id="mostrar_termos"
                    checked={config.mostrar_termos}
                    onCheckedChange={(checked) => handleCheckboxChange('mostrar_termos', checked)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="texto" className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={config.titulo}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="instrucao">Instrução</Label>
                <Input
                  type="text"
                  id="instrucao"
                  name="instrucao"
                  value={config.instrucao}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="botao_texto">Texto do Botão</Label>
                <Input
                  type="text"
                  id="botao_texto"
                  name="botao_texto"
                  value={config.botao_texto}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="seguranca_texto">Texto de Segurança</Label>
                <Textarea
                  id="seguranca_texto"
                  name="seguranca_texto"
                  value={config.seguranca_texto}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="compra_titulo">Título da Compra</Label>
                <Input
                  type="text"
                  id="compra_titulo"
                  name="compra_titulo"
                  value={config.compra_titulo}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="saiba_mais_texto">Texto "Saiba Mais"</Label>
                <Input
                  type="text"
                  id="saiba_mais_texto"
                  name="saiba_mais_texto"
                  value={config.saiba_mais_texto}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="timer_texto">Texto do Timer</Label>
                <Input
                  type="text"
                  id="timer_texto"
                  name="timer_texto"
                  value={config.timer_texto}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="texto_copiado">Texto Copiado</Label>
                <Input
                  type="text"
                  id="texto_copiado"
                  name="texto_copiado"
                  value={config.texto_copiado}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="instrucoes_titulo">Título das Instruções</Label>
                <Input
                  type="text"
                  id="instrucoes_titulo"
                  name="instrucoes_titulo"
                  value={config.instrucoes_titulo}
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            <TabsContent value="instrucoes" className="space-y-4">
              {config.instrucoes.map((instrucao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Label htmlFor={`instrucao-${index}`}>Instrução {index + 1}</Label>
                  <Input
                    type="text"
                    id={`instrucao-${index}`}
                    value={instrucao}
                    onChange={(e) => handleInstrucoesChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeInstrucao(index)}>
                    Remover
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addInstrucao}>
                Adicionar Instrução
              </Button>
            </TabsContent>
          </Tabs>
          <Button className="mt-6" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
