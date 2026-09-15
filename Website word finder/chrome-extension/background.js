// Background script for Website Word Finder CORS Bypass Extension

let currentSearch = null;

chrome.runtime.onInstalled.addListener(() => {
    console.log('🔓 Website Word Finder CORS Bypass Extension installed');
});

// Handle extension icon click to open side panel
chrome.action.onClicked.addListener(async (tab) => {
    console.log('🔓 Extension icon clicked on tab:', tab.url);
    
    try {
        // Open the side panel
        await chrome.sidePanel.open({ windowId: tab.windowId });
        
        // Inject the content script if not already injected
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.log('Content script already injected or failed:', chrome.runtime.lastError.message);
            } else {
                console.log('✅ Content script injected successfully');
            }
        });
    } catch (error) {
        console.error('❌ Failed to open side panel:', error);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.type === 'CONTENT_SCRIPT_LOADED') {
            console.log('✅ Content script loaded on:', message.url);
            sendResponse({ success: true });
        } else if (message.type === 'START_SEARCH') {
            // Store search state for background processing
            currentSearch = {
                baseUrl: message.baseUrl,
                searchTerms: message.searchTerms,
                options: message.options,
                startTime: new Date().toISOString(),
                pages: new Map(),
                results: [],
                isRunning: true
            };
            
            // Store in chrome.storage for persistence
            chrome.storage.local.set({ 
                currentSearch: {
                    baseUrl: currentSearch.baseUrl,
                    searchTerms: currentSearch.searchTerms,
                    options: currentSearch.options,
                    startTime: currentSearch.startTime,
                    pages: Array.from(currentSearch.pages.entries()),
                    results: currentSearch.results,
                    isRunning: currentSearch.isRunning
                }
            });
            
            console.log('🔍 Background search started:', currentSearch);
            sendResponse({ success: true });
        } else if (message.type === 'UPDATE_PAGE') {
            // Update page status in background
            if (currentSearch && currentSearch.isRunning) {
                currentSearch.pages.set(message.url, {
                    url: message.url,
                    status: message.status,
                    foundTerms: message.foundTerms || [],
                    timestamp: new Date().toISOString()
                });
                
                // Store updated state
                chrome.storage.local.set({ 
                    currentSearch: {
                        baseUrl: currentSearch.baseUrl,
                        searchTerms: currentSearch.searchTerms,
                        options: currentSearch.options,
                        startTime: currentSearch.startTime,
                        pages: Array.from(currentSearch.pages.entries()),
                        results: currentSearch.results,
                        isRunning: currentSearch.isRunning
                    }
                });
            }
            sendResponse({ success: true });
        } else if (message.type === 'GET_SEARCH_STATUS') {
            // Return current search status
            const searchData = currentSearch ? {
                baseUrl: currentSearch.baseUrl,
                searchTerms: currentSearch.searchTerms,
                options: currentSearch.options,
                startTime: currentSearch.startTime,
                pages: Array.from(currentSearch.pages.entries()),
                results: currentSearch.results,
                isRunning: currentSearch.isRunning
            } : null;
            
            sendResponse({ search: searchData });
        } else if (message.type === 'STOP_SEARCH') {
            // Stop current search
            if (currentSearch) {
                currentSearch.isRunning = false;
                chrome.storage.local.set({ currentSearch: null });
            }
            currentSearch = null;
            sendResponse({ success: true });
        } else {
            // If we get here, it's an unknown message type
            sendResponse({ error: 'Unknown message type' });
        }
    } catch (error) {
        console.error('Error in background script message handler:', error);
        sendResponse({ error: error.message });
    }
}); 