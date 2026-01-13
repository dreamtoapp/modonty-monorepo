/**
 * Cross-platform performance utility
 * Works in both Node.js and browser environments
 */

/**
 * Get high-precision timestamp in milliseconds
 * Uses browser Performance API in client, Node.js perf_hooks in server
 */
export function getPerformanceNow(): number {
  // Browser environment
  if (typeof window !== 'undefined' && window.performance) {
    return window.performance.now();
  }

  // Node.js environment
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      // Dynamic require to avoid bundling in client
      const { performance } = require('perf_hooks');
      return performance.now();
    } catch {
      // Fallback if perf_hooks not available
      return Date.now();
    }
  }

  // Fallback for other environments
  return Date.now();
}
