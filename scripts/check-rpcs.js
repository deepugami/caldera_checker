#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Extract mainnet RPC URLs from the config - Updated with correct endpoints
const MAINNET_RPCS = [
  { name: 'B3', url: 'https://mainnet-rpc.b3.fun/http', chainId: 8333 },
  { name: 'ApeChain', url: 'https://apechain.calderachain.xyz/http', chainId: 33139 },
  { name: 'Rufus', url: 'https://rufus.calderachain.xyz/http', chainId: 2420 },
  { name: 'Towns Mainnet', url: 'https://towns-mainnet.calderachain.xyz/http', chainId: 550 },
  { name: 'Manta Pacific', url: 'https://pacific-rpc.manta.network/http', chainId: 169 },
  { name: 'Kinto', url: 'https://rpc.kinto-rpc.com', chainId: 7887 },
  { name: 'AlienX', url: 'https://rpc.alienxchain.io/http', chainId: 10241024 },
  { name: 'RARI Chain', url: 'https://mainnet.rpc.rarichain.org/http', chainId: 1380012617 },
  { name: 'Rivalz', url: 'https://rivalz.calderachain.xyz/http', chainId: 753 },
  { name: 'AppChain', url: 'https://466.rpc.thirdweb.com', chainId: 466 },
  { name: 'Edgeless Mainnet', url: 'https://edgeless-mainnet.calderachain.xyz/http', chainId: 2026 },
  { name: 'Zerion (Zero Network)', url: 'https://zero-network.calderachain.xyz/http', chainId: 543210 }
];

// Function to make JSON-RPC request
function makeRpcRequest(url, chainId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_chainId",
      params: [],
      id: 1
    });

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Caldera-RPC-Checker/1.0'
      },
      timeout: 10000 // 10 second timeout
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (response.result) {
            const returnedChainId = parseInt(response.result, 16);
            resolve({
              status: 'success',
              statusCode: res.statusCode,
              chainId: returnedChainId,
              expectedChainId: chainId,
              chainIdMatch: returnedChainId === chainId,
              responseTime: Date.now() - startTime
            });
          } else {
            resolve({
              status: 'error',
              statusCode: res.statusCode,
              error: response.error || 'No result in response',
              responseTime: Date.now() - startTime
            });
          }
        } catch (error) {
          resolve({
            status: 'error',
            statusCode: res.statusCode,
            error: 'Invalid JSON response',
            responseTime: Date.now() - startTime
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 'error',
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'error',
        error: 'Request timeout (10s)',
        responseTime: 10000
      });
    });

    const startTime = Date.now();
    req.write(data);
    req.end();
  });
}

// Function to test all RPCs
async function testAllRpcs() {
  console.log('🔍 Testing Caldera Mainnet RPC Endpoints...\n');
  
  const results = [];
  let working = 0;
  let failed = 0;

  for (const rpc of MAINNET_RPCS) {
    process.stdout.write(`Testing ${rpc.name.padEnd(25)} `);
    
    try {
      const result = await makeRpcRequest(rpc.url, rpc.chainId);
      
      if (result.status === 'success') {
        if (result.chainIdMatch) {
          console.log(`✅ Working (${result.responseTime}ms)`);
          working++;
        } else {
          console.log(`⚠️  Chain ID mismatch! Expected: ${result.expectedChainId}, Got: ${result.chainId} (${result.responseTime}ms)`);
          failed++;
        }
      } else {
        console.log(`❌ Failed: ${result.error} (${result.responseTime || 'N/A'}ms)`);
        failed++;
      }
      
      results.push({
        name: rpc.name,
        url: rpc.url,
        ...result
      });
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failed++;
      results.push({
        name: rpc.name,
        url: rpc.url,
        status: 'error',
        error: error.message
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 RPC Test Summary:');
  console.log(`✅ Working: ${working}/${MAINNET_RPCS.length}`);
  console.log(`❌ Failed: ${failed}/${MAINNET_RPCS.length}`);
  console.log(`📈 Success Rate: ${((working / MAINNET_RPCS.length) * 100).toFixed(1)}%`);

  // Show failed endpoints for debugging
  const failedEndpoints = results.filter(r => r.status !== 'success' || !r.chainIdMatch);
  if (failedEndpoints.length > 0) {
    console.log('\n🔧 Failed Endpoints:');
    failedEndpoints.forEach(endpoint => {
      console.log(`- ${endpoint.name}: ${endpoint.error || 'Chain ID mismatch'}`);
      console.log(`  URL: ${endpoint.url}`);
    });
  }

  // Show performance metrics for working endpoints
  const workingEndpoints = results.filter(r => r.status === 'success' && r.chainIdMatch);
  if (workingEndpoints.length > 0) {
    console.log('\n⚡ Performance Metrics:');
    const avgResponseTime = workingEndpoints.reduce((sum, e) => sum + e.responseTime, 0) / workingEndpoints.length;
    const fastestEndpoint = workingEndpoints.reduce((prev, curr) => 
      prev.responseTime < curr.responseTime ? prev : curr
    );
    const slowestEndpoint = workingEndpoints.reduce((prev, curr) => 
      prev.responseTime > curr.responseTime ? prev : curr
    );
    
    console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`Fastest: ${fastestEndpoint.name} (${fastestEndpoint.responseTime}ms)`);
    console.log(`Slowest: ${slowestEndpoint.name} (${slowestEndpoint.responseTime}ms)`);
  }

  console.log('\n' + '='.repeat(60));
  
  return {
    total: MAINNET_RPCS.length,
    working,
    failed,
    successRate: (working / MAINNET_RPCS.length) * 100,
    results
  };
}

// Run the test
if (require.main === module) {
  testAllRpcs()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = { testAllRpcs, MAINNET_RPCS };
