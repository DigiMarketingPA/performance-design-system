// Content script for Website Word Finder CORS Bypass Extension
// This script runs in the context of web pages and provides CORS bypass functionality

(function() {
    'use strict';
    
    console.log('🔓 Website Word Finder CORS Bypass Extension loaded');
    
    // Store original fetch and XMLHttpRequest
    const originalFetch = window.fetch;
    const originalXMLHttpRequest = window.XMLHttpRequest;
    
    let corsBypassEnabled = false;
    let isInitialized = false;
    
    // Send confirmation that content script is loaded
    try {
        chrome.runtime.sendMessage({
            type: 'CONTENT_SCRIPT_LOADED',
            url: window.location.href
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.log('Background script not ready:', chrome.runtime.lastError.message);
            } else {
                console.log('✅ Content script confirmed with background script');
            }
        });
    } catch (error) {
        console.log('Failed to send content script loaded message:', error.message);
    }
    
    // Listen for messages from side panel
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
            if (message.type === 'ENABLE_CORS_BYPASS') {
                if (!isInitialized) {
                    initializeCORSBypass();
                }
                corsBypassEnabled = true;
                console.log('🔓 CORS bypass enabled via content script');
                sendResponse({ success: true, status: 'enabled' });
            } else if (message.type === 'DISABLE_CORS_BYPASS') {
                corsBypassEnabled = false;
                console.log('🔒 CORS bypass disabled via content script');
                sendResponse({ success: true, status: 'disabled' });
            } else if (message.type === 'FETCH_PAGE') {
                // Handle page fetching request using fetch with proper error handling
                fetch(message.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'WebsiteWordFinder/1.0 (Content-Script)'
                    }
                }).then(response => {
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('text/html')) {
                            return response.text();
                        } else {
                            throw new Error('Non-HTML content');
                        }
                    } else {
                        throw new Error(`HTTP ${response.status}`);
                    }
                }).then(content => {
                    console.log(`✅ Successfully fetched ${message.url} (${content.length} characters)`);
                    sendResponse({ success: true, content: content });
                }).catch(error => {
                    console.error(`❌ Error fetching ${message.url}:`, error);
                    sendResponse({ success: false, error: error.message });
                });
            } else {
                sendResponse({ success: false, error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('Error handling message in content script:', error);
            sendResponse({ success: false, error: error.message });
        }
    });
    
    // Initialize CORS bypass functionality only when needed
    function initializeCORSBypass() {
        if (isInitialized) return;
        
        console.log('🔧 Initializing CORS bypass functionality...');
        
        // Only override fetch if it's configurable and not already overridden
        try {
            const originalFetchDescriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
            if (originalFetchDescriptor && originalFetchDescriptor.configurable) {
                Object.defineProperty(window, 'fetch', {
                    value: async function(url, options = {}) {
                        try {
                            // Only attempt CORS bypass if explicitly enabled
                            if (!corsBypassEnabled) {
                                return await originalFetch.call(this, url, options);
                            }
                            
                            // Check if this is a cross-origin request
                            const urlObj = new URL(url, window.location.href);
                            const currentOrigin = window.location.origin;
                            
                            if (urlObj.origin !== currentOrigin) {
                                console.log('🔄 CORS bypass attempt for:', url);
                                
                                // Method 1: Try with no-cors mode
                                try {
                                    const response = await originalFetch.call(this, url, {
                                        ...options,
                                        mode: 'no-cors',
                                        credentials: 'omit'
                                    });
                                    
                                    if (response.type === 'opaque') {
                                        console.log('✅ Opaque response received for:', url);
                                        return response;
                                    }
                                } catch (error) {
                                    console.log('❌ no-cors failed for:', url, error);
                                }
                                
                                // Method 2: Try with proxy (only for specific content types)
                                if (url.includes('.html') || url.includes('.htm') || url.includes('.txt')) {
                                    try {
                                        const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
                                        console.log('🔄 Trying proxy:', proxyUrl);
                                        
                                        const response = await originalFetch.call(this, proxyUrl, {
                                            method: 'GET',
                                            headers: {
                                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                                'User-Agent': 'WebsiteWordFinder/1.0 (CORS-Bypass-Extension)'
                                            }
                                        });
                                        
                                        if (response.ok) {
                                            console.log('✅ Proxy success for:', url);
                                            return response;
                                        }
                                    } catch (error) {
                                        console.log('❌ Proxy failed for:', url, error);
                                    }
                                }
                            }
                            
                            // Fallback to original fetch
                            return await originalFetch.call(this, url, options);
                        } catch (error) {
                            console.error('❌ Fetch failed for:', url, error);
                            throw error;
                        }
                    },
                    configurable: true,
                    writable: true
                });
            }
        } catch (error) {
            console.log('⚠️ Could not override fetch:', error.message);
        }
        
        // Only override XMLHttpRequest if it's configurable and not already overridden
        try {
            const originalXMLHttpRequestDescriptor = Object.getOwnPropertyDescriptor(window, 'XMLHttpRequest');
            if (originalXMLHttpRequestDescriptor && originalXMLHttpRequestDescriptor.configurable) {
                const CustomXMLHttpRequest = function() {
                    const xhr = new originalXMLHttpRequest();
                    const originalOpen = xhr.open;
                    const originalSend = xhr.send;
                    
                    xhr.open = function(method, url, async, user, password) {
                        this._url = url;
                        return originalOpen.call(this, method, url, async, user, password);
                    };
                    
                    xhr.send = function(data) {
                        // Only attempt CORS bypass if explicitly enabled
                        if (corsBypassEnabled && this._url) {
                            try {
                                const urlObj = new URL(this._url, window.location.href);
                                const currentOrigin = window.location.origin;
                                
                                if (urlObj.origin !== currentOrigin) {
                                    console.log('🔄 CORS bypass for XMLHttpRequest:', this._url);
                                }
                            } catch (error) {
                                // Invalid URL, continue normally
                            }
                        }
                        
                        return originalSend.call(this, data);
                    };
                    
                    return xhr;
                };
                
                // Copy static properties and prototype
                Object.setPrototypeOf(CustomXMLHttpRequest, originalXMLHttpRequest);
                CustomXMLHttpRequest.prototype = originalXMLHttpRequest.prototype;
                
                Object.defineProperty(window, 'XMLHttpRequest', {
                    value: CustomXMLHttpRequest,
                    configurable: true,
                    writable: true
                });
            }
        } catch (error) {
            console.log('⚠️ Could not override XMLHttpRequest:', error.message);
        }
        
        isInitialized = true;
        console.log('✅ CORS bypass functionality initialized');
    }
    
    // Create a global object that can be accessed by the page if needed
    if (!window.websiteWordFinderCORS) {
        Object.defineProperty(window, 'websiteWordFinderCORS', {
            value: {
                isEnabled: false,
                version: '1.0',
                bypassMethods: ['no-cors', 'proxy', 'original'],
                log: function(message) {
                    console.log('🔓 CORS Bypass:', message);
                },
                enable: function() {
                    if (!isInitialized) {
                        initializeCORSBypass();
                    }
                    corsBypassEnabled = true;
                    this.isEnabled = true;
                    console.log('🔓 CORS bypass enabled via global API');
                },
                disable: function() {
                    corsBypassEnabled = false;
                    this.isEnabled = false;
                    console.log('🔒 CORS bypass disabled via global API');
                }
            },
            configurable: true,
            writable: false
        });
    }
    
    console.log('✅ Website Word Finder CORS Bypass Extension initialized (CSP-compliant)');
})(); 