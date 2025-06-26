const https = require('https');

async function testRivalzRPC() {
  const rpcUrl = 'https://rivalz.calderachain.xyz/http';
  const chainId = 753;
  
  console.log(`Testing Rivalz RPC: ${rpcUrl}`);
  console.log(`Expected Chain ID: ${chainId}`);
  console.log('---');
  
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_chainId',
    params: [],
    id: 1
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(rpcUrl, options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            console.log(`❌ RPC Error: ${response.error.message}`);
            resolve(false);
            return;
          }
          
          const returnedChainId = parseInt(response.result, 16);
          
          if (returnedChainId === chainId) {
            console.log(`✅ Rivalz RPC is working correctly`);
            console.log(`   Chain ID: ${returnedChainId} ✓`);
            console.log(`   Status Code: ${res.statusCode}`);
            resolve(true);
          } else {
            console.log(`❌ Chain ID mismatch for Rivalz`);
            console.log(`   Expected: ${chainId}`);
            console.log(`   Got: ${returnedChainId}`);
            resolve(false);
          }
        } catch (parseError) {
          console.log(`❌ Failed to parse response: ${parseError.message}`);
          console.log(`   Raw response: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Network error: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ Request timeout`);
      req.destroy();
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

async function testBlockNumber() {
  const rpcUrl = 'https://rivalz.calderachain.xyz/http';
  
  console.log('\nTesting block number retrieval...');
  
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 2
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    },
    timeout: 10000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(rpcUrl, options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            console.log(`❌ Block number error: ${response.error.message}`);
            resolve(false);
            return;
          }
          
          const blockNumber = parseInt(response.result, 16);
          console.log(`✅ Latest block: ${blockNumber.toLocaleString()}`);
          resolve(true);
        } catch (parseError) {
          console.log(`❌ Failed to parse block response: ${parseError.message}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Block request error: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ Block request timeout`);
      req.destroy();
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🔍 Testing Rivalz RPC Endpoint\n');
  
  const chainIdTest = await testRivalzRPC();
  const blockTest = await testBlockNumber();
  
  console.log('\n📊 Summary:');
  console.log(`Chain ID Test: ${chainIdTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Block Number Test: ${blockTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (chainIdTest && blockTest) {
    console.log('\n🎉 Rivalz RPC is fully functional and ready to use!');
  } else {
    console.log('\n⚠️ Rivalz RPC has issues and may need attention.');
  }
}

main().catch(console.error);
