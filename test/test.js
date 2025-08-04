// Simple test for the firstapp API
const https = require('https');
const fs = require('fs');

// Disable SSL verification for self-signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

console.log('Starting tests for FirstApp API...\n');

// Test configuration
const testConfig = {
  host: 'localhost',
  port: 443,
  timeout: 5000
};

// Test counter
let testsPassed = 0;
let testsTotal = 0;

// Helper function to make HTTPS requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve({ statusCode: res.statusCode, body: parsedBody, headers: res.headers });
        } catch (error) {
          resolve({ statusCode: res.statusCode, body: body, headers: res.headers });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(testConfig.timeout, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test function
async function runTest(testName, testFunction) {
  testsTotal++;
  try {
    console.log(`🧪 Running: ${testName}`);
    await testFunction();
    testsPassed++;
    console.log(`✅ PASSED: ${testName}\n`);
  } catch (error) {
    console.log(`❌ FAILED: ${testName}`);
    console.log(`   Error: ${error.message}\n`);
  }
}

// Test cases
async function testHealthEndpoint() {
  const options = {
    hostname: testConfig.host,
    port: testConfig.port,
    path: '/api/health',
    method: 'GET',
    rejectUnauthorized: false
  };

  const response = await makeRequest(options);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  
  if (!response.body.success) {
    throw new Error('Health check should return success: true');
  }
}

async function testHomeEndpoint() {
  const options = {
    hostname: testConfig.host,
    port: testConfig.port,
    path: '/',
    method: 'GET',
    rejectUnauthorized: false
  };

  const response = await makeRequest(options);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  
  if (!response.body.message) {
    throw new Error('Home endpoint should return a message');
  }
}

async function testGetUsers() {
  const options = {
    hostname: testConfig.host,
    port: testConfig.port,
    path: '/api/users',
    method: 'GET',
    rejectUnauthorized: false
  };

  const response = await makeRequest(options);
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  
  if (!response.body.success) {
    throw new Error('Get users should return success: true');
  }
  
  if (!Array.isArray(response.body.data)) {
    throw new Error('Users data should be an array');
  }
}

async function testCreateUser() {
  const options = {
    hostname: testConfig.host,
    port: testConfig.port,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: false
  };

  const userData = {
    name: 'Test User',
    email: 'test@example.com'
  };

  const response = await makeRequest(options, userData);
  
  if (response.statusCode !== 201) {
    throw new Error(`Expected status 201, got ${response.statusCode}`);
  }
  
  if (!response.body.success) {
    throw new Error('Create user should return success: true');
  }
  
  if (response.body.data.name !== userData.name) {
    throw new Error('Created user name should match input');
  }
}

// Check if server is running
async function checkServerRunning() {
  try {
    const options = {
      hostname: testConfig.host,
      port: testConfig.port,
      path: '/api/health',
      method: 'GET',
      rejectUnauthorized: false
    };
    
    await makeRequest(options);
    return true;
  } catch (error) {
    return false;
  }
}

// Main test execution
async function runAllTests() {
  console.log('🚀 FirstApp API Test Suite');
  console.log('==========================\n');
  
  // Check if server is running
  const isServerRunning = await checkServerRunning();
  
  if (!isServerRunning) {
    console.log('❌ Server is not running at https://localhost:443');
    console.log('   Please start the server with: npm start');
    console.log('   Then run tests with: npm test\n');
    process.exit(1);
  }
  
  console.log('✅ Server is running\n');
  
  // Run tests
  await runTest('Health Endpoint', testHealthEndpoint);
  await runTest('Home Endpoint', testHomeEndpoint);
  await runTest('Get Users Endpoint', testGetUsers);
  await runTest('Create User Endpoint', testCreateUser);
  
  // Test summary
  console.log('📊 Test Summary');
  console.log('===============');
  console.log(`Total Tests: ${testsTotal}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsTotal - testsPassed}`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
