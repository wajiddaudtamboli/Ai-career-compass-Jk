// Authentication Test Script for J&K Career Navigator
// Tests JWT authentication endpoints

const API_BASE = 'http://localhost:5002';

async function testAuth() {
    console.log('🧪 Testing JWT Authentication System');
    console.log('===================================');

    try {
        // Test 1: Health Check
        console.log('\n1. Testing Health Check...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        const healthData = await healthResponse.json();
        console.log(`✅ Health Status: ${healthData.status}`);
        console.log(`📊 Database: ${healthData.database.status}`);
        console.log(`🔐 Auth: ${healthData.features.authentication}`);

        // Test 2: Register User
        console.log('\n2. Testing User Registration...');
        const registerData = {
            email: 'test@jkcareer.com',
            password: 'testpass123',
            firstName: 'Test',
            lastName: 'User'
        };

        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });
        
        const registerResult = await registerResponse.json();
        console.log(`✅ Registration: ${registerResult.success}`);
        
        if (registerResult.success) {
            console.log(`👤 User ID: ${registerResult.data.user.id}`);
            console.log(`📧 Email: ${registerResult.data.user.email}`);
            console.log(`🎫 Token: ${registerResult.data.token.substring(0, 20)}...`);
        }

        // Test 3: Login User
        console.log('\n3. Testing User Login...');
        const loginData = {
            email: 'test@jkcareer.com',
            password: 'testpass123'
        };

        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        
        const loginResult = await loginResponse.json();
        console.log(`✅ Login: ${loginResult.success}`);
        
        let token = '';
        if (loginResult.success) {
            token = loginResult.data.token;
            console.log(`👤 User: ${loginResult.data.user.firstName} ${loginResult.data.user.lastName}`);
            console.log(`🔑 Role: ${loginResult.data.user.role}`);
        }

        // Test 4: Get User Info (Protected Route)
        if (token) {
            console.log('\n4. Testing Protected Route (/auth/me)...');
            const meResponse = await fetch(`${API_BASE}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const meResult = await meResponse.json();
            console.log(`✅ Protected Route: ${meResult.success}`);
            
            if (meResult.success) {
                console.log(`📧 Email: ${meResult.data.email}`);
                console.log(`👤 Name: ${meResult.data.firstName} ${meResult.data.lastName}`);
                console.log(`✉️ Verified: ${meResult.data.emailVerified}`);
            }
        }

        // Test 5: Test API Endpoints
        console.log('\n5. Testing API Endpoints...');
        
        const endpoints = [
            '/api/v1/health',
            '/api/v1/careers',
            '/api/v1/colleges',
            '/api/gemini/health'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${API_BASE}${endpoint}`);
                const data = await response.json();
                console.log(`✅ ${endpoint}: ${data.success !== false ? 'Working' : 'Error'}`);
            } catch (error) {
                console.log(`❌ ${endpoint}: Failed - ${error.message}`);
            }
        }

        console.log('\n🎉 Authentication tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAuth();
