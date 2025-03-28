
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigForm } from '@/components/admin/config/ConfigForm';

export default function AdminConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <ConfigForm />
      </CardContent>
    </Card>
  );
}
