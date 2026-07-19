'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAnimatedMount } from '../hooks/useAnimatedMount';

export interface ToastState {
  open: boolean;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const anim = useAnimatedMount(toast.open, 200);
  if (!anim.mounted) return null;

  return (
    <div className="fixed top-4 right-4 z-9999">
      <div
        className={`flex items-center gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3
        transition-all duration-200 ease-out
        ${anim.active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <p className="text-sm text-gray-800">{toast.message}</p>
        <button
          type="button"
          className="ml-2 p-1 rounded-lg hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close toast"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}