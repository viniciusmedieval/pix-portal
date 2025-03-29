
import { QrCode, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Timer from "./Timer";

interface PixCodeProps {
  pixCode: string;
  expirationMinutes: number;
  onExpire: () => void;
  qrCodeUrl?: string;
  beneficiaryName?: string;
  pixKeyType?: string;
  showQrOnMobile?: boolean;
}

const PixCode = ({ 
  pixCode, 
  expirationMinutes, 
  onExpire, 
  qrCodeUrl,
  beneficiaryName,
  pixKeyType,
  showQrOnMobile = true 
}: PixCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Show or hide QR Code based on device and settings
  const shouldShowQrCode = () => {
    const isMobile = window.innerWidth < 768;
    return !isMobile || (isMobile && showQrOnMobile);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold">
          Pague com PIX
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Escaneie o código ou copie o código PIX
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {shouldShowQrCode() && (
          <div className="w-48 h-48 bg-white p-2 border rounded-md mb-4">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
            ) : (
              <QrCode className="w-full h-full" />
            )}
          </div>
        )}
        
        <div className="w-full mb-6">
          <div className="relative">
            <div className="border rounded-md p-3 pr-10 bg-gray-50 text-sm truncate font-mono">
              {pixCode}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {beneficiaryName && (
          <div className="w-full mb-4 text-sm">
            <p className="text-muted-foreground">Beneficiário: <span className="font-medium">{beneficiaryName}</span></p>
            {pixKeyType && <p className="text-muted-foreground">Tipo de chave: <span className="font-medium">{pixKeyType}</span></p>}
          </div>
        )}
        
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Este código PIX expira em:</p>
          <Timer 
            initialMinutes={expirationMinutes} 
            onExpire={onExpire}
            className="justify-center mx-auto" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PixCode;
