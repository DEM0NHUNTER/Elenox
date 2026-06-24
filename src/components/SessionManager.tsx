/**
 * Modal overlay grouping and presenting interactive conversation threads.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Trash2, X } from 'lucide-react';

import { IconButton } from './ui/IconButton';
import { Badge } from './ui/Badge';
import ConfirmModal from './ConfirmModal';
import type { Session } from '../types';

interface SessionManagerProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionManager({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  isOpen,
  onClose,
}: SessionManagerProps): React.JSX.Element | null {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen && !deleteTarget) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, deleteTarget, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) modalRef.current.focus();
  }, [isOpen]);

  const handleDelete = (): void => {
    if (deleteTarget) {
      onDeleteSession(deleteTarget);
      setDeleteTarget(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-foreground">Saved Sessions</h2>
            <IconButton icon={<X className="w-5 h-5" />} label="Close" onClick={onClose} />
          </div>

          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No sessions yet. Start a new one!</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2" role="listbox">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <li
                    key={session.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${
                      isActive ? 'bg-primary/10 border-primary/30' : 'border-transparent hover:bg-muted'
                    }`}
                    onClick={() => { onSelectSession(session.id); onClose(); }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {session.name}
                        </p>
                        {isActive && <Badge variant="info">ACTIVE</Badge>}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        <time>{new Date(session.createdAt).toLocaleDateString()}</time>
                      </div>
                    </div>
                    <IconButton
                      icon={<Trash2 className="w-4 h-4" />}
                      label={`Delete ${session.name}`}
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(session.id); }}
                      className="text-muted-foreground hover:text-destructive"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Session?"
        message="This will permanently remove the session. This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}