/**
 * Standalone Icon Button wrapper.
 * Tailored for contextual, space-efficient control parameters inside dense dashboards.
 */
import React from 'react';
import { colors } from '../../theme/theme';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string; // Made required for strict a11y compliance
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onClick,
  className = '',
  disabled,
  ...props
}) => (
  <button
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    style={{ color: disabled ? colors.textTertiary : colors.textSecondary }}
    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
      hover:scale-105 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10
      focus:outline-none focus:ring-2 focus:ring-[#00F0FF] focus:ring-offset-2 focus:ring-offset-[#0A0E17]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent
      ${className}`}
    {...props}
  >
    {icon}
  </button>
);