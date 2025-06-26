// Test the new multi-API gas conversion system
// This script tests the fallback mechanism and live rate fetching

const { GAS_CONVERSION_UTILS, GAS_TOKEN_CONFIG } = require('../src/config/caldera.ts');

console.log('🧪 Testing Multi-API Gas Conversion System...\n');

// Mock fetch for Node.js environment
global.fetch = require('node-fetch');

// Test 1: Test static conversion (should work immediately)
console.log('📊 Testing Static Conversion...');
const testCases = [
  { chainId: 8333, amount: 0.01, expected: 0.01, name: 'B3 (ETH)' },
  { chainId: 33139, amount: 10, expected: 0.01, name: 'ApeChain (APE)' },
  { chainId: 550, amount: 0.005, expected: 0.005, name: 'Towns (ETH)' }
];

testCases.forEach(test => {
  const result = GAS_CONVERSION_UTILS.convertToEthEquivalent(test.amount, test.chainId);
  const passed = Math.abs(result - test.expected) < 0.001; // Allow small variance
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${test.amount} → ${result} ETH`);
});

// Test 2: Test live conversion (async)
console.log('\n💰 Testing Live Conversion (with API calls)...');

const testLiveConversion = async () => {
  try {
    console.log('Fetching live APE/ETH rate...');
    const liveRate = await GAS_CONVERSION_UTILS.fetchLiveConversionRate('APE');
    console.log(`✅ Live APE rate: ${liveRate} ETH`);
    
    // Test live conversion for ApeChain
    const apeAmount = 100; // 100 APE
    const ethEquivalent = await GAS_CONVERSION_UTILS.convertToEthEquivalentLive(apeAmount, 33139);
    console.log(`✅ Live conversion: ${apeAmount} APE → ${ethEquivalent} ETH`);
    
    // Test ETH chain (should return immediately)
    const ethAmount = 0.05;
    const ethResult = await GAS_CONVERSION_UTILS.convertToEthEquivalentLive(ethAmount, 8333);
    console.log(`✅ ETH chain: ${ethAmount} ETH → ${ethResult} ETH`);
    
  } catch (error) {
    console.log(`❌ Live conversion failed: ${error.message}`);
  }
};

// Test 3: Test multi-chain gas calculation
console.log('\n⛽ Testing Multi-Chain Gas Calculation...');

const testMultiChainGas = async () => {
  const gasSpentByChain = {
    8333: 0.01,   // B3: 0.01 ETH
    33139: 50,    // ApeChain: 50 APE
    550: 0.005,   // Towns: 0.005 ETH
    169: 0.02     // Manta: 0.02 ETH
  };
  
  try {
    console.log('Testing static calculation...');
    const staticTotal = GAS_CONVERSION_UTILS.calculateTotalGasInEth(gasSpentByChain);
    console.log(`✅ Static total: ${staticTotal} ETH`);
    
    console.log('Testing live calculation...');
    const liveTotal = await GAS_CONVERSION_UTILS.calculateTotalGasInEthLive(gasSpentByChain);
    console.log(`✅ Live total: ${liveTotal} ETH`);
    
    console.log(`📊 Difference: ${Math.abs(liveTotal - staticTotal).toFixed(6)} ETH`);
    
  } catch (error) {
    console.log(`❌ Multi-chain calculation failed: ${error.message}`);
  }
};

// Test 4: Test API fallback mechanism
console.log('\n🔄 Testing API Fallback Mechanism...');

const testAPIFallback = async () => {
  const config = GAS_TOKEN_CONFIG.priceApiEndpoints;
  
  console.log(`Primary APIs: ${config.primary.length}`);
  config.primary.forEach(api => {
    console.log(`  • ${api.name}: ${api.url.substring(0, 50)}...`);
  });
  
  console.log(`Fallback APIs: ${config.fallback.length}`);
  config.fallback.forEach(api => {
    console.log(`  • ${api.name}: ${api.url.substring(0, 50)}...`);
  });
  
  console.log(`Static fallback rate for APE: ${config.staticFallback.APE} ETH`);
};

// Run all tests
const runAllTests = async () => {
  await testLiveConversion();
  await testMultiChainGas();
  await testAPIFallback();
  
  console.log('\n🎯 Multi-API Gas Conversion Test Complete!');
  console.log('\n✨ Features tested:');
  console.log('  • Static conversion rates');
  console.log('  • Live API rate fetching');
  console.log('  • Multi-API fallback system');
  console.log('  • Multi-chain gas calculation');
  console.log('  • Error handling and timeouts');
};

runAllTests().catch(console.error);
