
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomPixPage from '@/components/pix/CustomPixPage';
import { usePixel } from '@/hooks/usePixel';

export default function PixPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const { loadPixels } = usePixel();
  
  useEffect(() => {
    if (id) {
      loadPixels(id);
    }
  }, [id, loadPixels]);
  
  return <CustomPixPage />;
}
