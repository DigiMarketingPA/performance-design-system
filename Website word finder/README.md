# 🔍 Website Word Finder - Chrome Extension

A powerful Chrome extension that finds specific words or phrases across entire websites, including all subpages. Perfect for content audits, compliance checks, and finding outdated information.

## 🚀 Features

### ✅ **Real-Time Page Tracking**
- **Live Updates** - See pages as they're being discovered and processed
- **Status Indicators** - Color-coded status (Processing, Found, No Match)
- **Page Count** - Real-time count of pages discovered
- **Auto-scroll** - Automatically scrolls to show latest pages

### ✅ **Background Processing**
- **Persistent Search** - Search continues running even when popup is closed
- **State Restoration** - Restores search state when popup reopens
- **Progress Tracking** - Maintains progress across popup sessions

### ✅ **Advanced Search**
- **Full Site Crawling** - Automatically discovers and crawls all subpages
- **Multiple Search Terms** - Search for multiple words/phrases at once
- **Configurable Settings** - Adjust crawl depth, page limits, and delays
- **Detailed Results** - Get page titles, URLs, and context for each match

### ✅ **CORS Bypass**
- **Automatic CORS Handling** - No manual configuration needed
- **Multiple Bypass Methods** - Tries different approaches automatically
- **Cross-origin Support** - Works with any website
- **Respectful Crawling** - Includes delays and proper headers

## 🎯 **Quick Start**

1. **Install Extension** - Load the extension in Chrome
2. **Navigate to Website** - Go to any website you want to search
3. **Click Extension Icon** - Opens the side panel (not a popup!)
4. **Enter Search Terms** - Comma-separated terms like "warranty, service"
5. **Start Search** - Watch real-time results as pages are crawled

## 🆕 **Latest Update: Side Panel Interface**

### **What's New**
- 🎯 **Side Panel Instead of Popup** - Extension now opens as a persistent side panel
- 🔄 **Stays Open** - Panel remains open when you click away to console or other tabs
- 📏 **Full Height** - Takes advantage of the full browser height for better visibility
- 🎨 **Optimized Layout** - Redesigned specifically for side panel viewing
- 🚀 **Better UX** - No more losing the interface when clicking elsewhere

### **Why Side Panel?**
- ✅ **Persistent Interface** - Perfect for debugging and monitoring searches
- ✅ **More Space** - Full height allows for better content organization
- ✅ **Better Workflow** - Can keep panel open while working in other tabs
- ✅ **Professional Feel** - More like a developer tool than a simple popup

## 🎨 **Interface**

### **Side Panel Design**
- ✅ **Persistent Panel** - Opens on the right side, stays open when you click away
- ✅ **Full Height** - Takes advantage of full browser height
- ✅ **Real-Time Updates** - See pages being discovered and processed live
- ✅ **Clean Layout** - Optimized for side panel viewing
- ✅ **Auto-Detection** - Automatically detects current website URL

### **Key Features**
- 🔍 **Real-Time Page List** - Always visible, shows pages as they're found
- 🎯 **Status Indicators** - Color-coded status (Processing, Found, No Match)
- 📊 **Page Counter** - Real-time count of pages discovered
- 🔄 **Background Processing** - Search continues even if panel is closed
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

### **Main Interface**
- **Current website display** - Automatically detected from the current page
- **Search terms textarea** - Enter multiple terms separated by commas
- **Settings panel** - Adjust crawl depth, page limits, and delays
- **CORS bypass toggle** - Enable/disable CORS bypass functionality
- **Search button** - Start the search process

### **Real-Time Page List**
- **Live page tracking** - See pages as they're discovered
- **Status indicators** - Processing, Found, No Match
- **Page count** - Real-time count of pages
- **Auto-scroll** - Shows latest pages automatically

### **Results Display**
- **Summary section** - Shows total results, pages crawled, and search terms
- **Individual results** - Each match with page title, URL, and context
- **Real-time updates** - Results appear as they're found

## 🔧 Advanced Usage

### **Search Settings**

- **Max Depth (1-5)**: How many levels deep to crawl
  - `1` = Only the main page
  - `3` = Main page + 2 levels deep (recommended)
  - `5` = Very deep crawl (may take longer)

- **Max Pages (50-500)**: Maximum number of pages to crawl
  - `50` = Quick search
  - `100` = Standard search (recommended)
  - `500` = Comprehensive search

- **Delay (500-3000ms)**: Time between requests
  - `500ms` = Fast (may be less respectful)
  - `1000ms` = Standard (recommended)
  - `3000ms` = Slow (very respectful)

### **Search Tips**

1. **Use specific terms** - "warranty" instead of "warr"
2. **Multiple terms** - Separate with commas: "privacy, terms, contact"
3. **Start small** - Test with depth 1-2 first
4. **Check results** - Look at the summary to see how many pages were crawled

## 🔍 Troubleshooting

### **Extension Not Working?**

1. **Check installation:**
   - Go to `chrome://extensions/`
   - Make sure the extension is enabled
   - Check for any error messages

2. **Refresh the page:**
   - Reload the page you want to search
   - Try clicking the extension icon again

3. **Enable CORS Bypass:**
   - Click the "Enable CORS Bypass" button
   - This is required for cross-origin requests

### **Search Not Finding Pages?**

1. **Check CORS Bypass:**
   - Make sure CORS bypass is enabled
   - Some websites may still block requests

2. **Adjust settings:**
   - Try increasing the max depth
   - Increase the max pages limit
   - Reduce the delay if the site is slow

3. **Check search terms:**
   - Make sure terms are spelled correctly
   - Try different variations of the terms

## 📁 Project Structure

```
Side Projects/Website word finder/
├── chrome-extension/           # Main extension files
│   ├── manifest.json          # Extension configuration
│   ├── popup.html             # Extension popup interface
│   ├── popup.js               # Popup functionality (integrated)
│   ├── background.js          # Background script
│   ├── content.js             # Content script for CORS bypass
│   ├── icon16.png             # Extension icons
│   ├── icon48.png
│   ├── icon128.png
│   └── README.md              # Extension-specific docs
├── INTEGRATED-EXTENSION.md    # Integration guide
└── README.md                  # This comprehensive documentation
```

## 🎯 Use Cases

### **Content Audits**
- Find outdated information across entire websites
- Locate specific terms that need updating
- Audit compliance-related content

### **SEO Optimization**
- Find missing meta descriptions
- Locate duplicate content
- Check for specific keywords

### **Compliance Checks**
- Find privacy policy references
- Locate terms of service mentions
- Check for regulatory compliance terms

### **Content Management**
- Find specific product information
- Locate pricing information
- Check for contact information

## 🔒 Privacy & Security

- **Local Processing** - All search processing happens locally
- **No Data Collection** - No data is sent to external servers
- **Respectful Crawling** - Includes delays and proper headers
- **CORS Compliant** - Uses proper CORS bypass methods

## 🚀 Performance

- **Background Processing** - Search continues when popup is closed
- **Real-time Updates** - See results as they're found
- **Efficient Crawling** - Smart link discovery and filtering
- **Memory Efficient** - Proper cleanup and state management

## 🔧 Technical Details

### **Recent Fixes & Improvements**

#### **Side Panel Implementation**
```javascript
// Manifest configuration for side panel
{
  "permissions": ["sidePanel"],
  "side_panel": {
    "default_path": "panel.html"
  }
}

// Background script handles panel opening
chrome.action.onClicked.addListener(async (tab) => {
    await chrome.sidePanel.open({ windowId: tab.windowId });
});
```

#### **Real-Time Page Tracking**
```javascript
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
    updatePageListDisplay();
    pageCount.textContent = `${pages.size} pages`;
}
```

#### **Background Processing**
```javascript
// Background script handles search state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_SEARCH') {
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
        chrome.storage.local.set({ currentSearch: {...} });
    }
});
```

#### **CORS Bypass**
```javascript
// Automatic content script injection
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
```

#### **UI Improvements**
- ✅ **Fixed Scrolling** - Removed redundant scrollbars
- ✅ **Clean Interface** - Only one scrollbar in the page list content
- ✅ **Better Layout** - Improved content organization

#### **Error Handling**
- ✅ **Message Port Errors** - Fixed "Unchecked runtime.lastError" messages
- ✅ **Async Response Errors** - Fixed "A listener indicated an asynchronous response" errors
- ✅ **Graceful Degradation** - Extension continues working when popup closes
- ✅ **Better UX** - No error messages in console
- ✅ **Robust Communication** - Handles all message port scenarios

### **Key Technical Features**

#### **Real-Time Page Tracking**
```javascript
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
    updatePageListDisplay();
    pageCount.textContent = `${pages.size} pages`;
}
```

#### **Background Processing**
```javascript
// Background script handles search state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_SEARCH') {
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
        chrome.storage.local.set({ currentSearch: {...} });
    }
});
```

#### **CORS Bypass**
```javascript
// Automatic content script injection
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
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Ready to find words across entire websites? Install the extension and start searching!** 🎯✅
