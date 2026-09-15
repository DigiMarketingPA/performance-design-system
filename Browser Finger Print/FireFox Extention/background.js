// Check if uBlock Origin is installed and enabled
async function checkUBlockStatus() {
  const extensions = await browser.management.getAll();
  const uBlock = extensions.find(ext => ext.id === 'uBlock0@raymondhill.net');
  return uBlock && uBlock.enabled;
}

// Set up cookie blocking
browser.privacy.websites.cookieConfig.set({
  value: {
    behavior: "reject",
    nonPersistentCookies: true
  }
});

// Block third-party cookies and tracking headers
browser.webRequest.onBeforeSendHeaders.addListener(
  async function(details) {
    // Check if the domain is whitelisted
    const storage = await browser.storage.local.get('whitelist');
    const whitelist = storage.whitelist || [];
    const url = new URL(details.url);
    
    if (whitelist.includes(url.hostname)) {
      return { requestHeaders: details.requestHeaders };
    }

    const requestHeaders = details.requestHeaders;
    
    // Remove tracking headers
    const trackingHeaders = [
      'cookie',
      'referer',
      'dnt',
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform',
      'sec-fetch-dest',
      'sec-fetch-mode',
      'sec-fetch-site',
      'sec-fetch-user',
      'user-agent',
      'accept-language',
      'accept-encoding',
      'connection',
      'upgrade-insecure-requests'
    ];

    for (let i = requestHeaders.length - 1; i >= 0; i--) {
      const header = requestHeaders[i].name.toLowerCase();
      if (trackingHeaders.includes(header)) {
        requestHeaders.splice(i, 1);
      }
    }

    // Remove cookie headers from third-party requests
    if (details.initiator && details.initiator !== details.url) {
      for (let i = 0; i < requestHeaders.length; i++) {
        if (requestHeaders[i].name.toLowerCase() === 'cookie') {
          requestHeaders.splice(i, 1);
          break;
        }
      }
    }

    return { requestHeaders: requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Block tracking cookies and headers
browser.webRequest.onHeadersReceived.addListener(
  async function(details) {
    // Check if the domain is whitelisted
    const storage = await browser.storage.local.get('whitelist');
    const whitelist = storage.whitelist || [];
    const url = new URL(details.url);
    
    if (whitelist.includes(url.hostname)) {
      return { responseHeaders: details.responseHeaders };
    }

    const responseHeaders = details.responseHeaders;
    
    // Block tracking cookies
    for (let i = responseHeaders.length - 1; i >= 0; i--) {
      const header = responseHeaders[i];
      if (header.name.toLowerCase() === 'set-cookie') {
        const cookieValue = header.value;
        if (cookieValue.includes('_ga') || 
            cookieValue.includes('_gid') || 
            cookieValue.includes('_fbp') || 
            cookieValue.includes('_fbc') ||
            cookieValue.includes('_gcl') ||
            cookieValue.includes('_ym_') ||
            cookieValue.includes('_ym_d') ||
            cookieValue.includes('_gat') ||
            cookieValue.includes('_gac') ||
            cookieValue.includes('_dc_gtm') ||
            cookieValue.includes('_hj') ||
            cookieValue.includes('_hjid') ||
            cookieValue.includes('_hstc') ||
            cookieValue.includes('_sctr') ||
            cookieValue.includes('_ssid') ||
            cookieValue.includes('_fb') ||
            cookieValue.includes('_pin') ||
            cookieValue.includes('_scid') ||
            cookieValue.includes('_uetvid') ||
            cookieValue.includes('_rdt_uuid') ||
            cookieValue.includes('_gcl_au') ||
            cookieValue.includes('_gcl_aw') ||
            cookieValue.includes('_gcl_dc')) {
          responseHeaders.splice(i, 1);
        }
      }
    }

    // Block tracking headers
    const trackingHeaders = [
      'set-cookie',
      'x-frame-options',
      'content-security-policy',
      'strict-transport-security',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy',
      'permissions-policy',
      'cross-origin-embedder-policy',
      'cross-origin-opener-policy',
      'cross-origin-resource-policy'
    ];

    for (let i = responseHeaders.length - 1; i >= 0; i--) {
      const header = responseHeaders[i].name.toLowerCase();
      if (trackingHeaders.includes(header)) {
        responseHeaders.splice(i, 1);
      }
    }

    return { responseHeaders: responseHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);

// Listen for uBlock Origin status changes
browser.management.onEnabled.addListener(async (info) => {
  if (info.id === 'uBlock0@raymondhill.net') {
    console.log('uBlock Origin is now enabled');
    // You can add additional integration logic here
  }
});

browser.management.onDisabled.addListener(async (info) => {
  if (info.id === 'uBlock0@raymondhill.net') {
    console.log('uBlock Origin is now disabled');
  }
});

// Initialize uBlock Origin integration
async function initializeUBlockIntegration() {
  const uBlockEnabled = await checkUBlockStatus();
  if (uBlockEnabled) {
    console.log('uBlock Origin is installed and enabled');
    // You can add additional integration logic here
  } else {
    console.log('uBlock Origin is not installed or disabled');
  }
}

// Run initialization
initializeUBlockIntegration();

// Background script for log management
const MAX_LOGS = 1000; // Maximum number of logs to store

// Initialize storage
browser.storage.local.get('logs').then((result) => {
  if (!result.logs) {
    browser.storage.local.set({ logs: [] });
  }
});

// Handle messages from content script
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'log') {
    // Get current logs
    browser.storage.local.get('logs').then((result) => {
      const logs = result.logs || [];
      
      // Add new log entry
      logs.push(message.data);
      
      // Trim logs if they exceed maximum
      if (logs.length > MAX_LOGS) {
        logs.splice(0, logs.length - MAX_LOGS);
      }
      
      // Save updated logs
      browser.storage.local.set({ logs });
    });
  }
});

// Handle requests for logs
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getLogs') {
    browser.storage.local.get('logs').then((result) => {
      sendResponse({ logs: result.logs || [] });
    });
    return true; // Required for async response
  }
}); 