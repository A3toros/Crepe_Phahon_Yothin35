import { useEffect, useState } from 'react';
import { Modal } from '@src/components/ui/Modal';

export function QrModal({ open, onClose, qrText, expiresAt }: { open: boolean, onClose: () => void, qrText: string, expiresAt: string }) {
  const [remaining, setRemaining] = useState<number>(() => Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now())/1000)));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now())/1000))), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <Modal open={open} onClose={onClose} title="Scan to Pay">
      <div className="space-y-3">
        <div className="text-sm text-gray-600">Expires in {remaining}s</div>
        {/* Placeholder: in production, render a QR from qrText using a QR lib */}
        <div className="p-4 border rounded text-xs break-all bg-blueSoft">{qrText}</div>
      </div>
    </Modal>
  );
}


