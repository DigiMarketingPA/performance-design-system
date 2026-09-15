// Anti-fingerprinting measures with noise injection
(function() {
  // Logging system
  const logEntry = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    blocked: [],
    modified: []
  };

  const sendLog = (type, details) => {
    if (type === 'blocked') {
      logEntry.blocked.push({ ...details, timestamp: new Date().toISOString() });
    } else if (type === 'modified') {
      logEntry.modified.push({ ...details, timestamp: new Date().toISOString() });
    }
    
    // Send log to background script
    browser.runtime.sendMessage({
      type: 'log',
      data: logEntry
    });
  };

  // Generate an overwhelming amount of random data
  const generateNoiseData = () => {
    const browsers = Array(50).fill().map(() => 
      `Mozilla/5.0 (${['Windows NT 10.0', 'Macintosh', 'X11; Linux x86_64', 'Windows NT 6.1', 'iPhone', 'iPad', 'Android'][Math.floor(Math.random() * 7)]}; ${['Win64', 'x64', 'x86_64', 'arm64', 'i686'][Math.floor(Math.random() * 5)]}) ${['AppleWebKit', 'Gecko', 'KHTML', 'Presto'][Math.floor(Math.random() * 4)]}/${(Math.random() * 1000).toFixed(3)} (KHTML, like Gecko) ${['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'][Math.floor(Math.random() * 5)]}/${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 100)}`
    );
    
    const platforms = Array(30).fill().map(() => 
      `${['Win', 'Mac', 'Linux', 'iPhone', 'iPad', 'Android'][Math.floor(Math.random() * 6)]}${['32', '64', 'x86_64', 'arm64', 'i686'][Math.floor(Math.random() * 5)]}`
    );
    
    const languages = Array(20).fill().map(() => 
      `${['en', 'fr', 'de', 'es', 'it', 'ja', 'zh', 'ru', 'ko', 'pt'][Math.floor(Math.random() * 10)]}-${['US', 'GB', 'FR', 'DE', 'ES', 'IT', 'JP', 'CN', 'RU', 'KR', 'BR'][Math.floor(Math.random() * 11)]}`
    );
    
    const timezones = Array(40).fill().map(() => 
      `${['America', 'Europe', 'Asia', 'Australia', 'Africa', 'Pacific'][Math.floor(Math.random() * 6)]}/${['New_York', 'London', 'Tokyo', 'Sydney', 'Paris', 'Berlin', 'Moscow', 'Shanghai', 'Singapore', 'Dubai'][Math.floor(Math.random() * 10)]}`
    );
    
    return {
      userAgents: browsers,
      platforms: platforms,
      languages: languages,
      timezones: timezones,
      hardwareConcurrency: Array(10).fill().map(() => Math.floor(Math.random() * 16) + 1),
      deviceMemory: Array(10).fill().map(() => Math.floor(Math.random() * 32) + 1),
      screenConfigs: Array(20).fill().map(() => ({
        width: [1280, 1366, 1440, 1536, 1600, 1680, 1920, 2560][Math.floor(Math.random() * 8)],
        height: [720, 768, 900, 864, 900, 1050, 1080, 1440][Math.floor(Math.random() * 8)],
        colorDepth: [24, 30, 32, 48][Math.floor(Math.random() * 4)],
        pixelDepth: [24, 30, 32, 48][Math.floor(Math.random() * 4)],
        availWidth: [1280, 1366, 1440, 1536, 1600, 1680, 1920, 2560][Math.floor(Math.random() * 8)],
        availHeight: [720, 768, 900, 864, 900, 1050, 1080, 1440][Math.floor(Math.random() * 8)]
      }))
    };
  };

  const noiseData = generateNoiseData();

  // Create a rotating navigator object that changes properties frequently
  const createRotatingNavigator = () => {
    const navigators = Array(10).fill().map(() => ({
      userAgent: noiseData.userAgents[Math.floor(Math.random() * noiseData.userAgents.length)],
      platform: noiseData.platforms[Math.floor(Math.random() * noiseData.platforms.length)],
      language: noiseData.languages[Math.floor(Math.random() * noiseData.languages.length)],
      languages: Array(5).fill().map(() => noiseData.languages[Math.floor(Math.random() * noiseData.languages.length)]),
      hardwareConcurrency: noiseData.hardwareConcurrency[Math.floor(Math.random() * noiseData.hardwareConcurrency.length)],
      deviceMemory: noiseData.deviceMemory[Math.floor(Math.random() * noiseData.deviceMemory.length)],
      screen: noiseData.screenConfigs[Math.floor(Math.random() * noiseData.screenConfigs.length)],
      plugins: Array(10).fill().map(() => ({
        name: `Plugin ${Math.random().toString(36).substring(2, 15)}`,
        description: `Description ${Math.random().toString(36).substring(2, 15)}`,
        filename: `plugin${Math.floor(Math.random() * 1000)}.dll`
      })),
      mimeTypes: Array(15).fill().map(() => ({
        type: `application/x-${Math.random().toString(36).substring(2, 10)}`,
        suffixes: `${Math.random().toString(36).substring(2, 5)}`,
        description: `MIME Type ${Math.random().toString(36).substring(2, 15)}`
      })),
      timezone: noiseData.timezones[Math.floor(Math.random() * noiseData.timezones.length)],
      maxTouchPoints: Math.floor(Math.random() * 10),
      deviceScaleFactor: [1, 1.5, 2, 2.5, 3][Math.floor(Math.random() * 5)],
      doNotTrack: Math.random() > 0.5 ? '1' : '0',
      cookieEnabled: Math.random() > 0.5,
      onLine: Math.random() > 0.5,
      appCodeName: 'Mozilla',
      appName: 'Netscape',
      appVersion: noiseData.userAgents[Math.floor(Math.random() * noiseData.userAgents.length)],
      product: 'Gecko',
      productSub: '20100101',
      vendor: ['Google Inc.', 'Apple Computer, Inc.', 'Microsoft Corporation', ''][Math.floor(Math.random() * 4)],
      vendorSub: '',
      buildID: Math.random().toString(36).substring(2, 15)
    }));

    let currentIndex = 0;
    return {
      get navigator() {
        currentIndex = (currentIndex + 1) % navigators.length;
        return navigators[currentIndex];
      }
    };
  };

  const rotatingNavigator = createRotatingNavigator();

  // Override navigator object with rotating properties
  Object.defineProperty(window, 'navigator', {
    get: () => rotatingNavigator.navigator,
    configurable: false
  });

  // Enhance WebGL fingerprinting with noise
  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    const noiseValues = {
      37445: ['Intel Inc.', 'NVIDIA Corporation', 'AMD', 'Apple Inc.', 'Qualcomm'],
      37446: ['Intel Iris OpenGL Engine', 'NVIDIA GeForce GTX', 'AMD Radeon', 'Apple M1', 'Adreno'],
      3410: [16384, 8192, 4096, 2048, 1024],
      3411: [[16384, 16384], [8192, 8192], [4096, 4096], [2048, 2048]],
      7936: ['Google Inc.', 'Apple Inc.', 'Microsoft Corporation', 'Mozilla Foundation'],
      7937: ['ANGLE (Intel, Intel(R) UHD Graphics)', 'ANGLE (NVIDIA GeForce GTX)', 'ANGLE (AMD Radeon)', 'ANGLE (Apple M1)'],
      7938: ['WebGL 2.0 (OpenGL ES 3.0 Chromium)', 'WebGL 2.0 (OpenGL ES 3.0)', 'WebGL 1.0 (OpenGL ES 2.0)'],
      35724: ['Intel Inc.', 'NVIDIA Corporation', 'AMD', 'Apple Inc.', 'Qualcomm'],
      35725: ['Intel Iris OpenGL Engine', 'NVIDIA GeForce GTX', 'AMD Radeon', 'Apple M1', 'Adreno']
    };

    if (noiseValues[parameter]) {
      return noiseValues[parameter][Math.floor(Math.random() * noiseValues[parameter].length)];
    }
    return originalGetParameter.call(this, parameter);
  };

  // Enhance canvas fingerprinting with more noise
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, attributes) {
    const context = originalGetContext.call(this, type, attributes);
    if (type === '2d') {
      const originalFillText = context.fillText;
      context.fillText = function() {
        arguments[1] += (Math.random() - 0.5) * 10;
        arguments[2] += (Math.random() - 0.5) * 10;
        return originalFillText.apply(this, arguments);
      };

      const originalGetImageData = context.getImageData;
      context.getImageData = function() {
        const imageData = originalGetImageData.apply(this, arguments);
        for (let i = 0; i < imageData.data.length; i += 4) {
          imageData.data[i] = Math.floor(Math.random() * 256);
          imageData.data[i + 1] = Math.floor(Math.random() * 256);
          imageData.data[i + 2] = Math.floor(Math.random() * 256);
          imageData.data[i + 3] = Math.floor(Math.random() * 256);
        }
        return imageData;
      };

      const originalMeasureText = context.measureText;
      context.measureText = function() {
        const metrics = originalMeasureText.apply(this, arguments);
        metrics.width += (Math.random() - 0.5) * 20;
        metrics.actualBoundingBoxAscent += (Math.random() - 0.5) * 10;
        metrics.actualBoundingBoxDescent += (Math.random() - 0.5) * 10;
        metrics.actualBoundingBoxLeft += (Math.random() - 0.5) * 10;
        metrics.actualBoundingBoxRight += (Math.random() - 0.5) * 10;
        return metrics;
      };

      const originalToDataURL = context.canvas.toDataURL;
      context.canvas.toDataURL = function() {
        const dataURL = originalToDataURL.apply(this, arguments);
        return dataURL.replace(/([a-f0-9]{2})/gi, function(match) {
          return Math.random() > 0.3 ? match : (parseInt(match, 16) + Math.floor(Math.random() * 16)).toString(16).padStart(2, '0');
        });
      };
    }
    return context;
  };

  // Override AudioContext fingerprinting
  if (window.AudioContext) {
    const originalGetChannelData = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function() {
      const data = originalGetChannelData.apply(this, arguments);
      // Add significant randomization to audio data
      for (let i = 0; i < data.length; i++) {
        data[i] += (Math.random() - 0.5) * 0.001;
      }
      return data;
    };
  }

  // Override WebRTC fingerprinting
  if (window.RTCPeerConnection) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function() {
      return Promise.reject(new Error('Not allowed'));
    };

    // Override RTCPeerConnection
    const originalRTCPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function() {
      const pc = new originalRTCPeerConnection();
      pc.createDataChannel = function() {
        return {
          send: function() {},
          close: function() {}
        };
      };
      return pc;
    };
  }

  // Override Battery API
  if (navigator.getBattery) {
    navigator.getBattery = function() {
      return Promise.resolve({
        charging: true,
        chargingTime: Infinity,
        dischargingTime: Infinity,
        level: 1
      });
    };
  }

  // Block fingerprinting scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'SCRIPT') {
          const src = node.src || '';
          if (src.includes('fingerprint') || 
              src.includes('analytics') || 
              src.includes('tracking') ||
              src.includes('metrics') ||
              src.includes('collect') ||
              src.includes('beacon') ||
              src.includes('tag') ||
              src.includes('pixel') ||
              src.includes('gtm') ||
              src.includes('ga') ||
              src.includes('gid') ||
              src.includes('fbq') ||
              src.includes('tr')) {
            node.remove();
            sendLog('blocked', {
              type: 'script',
              url: src,
              reason: 'Fingerprinting/analytics script detected'
            });
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Block fingerprinting iframes
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    if (tagName.toLowerCase() === 'iframe') {
      Object.defineProperty(element, 'src', {
        set: function(value) {
          if (value.includes('fingerprint') || 
              value.includes('analytics') || 
              value.includes('tracking') ||
              value.includes('metrics') ||
              value.includes('collect') ||
              value.includes('beacon') ||
              value.includes('tag') ||
              value.includes('pixel') ||
              value.includes('gtm') ||
              value.includes('ga') ||
              value.includes('gid') ||
              value.includes('fbq') ||
              value.includes('tr')) {
            sendLog('blocked', {
              type: 'iframe',
              url: value,
              reason: 'Fingerprinting/analytics iframe detected'
            });
            return;
          }
          this.setAttribute('src', value);
        }
      });
    }
    return element;
  };

  // Block fingerprinting APIs
  const blockedAPIs = [
    'PerformanceObserver',
    'PerformanceResourceTiming',
    'PerformanceNavigationTiming',
    'PerformancePaintTiming',
    'PerformanceLongTaskTiming',
    'PerformanceEntry',
    'PerformanceMark',
    'PerformanceMeasure',
    'PerformanceNavigation',
    'PerformanceTiming'
  ];

  blockedAPIs.forEach(api => {
    if (window[api]) {
      window[api] = function() {
        return {
          observe: function() {},
          disconnect: function() {},
          takeRecords: function() { return []; }
        };
      };
    }
  });

  // Block localStorage and sessionStorage
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    if (key.includes('fingerprint') || 
        key.includes('analytics') || 
        key.includes('tracking') ||
        key.includes('metrics') ||
        key.includes('collect') ||
        key.includes('beacon') ||
        key.includes('tag') ||
        key.includes('pixel') ||
        key.includes('gtm') ||
        key.includes('ga') ||
        key.includes('gid') ||
        key.includes('fbq') ||
        key.includes('tr')) {
      return;
    }
    return originalSetItem.call(this, key, value);
  };

  // Block IndexedDB
  if (window.indexedDB) {
    const originalOpen = window.indexedDB.open;
    window.indexedDB.open = function() {
      const request = originalOpen.apply(this, arguments);
      request.onupgradeneeded = function() {};
      return request;
    };
  }

  // Block Service Workers
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register = function() {
      return Promise.reject(new Error('Service Workers are disabled'));
    };
  }

  // Block Web Workers
  const originalWorker = window.Worker;
  window.Worker = function() {
    return {
      postMessage: function() {},
      terminate: function() {},
      addEventListener: function() {},
      removeEventListener: function() {}
    };
  };

  // Log API modifications
  sendLog('modified', {
    type: 'navigator',
    details: 'Modified navigator properties with rotating values'
  });

  sendLog('modified', {
    type: 'WebGL',
    details: 'Modified WebGL fingerprinting with noise'
  });

  sendLog('modified', {
    type: 'Canvas',
    details: 'Modified canvas fingerprinting with noise'
  });

  if (window.AudioContext) {
    sendLog('modified', {
      type: 'AudioContext',
      details: 'Modified AudioContext fingerprinting'
    });
  }

  if (window.RTCPeerConnection) {
    sendLog('modified', {
      type: 'WebRTC',
      details: 'Blocked WebRTC fingerprinting'
    });
  }

  if (navigator.getBattery) {
    sendLog('modified', {
      type: 'Battery API',
      details: 'Modified Battery API fingerprinting'
    });
  }
})(); 