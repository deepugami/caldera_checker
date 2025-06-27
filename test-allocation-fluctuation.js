// Test to prove allocation fluctuation issue
// Run with: node test-allocation-fluctuation.js

async function testAllocationFluctuation() {
  console.log("🧪 TESTING ALLOCATION FLUCTUATION ISSUE")
  console.log("==========================================")
  
  // Simulate the two scenarios:
  
  // SCENARIO 1: RPC calls succeed, real data with live APE conversion
  console.log("📡 SCENARIO 1: RPC Success - Real Data with Live APE Conversion")
  const liveApePrice = 1.25 // Current APE price in USD (example)
  const ethPrice = 3200 // Current ETH price in USD (example)
  const liveApeToEthRate = liveApePrice / ethPrice // ~0.00039
  const apeAmount = 62.5
  const liveEthEquivalent = apeAmount * liveApeToEthRate
  
  const realDataMetrics = {
    totalTransactions: 25,
    bridgeTransactions: 8,
    swapTransactions: 12,
    stakingTransactions: 3,
    liquidityTransactions: 2,
    uniqueChainsUsed: 4,
    totalBalance: (0.125 + liveEthEquivalent).toString() // Base + converted APE
  }
  
  console.log(`   APE Amount: ${apeAmount}`)
  console.log(`   Live APE/ETH Rate: ${liveApeToEthRate.toFixed(8)}`)
  console.log(`   Live ETH Equivalent: ${liveEthEquivalent.toFixed(6)} ETH`)
  console.log(`   Total Balance: ${realDataMetrics.totalBalance} ETH`)
  
  // SCENARIO 2: RPC calls fail, demo data with static APE conversion
  console.log("\n💾 SCENARIO 2: RPC Failure - Demo Data with Static APE Conversion")
  const staticApeToEthRate = 0.00025 // Fixed rate from demo data
  const staticEthEquivalent = apeAmount * staticApeToEthRate
  
  const demoDataMetrics = {
    totalTransactions: 25,
    bridgeTransactions: 8,
    swapTransactions: 12,
    stakingTransactions: 3,
    liquidityTransactions: 2,
    uniqueChainsUsed: 4,
    totalBalance: '0.125' // Fixed demo balance
  }
  
  console.log(`   APE Amount: ${apeAmount}`)
  console.log(`   Static APE/ETH Rate: ${staticApeToEthRate.toFixed(8)}`)
  console.log(`   Static ETH Equivalent: ${staticEthEquivalent.toFixed(6)} ETH`)
  console.log(`   Total Balance: ${demoDataMetrics.totalBalance} ETH`)
  
  // Calculate scores for both scenarios
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
  
  const realDataScore = calculateScore(realDataMetrics)
  const demoDataScore = calculateScore(demoDataMetrics)
  
  console.log("\n📊 ALLOCATION CALCULATION:")
  console.log("===========================")
  console.log(`Real Data Score: ${realDataScore.toFixed(2)}`)
  console.log(`Demo Data Score: ${demoDataScore.toFixed(2)}`)
  console.log(`Score Difference: ${(realDataScore - demoDataScore).toFixed(2)}`)
  console.log(`Allocation Difference: ${Math.round(realDataScore - demoDataScore)} tokens`)
  
  console.log("\n🎯 CONCLUSION:")
  console.log("================")
  console.log("The allocation fluctuation is caused by:")
  console.log("1. Sometimes RPC calls succeed → real data with live APE conversion")
  console.log("2. Sometimes RPC calls fail → demo data with static APE conversion")
  console.log("3. Network conditions determine which scenario occurs")
  console.log("4. This causes the same wallet to get different allocations!")
}

testAllocationFluctuation()
