const { Firestore } = require('@google-cloud/firestore');
const logger = require('../utils/logger');

class FirestoreService {
  constructor() {
    this.db = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id'
    });
    
    this.scansCollection = this.db.collection('scans');
    this.resultsCollection = this.db.collection('results');
  }

  async createScan(scanId, scanData) {
    try {
      const scanDoc = {
        scanId,
        targetUrl: scanData.targetUrl,
        keywords: scanData.keywords,
        maxPages: scanData.maxPages,
        requestDelay: scanData.requestDelay,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {
          pagesScanned: 0,
          totalMatches: 0,
          pendingUrls: 0,
          visitedUrls: 0
        }
      };

      await this.scansCollection.doc(scanId).set(scanDoc);
      logger.info(`Scan ${scanId} created in Firestore`);
      
      return scanDoc;
    } catch (error) {
      logger.error('Error creating scan in Firestore:', error);
      throw error;
    }
  }

  async updateScanStatus(scanId, status) {
    try {
      await this.scansCollection.doc(scanId).update({
        status,
        updatedAt: new Date()
      });
      
      logger.info(`Scan ${scanId} status updated to ${status}`);
    } catch (error) {
      logger.error('Error updating scan status:', error);
      throw error;
    }
  }

  async updateScanProgress(scanId, progress) {
    try {
      await this.scansCollection.doc(scanId).update({
        progress,
        updatedAt: new Date()
      });
    } catch (error) {
      logger.error('Error updating scan progress:', error);
      throw error;
    }
  }

  async getScanStatus(scanId) {
    try {
      const doc = await this.scansCollection.doc(scanId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      return {
        scanId: data.scanId,
        status: data.status,
        progress: data.progress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        targetUrl: data.targetUrl,
        keywords: data.keywords
      };
    } catch (error) {
      logger.error('Error getting scan status:', error);
      throw error;
    }
  }

  async saveScanResults(scanId, results) {
    try {
      const resultsDoc = {
        scanId,
        results,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.resultsCollection.doc(scanId).set(resultsDoc);
      logger.info(`Results saved for scan ${scanId}`);
      
      return resultsDoc;
    } catch (error) {
      logger.error('Error saving scan results:', error);
      throw error;
    }
  }

  async getScanResults(scanId) {
    try {
      const doc = await this.resultsCollection.doc(scanId).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return doc.data().results;
    } catch (error) {
      logger.error('Error getting scan results:', error);
      throw error;
    }
  }

  async listScans(limit = 50) {
    try {
      const snapshot = await this.scansCollection
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      const scans = [];
      snapshot.forEach(doc => {
        scans.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return scans;
    } catch (error) {
      logger.error('Error listing scans:', error);
      throw error;
    }
  }

  async deleteScan(scanId) {
    try {
      // Delete scan document
      await this.scansCollection.doc(scanId).delete();
      
      // Delete results document
      await this.resultsCollection.doc(scanId).delete();
      
      logger.info(`Scan ${scanId} deleted from Firestore`);
    } catch (error) {
      logger.error('Error deleting scan:', error);
      throw error;
    }
  }

  async getScanStats() {
    try {
      const snapshot = await this.scansCollection.get();
      
      const stats = {
        total: 0,
        completed: 0,
        running: 0,
        failed: 0,
        pending: 0
      };
      
      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total++;
        
        switch (data.status) {
          case 'completed':
            stats.completed++;
            break;
          case 'running':
            stats.running++;
            break;
          case 'failed':
            stats.failed++;
            break;
          case 'pending':
            stats.pending++;
            break;
        }
      });
      
      return stats;
    } catch (error) {
      logger.error('Error getting scan stats:', error);
      throw error;
    }
  }
}

module.exports = { FirestoreService }; 