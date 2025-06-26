const { GAS_CONVERSION_UTILS, GAS_TOKEN_CONFIG } = require('../src/config/caldera.ts');

console.log('🧪 Testing Gas Token Conversion Utilities...\n');

// Test data
const testCases = [
  {
    name: 'B3 (ETH native)',
    chainId: 8333,
    amount: 0.01, // 0.01 ETH
    expected: 0.01
  },
  {
    name: 'ApeChain (APE native)',
    chainId: 33139,
    amount: 10, // 10 APE
    expected: 0.01 // 10 APE * 0.001 rate = 0.01 ETH
  },
  {
    name: 'Kinto (ETH native)',
    chainId: 7887,
    amount: 0.005, // 0.005 ETH
    expected: 0.005
  },
  {
    name: 'Manta Pacific (ETH native)',
    chainId: 169,
    amount: 0.02, // 0.02 ETH
    expected: 0.02
  }
];

console.log('📊 Testing convertToEthEquivalent...');
testCases.forEach(test => {
  try {
    const result = GAS_CONVERSION_UTILS.convertToEthEquivalent(test.amount, test.chainId);
    const passed = Math.abs(result - test.expected) < 0.0001;
    
    console.log(`${passed ? '✅' : '❌'} ${test.name}:`);
    console.log(`   Input: ${test.amount} (Chain ${test.chainId})`);
    console.log(`   Expected: ${test.expected} ETH`);
    console.log(`   Got: ${result} ETH`);
    console.log('');
  } catch (error) {
    console.log(`❌ ${test.name}: Error - ${error.message}`);
  }
});

console.log('🏷️  Testing getNativeTokenSymbol...');
const symbolTests = [
  { chainId: 8333, expected: 'ETH' },
  { chainId: 33139, expected: 'APE' },
  { chainId: 7887, expected: 'ETH' },
  { chainId: 999999, expected: 'ETH' } // Unknown chain should default to ETH
];

symbolTests.forEach(test => {
  try {
    const result = GAS_CONVERSION_UTILS.getNativeTokenSymbol(test.chainId);
    const passed = result === test.expected;
    
    console.log(`${passed ? '✅' : '❌'} Chain ${test.chainId}: Expected ${test.expected}, Got ${result}`);
  } catch (error) {
    console.log(`❌ Chain ${test.chainId}: Error - ${error.message}`);
  }
});

console.log('\n💰 Testing calculateTotalGasInEth...');
const gasSpentByChain = {
  8333: 0.01,  // B3: 0.01 ETH
  33139: 10,   // ApeChain: 10 APE = 0.01 ETH equivalent
  7887: 0.005, // Kinto: 0.005 ETH
  169: 0.02    // Manta Pacific: 0.02 ETH
};

const expectedTotal = 0.01 + 0.01 + 0.005 + 0.02; // 0.045 ETH

try {
  const totalGasEth = GAS_CONVERSION_UTILS.calculateTotalGasInEth(gasSpentByChain);
  const passed = Math.abs(totalGasEth - expectedTotal) < 0.0001;
  
  console.log(`${passed ? '✅' : '❌'} Total gas calculation:`);
  console.log(`   Gas spent by chain: ${JSON.stringify(gasSpentByChain)}`);
  console.log(`   Expected total: ${expectedTotal} ETH`);
  console.log(`   Calculated total: ${totalGasEth} ETH`);
} catch (error) {
  console.log(`❌ Total gas calculation: Error - ${error.message}`);
}

console.log('\n📝 Testing formatGasAmount...');
const formatTests = [
  { amount: 10000000000000000, chainId: 8333, expected: '0.010000 ETH' }, // 0.01 ETH in wei
  { amount: 5000000000000000, chainId: 7887, expected: '0.005000 ETH' },  // 0.005 ETH in wei
];

formatTests.forEach((test, index) => {
  try {
    const result = GAS_CONVERSION_UTILS.formatGasAmount(test.amount, test.chainId);
    const passed = result === test.expected;
    
    console.log(`${passed ? '✅' : '❌'} Format test ${index + 1}: Expected "${test.expected}", Got "${result}"`);
  } catch (error) {
    console.log(`❌ Format test ${index + 1}: Error - ${error.message}`);
  }
});

console.log('\n🎯 Gas Token Conversion Test Complete!');
