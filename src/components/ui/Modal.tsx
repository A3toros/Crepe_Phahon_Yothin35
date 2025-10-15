import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'notification';
};

export function Modal({ open, onClose, title, description, children, variant = 'default' }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div role="dialog" aria-modal="true" aria-labelledby={title? 'modal-title': undefined} aria-describedby={description? 'modal-desc': undefined} className={`w-full max-w-md rounded-lg bg-white p-4 shadow-xl ${variant==='notification'? 'border-l-4 border-blue-500': ''}`}>
          {(title || description) && (
            <div className="mb-3">
              {title && <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>}
              {description && <p id="modal-desc" className="text-sm text-gray-600">{description}</p>}
            </div>
          )}
          {children}

        </div>
      </div>
    </div>,
    document.body
  );
}
