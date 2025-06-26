const https = require('https');
const http = require('http');

// Define all APIs to test
const PRICE_APIS = {
  coingecko: {
    name: 'CoinGecko',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=apecoin&vs_currencies=eth',
    parser: (data) => data.apecoin?.eth,
    requiresAuth: false
  },
  binance: {
    name: 'Binance',
    url: 'https://api.binance.com/api/v3/ticker/price?symbol=APEETH',
    parser: (data) => parseFloat(data.price),
    requiresAuth: false
  },
  cryptocompare: {
    name: 'CryptoCompare',
    url: 'https://min-api.cryptocompare.com/data/price?fsym=APE&tsyms=ETH',
    parser: (data) => data.ETH,
    requiresAuth: false
  },
  coinmarketcap: {
    name: 'CoinMarketCap',
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=APE&convert=ETH',
    parser: (data) => data.data?.APE?.quote?.ETH?.price,
    requiresAuth: true,
    headers: {
      'X-CMC_PRO_API_KEY': 'YOUR_API_KEY_HERE'
    }
  },
  nomics: {
    name: 'Nomics',
    url: 'https://api.nomics.com/v1/currencies/ticker?key=YOUR_API_KEY&ids=APE&convert=ETH',
    parser: (data) => data[0]?.price,
    requiresAuth: true
  },
  coinpaprika: {
    name: 'CoinPaprika',
    url: 'https://api.coinpaprika.com/v1/tickers/ape-apecoin?quotes=ETH',
    parser: (data) => data.quotes?.ETH?.price,
    requiresAuth: false
  },
  kraken: {
    name: 'Kraken',
    url: 'https://api.kraken.com/0/public/Ticker?pair=APEETH',
    parser: (data) => {
      const pair = Object.keys(data.result)[0];
      return parseFloat(data.result[pair]?.c?.[0]);
    },
    requiresAuth: false
  }
};

// Test function for each API
const testAPI = async (apiKey, config) => {
  console.log(`🧪 Testing ${config.name}...`);
  
  if (config.requiresAuth) {
    console.log(`   ⚠️  Requires API key - skipping live test`);
    return { 
      success: false, 
      price: null, 
      error: 'Requires API key', 
      responseTime: null,
      available: true // Available but needs auth
    };
  }

  const startTime = Date.now();
  
  return new Promise((resolve) => {
    try {
      const url = new URL(config.url);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          ...config.headers
        }
      };

      const req = protocol.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          try {
            const parsed = JSON.parse(data);
            const price = config.parser(parsed);
            
            if (price && !isNaN(price) && price > 0) {
              console.log(`   ✅ Success: ${price} ETH (${responseTime}ms)`);
              resolve({ 
                success: true, 
                price, 
                error: null, 
                responseTime,
                available: true
              });
            } else {
              console.log(`   ❌ Invalid price data: ${price}`);
              resolve({ 
                success: false, 
                price: null, 
                error: 'Invalid price data', 
                responseTime,
                available: true
              });
            }
          } catch (error) {
            console.log(`   ❌ Parse error: ${error.message}`);
            resolve({ 
              success: false, 
              price: null, 
              error: `Parse error: ${error.message}`, 
              responseTime,
              available: true
            });
          }
        });
      });

      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        console.log(`   ❌ Network error: ${error.message}`);
        resolve({ 
          success: false, 
          price: null, 
          error: `Network error: ${error.message}`, 
          responseTime,
          available: false
        });
      });

      req.setTimeout(10000, () => {
        const responseTime = Date.now() - startTime;
        console.log(`   ❌ Timeout after ${responseTime}ms`);
        req.destroy();
        resolve({ 
          success: false, 
          price: null, 
          error: 'Timeout', 
          responseTime,
          available: false
        });
      });

      req.end();
    } catch (error) {
      console.log(`   ❌ Request error: ${error.message}`);
      resolve({ 
        success: false, 
        price: null, 
        error: `Request error: ${error.message}`, 
        responseTime: null,
        available: false
      });
    }
  });
};

// Main testing function
const main = async () => {
  console.log('🚀 Testing Price APIs for Gas Conversion\n');
  console.log('============================================\n');

  const results = {};
  const workingAPIs = [];
  const availableAPIs = [];

  // Test all APIs
  for (const [key, config] of Object.entries(PRICE_APIS)) {
    const result = await testAPI(key, config);
    results[key] = { ...result, config };
    
    if (result.success) {
      workingAPIs.push(key);
    }
    if (result.available) {
      availableAPIs.push(key);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n============================================');
  console.log('📊 SUMMARY REPORT');
  console.log('============================================\n');

  console.log(`✅ Working APIs (no auth required): ${workingAPIs.length}`);
  workingAPIs.forEach(api => {
    const result = results[api];
    console.log(`   • ${result.config.name}: ${result.price} ETH (${result.responseTime}ms)`);
  });

  console.log(`\n📋 Available APIs (with auth): ${availableAPIs.length - workingAPIs.length}`);
  availableAPIs.filter(api => !workingAPIs.includes(api)).forEach(api => {
    const result = results[api];
    console.log(`   • ${result.config.name}: ${result.error}`);
  });

  console.log(`\n❌ Unavailable APIs: ${Object.keys(PRICE_APIS).length - availableAPIs.length}`);
  Object.keys(PRICE_APIS).filter(api => !availableAPIs.includes(api)).forEach(api => {
    const result = results[api];
    console.log(`   • ${result.config.name}: ${result.error}`);
  });

  // Generate configuration for working APIs
  if (workingAPIs.length > 0) {
    console.log('\n🔧 RECOMMENDED CONFIGURATION');
    console.log('============================================\n');
    
    console.log('// Primary API endpoints (no auth required)');
    console.log('export const PRICE_API_ENDPOINTS = {');
    
    workingAPIs.forEach((api, index) => {
      const result = results[api];
      const speed = result.responseTime < 1000 ? 'fast' : result.responseTime < 3000 ? 'medium' : 'slow';
      console.log(`  ${api}: {`);
      console.log(`    name: '${result.config.name}',`);
      console.log(`    url: '${result.config.url}',`);
      console.log(`    speed: '${speed}', // ${result.responseTime}ms`);
      console.log(`    parser: ${result.config.parser.toString()}`);
      console.log(`  }${index < workingAPIs.length - 1 ? ',' : ''}`);
    });
    
    console.log('};');

    // Fallback order based on speed
    const sortedAPIs = workingAPIs.sort((a, b) => results[a].responseTime - results[b].responseTime);
    console.log('\n// Recommended fallback order (fastest to slowest)');
    console.log(`export const API_FALLBACK_ORDER = [${sortedAPIs.map(api => `'${api}'`).join(', ')}];`);
  }

  console.log('\n🎯 API Testing Complete!');
};

main().catch(console.error);
