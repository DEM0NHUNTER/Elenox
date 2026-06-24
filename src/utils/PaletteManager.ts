/**
 * Core engine managing application palette configuration states.
 * Swaps data attributes on the document root to update active theme tokens.
 */
export type PaletteType = 'default' | 'quantum-rose';

export const PaletteManager = {
  /**
   * Retrieves the currently stored palette configuration.
   */
  getStoredPalette(): PaletteType {
    const saved = localStorage.getItem('axiosigil_palette');
    return (saved === 'quantum-rose' ? 'quantum-rose' : 'default') as PaletteType;
  },

  /**
   * Asserts a new palette selection across the document DOM tree.
   */
  applyPalette(palette: PaletteType): void {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    localStorage.setItem('axiosigil_palette', palette);
  },

  /**
   * Initializes structural state allocations upon window lifecycle boot.
   */
  initialize(): void {
    const activePalette = this.getStoredPalette();
    this.applyPalette(activePalette);
  }
};