const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../utils/logger');

class TermSpider {
  constructor(config) {
    this.config = {
      targetUrl: config.targetUrl,
      keywords: config.keywords,
      maxPages: config.maxPages || 50,
      requestDelay: config.requestDelay || 1000,
      scanId: config.scanId,
      storageService: config.storageService,
      firestoreService: config.firestoreService,
      userAgent: 'TermSpider/2.0 (Web Scraping Tool)',
      timeout: 30000,
      maxRetries: 3
    };

    this.results = {
      matches: [],
      pagesScanned: 0,
      totalMatches: 0,
      errors: [],
      startTime: new Date(),
      endTime: null,
      status: 'pending'
    };

    this.visitedUrls = new Set();
    this.pendingUrls = new Set();
    this.rateLimiter = new RateLimiterMemory({
      keyGenerator: () => 'global',
      points: 10,
      duration: 1
    });

    // Initialize services
    this.storageService = config.storageService;
    this.firestoreService = config.firestoreService;
  }

  async startScan() {
    try {
      logger.info(`Starting scan ${this.config.scanId} for ${this.config.targetUrl}`);
      
      // Update status to running
      await this.updateStatus('running');
      
      // Initialize with the main URL
      this.pendingUrls.add(this.config.targetUrl);
      
      // Process URLs until we run out or hit the limit
      while (this.pendingUrls.size > 0 && 
             (this.config.maxPages === -1 || this.results.pagesScanned < this.config.maxPages)) {
        
        const currentUrl = Array.from(this.pendingUrls)[0];
        this.pendingUrls.delete(currentUrl);
        
        if (this.visitedUrls.has(currentUrl)) {
          continue;
        }
        
        this.visitedUrls.add(currentUrl);
        this.results.pagesScanned++;
        
        logger.info(`Scanning page ${this.results.pagesScanned}: ${currentUrl}`);
        
        try {
          // Rate limiting
          await this.rateLimiter.consume('global');
          
          // Scan the current page
          const pageResults = await this.scanPage(currentUrl);
          
          // Add results
          this.results.matches.push(...pageResults.matches);
          this.results.totalMatches += pageResults.matches.length;
          
          // Add new URLs to pending list
          pageResults.newUrls.forEach(url => {
            if (!this.visitedUrls.has(url) && this.isValidUrl(url)) {
              this.pendingUrls.add(url);
            }
          });
          
          // Update progress
          await this.updateProgress();
          
          // Respectful delay
          await this.delay(this.config.requestDelay);
          
        } catch (error) {
          this.results.errors.push({
            url: currentUrl,
            error: error.toString(),
            timestamp: new Date()
          });
          logger.error(`Error scanning ${currentUrl}: ${error.toString()}`);
        }
      }
      
      this.results.endTime = new Date();
      this.results.status = 'completed';
      
      // Save final results
      await this.saveResults();
      
      logger.info(`Scan ${this.config.scanId} completed: ${this.results.totalMatches} matches found`);
      return this.results;
      
    } catch (error) {
      this.results.status = 'failed';
      this.results.endTime = new Date();
      await this.updateStatus('failed');
      logger.error(`Scan ${this.config.scanId} failed:`, error);
      throw error;
    }
  }

  async scanPage(url) {
    const pageResults = {
      matches: [],
      newUrls: []
    };
    
    try {
      // Try with axios first (faster for static content)
      let html = await this.fetchWithAxios(url);
      
      // If axios fails or returns limited content, try with Puppeteer
      if (!html || html.length < 1000) {
        html = await this.fetchWithPuppeteer(url);
      }
      
      if (!html) {
        throw new Error('Failed to fetch page content');
      }
      
      // Extract text content
      const textContent = this.extractTextContent(html);
      
      // Search for keywords
      this.config.keywords.forEach(keyword => {
        const matches = this.findKeywordMatches(textContent, keyword, url);
        pageResults.matches.push(...matches);
      });
      
      // Extract links for further scanning
      pageResults.newUrls = this.extractLinks(html, url);
      
    } catch (error) {
      throw new Error(`Failed to scan page: ${error.toString()}`);
    }
    
    return pageResults;
  }

  async fetchWithAxios(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: this.config.timeout,
        maxRedirects: 5,
        validateStatus: (status) => status < 400
      });
      
      return response.data;
    } catch (error) {
      logger.warn(`Axios fetch failed for ${url}: ${error.message}`);
      return null;
    }
  }

  async fetchWithPuppeteer(url) {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      
      const page = await browser.newPage();
      
      // Set user agent
      await page.setUserAgent(this.config.userAgent);
      
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to page
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: this.config.timeout 
      });
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      // Get the HTML content
      const html = await page.content();
      
      return html;
      
    } catch (error) {
      logger.warn(`Puppeteer fetch failed for ${url}: ${error.message}`);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  extractTextContent(html) {
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, noscript').remove();
    
    // Get text content
    let text = $('body').text();
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  findKeywordMatches(text, keyword, url) {
    const matches = [];
    const regex = new RegExp(keyword, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Get context around the match
      const start = Math.max(0, match.index - 100);
      const end = Math.min(text.length, match.index + keyword.length + 100);
      const context = text.substring(start, end);
      
      matches.push({
        keyword: keyword,
        url: url,
        position: match.index,
        context: context,
        timestamp: new Date(),
        scanId: this.config.scanId
      });
    }
    
    return matches;
  }

  extractLinks(html, baseUrl) {
    const links = [];
    const $ = cheerio.load(html);
    
    $('a[href]').each((i, element) => {
      const href = $(element).attr('href');
      if (href) {
        const fullUrl = this.resolveUrl(href, baseUrl);
        if (fullUrl && this.isValidUrl(fullUrl)) {
          links.push(fullUrl);
        }
      }
    });
    
    return links;
  }

  resolveUrl(href, baseUrl) {
    try {
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return href;
      }
      
      if (href.startsWith('/')) {
        const url = new URL(baseUrl);
        return `${url.protocol}//${url.host}${href}`;
      }
      
      if (href.startsWith('./') || href.startsWith('../') || !href.startsWith('#')) {
        const base = new URL(baseUrl);
        const resolved = new URL(href, base);
        return resolved.toString();
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      
      // Only scan the same domain
      const targetDomain = new URL(this.config.targetUrl).hostname;
      if (urlObj.hostname !== targetDomain) {
        return false;
      }
      
      // Skip common non-content URLs
      const skipPatterns = [
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|exe|dmg)$/i,
        /\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i,
        /mailto:/i,
        /tel:/i,
        /javascript:/i,
        /#/i
      ];
      
      for (const pattern of skipPatterns) {
        if (pattern.test(url)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateStatus(status) {
    try {
      await this.firestoreService.updateScanStatus(this.config.scanId, status);
    } catch (error) {
      logger.error('Error updating status:', error);
    }
  }

  async updateProgress() {
    try {
      const progress = {
        pagesScanned: this.results.pagesScanned,
        totalMatches: this.results.totalMatches,
        pendingUrls: this.pendingUrls.size,
        visitedUrls: this.visitedUrls.size,
        lastUpdated: new Date()
      };
      
      await this.firestoreService.updateScanProgress(this.config.scanId, progress);
    } catch (error) {
      logger.error('Error updating progress:', error);
    }
  }

  async saveResults() {
    try {
      // Save to Firestore
      await this.firestoreService.saveScanResults(this.config.scanId, this.results);
      
      // Save to Cloud Storage
      const jsonData = JSON.stringify(this.results, null, 2);
      await this.storageService.uploadResults(jsonData, this.config.scanId);
      
      logger.info(`Results saved for scan ${this.config.scanId}`);
    } catch (error) {
      logger.error('Error saving results:', error);
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { TermSpider }; 