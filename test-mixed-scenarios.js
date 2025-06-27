// Test mixed RPC success/failure scenarios
// Run with: node test-mixed-scenarios.js

async function testMixedScenarios() {
  console.log("🧪 TESTING MIXED RPC SUCCESS/FAILURE SCENARIOS")
  console.log("================================================")
  
  const scoring = {
    transactionWeight: 2,
    bridgeWeight: 45,
    swapWeight: 15,
    stakingWeight: 40,
    liquidityWeight: 30,
    chainDiversityWeight: 100,
    balanceWeight: 50
  }
  
  function calculateScore(metrics) {
    let score = 0
    score += metrics.totalTransactions * scoring.transactionWeight
    score += metrics.bridgeTransactions * scoring.bridgeWeight
    score += metrics.swapTransactions * scoring.swapWeight
    score += metrics.stakingTransactions * scoring.stakingWeight
    score += metrics.liquidityTransactions * scoring.liquidityWeight
    score += metrics.uniqueChainsUsed * scoring.chainDiversityWeight
    score += parseFloat(metrics.totalBalance) * scoring.balanceWeight
    return score
  }
  
  // SCENARIO 1: All RPCs fail → Full demo data
  const fullDemoMetrics = {
    totalTransactions: 25,
    bridgeTransactions: 8,
    swapTransactions: 12,
    stakingTransactions: 3,
    liquidityTransactions: 2,
    uniqueChainsUsed: 4,
    totalBalance: '0.125'
  }
  
  // SCENARIO 2: Some RPCs succeed → Mixed real + failed data
  // Real data from successful chains, zeros from failed chains
  const mixedMetrics = {
    totalTransactions: 15, // Only from successful chains
    bridgeTransactions: 5,
    swapTransactions: 7,
    stakingTransactions: 2,
    liquidityTransactions: 1,
    uniqueChainsUsed: 2, // Only successful chains count
    totalBalance: '0.080' // Only from successful chains
  }
  
  // SCENARIO 3: All RPCs succeed → Full real data
  const fullRealMetrics = {
    totalTransactions: 45, // Higher from real activity
    bridgeTransactions: 15,
    swapTransactions: 18,
    stakingTransactions: 8,
    liquidityTransactions: 4,
    uniqueChainsUsed: 5, // All chains active
    totalBalance: '0.250' // Higher real balance
  }
  
  const scenarios = [
    { name: "All RPCs Fail (Full Demo)", metrics: fullDemoMetrics },
    { name: "Some RPCs Succeed (Mixed)", metrics: mixedMetrics },
    { name: "All RPCs Succeed (Full Real)", metrics: fullRealMetrics }
  ]
  
  console.log("📊 CALCULATING ALLOCATIONS:")
  console.log("=============================")
  
  scenarios.forEach((scenario, i) => {
    const score = calculateScore(scenario.metrics)
    const allocation = Math.round(score) // No roles = 0 base + score
    
    console.log(`${i + 1}. ${scenario.name}`)
    console.log(`   Transactions: ${scenario.metrics.totalTransactions}`)
    console.log(`   Unique Chains: ${scenario.metrics.uniqueChainsUsed}`)
    console.log(`   Balance: ${scenario.metrics.totalBalance} ETH`)
    console.log(`   Bridge/Swap/Stake/LP: ${scenario.metrics.bridgeTransactions}/${scenario.metrics.swapTransactions}/${scenario.metrics.stakingTransactions}/${scenario.metrics.liquidityTransactions}`)
    console.log(`   📊 Score: ${score.toFixed(2)}`)
    console.log(`   💰 Allocation: ${allocation} tokens`)
    console.log("")
  })
  
  const scores = scenarios.map(s => calculateScore(s.metrics))
  const maxDiff = Math.max(...scores) - Math.min(...scores)
  
  console.log("🎯 ANALYSIS:")
  console.log("=============")
  console.log(`Max Allocation Difference: ${Math.round(maxDiff)} tokens`)
  console.log("This explains large fluctuations when RPC availability varies!")
  console.log("")
  console.log("The issue occurs because:")
  console.log("1. Some chains might be accessible while others aren't")
  console.log("2. Partial data skews the total metrics significantly")
  console.log("3. Demo data kicks in only when ALL chains fail")
  console.log("4. Same wallet gets different data depending on network conditions")
}

testMixedScenarios()
