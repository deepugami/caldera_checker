const https = require('https');

// Test Kraken API specifically with better error handling
const testKraken = async () => {
  console.log('🧪 Testing Kraken API with detailed debugging...\n');
  
  const url = 'https://api.kraken.com/0/public/Ticker?pair=APEETH';
  
  return new Promise((resolve) => {
    const req = https.request(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('Raw response:', data);
          const parsed = JSON.parse(data);
          console.log('Parsed response:', JSON.stringify(parsed, null, 2));
          
          if (parsed.error && parsed.error.length > 0) {
            console.log('❌ Kraken API error:', parsed.error);
            resolve({ success: false, error: parsed.error.join(', ') });
            return;
          }
          
          if (parsed.result) {
            console.log('Result keys:', Object.keys(parsed.result));
            const pairs = Object.keys(parsed.result);
            if (pairs.length > 0) {
              const pairData = parsed.result[pairs[0]];
              console.log('First pair data:', pairData);
              
              if (pairData && pairData.c && pairData.c.length > 0) {
                const price = parseFloat(pairData.c[0]);
                console.log('✅ Extracted price:', price);
                resolve({ success: true, price });
              } else {
                console.log('❌ No price data in pair');
                resolve({ success: false, error: 'No price data' });
              }
            } else {
              console.log('❌ No pairs in result');
              resolve({ success: false, error: 'No pairs found' });
            }
          } else {
            console.log('❌ No result in response');
            resolve({ success: false, error: 'No result' });
          }
        } catch (error) {
          console.log('❌ Parse error:', error.message);
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Network error:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      console.log('❌ Timeout');
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
};

testKraken().then(result => {
  console.log('\nFinal result:', result);
});
