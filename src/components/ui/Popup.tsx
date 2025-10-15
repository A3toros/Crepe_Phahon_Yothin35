import { useCallback, useState } from 'react';
import { Modal } from './Modal';

export function usePopup(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  return { open, show, hide, setOpen } as const;
}

export function Popup({ ctrl, title, description, children }: { ctrl: ReturnType<typeof usePopup>, title?: string, description?: string, children?: React.ReactNode }) {
  return (
    <Modal open={ctrl.open} onClose={ctrl.hide} title={title} description={description}>
      {children}
    </Modal>
  );
}
