// Panel script for Website Word Finder CORS Bypass Extension
// Includes full website word finder functionality

class WebsiteWordFinder {
    constructor() {
        this.visitedUrls = new Set();
        this.foundResults = [];
        this.maxDepth = 3;
        this.maxPages = 100;
        this.delay = 1000;
        this.onPageUpdate = null; // Callback for real-time updates
        this.isRunning = false;
        this.searchInstance = null; // Store current search instance
    }

    async searchWebsite(baseUrl, searchTerms, options = {}) {
        try {
            this.baseUrl = new URL(baseUrl);
        } catch (error) {
            throw new Error(`Invalid URL: ${baseUrl}`);
        }
        
        this.searchTerms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];
        this.maxDepth = options.maxDepth || 3;
        this.maxPages = options.maxPages || 100;
        this.delay = options.delay || 1000;
        this.onPageUpdate = options.onPageUpdate || null;
        
        this.visitedUrls.clear();
        this.foundResults = [];
        this.isRunning = true;
        this.searchInstance = this; // Store reference to current search
        
        console.log(`🔍 Starting search for terms: ${this.searchTerms.join(', ')}`);
        console.log(`🌐 Base URL: ${this.baseUrl.href}`);
        
        try {
            await this.crawlPage(this.baseUrl.href, 0);
            
            return {
                summary: {
                    totalResults: this.foundResults.length,
                    totalPages: this.visitedUrls.size,
                    searchTerms: this.searchTerms,
                    baseUrl: this.baseUrl.href
                },
                results: this.foundResults
            };
        } catch (error) {
            console.error('❌ Search failed:', error);
            return {
                error: error.message,
                summary: {
                    totalResults: 0,
                    totalPages: this.visitedUrls.size,
                    searchTerms: this.searchTerms,
                    baseUrl: this.baseUrl.href
                },
                results: []
            };
        } finally {
            this.isRunning = false;
            this.searchInstance = null;
        }
    }

    async crawlPage(url, depth) {
        if (!this.isRunning || depth > this.maxDepth || this.visitedUrls.size >= this.maxPages) {
            console.log(`Stopping crawl: depth=${depth}, maxDepth=${this.maxDepth}, visited=${this.visitedUrls.size}, maxPages=${this.maxPages}`);
            return;
        }

        if (this.visitedUrls.has(url)) {
            console.log(`Already visited: ${url}`);
            return;
        }

        this.visitedUrls.add(url);
        console.log(`🔍 Crawling: ${url} (depth: ${depth})`);

        // Notify about page being processed
        if (this.onPageUpdate) {
            this.onPageUpdate(url, 'processing', null);
        }

        try {
            const response = await this.fetchPage(url);
            if (!response) {
                console.log(`❌ No response for: ${url}`);
                if (this.onPageUpdate) {
                    this.onPageUpdate(url, 'not-found', null);
                }
                return;
            }

            // Search for terms in the content
            const foundTerms = await this.searchInContent(url, response);
            
            // Notify about page results
            if (this.onPageUpdate) {
                const status = foundTerms.length > 0 ? 'found' : 'not-found';
                this.onPageUpdate(url, status, foundTerms);
            }

            // Extract links for further crawling
            const links = this.extractLinks(response, url);
            console.log(`🔗 Found ${links.length} links on ${url}`);

            // Crawl links if we haven't reached the limit
            if (depth < this.maxDepth && this.visitedUrls.size < this.maxPages) {
                console.log(`🌐 Will crawl ${links.length} links from ${url} (depth ${depth + 1})`);
                for (const link of links) {
                    if (this.shouldCrawlLink(link)) {
                        console.log(`✅ Will crawl link: ${link}`);
                        // Use a more explicit delay approach
                        await new Promise(resolve => setTimeout(resolve, this.delay));
                        await this.crawlPage(link, depth + 1);
                    } else {
                        console.log(`❌ Skipping link: ${link} (filtered out)`);
                    }
                }
            } else {
                console.log(`⏹️ Stopping link crawling: depth=${depth}, maxDepth=${this.maxDepth}, visited=${this.visitedUrls.size}, maxPages=${this.maxPages}`);
            }
        } catch (error) {
            console.error(`❌ Error crawling ${url}:`, error);
            // Continue crawling other pages even if one fails
            if (error.name === 'TypeError' && error.message.includes('delay')) {
                console.error('Delay method error - this should be fixed now');
            } else {
                console.error(`Crawling error for ${url}:`, error.message);
            }
            
            // Notify about page error
            if (this.onPageUpdate) {
                this.onPageUpdate(url, 'not-found', null);
            }
        }
    }

    async fetchPage(url) {
        try {
            console.log(`Fetching: ${url}`);
            
            const urlObj = new URL(url);
            const baseUrlObj = new URL(this.baseUrl);
            
            // Check if this is the same domain as our base URL
            const isSameDomain = urlObj.hostname === baseUrlObj.hostname;
            
            if (isSameDomain) {
                console.log(`Same-domain request: ${url}`);
                // For same-domain requests, use the content script to fetch the page
                try {
                    // Get the current active tab
                    const tabs = await new Promise((resolve, reject) => {
                        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve(tabs);
                            }
                        });
                    });
                    
                    if (tabs && tabs[0]) {
                        // Use the content script to fetch the page
                        const response = await new Promise((resolve, reject) => {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                type: 'FETCH_PAGE',
                                url: url
                            }, (response) => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError.message));
                                } else {
                                    resolve(response);
                                }
                            });
                        });
                        
                        if (response && response.success && response.content) {
                            console.log(`Successfully fetched ${url} via content script (${response.content.length} characters)`);
                            return response.content;
                        } else if (response && response.error) {
                            console.log(`Content script fetch failed for ${url}:`, response.error);
                        }
                    }
                } catch (error) {
                    console.log(`Content script fetch failed for ${url}:`, error.message);
                }
                
                // Fallback: try direct fetch for same-domain
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'WebsiteWordFinder/1.0 (Same-Domain)'
                        }
                    });
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('text/html')) {
                            const text = await response.text();
                            console.log(`Successfully fetched ${url} (${text.length} characters)`);
                            return text;
                        }
                    }
                } catch (error) {
                    console.log(`Direct fetch failed for ${url}:`, error.message);
                }
            }
            
            // Try CORS bypass methods for cross-domain or failed same-domain requests
            console.log(`Attempting CORS bypass for: ${url}`);
            
            // Method 1: Try with no-cors mode
            try {
                const response = await this.fetchWithNoCors(url);
                if (response) return response;
            } catch (error) {
                console.log(`No-cors failed for ${url}:`, error.message);
            }
            
            // Method 2: Try with proxy
            try {
                const response = await this.fetchWithProxy(url);
                if (response) return response;
            } catch (error) {
                console.log(`Proxy failed for ${url}:`, error.message);
            }
            
            // Method 3: Try original fetch as fallback
            try {
                const response = await this.fetchWithOriginal(url);
                if (response) return response;
            } catch (error) {
                console.log(`Original fetch failed for ${url}:`, error.message);
            }
            
            console.log(`All fetch methods failed for: ${url}`);
            return null;
        } catch (error) {
            console.error(`Fetch failed for ${url}:`, error);
            return null;
        }
    }

    async fetchWithCORSBypass(url) {
        try {
            // Try to use the content script's overridden fetch
            const response = await fetch(url, {
                method: 'GET',
                mode: 'no-cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'User-Agent': 'WebsiteWordFinder/1.0 (CORS-Bypass)'
                }
            });
            
            if (response.type === 'opaque') {
                console.log(`Opaque response received for: ${url}`);
                return 'Opaque response - content not accessible';
            }
            
            if (response.ok) {
                const text = await response.text();
                return text;
            }
        } catch (error) {
            console.log(`CORS bypass failed for ${url}:`, error.message);
        }
        return null;
    }

    async fetchWithProxy(url) {
        const proxies = [
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://thingproxy.freeboard.io/fetch/${url}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];
        
        for (const proxyUrl of proxies) {
            try {
                console.log(`Trying proxy: ${proxyUrl}`);
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'WebsiteWordFinder/1.0 (Proxy)'
                    }
                });
                
                if (response.ok) {
                    const text = await response.text();
                    console.log(`Proxy success for ${url} via ${proxyUrl}`);
                    return text;
                }
            } catch (error) {
                console.log(`Proxy ${proxyUrl} failed for ${url}:`, error.message);
            }
        }
        return null;
    }

    async fetchWithNoCors(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'no-cors',
                credentials: 'omit'
            });
            
            if (response.type === 'opaque') {
                console.log(`No-cors opaque response for: ${url}`);
                return 'Opaque response - content not accessible';
            }
        } catch (error) {
            console.log(`No-cors failed for ${url}:`, error.message);
        }
        return null;
    }

    async fetchWithOriginal(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'User-Agent': 'WebsiteWordFinder/1.0 (Original)'
                }
            });
            
            if (response.ok) {
                const text = await response.text();
                return text;
            }
        } catch (error) {
            console.log(`Original fetch failed for ${url}:`, error.message);
        }
        return null;
    }

    async searchInContent(url, content) {
        const foundTerms = [];
        const title = this.extractTitle(content);
        const text = this.extractText(content);
        
        for (const term of this.searchTerms) {
            const regex = new RegExp(this.escapeRegex(term), 'gi');
            const matches = text.match(regex);
            
            if (matches) {
                foundTerms.push({
                    term: term,
                    count: matches.length,
                    url: url,
                    title: title,
                    context: this.getContext(text, text.indexOf(matches[0]), 100)
                });
            }
        }
        
        if (foundTerms.length > 0) {
            this.foundResults.push(...foundTerms);
        }
        
        return foundTerms;
    }

    extractTitle(content) {
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : 'No title';
    }

    extractText(content) {
        // Remove script and style tags
        let text = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // Remove HTML tags
        text = text.replace(/<[^>]+>/g, ' ');
        
        // Decode HTML entities
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        text = text.replace(/&#39;/g, "'");
        
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }

    getContext(text, position, contextLength) {
        const start = Math.max(0, position - contextLength / 2);
        const end = Math.min(text.length, position + contextLength / 2);
        return text.substring(start, end);
    }

    extractLinks(content, baseUrl) {
        const links = new Set();
        const baseUrlObj = new URL(baseUrl);
        
        console.log(`🔍 Extracting links from ${baseUrl}`);
        
        // Multiple regex patterns for different types of links
        const linkPatterns = [
            /<a[^>]+href=["']([^"']+)["'][^>]*>/gi,
            /<link[^>]+href=["']([^"']+)["'][^>]*>/gi,
            /<script[^>]+src=["']([^"']+)["'][^>]*>/gi,
            /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
            /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi,
            /<form[^>]+action=["']([^"']+)["'][^>]*>/gi
        ];
        
        for (const pattern of linkPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const link = match[1];
                if (link && !link.startsWith('#')) {
                    try {
                        let fullUrl;
                        if (link.startsWith('http://') || link.startsWith('https://')) {
                            fullUrl = link;
                        } else if (link.startsWith('//')) {
                            fullUrl = baseUrlObj.protocol + link;
                        } else if (link.startsWith('/')) {
                            fullUrl = baseUrlObj.origin + link;
                        } else {
                            fullUrl = new URL(link, baseUrl).href;
                        }
                        
                        // Only include links from the same domain
                        const linkUrl = new URL(fullUrl);
                        if (linkUrl.hostname === baseUrlObj.hostname) {
                            links.add(fullUrl);
                            console.log(`🔗 Found link: ${fullUrl}`);
                        }
                    } catch (error) {
                        console.log(`Invalid link: ${link}`);
                    }
                }
            }
        }
        
        const linkArray = Array.from(links);
        console.log(`📊 Extracted ${linkArray.length} links from ${baseUrl}`);
        return linkArray;
    }

    shouldCrawlLink(url) {
        try {
            const urlObj = new URL(url);
            const baseUrlObj = new URL(this.baseUrl);
            
            // Only crawl same domain
            if (urlObj.hostname !== baseUrlObj.hostname) {
                return false;
            }
            
            // Skip common non-content paths
            const skipPatterns = [
                /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|jpg|jpeg|png|gif|svg|ico|css|js|xml|json|txt|log|csv)$/i,
                /\/api\//,
                /\/admin\//,
                /\/wp-admin\//,
                /\/wp-content\/uploads\//,
                /\/wp-includes\//,
                /\/node_modules\//,
                /\/vendor\//,
                /\/assets\//,
                /\/static\//,
                /\/media\//,
                /\/images\//,
                /\/css\//,
                /\/js\//,
                /\/fonts\//,
                /\/downloads\//,
                /\/temp\//,
                /\/cache\//,
                /\/backup\//,
                /\/old\//,
                /\/archive\//,
                /\/trash\//,
                /\/deleted\//,
                /\/draft\//,
                /\/preview\//,
                /\/test\//,
                /\/dev\//,
                /\/staging\//,
                /\/beta\//,
                /\/alpha\//,
                /\/debug\//,
                /\/error\//,
                /\/404\//,
                /\/500\//,
                /\/maintenance\//,
                /\/under-construction\//,
                /\/coming-soon\//,
                /\/privacy\//,
                /\/terms\//,
                /\/legal\//,
                /\/sitemap\//,
                /\/robots\//,
                /\/feed\//,
                /\/rss\//,
                /\/atom\//,
                /\/sitemap\.xml$/,
                /\/robots\.txt$/,
                /\/favicon\.ico$/,
                /\/apple-touch-icon/,
                /\/manifest\.json$/,
                /\/service-worker\.js$/,
                /\/sw\.js$/,
                /\/offline\.html$/,
                /\/404\.html$/,
                /\/500\.html$/,
                /\/error\.html$/,
                /\/maintenance\.html$/,
                /\/under-construction\.html$/,
                /\/coming-soon\.html$/,
                /\/privacy\.html$/,
                /\/terms\.html$/,
                /\/legal\.html$/,
                /\/sitemap\.html$/,
                /\/robots\.html$/,
                /\/feed\.html$/,
                /\/rss\.html$/,
                /\/atom\.html$/
            ];
            
            for (const pattern of skipPatterns) {
                if (pattern.test(urlObj.pathname)) {
                    return false;
                }
            }
            
            // Skip URLs with tracking parameters
            const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
            for (const param of trackingParams) {
                if (urlObj.searchParams.has(param)) {
                    return false;
                }
            }
            
            // Skip very long URLs
            if (url.length > 500) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.log(`Error checking link ${url}:`, error.message);
            return false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    stopSearch() {
        console.log('⏹️ Stopping search...');
        this.isRunning = false;
        this.searchInstance = null;
    }
    
    restartSearch() {
        console.log('🔄 Restarting search...');
        this.stopSearch();
        // The restart will be handled by the UI event handler
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize when panel loads
document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const toggleBtn = document.getElementById('toggleBtn');
    const searchBtn = document.getElementById('searchBtn');
    const stopBtn = document.getElementById('stopBtn');
    const restartBtn = document.getElementById('restartBtn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const resultsContent = document.getElementById('resultsContent');
    const pageList = document.getElementById('pageList');
    const pageListContent = document.getElementById('pageListContent');
    const pageCount = document.getElementById('pageCount');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let corsBypassEnabled = false;
    let wordFinder = new WebsiteWordFinder();
    let pages = new Map(); // Store page status for real-time updates
    
    // Initialize download button (hidden by default)
    downloadBtn.style.display = 'none';
    
    // Show page list by default
    pageList.style.display = 'block';
    pageListContent.innerHTML = '<div class="page-item not-found"><div class="page-url">No pages found yet</div><div class="page-status not-found">Ready</div></div>';
    pageCount.textContent = '0 pages';
    
    // Function to inject content script if not already injected
    async function ensureContentScriptInjected() {
        try {
            const tabs = await new Promise((resolve, reject) => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(tabs);
                    }
                });
            });
            
            if (tabs && tabs[0]) {
                // Try to inject the content script
                await new Promise((resolve, reject) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.log('Content script already injected or failed:', chrome.runtime.lastError.message);
                        } else {
                            console.log('✅ Content script injected successfully');
                        }
                        resolve();
                    });
                });
            }
        } catch (error) {
            console.log('Failed to inject content script:', error.message);
        }
    }
    
    // Inject content script when panel opens
    ensureContentScriptInjected();
    
    // Function to update page list in real-time
    function updatePageList(url, status, foundTerms) {
        const pageKey = url;
        const pageData = {
            url: url,
            status: status,
            foundTerms: foundTerms || [],
            timestamp: new Date().toISOString()
        };
        
        pages.set(pageKey, pageData);
        
        // Update the page list display
        updatePageListDisplay();
        
        // Update page count
        pageCount.textContent = `${pages.size} pages`;
        
        // Send update to background script with error handling
        try {
            chrome.runtime.sendMessage({
                type: 'UPDATE_PAGE',
                url: url,
                status: status,
                foundTerms: foundTerms
            }, function(response) {
                if (chrome.runtime.lastError) {
                    // Ignore errors when panel is closed
                    console.log('Message port closed (panel likely closed):', chrome.runtime.lastError.message);
                }
            });
        } catch (error) {
            // Ignore errors when panel is closed
            console.log('Failed to send message to background script:', error.message);
        }
    }
    
    function updatePageListDisplay() {
        let html = '';
        if (pages.size === 0) {
            html = '<div class="page-item not-found"><div class="page-url">No pages found yet</div><div class="page-status not-found">Ready</div></div>';
        } else {
            pages.forEach((pageData, url) => {
                const statusClass = pageData.status;
                const statusText = pageData.status === 'found' ? 'Found' : 
                                 pageData.status === 'not-found' ? 'No Match' : 
                                 pageData.status === 'processing' ? 'Processing' : 'Error';
                
                html += `
                    <div class="page-item ${statusClass}">
                        <div class="page-url" title="${url}">${url}</div>
                        <div class="page-status ${statusClass}">${statusText}</div>
                    </div>
                `;
            });
        }
        
        pageListContent.innerHTML = html;
        
        // Scroll to bottom to show latest pages
        if (pageListContent.scrollHeight > pageListContent.clientHeight) {
            pageListContent.scrollTop = pageListContent.scrollHeight;
        }
    }
    
    // Function to load existing search state
    function loadExistingSearch() {
        try {
            chrome.runtime.sendMessage({ type: 'GET_SEARCH_STATUS' }, function(response) {
                if (chrome.runtime.lastError) {
                    // Ignore errors when panel is closed
                    console.log('Message port closed (panel likely closed):', chrome.runtime.lastError.message);
                    return;
                }
                
                if (response && response.search && response.search.isRunning) {
                    // Restore search state
                    const search = response.search;
                    pages = new Map(search.pages || []);
                    updatePageListDisplay();
                    pageCount.textContent = `${pages.size} pages`;
                    pageList.style.display = 'block';
                    
                    // Update UI to show search is running
                    searchBtn.disabled = true;
                    searchBtn.textContent = '🔍 Search Running...';
                    loadingDiv.style.display = 'block';
                    
                    console.log('🔍 Restored existing search:', search);
                }
            });
        } catch (error) {
            // Ignore errors when panel is closed
            console.log('Failed to load existing search:', error.message);
        }
    }
    
    // Load existing search state when panel opens
    loadExistingSearch();
    
    // Get current tab URL and set it as the default
    try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.error('Error getting current tab:', chrome.runtime.lastError);
                document.getElementById('baseUrl').value = 'Error detecting website';
                document.getElementById('baseUrl').disabled = true;
                
                const urlNote = document.createElement('div');
                urlNote.className = 'error';
                urlNote.innerHTML = `<strong>Error:</strong> Failed to detect current website. Please refresh the page and try again.`;
                document.getElementById('baseUrl').parentNode.appendChild(urlNote);
                return;
            }
            
            if (tabs && tabs[0] && tabs[0].url) {
                const currentUrl = tabs[0].url;
                console.log('Current tab URL:', currentUrl);
                
                // Extract the base URL (protocol + hostname)
                try {
                    const urlObj = new URL(currentUrl);
                    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
                    document.getElementById('baseUrl').value = baseUrl;
                    console.log('Set base URL:', baseUrl);
                } catch (error) {
                    console.error('Error parsing URL:', error);
                    document.getElementById('baseUrl').value = currentUrl;
                }
            } else {
                console.log('No active tab or URL found');
                document.getElementById('baseUrl').value = 'No website detected';
                document.getElementById('baseUrl').disabled = true;
            }
        });
    } catch (error) {
        console.error('Error in URL detection:', error);
        document.getElementById('baseUrl').value = 'Error detecting website';
        document.getElementById('baseUrl').disabled = true;
    }
    
    // Handle CORS bypass toggle
    toggleBtn.addEventListener('click', function() {
        try {
            const newStatus = !corsBypassEnabled;
            
            // Update the button text and status
            toggleBtn.textContent = newStatus ? 'Disable CORS Bypass' : 'Enable CORS Bypass';
            toggleBtn.className = `toggle-btn ${newStatus ? 'disable' : 'enable'}`;
            
            // Update the status display
            updateCORSStatus(newStatus);
            
            // Send message to content script with improved error handling
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (chrome.runtime.lastError) {
                    console.error('Error getting tabs for CORS message:', chrome.runtime.lastError);
                    return;
                }
                
                if (tabs[0]) {
                    // First, ensure content script is injected
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    }, () => {
                        // Then send the message
                        try {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                type: newStatus ? 'ENABLE_CORS_BYPASS' : 'DISABLE_CORS_BYPASS'
                            }, function(response) {
                                if (chrome.runtime.lastError) {
                                    console.log('Content script not ready for CORS message:', chrome.runtime.lastError.message);
                                    // Try to inject again and retry
                                    setTimeout(() => {
                                        chrome.scripting.executeScript({
                                            target: { tabId: tabs[0].id },
                                            files: ['content.js']
                                        }, () => {
                                            setTimeout(() => {
                                                chrome.tabs.sendMessage(tabs[0].id, {
                                                    type: newStatus ? 'ENABLE_CORS_BYPASS' : 'DISABLE_CORS_BYPASS'
                                                }, function(response) {
                                                    if (chrome.runtime.lastError) {
                                                        console.log('Content script still not ready after retry:', chrome.runtime.lastError.message);
                                                    } else {
                                                        console.log('✅ CORS bypass message sent successfully');
                                                    }
                                                });
                                            }, 100);
                                        });
                                    }, 100);
                                } else {
                                    console.log('✅ CORS bypass message sent successfully');
                                }
                            });
                        } catch (error) {
                            console.log('Failed to send CORS message to content script:', error.message);
                        }
                    });
                }
            });
            
            corsBypassEnabled = newStatus;
            console.log('🔓 CORS bypass ' + (newStatus ? 'enabled' : 'disabled'));
        } catch (error) {
            console.error('Error in CORS bypass toggle:', error);
        }
    });
    
    // Handle search button
    searchBtn.addEventListener('click', async function() {
        const baseUrl = document.getElementById('baseUrl').value.trim();
        const searchTerms = document.getElementById('searchTerms').value.trim();
        const maxDepth = parseInt(document.getElementById('maxDepth').value);
        const maxPages = parseInt(document.getElementById('maxPages').value);
        const delay = parseInt(document.getElementById('delay').value);
        
        if (!searchTerms) {
            showError('Please enter search terms.');
            return;
        }
        
        if (!baseUrl || baseUrl === 'No website detected' || baseUrl === 'Error detecting website') {
            showError('No website URL detected. Please refresh the page and try again.');
            return;
        }
        
        // Clear previous results and pages
        pages.clear();
        resultsDiv.style.display = 'none';
        downloadBtn.style.display = 'none';
        pageList.style.display = 'block';
        pageListContent.innerHTML = '<div class="page-item not-found"><div class="page-url">Starting search...</div><div class="page-status processing">Processing</div></div>';
        pageCount.textContent = '0 pages';
        
        // Start search
        searchBtn.disabled = true;
        searchBtn.textContent = '🔍 Search Running...';
        stopBtn.style.display = 'block';
        restartBtn.style.display = 'none';
        loadingDiv.style.display = 'block';
        
        try {
            const terms = searchTerms.split(',').map(term => term.trim()).filter(term => term);
            const options = { 
                maxDepth, 
                maxPages, 
                delay,
                onPageUpdate: updatePageList // Pass the callback for real-time updates
            };
            
            console.log('🔍 Starting search...');
            console.log('Base URL:', baseUrl);
            console.log('Search terms:', terms);
            console.log('Options:', options);
            
            // Send search start to background script
            try {
                chrome.runtime.sendMessage({
                    type: 'START_SEARCH',
                    baseUrl: baseUrl,
                    searchTerms: terms,
                    options: options
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        // Ignore errors when panel is closed
                        console.log('Message port closed (panel likely closed):', chrome.runtime.lastError.message);
                        return;
                    }
                    
                    if (response && response.success) {
                        console.log('✅ Background search started');
                    }
                });
            } catch (error) {
                // Ignore errors when panel is closed
                console.log('Failed to start background search:', error.message);
            }
            
            // Start the search (this will continue in background even if panel closes)
            const results = await wordFinder.searchWebsite(baseUrl, terms, options);
            
            displayResults(results);
            
            // Reset button state
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Start Search';
            loadingDiv.style.display = 'none';
            
        } catch (error) {
            console.error('❌ Search failed:', error);
            let errorMessage = 'Search failed: ' + error.message;
            
            // Provide more specific error messages
            if (error.message.includes('CORS')) {
                errorMessage = 'CORS error: The website may have security restrictions. Try enabling CORS bypass.';
            } else if (error.message.includes('fetch')) {
                errorMessage = 'Network error: Unable to fetch website content. Check your internet connection.';
            } else if (error.message.includes('URL')) {
                errorMessage = 'Invalid URL: Please refresh the page and try again.';
            }
            
            showError(errorMessage);
            
            // Reset button state
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Start Search';
            stopBtn.style.display = 'none';
            restartBtn.style.display = 'none';
            loadingDiv.style.display = 'none';
        }
    });
    
    // Handle stop button
    stopBtn.addEventListener('click', function() {
        console.log('⏹️ Stop button clicked');
        
        // Stop the current search
        if (wordFinder) {
            wordFinder.stopSearch();
        }
        
        // Send stop message to background script
        try {
            chrome.runtime.sendMessage({
                type: 'STOP_SEARCH'
            }, function(response) {
                if (chrome.runtime.lastError) {
                    console.log('Message port closed (panel likely closed):', chrome.runtime.lastError.message);
                }
            });
        } catch (error) {
            console.log('Failed to send stop message:', error.message);
        }
        
        // Update UI
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Start Search';
        stopBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        loadingDiv.style.display = 'none';
        
        // Update page list to show stopped status
        pageListContent.innerHTML = '<div class="page-item not-found"><div class="page-url">Search stopped by user</div><div class="page-status not-found">Stopped</div></div>';
    });
    
    // Handle restart button
    restartBtn.addEventListener('click', async function() {
        console.log('🔄 Restart button clicked');
        
        // Hide restart button and show stop button
        restartBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        
        // Trigger a new search with the same parameters
        searchBtn.click();
    });
    
    function updateCORSStatus(isEnabled) {
        const statusDiv = document.getElementById('status');
        if (isEnabled) {
            statusDiv.textContent = 'CORS Bypass: Enabled';
            statusDiv.className = 'status enabled';
        } else {
            statusDiv.textContent = 'CORS Bypass: Disabled';
            statusDiv.className = 'status disabled';
        }
    }
    
    function showError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
        
        // Insert error message after the header
        const header = document.querySelector('.header');
        header.parentNode.insertBefore(errorDiv, header.nextSibling);
        
        // Auto-remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    function displayResults(results) {
        resultsDiv.style.display = 'block';
        resultsContent.innerHTML = '';
        
        if (results.error) {
            showError(results.error);
            return;
        }
        
        const summary = results.summary;
        const resultItems = results.results;
        
        let html = `
            <h3>Search Results</h3>
            <div class="result-item">
                <h4>Summary</h4>
                <p><strong>Total Results:</strong> ${summary.totalResults}</p>
                <p><strong>Pages Crawled:</strong> ${summary.totalPages}</p>
                <p><strong>Search Terms:</strong> ${summary.searchTerms.join(', ')}</p>
                <p><strong>Base URL:</strong> ${summary.baseUrl}</p>
            </div>
        `;
        
        if (resultItems.length === 0) {
            html += '<div class="result-item"><p>No matches found for the specified search terms.</p></div>';
        } else {
            resultItems.forEach((result, index) => {
                html += `
                    <div class="result-item">
                        <h4>${result.title}</h4>
                        <p><strong>URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>
                        <p><strong>Term:</strong> ${result.term}</p>
                        <p><strong>Count:</strong> ${result.count} occurrence(s)</p>
                        <p><strong>Context:</strong> ...${result.context}...</p>
                    </div>
                `;
            });
        }
        
        resultsContent.innerHTML = html;
        
        // Show download button if there are results
        if (resultItems.length > 0) {
            downloadBtn.style.display = 'block';
            downloadBtn.onclick = () => downloadCSV(results);
        } else {
            downloadBtn.style.display = 'none';
        }
    }
    
    function downloadCSV(results) {
        try {
            const summary = results.summary;
            const resultItems = results.results;
            
            if (!resultItems || resultItems.length === 0) {
                showError('No results to download');
                return;
            }
            
            // Create CSV header
            let csvContent = 'data:text/csv;charset=utf-8,';
            csvContent += 'Title,URL,Search Term,Count,Context,Base URL,Total Pages Crawled,Search Terms\n';
            
            // Add data rows
            resultItems.forEach((result) => {
                const title = `"${(result.title || 'No Title').replace(/"/g, '""')}"`;
                const url = `"${result.url || ''}"`;
                const term = `"${result.term || ''}"`;
                const count = result.count || 0;
                const context = `"${(result.context || '').replace(/"/g, '""')}"`;
                const baseUrl = `"${summary.baseUrl || ''}"`;
                const totalPages = summary.totalPages || 0;
                const searchTerms = `"${(summary.searchTerms || []).join(', ')}"`;
                
                csvContent += `${title},${url},${term},${count},${context},${baseUrl},${totalPages},${searchTerms}\n`;
            });
            
            // Create a more user-friendly filename
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
            const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
            const domain = summary.baseUrl ? new URL(summary.baseUrl).hostname.replace(/\./g, '_') : 'website';
            const filename = `word_finder_results_${domain}_${dateStr}_${timeStr}.csv`;
            
            // Create and trigger download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('✅ CSV download initiated:', filename);
        } catch (error) {
            console.error('❌ Error generating CSV:', error);
            showError('Failed to generate CSV download: ' + error.message);
        }
    }
});
