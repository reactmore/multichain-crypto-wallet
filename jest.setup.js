const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('util');

// --------------------
// Polyfill TextEncoder / TextDecoder
// --------------------
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// --------------------
// Suppress bigint-buffer warning
// --------------------
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('bigint: Failed to load bindings')
  ) {
    return; // ignore
  }
  originalWarn(...args);
};

// --------------------
// Polyfill crypto.getRandomValues
// --------------------
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomFillSync(arr),
  },
});

// --------------------
// Patch @noble/hashes randomBytes
// --------------------
try {
  const noble = require('@noble/hashes/utils');
  if (noble) {
    noble.randomBytes = (length) => crypto.randomBytes(length);
  }
} catch (e) {
  console.warn('Could not patch @noble/hashes');
}
