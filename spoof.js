// spoof.js
// Override navigator.maxTouchPoints and screen properties and stub navigator.getBattery()

(function() {
  // Max touch points
  try {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: function() { return 1; },
      configurable: true
    });
  } catch (e) {
    console.warn("Could not override navigator.maxTouchPoints", e);
  }

  // Screen properties override
  try {
    if (window.screen) {
      Object.defineProperty(window.screen, 'width', {
        get: function() { return 600; },
        configurable: true
      });
      Object.defineProperty(window.screen, 'height', {
        get: function() { return 800; },
        configurable: true
      });
      Object.defineProperty(window.screen, 'colorDepth', {
        get: function() { return 24; },
        configurable: true
      });
    }
  } catch (e) {
    console.warn("Could not override screen properties", e);
  }

  // navigator.getBattery — return a Promise resolving to an object with expected fields.
  try {
    navigator.getBattery = function() {
      return Promise.resolve({
        charging: false,
        chargingTime: 10,
        dischargingTime: 20,
        level: 0.56
      });
    };
  } catch (e) {
    console.warn("Could not override navigator.getBattery", e);
  }

  // Debug flag
  window.__SPOOF_ACTIVE = true;
})();