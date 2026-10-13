/**
 * Robust copy-to-clipboard function that works in iframe, mobile Android, and non-secure contexts.
 */
export async function copyFormulaToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Try modern Async Clipboard API if available and permitted
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, using fallback:', err);
    }
  }

  // 2. Fallback using temporary textarea + document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling on mobile iOS/Android
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('execCommand copy fallback failed:', fallbackErr);
    return false;
  }
}
