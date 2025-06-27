// Test script to verify reduced allocation calculations
// Run with: node test-reduced-allocations.js

const ALLOCATION_CONFIG = {
  baseAllocationByRole: {
    'default': 0
  },
  
  roleMultipliers: {
    'default': 1.0
  },
  
  // REDUCED scoring weights (70% reduction)
  onChainScoring: {
    transactionWeight: 0.6,      // was 2
    bridgeWeight: 14,            // was 45
    swapWeight: 5,               // was 15
    stakingWeight: 12,           // was 40
    liquidityWeight: 9,          // was 30
    chainDiversityWeight: 30,    // was 100
    balanceWeight: 15,           // was 50
    
    powerUserBonus: {
      transactions: { threshold: 500, bonus: 30 },     // was 100
      chains: { threshold: 5, bonus: 60 },             // was 200
      balance: { threshold: 0.1, bonus: 45 }           // was 150
    }
  }
}

const ALLOCATION_FORMULA = {
  activityBonusEnabled: true,
  activityBonusMultiplier: 1.15 // was 1.5 (50% bonus, now 15%)
}

// Example user metrics (same as current user)
const testMetrics = {
  totalTransactions: 25,
  uniqueChainsUsed: 4,
  totalBalance: '0.125',  // 0.1250 ETH
  bridgeTransactions: 8,
  swapTransactions: 12,
  stakingTransactions: 3,
  liquidityTransactions: 2
}

// Calculate OLD vs NEW allocations
function calculateAllocation(metrics, isOldSystem = false) {
  const scoring = isOldSystem ? {
    // OLD scoring weights
    transactionWeight: 2,
    bridgeWeight: 45,
    swapWeight: 15,
    stakingWeight: 40,
    liquidityWeight: 30,
    chainDiversityWeight: 100,
    balanceWeight: 50,
    powerUserBonus: {
      transactions: { threshold: 500, bonus: 100 },
      chains: { threshold: 5, bonus: 200 },
      balance: { threshold: 0.1, bonus: 150 }
    }
  } : ALLOCATION_CONFIG.onChainScoring

  const activityMultiplier = isOldSystem ? 1.5 : ALLOCATION_FORMULA.activityBonusMultiplier
  
  // Base allocation (no Discord roles)
  const baseAllocation = 0
  
  // Calculate on-chain score
  let onChainScore = 0
  onChainScore += metrics.totalTransactions * scoring.transactionWeight
  onChainScore += metrics.bridgeTransactions * scoring.bridgeWeight
  onChainScore += metrics.swapTransactions * scoring.swapWeight
  onChainScore += metrics.stakingTransactions * scoring.stakingWeight
  onChainScore += metrics.liquidityTransactions * scoring.liquidityWeight
  onChainScore += metrics.uniqueChainsUsed * scoring.chainDiversityWeight
  onChainScore += parseFloat(metrics.totalBalance) * scoring.balanceWeight
  
  // Power user bonuses
  if (metrics.totalTransactions >= scoring.powerUserBonus.transactions.threshold) {
    onChainScore += scoring.powerUserBonus.transactions.bonus
  }
  if (metrics.uniqueChainsUsed >= scoring.powerUserBonus.chains.threshold) {
    onChainScore += scoring.powerUserBonus.chains.bonus
  }
  if (parseFloat(metrics.totalBalance) >= scoring.powerUserBonus.balance.threshold) {
    onChainScore += scoring.powerUserBonus.balance.bonus
  }
  
  // Role multiplier (1.0 for no roles)
  const roleMultiplier = 1.0
  const onChainBonus = onChainScore * roleMultiplier
  
  // Activity bonus (for high-activity users)
  let activityBonus = 0
  const isHighActivity = metrics.totalTransactions >= 200
  const isMultiChain = metrics.uniqueChainsUsed >= 5
  const hasSignificantBalance = parseFloat(metrics.totalBalance) >= 0.05
  
  if (isHighActivity && isMultiChain && hasSignificantBalance) {
    activityBonus = onChainScore * (activityMultiplier - 1)
  }
  
  const totalAllocation = baseAllocation + onChainBonus + activityBonus
  
  return {
    baseAllocation,
    onChainScore: Math.round(onChainScore),
    onChainBonus: Math.round(onChainBonus),
    activityBonus: Math.round(activityBonus),
    totalAllocation: Math.round(totalAllocation)
  }
}

console.log("🧪 ALLOCATION REDUCTION TEST")
console.log("===============================")

console.log("\n📊 Test User Profile:")
console.log(`• No Discord roles (default role)`)
console.log(`• ${testMetrics.totalTransactions} transactions across ${testMetrics.uniqueChainsUsed} chains`)
console.log(`• ${testMetrics.totalBalance} ETH balance`)
console.log(`• ${testMetrics.bridgeTransactions} bridge, ${testMetrics.swapTransactions} swap, ${testMetrics.stakingTransactions} staking, ${testMetrics.liquidityTransactions} LP txs`)

const oldAllocation = calculateAllocation(testMetrics, true)
const newAllocation = calculateAllocation(testMetrics, false)

console.log("\n📈 OLD SYSTEM (Current):")
console.log(`• Base allocation: ${oldAllocation.baseAllocation} tokens`)
console.log(`• On-chain score: ${oldAllocation.onChainScore} points`)
console.log(`• On-chain bonus: ${oldAllocation.onChainBonus} tokens`)
console.log(`• Activity bonus: ${oldAllocation.activityBonus} tokens`)
console.log(`• 🎯 TOTAL: ${oldAllocation.totalAllocation} tokens`)

console.log("\n📉 NEW SYSTEM (Optimized):")
console.log(`• Base allocation: ${newAllocation.baseAllocation} tokens`)
console.log(`• On-chain score: ${newAllocation.onChainScore} points`)
console.log(`• On-chain bonus: ${newAllocation.onChainBonus} tokens`)
console.log(`• Activity bonus: ${newAllocation.activityBonus} tokens`)
console.log(`• 🎯 TOTAL: ${newAllocation.totalAllocation} tokens`)

const reduction = oldAllocation.totalAllocation - newAllocation.totalAllocation
const reductionPercent = ((reduction / oldAllocation.totalAllocation) * 100).toFixed(1)

console.log("\n🎯 REDUCTION ANALYSIS:")
console.log(`• Absolute reduction: ${reduction} tokens`)
console.log(`• Percentage reduction: ${reductionPercent}%`)
console.log(`• Target was: 60-70% reduction`)

if (reductionPercent >= 60 && reductionPercent <= 75) {
  console.log(`✅ SUCCESS: Achieved target reduction of ${reductionPercent}%`)
} else if (reductionPercent < 60) {
  console.log(`⚠️ ADJUSTMENT NEEDED: Only ${reductionPercent}% reduction (target: 60-70%)`)
} else {
  console.log(`⚠️ OVER-REDUCED: ${reductionPercent}% reduction (target: 60-70%)`)
}

console.log("\n💡 NEW EXPECTED RESULTS:")
console.log(`• User with no Discord roles: ~${newAllocation.totalAllocation} tokens`)
console.log(`• Much more conservative allocation system`)
console.log(`• Still rewards on-chain activity but at reduced rates`)
