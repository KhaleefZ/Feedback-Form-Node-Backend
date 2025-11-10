const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

// Test data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
};

const testSupportRequest = {
  name: 'Support Test User',
  email: `support${Date.now()}@example.com`,
  subject: 'Test support request',
  description: 'This is a test support request to verify MongoDB storage',
  contactNumber: '+1234567890',
  screenshot: 'optional_screenshot_data',
};

// Helper function to log results
function logSuccess(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
}

// Test functions
async function testHealthCheck() {
  try {
    logInfo('Testing health check endpoint...');
    const response = await axios.get(`${BASE_URL}/`);
    logSuccess('Health check passed');
    console.log('  Response:', response.data);
    return true;
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

async function testUserSignup() {
  try {
    logInfo('Testing user signup...');
    const response = await axios.post(`${BASE_URL}/auth/signup`, testUser);
    logSuccess('User signup successful');
    console.log('  User created:', response.data.user);
    return response.data.user;
  } catch (error) {
    logError(`User signup failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testUserLogin() {
  try {
    logInfo('Testing user login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    logSuccess('User login successful');
    console.log('  User logged in:', response.data.user);
    return response.data.user;
  } catch (error) {
    logError(`User login failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testDuplicateSignup() {
  try {
    logInfo('Testing duplicate signup (should fail)...');
    await axios.post(`${BASE_URL}/auth/signup`, testUser);
    logError('Duplicate signup should have failed but passed!');
    return false;
  } catch (error) {
    if (error.response?.status === 409) {
      logSuccess('Duplicate signup correctly rejected');
      console.log('  Error message:', error.response.data.message);
      return true;
    } else {
      logError(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

async function testCreateSupportRequest() {
  try {
    logInfo('Testing support request creation...');
    const response = await axios.post(`${BASE_URL}/support`, testSupportRequest);
    logSuccess('Support request created successfully');
    console.log('  Support request:', response.data.data);
    return response.data.data;
  } catch (error) {
    logError(`Support request creation failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testGetAllSupportRequests() {
  try {
    logInfo('Testing get all support requests...');
    const response = await axios.get(`${BASE_URL}/support`);
    logSuccess(`Retrieved ${response.data.count} support request(s)`);
    console.log('  Total count:', response.data.count);
    return response.data.data;
  } catch (error) {
    logError(`Get support requests failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testGetSupportRequestById(id) {
  try {
    logInfo(`Testing get support request by ID: ${id}...`);
    const response = await axios.get(`${BASE_URL}/support/${id}`);
    logSuccess('Support request retrieved successfully');
    console.log('  Support request:', response.data.data);
    return response.data.data;
  } catch (error) {
    logError(`Get support request failed: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function testValidation() {
  try {
    logInfo('Testing validation (invalid email)...');
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test',
      email: 'invalid-email',
      password: '123',
    });
    logError('Validation should have failed but passed!');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('Validation correctly rejected invalid data');
      console.log('  Error messages:', error.response.data.message);
      return true;
    } else {
      logError(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.yellow}=== Starting MongoDB Schema Tests ===${colors.reset}\n`);

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Health Check
  totalTests++;
  if (await testHealthCheck()) passedTests++;
  console.log('');

  // Test 2: User Signup
  totalTests++;
  const createdUser = await testUserSignup();
  if (createdUser) passedTests++;
  console.log('');

  // Test 3: User Login
  totalTests++;
  if (await testUserLogin()) passedTests++;
  console.log('');

  // Test 4: Duplicate Signup
  totalTests++;
  if (await testDuplicateSignup()) passedTests++;
  console.log('');

  // Test 5: Validation
  totalTests++;
  if (await testValidation()) passedTests++;
  console.log('');

  // Test 6: Create Support Request
  totalTests++;
  const supportRequest = await testCreateSupportRequest();
  if (supportRequest) passedTests++;
  console.log('');

  // Test 7: Get All Support Requests
  totalTests++;
  if (await testGetAllSupportRequests()) passedTests++;
  console.log('');

  // Test 8: Get Support Request by ID
  if (supportRequest && supportRequest._id) {
    totalTests++;
    if (await testGetSupportRequestById(supportRequest._id)) passedTests++;
    console.log('');
  }

  // Summary
  console.log(`${colors.yellow}=== Test Summary ===${colors.reset}`);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`);

  if (passedTests === totalTests) {
    console.log(`${colors.green}🎉 All tests passed! Schemas are working correctly and data is being stored in MongoDB.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
  }
}

// Run tests
runAllTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
