/**
 * Accessibility utilities
 */

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Get ARIA label for form field
 */
export function getFieldAriaLabel(
  label: string,
  required?: boolean,
  error?: string,
): string {
  let ariaLabel = label;
  if (required) {
    ariaLabel += ' (required)';
  }
  if (error) {
    ariaLabel += `. Error: ${error}`;
  }
  return ariaLabel;
}

/**
 * Get ARIA describedby IDs for form field
 */
export function getFieldAriaDescribedBy(
  hasError: boolean,
  hasHelperText: boolean,
  errorId?: string,
  helperId?: string,
): string | undefined {
  const ids: string[] = [];
  if (hasError && errorId) ids.push(errorId);
  if (hasHelperText && helperId) ids.push(helperId);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * Keyboard event handlers for accessibility
 */
export const keyboardHandlers = {
  /**
   * Handle Enter key press
   */
  onEnter: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      callback();
    }
  },

  /**
   * Handle Escape key press
   */
  onEscape: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      callback();
    }
  },

  /**
   * Handle Arrow key navigation
   */
  onArrowKeys: (
    onUp?: () => void,
    onDown?: () => void,
    onLeft?: () => void,
    onRight?: () => void,
  ) => (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onRight?.();
        break;
    }
  },
};
