/**
 * Core Action Button component.
 * Implements monospaced layout tracking and interactive state dynamics.
 */
import React, { useState } from 'react';
import { colors } from '../../theme/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

type VariantStyle = {
  background?: string;
  color?: string;
  border?: string;
  hoverBackground?: string;
  hoverBorder?: string;
  hoverColor?: string;
};

const variantStyles: Record<string, VariantStyle> = {
  primary: {
    background: colors.accentCyan,
    color: colors.bgPrimary,
    hoverBackground: colors.accentGreen,
  },
  secondary: {
    background: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    hoverBorder: colors.accentCyan,
    hoverColor: colors.accentCyan,
  },
  danger: {
    background: colors.accentRose,
    color: '#fff',
    hoverBackground: '#e11d48',
  },
  outline: {
    border: `1px solid ${colors.border}`,
    color: colors.accentCyan,
    hoverBackground: `${colors.accentCyan}10`,
  },
};

const sizeStyles = {
  sm: { padding: '0.25rem 0.75rem', fontSize: '10px' },
  md: { padding: '0.5rem 1rem', fontSize: '12px' },
  lg: { padding: '0.75rem 1.5rem', fontSize: '14px' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const mergedStyle: React.CSSProperties = {
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    width: fullWidth ? '100%' : 'auto',
    borderRadius: '0.125rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.7 : 1,
    transform: isHovered && !disabled && !isLoading ? 'translateY(-1px)' : 'translateY(0)',
    ...sizeStyle,
    ...variantStyle,
    ...(isHovered && !disabled && !isLoading
      ? {
          background: variantStyle.hoverBackground ?? variantStyle.background,
          borderColor: variantStyle.hoverBorder ?? variantStyle.border,
          color: variantStyle.hoverColor ?? variantStyle.color,
        }
      : {}),
    ...style,
  };

  return (
    <button
      style={mergedStyle}
      className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0E17] focus:ring-cyan-400 ${className}`}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          PROCESSING...
        </span>
      ) : (
        children
      )}
    </button>
  );
};