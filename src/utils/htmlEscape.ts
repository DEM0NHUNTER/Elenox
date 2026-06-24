/**
 * Contextual HTML string escaping utility.
 * Sanitizes core characters to protect telemetry logs against common script execution paths.
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      default: return char;
    }
  });
}