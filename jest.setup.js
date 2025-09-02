const crypto = require('crypto');

const originalWarn = console.warn;
console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('bigint: Failed to load bindings')) {
        return;
    }
    originalWarn(...args);
};

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: arr => crypto.randomFillSync(arr),
  },
});

try {
  const noble = require('@noble/hashes/utils');
  if (noble) {
    noble.randomBytes = length => {
      return crypto.randomBytes(length);
    };
  }
} catch (e) {
  console.warn('Could not patch @noble/hashes');
}
