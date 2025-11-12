/**
 * Security validation utilities for user input
 */

// Maximum field lengths to prevent DoS attacks
export const VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  URL_MAX_LENGTH: 2000,
  ADDRESS_MAX_LENGTH: 500,
  NOTES_MAX_LENGTH: 10000,
} as const;

/**
 * Validates a URL to ensure it uses a safe protocol (http/https only)
 * Prevents javascript:, data:, file:, and other potentially dangerous protocols
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim whitespace
  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return true; // Empty URLs are allowed
  }

  if (trimmed.length > VALIDATION_LIMITS.URL_MAX_LENGTH) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    // Only allow http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    // If URL parsing fails, check if it's a relative URL or malformed
    // Reject anything that looks like a protocol injection
    const protocolPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
    if (protocolPattern.test(trimmed)) {
      // Has a protocol but failed to parse - reject it
      return false;
    }
    // Could be a relative URL or domain without protocol - allow it
    // but ensure it doesn't contain suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /about:/i,
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(trimmed));
  }
}

/**
 * Sanitizes a string by trimming and enforcing length limits
 */
export function sanitizeString(
  value: string | undefined,
  maxLength: number
): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return trimmed.length > maxLength
    ? trimmed.substring(0, maxLength)
    : trimmed;
}

/**
 * Validates and sanitizes itinerary item fields
 */
export function validateItineraryItem(item: {
  title?: string;
  url?: string;
  address?: string;
  notes?: string;
}): {
  isValid: boolean;
  errors: string[];
  sanitized: {
    title: string;
    url: string;
    address: string;
    notes: string;
  };
} {
  const errors: string[] = [];

  // Sanitize all fields
  const sanitized = {
    title: sanitizeString(item.title, VALIDATION_LIMITS.TITLE_MAX_LENGTH),
    url: sanitizeString(item.url, VALIDATION_LIMITS.URL_MAX_LENGTH),
    address: sanitizeString(item.address, VALIDATION_LIMITS.ADDRESS_MAX_LENGTH),
    notes: sanitizeString(item.notes, VALIDATION_LIMITS.NOTES_MAX_LENGTH),
  };

  // Validate title (required, non-empty after trimming)
  if (!sanitized.title) {
    errors.push('Title is required');
  }

  // Validate URL if provided
  if (sanitized.url && !isValidUrl(sanitized.url)) {
    errors.push('Invalid URL. Please use http:// or https:// URLs only');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Escapes HTML special characters to prevent XSS
 * Note: React already escapes content, but this is an extra safety layer
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, char => map[char] || char);
}
