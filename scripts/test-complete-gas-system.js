const { CALDERA_CHAINS, GAS_CONVERSION_UTILS, GAS_TOKEN_CONFIG } = require('../src/config/caldera.ts');

console.log('🧪 Testing Complete Gas Token System...\n');

// Test 1: Verify all chains have correct native tokens
console.log('📋 Testing Native Token Configuration...');
const expectedTokens = {
  'B3': 'ETH',
  'ApeChain': 'APE',
  'Rufus': 'ETH',
  'Towns Mainnet (River)': 'ETH',
  'Manta Pacific': 'ETH',
  'Kinto': 'ETH',
  'AlienX': 'ETH',
  'RARI Chain': 'ETH',
  'AppChain': 'ETH',
  'Rivalz': 'ETH',
  'Edgeless Mainnet': 'ETH',
  'Zerion (Zero Network)': 'ETH',
  'Solo Testnet': 'ETH'
};

CALDERA_CHAINS.forEach(chain => {
  const expected = expectedTokens[chain.name];
  const actual = chain.nativeToken.symbol;
  const passed = actual === expected;
  
  console.log(`${passed ? '✅' : '❌'} ${chain.name}: Expected ${expected}, Got ${actual}`);
  
  if (!passed) {
    console.log(`   ⚠️  Chain ID: ${chain.chainId}, RPC: ${chain.rpcUrl}`);
  }
});

// Test 2: Gas conversion functionality
console.log('\n💰 Testing Gas Conversion Functions...');

// Test ETH chains (should return same value)
const ethChains = [8333, 2420, 550, 169, 7887]; // B3, Rufus, Towns, Manta, Kinto
ethChains.forEach(chainId => {
  const testAmount = 0.01;
  const result = GAS_CONVERSION_UTILS.convertToEthEquivalent(testAmount, chainId);
  const passed = Math.abs(result - testAmount) < 0.0001;
  
  const chainName = CALDERA_CHAINS.find(c => c.chainId === chainId)?.name || `Chain ${chainId}`;
  console.log(`${passed ? '✅' : '❌'} ${chainName}: ${testAmount} ETH → ${result} ETH`);
});

// Test APE chain conversion
const apeChainTest = GAS_CONVERSION_UTILS.convertToEthEquivalent(10, 33139); // 10 APE
const expectedAPE = 10 * GAS_TOKEN_CONFIG.conversionRates.APE; // 10 * 0.001 = 0.01 ETH
const apeTestPassed = Math.abs(apeChainTest - expectedAPE) < 0.0001;
console.log(`${apeTestPassed ? '✅' : '❌'} ApeChain: 10 APE → ${apeChainTest} ETH (expected ${expectedAPE})`);

// Test 3: Token symbol detection
console.log('\n🏷️  Testing Token Symbol Detection...');
const symbolTests = [
  { chainId: 8333, expected: 'ETH', name: 'B3' },
  { chainId: 33139, expected: 'APE', name: 'ApeChain' },
  { chainId: 7887, expected: 'ETH', name: 'Kinto' },
  { chainId: 169, expected: 'ETH', name: 'Manta Pacific' }
];

symbolTests.forEach(test => {
  const result = GAS_CONVERSION_UTILS.getNativeTokenSymbol(test.chainId);
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} ${test.name} (${test.chainId}): Expected ${test.expected}, Got ${result}`);
});

// Test 4: Multi-chain gas calculation
console.log('\n⛽ Testing Multi-Chain Gas Calculation...');
const multiChainGas = {
  8333: 0.01,   // B3: 0.01 ETH
  33139: 20,    // ApeChain: 20 APE = 0.02 ETH equivalent
  7887: 0.005,  // Kinto: 0.005 ETH
  169: 0.015    // Manta Pacific: 0.015 ETH
};

const totalExpected = 0.01 + (20 * 0.001) + 0.005 + 0.015; // 0.05 ETH
const totalCalculated = GAS_CONVERSION_UTILS.calculateTotalGasInEth(multiChainGas);
const totalTestPassed = Math.abs(totalCalculated - totalExpected) < 0.0001;

console.log(`${totalTestPassed ? '✅' : '❌'} Multi-chain total: Expected ${totalExpected} ETH, Got ${totalCalculated} ETH`);

// Test 5: Format gas amounts
console.log('\n📝 Testing Gas Amount Formatting...');
const formatTests = [
  { amount: 10000000000000000, chainId: 8333, expected: '0.010000 ETH' }, // 0.01 ETH in wei for B3
  { amount: 20000000000000000000, chainId: 33139, expected: '20.000000 APE' }, // 20 APE in wei for ApeChain
];

formatTests.forEach((test, index) => {
  const result = GAS_CONVERSION_UTILS.formatGasAmount(test.amount, test.chainId);
  const passed = result === test.expected;
  console.log(`${passed ? '✅' : '❌'} Format test ${index + 1}: Expected "${test.expected}", Got "${result}"`);
});

// Test 6: Chain configuration completeness
console.log('\n🔧 Testing Chain Configuration Completeness...');
const requiredFields = ['name', 'chainId', 'rpcUrl', 'explorerUrl', 'nativeToken'];
let configErrors = 0;

CALDERA_CHAINS.forEach(chain => {
  requiredFields.forEach(field => {
    if (!chain[field]) {
      console.log(`❌ ${chain.name}: Missing ${field}`);
      configErrors++;
    }
  });
  
  // Check native token structure
  if (chain.nativeToken) {
    const tokenFields = ['symbol', 'name', 'decimals'];
    tokenFields.forEach(field => {
      if (!chain.nativeToken[field]) {
        console.log(`❌ ${chain.name}: Missing nativeToken.${field}`);
        configErrors++;
      }
    });
  }
});

if (configErrors === 0) {
  console.log('✅ All chains have complete configuration');
} else {
  console.log(`❌ Found ${configErrors} configuration errors`);
}

// Summary
console.log('\n📊 Test Summary:');
console.log(`Total Caldera Chains: ${CALDERA_CHAINS.length}`);
console.log(`ETH Native Chains: ${GAS_TOKEN_CONFIG.ethNativeChains.length}`);
console.log(`Non-ETH Chains: ${Object.keys(GAS_TOKEN_CONFIG.nonEthChains).length}`);
console.log(`Mainnet Chains: ${CALDERA_CHAINS.filter(c => !c.isTestnet).length}`);
console.log(`Testnet Chains: ${CALDERA_CHAINS.filter(c => c.isTestnet).length}`);

console.log('\n🎯 Gas Token System Test Complete!');
