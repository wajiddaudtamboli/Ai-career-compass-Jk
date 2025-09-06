// Simple test to verify server is working
const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5002,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    console.log(`\n🧪 Testing ${description}: http://localhost:5002${path}`);
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log('📄 Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('📄 Raw Response:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
        }
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Error: ${err.message}`);
      reject(err);
    });

    req.on('timeout', () => {
      console.log(`❌ Timeout after 5 seconds`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing J&K Career Navigator API Server');
  console.log('===========================================');
  
  const tests = [
    { path: '/', description: 'Root endpoint' },
    { path: '/health', description: 'Health check' },
    { path: '/api/v1/health', description: 'API V1 health' },
    { path: '/api/gemini/health', description: 'Gemini health' }
  ];

  for (const test of tests) {
    try {
      await testEndpoint(test.path, test.description);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Testing complete');
}

runTests().catch(console.error);
