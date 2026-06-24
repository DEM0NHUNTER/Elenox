/**
 * Core UI Badge component.
 * Renders tiny typographic tags optimized for system status tracking and log classification.
 */
import React from 'react';
import { colors } from '../../theme/theme';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { background: string; color: string; border: string }> = {
  success: { background: `${colors.accentGreen}10`, color: colors.accentGreen, border: `1px solid ${colors.accentGreen}30` },
  error: { background: `${colors.accentRose}10`, color: colors.accentRose, border: `1px solid ${colors.accentRose}30` },
  warning: { background: '#fbbf2410', color: '#fbbf24', border: '1px solid #fbbf2430' },
  info: { background: `${colors.accentCyan}10`, color: colors.accentCyan, border: `1px solid ${colors.accentCyan}30` },
  neutral: { background: colors.bgTertiary, color: colors.textSecondary, border: `1px solid ${colors.border}` },
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const isPulsing = variant === 'success' || variant === 'info';

  return (
    <span
      style={variantStyles[variant]}
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest ${isPulsing ? 'status-ring' : ''} ${className}`}
    >
      {children}
    </span>
  );
};