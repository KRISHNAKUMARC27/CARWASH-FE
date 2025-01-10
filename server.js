const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const { createProxyServer } = require('http-proxy');

const app = express();
const proxy = createProxyServer({ changeOrigin: true });

// Proxy API requests and rewrite the path
app.use('/api', (req, res) => {
  req.url = req.url.replace(/^\/api/, ''); // Remove '/api' from the request URL
  proxy.web(req, res, { target: 'http://localhost:8080' }, (err) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  });
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const ipAddress = getLocalIpAddress();

// Fallback route should come after static middleware
app.get('*', (req, res) => {
  console.log("Fallback route triggered");
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listening on all network interfaces to make it accessible on the local network
http.createServer(app).listen(4001, '0.0.0.0', () => {
  console.log(`HTTP server running at http://${ipAddress}:4001`);
});
