const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { TermSpider } = require('./services/termSpider');
const { StorageService } = require('./services/storageService');
const { FirestoreService } = require('./services/firestoreService');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main scanning endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { 
      targetUrl, 
      keywords, 
      maxPages = 50, 
      requestDelay = 1000,
      scanId = null 
    } = req.body;

    // Validation
    if (!targetUrl || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: 'Missing required fields: targetUrl and keywords (array)'
      });
    }

    logger.info(`Starting scan for ${targetUrl} with keywords: ${keywords.join(', ')}`);

    // Initialize services
    const storageService = new StorageService();
    const firestoreService = new FirestoreService();
    
    // Create scan ID if not provided
    const scanIdFinal = scanId || `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Initialize TermSpider
    const spider = new TermSpider({
      targetUrl,
      keywords,
      maxPages,
      requestDelay,
      scanId: scanIdFinal,
      storageService,
      firestoreService
    });

    // Start the scan (non-blocking)
    spider.startScan()
      .then(results => {
        logger.info(`Scan ${scanIdFinal} completed: ${results.totalMatches} matches found`);
      })
      .catch(error => {
        logger.error(`Scan ${scanIdFinal} failed:`, error);
      });

    // Return immediately with scan ID
    res.json({
      success: true,
      scanId: scanIdFinal,
      message: 'Scan started successfully',
      statusUrl: `/api/status/${scanIdFinal}`
    });

  } catch (error) {
    logger.error('Error starting scan:', error);
    res.status(500).json({
      error: 'Failed to start scan',
      details: error.message
    });
  }
});

// Get scan status
app.get('/api/status/:scanId', async (req, res) => {
  try {
    const { scanId } = req.params;
    const firestoreService = new FirestoreService();
    
    const status = await firestoreService.getScanStatus(scanId);
    
    if (!status) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    
    res.json(status);
  } catch (error) {
    logger.error('Error getting scan status:', error);
    res.status(500).json({
      error: 'Failed to get scan status',
      details: error.message
    });
  }
});

// Get scan results
app.get('/api/results/:scanId', async (req, res) => {
  try {
    const { scanId } = req.params;
    const { format = 'json' } = req.query;
    
    const firestoreService = new FirestoreService();
    const storageService = new StorageService();
    
    const results = await firestoreService.getScanResults(scanId);
    
    if (!results) {
      return res.status(404).json({ error: 'Results not found' });
    }
    
    if (format === 'csv') {
      // Generate CSV and return download link
      const csvData = await storageService.generateCSV(results);
      const downloadUrl = await storageService.uploadCSV(csvData, scanId);
      
      res.json({
        downloadUrl,
        scanId,
        totalMatches: results.matches.length
      });
    } else {
      res.json(results);
    }
  } catch (error) {
    logger.error('Error getting scan results:', error);
    res.status(500).json({
      error: 'Failed to get scan results',
      details: error.message
    });
  }
});

// List all scans
app.get('/api/scans', async (req, res) => {
  try {
    const firestoreService = new FirestoreService();
    const scans = await firestoreService.listScans();
    res.json(scans);
  } catch (error) {
    logger.error('Error listing scans:', error);
    res.status(500).json({
      error: 'Failed to list scans',
      details: error.message
    });
  }
});

// Delete scan
app.delete('/api/scans/:scanId', async (req, res) => {
  try {
    const { scanId } = req.params;
    const firestoreService = new FirestoreService();
    const storageService = new StorageService();
    
    await firestoreService.deleteScan(scanId);
    await storageService.deleteScanFiles(scanId);
    
    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    logger.error('Error deleting scan:', error);
    res.status(500).json({
      error: 'Failed to delete scan',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Term Spider Cloud server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 