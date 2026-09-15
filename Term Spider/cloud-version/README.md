# Term Spider Cloud - Web Scraping Keyword Finder

A powerful, scalable web scraping application built on Google Cloud Platform designed to help you find specific keywords (like former company names) on websites. This cloud-based solution offers significant advantages over the Google Apps Script version.

## 🚀 Why Google Cloud is Better

### **Advantages over Google Apps Script:**

1. **No Execution Time Limits**: Unlike Apps Script's 6-minute limit, Cloud Run can run for hours
2. **Scalable Infrastructure**: Automatically scales based on demand
3. **Better Performance**: Faster processing with dedicated resources
4. **Advanced Features**: Puppeteer for JavaScript-heavy sites, rate limiting, progress tracking
5. **Persistent Storage**: Cloud Storage and Firestore for reliable data storage
6. **Real-time Monitoring**: Live progress updates and status tracking
7. **API-First Design**: RESTful API for easy integration
8. **Cost Effective**: Pay only for what you use

### **Key Features:**

- **Dual Scraping Engine**: Axios for static content, Puppeteer for dynamic sites
- **Real-time Progress Tracking**: Live updates on scan progress
- **Persistent Storage**: Results stored in Cloud Storage and Firestore
- **RESTful API**: Easy integration with other applications
- **Rate Limiting**: Respectful scraping with configurable delays
- **Error Handling**: Robust error handling and retry logic
- **CSV Export**: Automatic CSV generation for results
- **Scalable Architecture**: Handles large websites efficiently

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Cloud Run     │    │   Cloud Storage │
│   (Web/Mobile)  │◄──►│   (API Server)  │◄──►│   (Results)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Firestore     │
                       │   (Metadata)    │
                       └─────────────────┘
```

## 🛠️ Setup Instructions

### **Prerequisites:**

1. **Google Cloud Project**: Create a new project or use existing one
2. **Google Cloud CLI**: Install and configure `gcloud`
3. **Node.js**: Version 18 or higher
4. **Billing**: Enable billing for your Google Cloud project

### **Important Note About Commands**

**All commands below should be run in your regular terminal/command prompt, NOT in the `gcloud` CLI itself.** The `gcloud` CLI is a tool you use from your terminal to interact with Google Cloud services.

**For Windows Users**: Use Command Prompt or PowerShell. The commands below are compatible with Windows.

### **Step 1: Enable Required APIs**

Open your terminal/command prompt and run:

```
gcloud services enable cloudbuild.googleapis.com run.googleapis.com firestore.googleapis.com storage.googleapis.com compute.googleapis.com
```

### **Step 2: Create Firestore Database**

```
gcloud firestore databases create --location=us-east1
```

### **Step 3: Create Cloud Storage Bucket**

```
gsutil mb gs://term-spider-results
```

### **Step 4: Set Up Authentication**

```
gcloud iam service-accounts create term-spider-sa --display-name="Term Spider Service Account"
```

```
gcloud projects add-iam-policy-binding term-spider-crawling-service --member="serviceAccount:term-spider-sa@term-spider-crawling-service.iam.gserviceaccount.com" --role="roles/datastore.user"
```

```
gcloud projects add-iam-policy-binding term-spider-crawling-service --member="serviceAccount:term-spider-sa@term-spider-crawling-service.iam.gserviceaccount.com" --role="roles/storage.objectViewer"
```

```
gcloud projects add-iam-policy-binding term-spider-crawling-service --member="serviceAccount:term-spider-sa@term-spider-crawling-service.iam.gserviceaccount.com" --role="roles/storage.objectCreator"
```

### **Step 5: Configure Environment**

Create a `.env` file in the project directory. You can use any text editor like Notepad, VS Code, or run:

```
notepad .env
```

Add the following content to your `.env` file:

```
GOOGLE_CLOUD_PROJECT=term-spider-crawling-service
GOOGLE_CLOUD_STORAGE_BUCKET=term-spider-results
NODE_ENV=production
LOG_LEVEL=info
```

### **Step 6: Deploy to Cloud Run**

```
gcloud run deploy term-spider --source . --platform managed --region us-central1 --allow-unauthenticated --service-account term-spider-sa@term-spider-crawling-service.iam.gserviceaccount.com --memory 2Gi --cpu 1 --max-instances 10
```

## 📊 API Reference

### **Start a Scan**

```
POST /api/scan
Content-Type: application/json

{
  "targetUrl": "https://example.com",
  "keywords": ["former company", "old brand", "legacy name"],
  "maxPages": 100,
  "requestDelay": 1500
}
```

**Response:**
```json
{
  "success": true,
  "scanId": "scan_1234567890_abc123",
  "message": "Scan started successfully",
  "statusUrl": "/api/status/scan_1234567890_abc123"
}
```

### **Check Scan Status**

```
GET /api/status/{scanId}
```

**Response:**
```json
{
  "scanId": "scan_1234567890_abc123",
  "status": "running",
  "progress": {
    "pagesScanned": 25,
    "totalMatches": 5,
    "pendingUrls": 15,
    "visitedUrls": 25
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### **Get Scan Results**

```
GET /api/results/{scanId}?format=json
GET /api/results/{scanId}?format=csv
```

### **List All Scans**

```
GET /api/scans
```

### **Delete Scan**

```
DELETE /api/scans/{scanId}
```

## 🎯 Usage Examples

### **Example 1: Finding Former Company References**

```
curl -X POST https://your-app-url/api/scan -H "Content-Type: application/json" -d "{\"targetUrl\": \"https://mynewwebsite.com\", \"keywords\": [\"Acme Corporation\", \"Acme Corp\", \"AcmeCorp\", \"Old Company Name\"], \"maxPages\": 200, \"requestDelay\": 2000}"
```

### **Example 2: Checking for Branding Elements**

```
curl -X POST https://your-app-url/api/scan -H "Content-Type: application/json" -d "{\"targetUrl\": \"https://acquiredwebsite.com\", \"keywords\": [\"Old Logo\", \"Previous Brand\", \"Legacy Company\", \"Former Owner\"], \"maxPages\": -1, \"requestDelay\": 1500}"
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_CLOUD_PROJECT` | Google Cloud Project ID | Required |
| `GOOGLE_CLOUD_STORAGE_BUCKET` | Cloud Storage bucket name | `term-spider-results` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `PORT` | Server port | `8080` |

### **Scan Configuration**

| Parameter | Description | Default |
|-----------|-------------|---------|
| `targetUrl` | Website to scan | Required |
| `keywords` | Array of keywords to search | Required |
| `maxPages` | Maximum pages to scan (-1 for unlimited) | `50` |
| `requestDelay` | Delay between requests (ms) | `1000` |

## 📈 Monitoring and Logging

### **Cloud Logging**

All logs are automatically sent to Google Cloud Logging:

```
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=term-spider" --limit 50
```

### **Metrics**

Monitor your application with Cloud Monitoring:

- Request count and latency
- Error rates
- Resource utilization
- Custom metrics

## 🔒 Security

### **Authentication**

- Service account authentication for Google Cloud services
- API key authentication (optional)
- Rate limiting to prevent abuse

### **Data Protection**

- All data encrypted at rest
- Secure transmission with HTTPS
- Access controls via IAM

## 💰 Cost Optimization

### **Pricing**

- **Cloud Run**: Pay per request and compute time
- **Firestore**: Pay per read/write operations
- **Cloud Storage**: Pay per GB stored and operations

### **Cost Optimization Tips**

1. **Use appropriate instance sizes**: Start with 1 CPU, 2GB RAM
2. **Set max instances**: Limit to prevent runaway costs
3. **Clean up old data**: Regularly delete old scan results
4. **Monitor usage**: Set up billing alerts

## 🚀 Deployment Options

### **Option 1: Cloud Run (Recommended)**

```
gcloud run deploy term-spider --source .
```

### **Option 2: App Engine**

```
gcloud app deploy
```

### **Option 3: GKE (Kubernetes)**

```
kubectl apply -f k8s/
```

## 🔄 Migration from Google Apps Script

If you're migrating from the Google Apps Script version:

1. **Export existing data**: Download results from Google Sheets
2. **Update configuration**: Use the new API format
3. **Test thoroughly**: Run test scans before production use
4. **Update integrations**: Modify any existing integrations

## 🆘 Troubleshooting

### **Common Issues**

1. **"Permission denied" errors**
   - Check service account permissions
   - Verify IAM roles are assigned correctly

2. **"Bucket not found" errors**
   - Ensure Cloud Storage bucket exists
   - Check bucket name in environment variables

3. **"Database not found" errors**
   - Create Firestore database if not exists
   - Verify database region matches deployment

4. **High latency**
   - Check instance size and scaling settings
   - Monitor resource utilization

### **Debug Mode**

Enable debug logging:

```
set LOG_LEVEL=debug
gcloud run deploy term-spider --source .
```

## 📞 Support

For issues and questions:

1. Check the logs: `gcloud logging read`
2. Review configuration and environment variables
3. Test with a small scan first
4. Monitor resource usage and costs

## 📄 License

MIT License - see LICENSE file for details. 