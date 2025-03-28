
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface CustomPixTemplateProps {
  pix: {
    titulo?: string;
    instrucao?: string;
    qr_code_url?: string;
    chave_pix?: string;
    mensagem_pos_pagamento?: string;
  };
  config: any;
  handleConfirm: () => void;
  verifyingPayment: boolean;
}

const CustomPixTemplate = ({ 
  pix, 
  config, 
  handleConfirm, 
  verifyingPayment 
}: CustomPixTemplateProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!pix.chave_pix) return;
    
    navigator.clipboard.writeText(pix.chave_pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white text-gray-800">
      {pix.titulo && (
        <h1 className="text-2xl font-bold mb-4 text-center">{pix.titulo}</h1>
      )}

      {pix.instrucao && (
        <p className="text-center text-sm mb-4 max-w-md">{pix.instrucao}</p>
      )}

      {pix.qr_code_url && (
        <img
          src={pix.qr_code_url}
          alt="QR Code"
          className="w-60 h-60 object-contain border p-2 rounded mb-4"
        />
      )}

      {pix.chave_pix && (
        <div className="text-center mb-6">
          <p className="font-semibold mb-1">Chave PIX:</p>
          <input
            type="text"
            value={pix.chave_pix}
            readOnly
            className="border p-2 rounded w-full max-w-sm text-center"
            onClick={handleCopy}
          />
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full max-w-sm mt-6 p-3 rounded font-bold text-white"
        style={{ backgroundColor: config.cor_botao }}
        disabled={verifyingPayment}
      >
        {verifyingPayment ? "Verificando pagamento..." : "Confirmar pagamento"}
      </button>

      {pix.mensagem_pos_pagamento && (
        <p className="text-xs text-gray-500 text-center max-w-md mt-4">
          {pix.mensagem_pos_pagamento}
        </p>
      )}
    </div>
  );
};

export default CustomPixTemplate;
