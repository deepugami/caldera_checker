const { ethers } = require('ethers');

// Updated RPC endpoints based on the provided information
const UPDATED_RPCS = [
  // Fixed RPCs
  { name: 'Kinto', chainId: 7887, rpcUrl: 'https://rpc.kinto-rpc.com' },
  { name: 'AppChain', chainId: 466, rpcUrl: 'https://466.rpc.thirdweb.com' },
  { name: 'Rufus', chainId: 2420, rpcUrl: 'https://rufus.calderachain.xyz/http' },
  { name: 'Towns Mainnet (River)', chainId: 550, rpcUrl: 'https://towns-mainnet.calderachain.xyz/http' },
  
  // Previously working RPCs (for verification)
  { name: 'B3', chainId: 8333, rpcUrl: 'https://mainnet-rpc.b3.fun/http' },
  { name: 'ApeChain', chainId: 33139, rpcUrl: 'https://apechain.calderachain.xyz/http' },
  { name: 'Manta Pacific', chainId: 169, rpcUrl: 'https://pacific-rpc.manta.network/http' },
  { name: 'AlienX', chainId: 10241024, rpcUrl: 'https://rpc.alienxchain.io/http' },
  { name: 'RARI Chain', chainId: 1380012617, rpcUrl: 'https://mainnet.rpc.rarichain.org/http' },
  { name: 'Edgeless Mainnet', chainId: 2026, rpcUrl: 'https://edgeless-mainnet.calderachain.xyz/http' },
  { name: 'Zerion (Zero Network)', chainId: 543210, rpcUrl: 'https://zero-network.calderachain.xyz/http' },
  { name: 'Solo Testnet', chainId: 11155111, rpcUrl: 'https://solo-testnet.rpc.caldera.xyz/http' }
];

async function testRPC(chain) {
  try {
    console.log(`\n🔍 Testing ${chain.name} (Chain ID: ${chain.chainId})`);
    console.log(`   RPC: ${chain.rpcUrl}`);
    
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl, null, {
      staticNetwork: true
    });
    
    // Set a timeout for requests
    provider.pollingInterval = 10000;
    
    // Test basic connectivity
    const startTime = Date.now();
    
    // Test 1: Get network info
    const network = await provider.getNetwork();
    const networkTime = Date.now() - startTime;
    
    // Test 2: Get latest block
    const blockStart = Date.now();
    const block = await provider.getBlock('latest');
    const blockTime = Date.now() - blockStart;
    
    // Test 3: Chain ID verification
    const chainIdMatch = Number(network.chainId) === chain.chainId;
    
    console.log(`   ✅ Network: ${network.name || 'Unknown'} (Chain ID: ${network.chainId})`);
    console.log(`   ✅ Latest Block: #${block.number} (${new Date(block.timestamp * 1000).toISOString()})`);
    console.log(`   ✅ Response Times: Network ${networkTime}ms, Block ${blockTime}ms`);
    
    if (chainIdMatch) {
      console.log(`   ✅ Chain ID matches: ${chain.chainId}`);
    } else {
      console.log(`   ⚠️  Chain ID mismatch: Expected ${chain.chainId}, got ${network.chainId}`);
    }
    
    return {
      name: chain.name,
      status: 'SUCCESS',
      chainId: Number(network.chainId),
      expectedChainId: chain.chainId,
      chainIdMatch,
      latestBlock: block.number,
      networkTime,
      blockTime,
      blockTimestamp: new Date(block.timestamp * 1000).toISOString()
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      name: chain.name,
      status: 'FAILED',
      error: error.message,
      chainId: null,
      expectedChainId: chain.chainId
    };
  }
}

async function main() {
  console.log('🚀 Testing Updated Caldera RPC Endpoints\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const chain of UPDATED_RPCS) {
    const result = await testRPC(chain);
    results.push(result);
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SUMMARY REPORT');
  console.log('=' .repeat(60));
  
  const successful = results.filter(r => r.status === 'SUCCESS');
  const failed = results.filter(r => r.status === 'FAILED');
  const chainIdMismatches = results.filter(r => r.status === 'SUCCESS' && !r.chainIdMatch);
  
  console.log(`\n✅ Successful RPCs: ${successful.length}/${results.length}`);
  successful.forEach(r => {
    console.log(`   • ${r.name}: Block #${r.latestBlock} (${r.networkTime + r.blockTime}ms total)`);
  });
  
  if (chainIdMismatches.length > 0) {
    console.log(`\n⚠️  Chain ID Mismatches: ${chainIdMismatches.length}`);
    chainIdMismatches.forEach(r => {
      console.log(`   • ${r.name}: Expected ${r.expectedChainId}, got ${r.chainId}`);
    });
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed RPCs: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   • ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n' + '=' .repeat(60));
  
  if (failed.length === 0 && chainIdMismatches.length === 0) {
    console.log('🎉 All RPCs are working correctly!');
  } else if (failed.length === 0) {
    console.log('✅ All RPCs are responding, but some have chain ID mismatches.');
  } else {
    console.log('⚠️  Some RPCs need attention.');
  }
}

main().catch(console.error);
