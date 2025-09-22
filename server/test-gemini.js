// Quick test to verify Gemini API is working
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...');
    console.log('🔑 API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('🔑 API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = 'Explain turmeric benefits in Ayurveda in exactly 2 sentences.';
    console.log('📤 Sending prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Response length:', text.length);
    console.log('📥 Response:', text);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📊 Full error:', error);
  }
}

testGemini();