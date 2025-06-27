// Debug script to test allocation calculation differences
// Run with: node debug-allocation-test.js

// Simulate the role configurations
const ALLOCATION_CONFIG = {
  baseAllocationByRole: {
    'Regional Champion': 8000,
    'OG': 6000,
    'hero': 4800,
    'Titan': 4500,
    'cder-mafia': 5000,
    'cder': 2500,
    'tion': 600,
    'calderan': 300,
    'newbies': 150,
    'ash': 400,
    'default': 0
  },
  
  roleMultipliers: {
    'Regional Champion': 5.0,
    'OG': 4.0,
    'hero': 3.5,
    'Titan': 3.5,
    'cder-mafia': 3.5,
    'cder': 2.5,
    'tion': 1.5,
    'calderan': 1.3,
    'newbies': 1.2,
    'ash': 1.3,
    'default': 1.0
  }
}

// Mock on-chain metrics (demo data)
const mockMetrics = {
  totalTransactions: 25,
  uniqueChainsUsed: 4,
  totalBalance: '0.125',
  bridgeTransactions: 8,
  swapTransactions: 12,
  stakingTransactions: 3,
  liquidityTransactions: 2
}

// Calculate on-chain score
function calculateOnChainScore(metrics) {
  const scoring = {
    transactionWeight: 2,
    bridgeWeight: 45,
    swapWeight: 15,
    stakingWeight: 40,
    liquidityWeight: 30,
    chainDiversityWeight: 100,
    balanceWeight: 50
  }
  
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

// Calculate role multiplier
function getRoleMultiplier(roleNames) {
  if (!roleNames || roleNames.length === 0) return 1.0
  
  const multipliers = roleNames
    .map(name => ALLOCATION_CONFIG.roleMultipliers[name] || 1.0)
    .sort((a, b) => b - a)
    .slice(0, 3) // maxRolesConsidered
  
  if (multipliers.length === 1) {
    return multipliers[0]
  }
  
  const bestMultiplier = multipliers[0]
  const additionalRolesBonus = multipliers.slice(1).reduce((bonus, mult) => {
    return bonus + (mult * 0.9) // 90% bonus!
  }, 0)
  
  return bestMultiplier + additionalRolesBonus
}

// Test different role combinations - FOCUS ON "NO ROLES" SCENARIO
const testCases = [
  {
    name: "NO ROLES SELECTED (I don't have any roles)",
    roles: []
  },
  {
    name: "Empty roles array",
    roles: []
  },
  {
    name: "Null roles",
    roles: null
  },
  {
    name: "Undefined roles", 
    roles: undefined
  }
]

console.log("🧪 ALLOCATION CALCULATION TEST")
console.log("=====================================")

const onChainScore = calculateOnChainScore(mockMetrics)
console.log(`📊 Base on-chain score: ${onChainScore}`)
console.log("")

testCases.forEach((testCase, i) => {
  console.log(`${i + 1}. ${testCase.name}`)
  console.log(`   Roles: ${testCase.roles ? '[' + testCase.roles.join(', ') + ']' : 'null/undefined'}`)
  
  // Handle null/undefined roles
  const roles = testCase.roles || []
  
  // Get best role allocation
  const bestRole = roles.reduce((best, role) => {
    const allocation = ALLOCATION_CONFIG.baseAllocationByRole[role] || 0
    const bestAllocation = ALLOCATION_CONFIG.baseAllocationByRole[best] || 0
    return allocation > bestAllocation ? role : best
  }, 'default')
  
  const baseAllocation = ALLOCATION_CONFIG.baseAllocationByRole[bestRole] || 0
  const roleMultiplier = getRoleMultiplier(roles)
  const onChainBonus = onChainScore * roleMultiplier
  const totalAllocation = Math.round(baseAllocation + onChainBonus)
  
  console.log(`   Best role: ${bestRole} (${baseAllocation} base tokens)`)
  console.log(`   Multiplier: ${roleMultiplier.toFixed(2)}x`)
  console.log(`   On-chain bonus: ${Math.round(onChainBonus)} tokens`)
  console.log(`   💰 TOTAL: ${totalAllocation} tokens`)
  console.log("")
})

console.log("🔍 ANALYSIS:")
console.log("- With no roles selected, base allocation should be 0")
console.log("- Only on-chain bonus applies (score × 1.0 multiplier)")
console.log("- If allocation still fluctuates, the issue is in on-chain data calculation")
console.log("- Possible causes: randomized demo data, live API calls, or caching issues")
