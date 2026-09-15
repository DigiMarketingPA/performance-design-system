// Get current tab information
browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
  const currentTab = tabs[0];
  document.getElementById('currentSite').textContent = new URL(currentTab.url).hostname;
});

// Function to format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

// Function to display logs
const displayLogs = (logs) => {
  const logsContainer = document.getElementById('logs');
  logsContainer.innerHTML = '';

  // Sort logs by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Display last 10 logs
  const recentLogs = logs.slice(0, 10);

  recentLogs.forEach(log => {
    // Create log entry container
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    // Add URL
    const urlElement = document.createElement('div');
    urlElement.className = 'url';
    urlElement.textContent = log.url;
    logEntry.appendChild(urlElement);
    
    // Add timestamp
    const timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = formatTimestamp(log.timestamp);
    logEntry.appendChild(timestampElement);
    
    // Add blocked items
    if (log.blocked && log.blocked.length > 0) {
      const blockedContainer = document.createElement('div');
      blockedContainer.className = 'blocked';
      blockedContainer.innerHTML = '<strong>Blocked:</strong><br>';
      
      log.blocked.forEach(block => {
        blockedContainer.innerHTML += `
          ${block.type}: ${block.url}<br>
          Reason: ${block.reason}<br>
          Time: ${formatTimestamp(block.timestamp)}<br><br>
        `;
      });
      
      logEntry.appendChild(blockedContainer);
    }
    
    // Add modified items
    if (log.modified && log.modified.length > 0) {
      const modifiedContainer = document.createElement('div');
      modifiedContainer.className = 'modified';
      modifiedContainer.innerHTML = '<strong>Modified:</strong><br>';
      
      log.modified.forEach(mod => {
        modifiedContainer.innerHTML += `
          ${mod.type}: ${mod.details}<br>
          Time: ${formatTimestamp(mod.timestamp)}<br><br>
        `;
      });
      
      logEntry.appendChild(modifiedContainer);
    }
    
    logsContainer.appendChild(logEntry);
  });
};

// Get and display logs
browser.runtime.sendMessage({ type: 'getLogs' }).then(response => {
  displayLogs(response.logs);
});

// Update logs every 5 seconds
setInterval(() => {
  browser.runtime.sendMessage({ type: 'getLogs' }).then(response => {
    displayLogs(response.logs);
  });
}, 5000);

// Check uBlock Origin status
function checkUBlockStatus() {
  browser.management.get('uBlock0@raymondhill.net').then(extension => {
    const statusElement = document.getElementById('ublockStatus');
    if (extension.enabled) {
      statusElement.textContent = 'uBlock Origin: Installed and Enabled';
      statusElement.className = 'ublock-status installed';
    } else {
      statusElement.textContent = 'uBlock Origin: Installed but Disabled';
      statusElement.className = 'ublock-status not-installed';
    }
  }).catch(() => {
    const statusElement = document.getElementById('ublockStatus');
    statusElement.textContent = 'uBlock Origin: Not Installed';
    statusElement.className = 'ublock-status not-installed';
  });
}

// Whitelist current site
document.getElementById('whitelist').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    const currentTab = tabs[0];
    const hostname = new URL(currentTab.url).hostname;
    
    browser.storage.local.get('whitelist').then(data => {
      const whitelist = data.whitelist || [];
      if (!whitelist.includes(hostname)) {
        whitelist.push(hostname);
        browser.storage.local.set({whitelist}).then(() => {
          const statusElement = document.querySelector('.status');
          statusElement.textContent = `Added ${hostname} to whitelist`;
          statusElement.className = 'status warning';
          setTimeout(() => {
            statusElement.textContent = 'Privacy Protection Active';
            statusElement.className = 'status';
          }, 3000);
        });
      }
    });
  });
});

// Disable protection
document.getElementById('disable').addEventListener('click', () => {
  browser.storage.local.set({enabled: false}).then(() => {
    const statusElement = document.querySelector('.status');
    statusElement.textContent = 'Protection Disabled';
    statusElement.className = 'status error';
    setTimeout(() => {
      window.close();
    }, 2000);
  });
});

// Open uBlock Origin dashboard
document.getElementById('openUblock').addEventListener('click', () => {
  browser.tabs.create({
    url: 'moz-extension://uBlock0@raymondhill.net/dashboard.html'
  });
});

// Initialize
checkUBlockStatus(); 