const { Storage } = require('@google-cloud/storage');
const logger = require('../utils/logger');

class StorageService {
  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id'
    });
    
    this.bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'term-spider-results';
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async uploadResults(jsonData, scanId) {
    try {
      const fileName = `results/${scanId}/results.json`;
      const file = this.bucket.file(fileName);
      
      await file.save(jsonData, {
        metadata: {
          contentType: 'application/json',
          metadata: {
            scanId,
            uploadedAt: new Date().toISOString()
          }
        }
      });
      
      logger.info(`Results uploaded to Cloud Storage: ${fileName}`);
      
      return `gs://${this.bucketName}/${fileName}`;
    } catch (error) {
      logger.error('Error uploading results to Cloud Storage:', error);
      throw error;
    }
  }

  async generateCSV(results) {
    try {
      const csvHeaders = [
        'Keyword',
        'URL',
        'Position',
        'Context',
        'Timestamp',
        'Scan ID'
      ];
      
      const csvRows = [csvHeaders.join(',')];
      
      results.matches.forEach(match => {
        const row = [
          `"${match.keyword}"`,
          `"${match.url}"`,
          match.position,
          `"${match.context.replace(/"/g, '""')}"`,
          `"${match.timestamp}"`,
          `"${match.scanId}"`
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    } catch (error) {
      logger.error('Error generating CSV:', error);
      throw error;
    }
  }

  async uploadCSV(csvData, scanId) {
    try {
      const fileName = `results/${scanId}/results.csv`;
      const file = this.bucket.file(fileName);
      
      await file.save(csvData, {
        metadata: {
          contentType: 'text/csv',
          metadata: {
            scanId,
            uploadedAt: new Date().toISOString()
          }
        }
      });
      
      logger.info(`CSV uploaded to Cloud Storage: ${fileName}`);
      
      // Generate signed URL for download (expires in 1 hour)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // 1 hour
      });
      
      return signedUrl;
    } catch (error) {
      logger.error('Error uploading CSV to Cloud Storage:', error);
      throw error;
    }
  }

  async deleteScanFiles(scanId) {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: `results/${scanId}/`
      });
      
      if (files.length > 0) {
        await Promise.all(files.map(file => file.delete()));
        logger.info(`Deleted ${files.length} files for scan ${scanId}`);
      }
    } catch (error) {
      logger.error('Error deleting scan files:', error);
      throw error;
    }
  }

  async getResultsUrl(scanId) {
    try {
      const fileName = `results/${scanId}/results.json`;
      const file = this.bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return null;
      }
      
      // Generate signed URL for download (expires in 1 hour)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // 1 hour
      });
      
      return signedUrl;
    } catch (error) {
      logger.error('Error getting results URL:', error);
      throw error;
    }
  }

  async listScanFiles(scanId) {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: `results/${scanId}/`
      });
      
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        updated: file.metadata.updated
      }));
    } catch (error) {
      logger.error('Error listing scan files:', error);
      throw error;
    }
  }

  async downloadResults(scanId) {
    try {
      const fileName = `results/${scanId}/results.json`;
      const file = this.bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        return null;
      }
      
      const [data] = await file.download();
      return JSON.parse(data.toString());
    } catch (error) {
      logger.error('Error downloading results:', error);
      throw error;
    }
  }
}

module.exports = { StorageService }; 