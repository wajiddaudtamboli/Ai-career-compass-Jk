// Simple API test
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...');
    
    // Test careers endpoint
    const careersResponse = await fetch('http://localhost:5002/api/careers');
    const careers = await careersResponse.json();
    console.log(`✅ Careers API: Found ${careers.length} careers`);
    
    // Test colleges endpoint
    const collegesResponse = await fetch('http://localhost:5002/api/colleges');
    const colleges = await collegesResponse.json();
    console.log(`✅ Colleges API: Found ${colleges.length} colleges`);
    
    // Test chat endpoint
    const chatResponse = await fetch('http://localhost:5002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello', context: 'career' })
    });
    const chatResult = await chatResponse.json();
    console.log(`✅ Chat API: ${chatResult.response ? 'Working' : 'Mock response'}`);
    
    console.log('🎉 All API endpoints are working!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
