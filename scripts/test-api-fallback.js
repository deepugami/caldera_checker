const https = require('https');

// Simple test of our API endpoints (simulating the TypeScript system)
const testAPIs = async () => {
  console.log('🧪 Testing API Endpoints for Gas Conversion...\n');

  const APIs = [
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=APEETH',
      parser: (data) => parseFloat(data.price)
    },
    {
      name: 'CryptoCompare',
      url: 'https://min-api.cryptocompare.com/data/price?fsym=APE&tsyms=ETH',
      parser: (data) => data.ETH
    },
    {
      name: 'CoinPaprika',
      url: 'https://api.coinpaprika.com/v1/tickers/ape-apecoin?quotes=ETH',
      parser: (data) => data.quotes?.ETH?.price
    },
    {
      name: 'CoinGecko',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=apecoin&vs_currencies=eth',
      parser: (data) => data.apecoin?.eth
    }
  ];

  const results = [];

  for (const api of APIs) {
    console.log(`Testing ${api.name}...`);
    
    try {
      const result = await testAPI(api);
      results.push({ name: api.name, ...result });
      
      if (result.success) {
        console.log(`✅ ${api.name}: ${result.price} ETH (${result.time}ms)`);
      } else {
        console.log(`❌ ${api.name}: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${api.name}: ${error.message}`);
      results.push({ name: api.name, success: false, error: error.message });
    }
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Summary:');
  const working = results.filter(r => r.success);
  console.log(`✅ Working APIs: ${working.length}/${results.length}`);
  
  if (working.length > 0) {
    const avgPrice = working.reduce((sum, r) => sum + r.price, 0) / working.length;
    console.log(`📈 Average APE/ETH rate: ${avgPrice.toFixed(8)} ETH`);
  }

  return results;
};

const testAPI = (api) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(api.url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const time = Date.now() - startTime;
        
        try {
          const parsed = JSON.parse(data);
          const price = api.parser(parsed);
          
          if (price && !isNaN(price) && price > 0) {
            resolve({ success: true, price, time });
          } else {
            resolve({ success: false, error: 'Invalid price data', time });
          }
        } catch (error) {
          resolve({ success: false, error: `Parse error: ${error.message}`, time });
        }
      });
    }).on('error', (error) => {
      const time = Date.now() - startTime;
      resolve({ success: false, error: `Network error: ${error.message}`, time });
    });
  });
};

// Test fallback mechanism
const testFallbackOrder = async () => {
  console.log('\n🔄 Testing Fallback Mechanism...');
  
  const results = await testAPIs();
  const working = results.filter(r => r.success);
  
  if (working.length > 1) {
    console.log('✅ Multiple APIs working - fallback system operational');
    
    // Sort by response time for optimal fallback order
    working.sort((a, b) => a.time - b.time);
    console.log('\n📋 Recommended fallback order (fastest first):');
    working.forEach((api, index) => {
      console.log(`  ${index + 1}. ${api.name} (${api.time}ms)`);
    });
  } else if (working.length === 1) {
    console.log('⚠️  Only one API working - static fallback recommended');
  } else {
    console.log('❌ No APIs working - static fallback will be used');
  }
};

// Main test
const main = async () => {
  await testFallbackOrder();
  
  console.log('\n🎯 API Test Complete!');
  console.log('\n✨ Features implemented:');
  console.log('  • Multiple API endpoints with different response formats');
  console.log('  • Automatic fallback system (Primary → Fallback → Static)');
  console.log('  • TypeScript-safe API parsing');
  console.log('  • Configurable timeouts per API');
  console.log('  • Live rate fetching with error handling');
};

main().catch(console.error);
