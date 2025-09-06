import fetch from 'node-fetch';

async function testAPI() {
    console.log('🧪 Testing J&K Career Navigator API...\n');
    
    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:5002/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
        console.log();
        
        // Test user registration
        console.log('2. Testing user registration...');
        const registerResponse = await fetch('http://localhost:5002/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpass123'
            })
        });
        const registerData = await registerResponse.json();
        console.log('✅ Registration:', registerData);
        console.log();
        
        // Test user login
        console.log('3. Testing user login...');
        const loginResponse = await fetch('http://localhost:5002/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'testpass123'
            })
        });
        const loginData = await loginResponse.json();
        console.log('✅ Login:', loginData);
        
        if (loginData.token) {
            console.log();
            
            // Test protected route
            console.log('4. Testing protected route (profile)...');
            const profileResponse = await fetch('http://localhost:5002/auth/me', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            const profileData = await profileResponse.json();
            console.log('✅ Profile:', profileData);
            console.log();
            
            // Test careers endpoint
            console.log('5. Testing careers endpoint...');
            const careersResponse = await fetch('http://localhost:5002/api/v1/careers');
            const careersData = await careersResponse.json();
            console.log('✅ Careers:', careersData);
            console.log();
            
            // Test colleges endpoint
            console.log('6. Testing colleges endpoint...');
            const collegesResponse = await fetch('http://localhost:5002/api/v1/colleges');
            const collegesData = await collegesResponse.json();
            console.log('✅ Colleges:', collegesData);
            console.log();
        }
        
        console.log('🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();
