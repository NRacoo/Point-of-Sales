'use client';

import { AlertCircle } from 'lucide-react';
import { useAnimatedMount } from '../hooks/useAnimatedMount';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmingLabel: string;
  cancelLabel: string;
  submitting?: boolean;
  iconBg?: string;
  iconColor?: string;
  confirmColor?: string;
  zIndexClass?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  cancelLabel,
  submitting = false,
  iconBg = 'bg-orange-100',
  iconColor = 'text-orange-600',
  confirmColor = 'bg-green-500 hover:bg-green-600',
  zIndexClass = 'z-[60]',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const anim = useAnimatedMount(open, 200);
  if (!anim.mounted) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 ${zIndexClass}
      transition-opacity duration-200 ease-out ${anim.active ? 'opacity-100' : 'opacity-0'}`}
      onClick={onCancel}
    >
      <div
        className={`bg-white rounded-xl max-w-sm w-full p-6
        transition-all duration-200 ease-out
        ${anim.active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 ${iconBg} rounded-lg`}>
            <AlertCircle className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors disabled:opacity-60 ${confirmColor}`}
          >
            {submitting ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}