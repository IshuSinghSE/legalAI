'use client';
import { ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">{children}</div>
      <div className="absolute inset-0" onClick={onClose} aria-label="Close modal" />
    </div>
  );
}
