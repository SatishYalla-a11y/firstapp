// Import required modules
const https = require('https');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// Read SSL certificate and key
const options = {
  key: fs.readFileSync('key.pem'), // Replace with your private key file
  cert: fs.readFileSync('cert.pem') // Replace with your certificate file
};

// Sample data for demonstration
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Helper function to parse request body
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      callback(null, parsedBody);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Helper function to send JSON response
function sendJSONResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Create an HTTPS server with API routes
https.createServer(options, (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // API Routes
  switch (true) {
    // Home route
    case path === '/' && method === 'GET':
      sendJSONResponse(res, 200, { 
        message: 'Welcome to First App API',
        version: '1.0.0',
        endpoints: [
          'GET / - Home',
          'GET /api/users - Get all users',
          'GET /api/users/:id - Get user by ID',
          'POST /api/users - Create new user',
          'PUT /api/users/:id - Update user',
          'DELETE /api/users/:id - Delete user',
          'GET /api/health - Health check'
        ]
      });
      break;

    // Get all users
    case path === '/api/users' && method === 'GET':
      sendJSONResponse(res, 200, { success: true, data: users });
      break;

    // Get user by ID
    case path.startsWith('/api/users/') && method === 'GET':
      const userId = parseInt(path.split('/')[3]);
      const user = users.find(u => u.id === userId);
      if (user) {
        sendJSONResponse(res, 200, { success: true, data: user });
      } else {
        sendJSONResponse(res, 404, { success: false, message: 'User not found' });
      }
      break;

    // Create new user
    case path === '/api/users' && method === 'POST':
      parseRequestBody(req, (error, body) => {
        if (error) {
          sendJSONResponse(res, 400, { success: false, message: 'Invalid JSON' });
          return;
        }
        
        if (!body.name || !body.email) {
          sendJSONResponse(res, 400, { success: false, message: 'Name and email are required' });
          return;
        }

        const newUser = {
          id: users.length + 1,
          name: body.name,
          email: body.email
        };
        users.push(newUser);
        sendJSONResponse(res, 201, { success: true, data: newUser });
      });
      break;

    // Update user
    case path.startsWith('/api/users/') && method === 'PUT':
      const updateUserId = parseInt(path.split('/')[3]);
      const userIndex = users.findIndex(u => u.id === updateUserId);
      
      if (userIndex === -1) {
        sendJSONResponse(res, 404, { success: false, message: 'User not found' });
        return;
      }

      parseRequestBody(req, (error, body) => {
        if (error) {
          sendJSONResponse(res, 400, { success: false, message: 'Invalid JSON' });
          return;
        }

        if (body.name) users[userIndex].name = body.name;
        if (body.email) users[userIndex].email = body.email;
        
        sendJSONResponse(res, 200, { success: true, data: users[userIndex] });
      });
      break;

    // Delete user
    case path.startsWith('/api/users/') && method === 'DELETE':
      const deleteUserId = parseInt(path.split('/')[3]);
      const deleteIndex = users.findIndex(u => u.id === deleteUserId);
      
      if (deleteIndex === -1) {
        sendJSONResponse(res, 404, { success: false, message: 'User not found' });
        return;
      }

      const deletedUser = users.splice(deleteIndex, 1)[0];
      sendJSONResponse(res, 200, { success: true, message: 'User deleted', data: deletedUser });
      break;

    // Health check
    case path === '/api/health' && method === 'GET':
      sendJSONResponse(res, 200, { 
        success: true, 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
      break;

    // 404 - Route not found
    default:
      sendJSONResponse(res, 404, { success: false, message: 'Route not found' });
      break;
  }
}).listen(443, () => {
  console.log('Server running at https://localhost:443/');
  console.log('Available API endpoints:');
  console.log('- GET https://localhost:443/ (Home)');
  console.log('- GET https://localhost:443/api/users (Get all users)');
  console.log('- GET https://localhost:443/api/users/:id (Get user by ID)');
  console.log('- POST https://localhost:443/api/users (Create user)');
  console.log('- PUT https://localhost:443/api/users/:id (Update user)');
  console.log('- DELETE https://localhost:443/api/users/:id (Delete user)');
  console.log('- GET https://localhost:443/api/health (Health check)');
});
