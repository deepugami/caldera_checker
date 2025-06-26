// Quick test for Discord-only allocation fix
const { ScoringService } = require('./src/services/scoring.ts');

// Test Discord user with 0 transactions using a valid role
const discordRoles = [{ name: 'newbies', id: '123' }];
const onChainMetrics = {
  totalTransactions: 0,
  bridgeTransactions: 0, 
  swapTransactions: 0,
  stakingTransactions: 0,
  liquidityTransactions: 0,
  uniqueChainsUsed: 0,
  totalBalance: '0.0',
  gasSpentUSD: 0,
  firstTransactionDate: null,
  lastTransactionDate: null
};

console.log('Testing Discord user (newbies role) with 0 transactions:');
const scorer = new ScoringService();
const result = scorer.calculateAllocation(discordRoles, onChainMetrics);
console.log('Eligible:', result.isEligible);
console.log('Token Amount:', result.tokenAmount);
console.log('Reason:', result.reason);
console.log('Base Allocation:', result.breakdown?.baseAllocation);

// Test user with no Discord roles and 0 transactions
const noRoles = [];
console.log('\nTesting user with no Discord roles and 0 transactions:');
const result2 = scorer.calculateAllocation(noRoles, onChainMetrics);
console.log('Eligible:', result2.isEligible);
console.log('Token Amount:', result2.tokenAmount);
console.log('Reason:', result2.reason);
