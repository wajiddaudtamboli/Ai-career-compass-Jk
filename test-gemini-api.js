// Test script to verify new Gemini API key
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '../backend/.env' });

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini AI with API Key:', process.env.GEMINI_API_KEY);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Hello! Please respond with 'API key is working correctly' if you can process this message.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log('✅ API Response:', response.text());
    console.log('✅ New Gemini API key is working successfully!');
    
  } catch (error) {
    console.error('❌ Error testing API key:', error.message);
  }
}

testGeminiAPI();