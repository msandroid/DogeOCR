const fetch = require('node-fetch');

async function testApiKeyCreation() {
  const testUserId = 'test_user_123';
  const testKeyName = 'test_key_' + Date.now();
  
  console.log('Testing API key creation...');
  console.log('User ID:', testUserId);
  console.log('Key Name:', testKeyName);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/api-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': testUserId
      },
      body: JSON.stringify({ name: testKeyName })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.apiKey) {
      console.log('✅ API key created successfully!');
      console.log('Generated key:', data.apiKey);
    } else {
      console.log('❌ Failed to create API key');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testApiKeyCreation(); 