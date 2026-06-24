/**
 * Presentational structural tile panel container.
 * Enforces optimized glassmorphism and perimeter glow states via inset box-shadows.
 */
import React, { useState } from 'react';
import { colors, shadows } from '../../theme/theme';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    position: 'relative',
    background: `rgba(${colors.bgPrimary}, 0.7)`,
    backdropFilter: 'blur(12px)',
    border: `1px solid rgba(${colors.border}, var(--border-opacity, 0.3))`,
    borderRadius: '1rem',
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.05), ${shadows?.tile || '0 4px 20px rgba(0,0,0,0.05)'}`,
    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease',
    overflow: 'hidden',
    transform: isHovered && hoverable ? 'translateY(-2px)' : 'translateY(0)',
    borderColor: isHovered && hoverable ? `rgba(${colors.accentCyan}, 0.4)` : undefined,
    ...style,
  };

  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    boxShadow: `inset 0 0 0 1px rgba(${colors.accentCyan}, 0.3), 0 0 15px rgba(${colors.accentCyan}, 0.1)`,
    opacity: isHovered && hoverable ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: 10,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={hoverable ? "button" : "region"}
      tabIndex={hoverable ? 0 : undefined}
    >
      {hoverable && <div style={glowStyle} aria-hidden="true" />}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};