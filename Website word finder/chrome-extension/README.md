# Website Word Finder - CORS Bypass Chrome Extension

This Chrome extension provides CORS bypass functionality **and** a complete website word finder tool integrated directly into the extension side panel. No need to open separate pages - everything works right from the extension!

## 🚀 Installation

### Method 1: Load Unpacked Extension (Recommended)

1. **Download the extension files:**
   - Download all files from the `chrome-extension` folder
   - Keep the folder structure intact

2. **Open Chrome Extensions:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
   - The extension should now appear in your extensions list

4. **Verify installation:**
   - Look for "Website Word Finder - CORS Bypass" in your extensions
   - You should see the extension icon in your toolbar

### Method 2: Create Icons (Optional)

The extension already includes PNG icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

If you want to use your own custom icons, simply replace these PNG files with your own versions of the same sizes.

## 🔧 Usage

### Step 1: Open the Extension
1. Click the extension icon in your Chrome toolbar
2. The side panel will open with the full website word finder interface

### Step 2: Enable CORS Bypass
1. Click "Enable CORS Bypass" in the side panel
2. The status should change to "Enabled"

### Step 3: Search for Words
1. **Current Website:** Automatically detected from the page you're on
2. **Enter Search Terms:** Enter words or phrases separated by commas (e.g., `warranty, service, maintenance`)
3. **Adjust Settings (optional):**
   - **Max Depth:** How many levels deep to crawl (1-5, default: 3)
   - **Max Pages:** Maximum number of pages to crawl (50-500, default: 100)
   - **Delay:** Time between requests in milliseconds (500-3000, default: 1000)
4. **Click "Start Search"**
5. Watch the results appear in real-time!

### Step 4: Control the Search
- **⏹️ Stop Search:** Click to immediately stop the current search
- **🔄 Restart Search:** Click to restart the search with the same parameters
- **📊 Download CSV:** Click to download results as a CSV file (appears when results are found)

### Step 5: View Results
- Results show all found terms with context
- Each result includes the page title, URL, and surrounding text
- Summary shows total results and pages crawled

## 🎯 How It Works

The extension works by:

1. **Integrated Interface**: Full website word finder tool built into the popup
2. **CORS Bypass**: Automatically handles cross-origin requests
3. **Smart Crawling**: Discovers and crawls all subpages within the site
4. **Multiple Methods**: Tries different CORS bypass approaches automatically
5. **Real-time Results**: Shows results as they're found

## 🔍 Features

### ✅ What You Get

- **🔍 Full Site Crawling**: Crawl entire websites, not just single pages
- **🚀 Integrated Tool**: No need to open separate pages
- **🔓 CORS Bypass**: Overcome browser security restrictions
- **📊 Detailed Results**: Find words with context and page locations
- **⚡ Real-time Search**: See results as they're discovered
- **🎨 Modern Interface**: Clean, responsive design
- **📄 CSV Export**: Download search results as CSV files
- **⏹️ Stop/Restart**: Control search execution with stop and restart buttons

### 🎯 Search Capabilities

- **Multiple Terms**: Search for multiple words/phrases at once
- **Context Display**: See surrounding text for each match
- **Page Information**: Get page titles and URLs for each result
- **Smart Filtering**: Skip non-content pages automatically
- **Configurable Limits**: Adjust crawl depth and page limits

## 🔍 Troubleshooting

### Extension Not Working?
1. **Check if enabled**: Click the extension icon and verify CORS bypass shows "Enabled"
2. **Refresh the page**: Reload the page after enabling the extension
3. **Check console**: Open browser console (F12) and look for CORS bypass messages
4. **Reinstall**: Try removing and re-adding the extension

### Still Only 1 Page Crawled?
1. **Check console logs**: Look for CORS bypass messages in the console
2. **Verify extension**: Make sure the extension is enabled and active
3. **Try different site**: Test with a different website to see if it's site-specific
4. **Check permissions**: Make sure the extension has permission to access the site

### CSV Download Not Working?
1. **Check if results exist**: Make sure the search completed and found results
2. **Check browser settings**: Ensure downloads are allowed for the extension
3. **Try different browser**: Some browsers may block automatic downloads

### Console Errors?
- Look for messages starting with 🔓, 🔄, ✅, or ❌
- These indicate the extension is working and show what's happening
- If you see ❌ messages, the CORS bypass methods are failing

## 🛡️ Security Notes

- **Only enable when needed**: Disable the extension when not using the Website Word Finder
- **Use responsibly**: Only use on websites you own or have permission to crawl
- **Respect robots.txt**: The tool doesn't currently respect robots.txt, so be mindful
- **Rate limiting**: The tool includes delays to be respectful to servers

## 🔄 Updates

To update the extension:
1. Download the latest files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Or remove and re-add the extension

## 📞 Support

If you encounter issues:

1. **Check the console** (F12) for error messages
2. **Verify installation** by following the steps above
3. **Test with a simple site** first
4. **Check file permissions** and folder structure

## 🎉 Success Indicators

When working correctly, you should see:

- ✅ Extension shows "Enabled" status
- 🔄 Console shows "CORS bypass attempt" messages
- 📊 Extension side panel crawls multiple pages
- 🎯 Search results from across the entire site
- 📈 Real-time results appearing in the side panel
- 📄 CSV download button appears when results are found

## 🎯 Quick Start Example

1. **Install extension** (follow installation steps above)
2. **Click extension icon** in toolbar
3. **Enable CORS Bypass** (click the toggle button)
4. **Enter website URL**: `https://example.com`
5. **Enter search terms**: `privacy, terms, contact`
6. **Click "Start Search"**
7. **Watch results appear** in real-time!

**That's it!** You now have a powerful website word finder that works directly from your browser extension! 🎯 