/**
 * Design token definitions mapping to local structural properties via CSS variables.
 */
export const colors = {
  bgPrimary: 'rgb(var(--bg-primary))',
  bgSecondary: 'rgb(var(--bg-secondary))',
  bgTertiary: 'rgb(var(--bg-tertiary))',
  border: 'rgb(var(--border))',
  borderHover: 'rgb(var(--border-hover))',
  accentCyan: 'rgb(var(--accent-cyan))',
  accentGreen: 'rgb(var(--accent-green))',
  accentRose: 'rgb(var(--accent-rose))',
  accentAmber: 'rgb(var(--accent-amber))',
  textPrimary: 'rgb(var(--text-primary))',
  textSecondary: 'rgb(var(--text-secondary))',
  textTertiary: 'rgb(var(--text-tertiary))',
};

export const alpha = (colorVar: string, opacity: number): string => {
  const match = colorVar.match(/var\(--([^)]+)\)/);
  if (!match) return colorVar;
  return `rgba(var(--${match[1]}), ${opacity})`;
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem'
};

export const typography = {
  fontFamily: 'monospace',
};

export const shadows = {
  tile: '0 4px 30px rgba(0, 0, 0, 0.4)',
};