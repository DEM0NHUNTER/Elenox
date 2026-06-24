/**
High-priority generic confirmation modal utility.
Implements continuous glitch feedback sequences for destructive IT protocol executions.
Updated: Migrated to semantic Tailwind theme classes for full palette integration.
*/
import { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useTextScramble } from '../hooks/useTextScramble';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const buttonVariantMap = {
  danger: 'danger',
  warning: 'primary',
  info: 'primary',
} as const;

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const scrambledTitle = useTextScramble(title, isOpen && variant === 'danger', 400);

  useEffect(() => {
    if (!isOpen) {
      setIsExecuting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (variant === 'danger') {
      setIsExecuting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await onConfirm();
      } finally {}
    } else {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={isExecuting ? undefined : onCancel}
      />
      <div
        className={`relative bg-card border border-border rounded-lg shadow-2xl p-6 w-full max-w-md ${
          isExecuting ? 'animate-glitch' : 'animate-in fade-in zoom-in-95 duration-200'
        }`}
        style={{
          boxShadow: isExecuting
            ? 'inset 0 0 0 1px rgba(255, 84, 112, 0.5), 0 0 40px rgba(255, 84, 112, 0.2)'
            : undefined
        }}
      >
        <button
          onClick={onCancel}
          disabled={isExecuting}
          className="absolute top-4 right-4 p-1 rounded-sm text-muted-foreground hover:text-card-foreground transition-colors disabled:opacity-50"
          aria-label="Abort protocol"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          {variant === 'danger' && (
            isExecuting ? (
              <Loader2 className="w-5 h-5 text-destructive animate-spin" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )
          )}
          <h2 className="text-sm font-bold text-card-foreground tracking-widest uppercase font-mono">
            {scrambledTitle}
          </h2>
        </div>

        <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-mono min-h-[40px]">
          {isExecuting ? '██████ █████ ██████████...' : message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isExecuting}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariantMap[variant]}
            onClick={handleConfirm}
            disabled={isExecuting}
            className="w-full sm:w-auto"
          >
            {isExecuting ? 'EXECUTING...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}