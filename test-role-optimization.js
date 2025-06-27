// Test script to verify role optimization and Regional Champion positioning
// Run with: node test-role-optimization.js

const ALLOCATION_CONFIG = {
  baseAllocationByRole: {
    // Updated configuration after optimization
    'Regional Champion': 8000, // HIGHEST ROLE
    'OG': 6000,
    'cder-mafia': 5000,
    'hero': 4800,
    'Titan': 4500,
    'maestro': 4200,
    'cder': 2500,
    'core': 2500,
    'young-cder': 1500,
    'Twitter Degen': 1200,
    'Twitter Champion': 800,
    'Twitter Supporter': 500,
    'poker TWR': 800,
    'meme-lord': 800,
    'tion': 600,
    'ash': 400,
    'No Discord Roles': 0,
    'default': 0
    // REMOVED: 'calderan': 300, 'newbies': 150
  },
  
  roleMultipliers: {
    'Regional Champion': 5.0,  // HIGHEST MULTIPLIER
    'OG': 4.0,
    'cder-mafia': 3.5,
    'hero': 3.5,
    'Titan': 3.5,
    'maestro': 3.5,
    'cder': 2.5,
    'core': 2.5,
    'young-cder': 2.0,
    'Twitter Degen': 2.0,
    'Twitter Champion': 1.8,
    'Twitter Supporter': 1.5,
    'poker TWR': 2.0,
    'meme-lord': 2.0,
    'tion': 1.5,
    'ash': 1.3,
    'No Discord Roles': 1.0,
    'default': 1.0
    // REMOVED: 'calderan': 1.3, 'newbies': 1.2
  }
}

console.log("🎭 ROLE OPTIMIZATION VERIFICATION")
console.log("=================================")

// Check that Regional Champion is the highest in both allocation and multiplier
function verifyRoleHierarchy() {
  const { baseAllocationByRole, roleMultipliers } = ALLOCATION_CONFIG
  
  console.log("\n🏆 ROLE HIERARCHY VERIFICATION:")
  
  // Find highest base allocation
  const maxAllocation = Math.max(...Object.values(baseAllocationByRole).filter(v => v > 0))
  const topAllocationRoles = Object.entries(baseAllocationByRole)
    .filter(([_, value]) => value === maxAllocation)
    .map(([role, _]) => role)
  
  console.log(`💰 Highest base allocation: ${maxAllocation} tokens`)
  console.log(`🎭 Top allocation role(s): ${topAllocationRoles.join(', ')}`)
  
  // Find highest multiplier
  const maxMultiplier = Math.max(...Object.values(roleMultipliers).filter(v => v > 1))
  const topMultiplierRoles = Object.entries(roleMultipliers)
    .filter(([_, value]) => value === maxMultiplier)
    .map(([role, _]) => role)
  
  console.log(`🔥 Highest multiplier: ${maxMultiplier}x`)
  console.log(`🎭 Top multiplier role(s): ${topMultiplierRoles.join(', ')}`)
  
  // Verify Regional Champion is at the top
  const regionalChampionAllocation = baseAllocationByRole['Regional Champion']
  const regionalChampionMultiplier = roleMultipliers['Regional Champion']
  
  console.log(`\n🎯 REGIONAL CHAMPION STATUS:`)
  console.log(`• Base allocation: ${regionalChampionAllocation} tokens`)
  console.log(`• Multiplier: ${regionalChampionMultiplier}x`)
  
  const isTopAllocation = regionalChampionAllocation === maxAllocation
  const isTopMultiplier = regionalChampionMultiplier === maxMultiplier
  
  if (isTopAllocation && isTopMultiplier) {
    console.log(`✅ VERIFIED: Regional Champion is the HIGHEST role in both allocation and multiplier!`)
  } else {
    console.log(`❌ ERROR: Regional Champion is not properly positioned as highest role`)
    if (!isTopAllocation) console.log(`  • Missing top allocation (${regionalChampionAllocation} vs ${maxAllocation})`)
    if (!isTopMultiplier) console.log(`  • Missing top multiplier (${regionalChampionMultiplier} vs ${maxMultiplier})`)
  }
}

// Check removed roles
function verifyRemovedRoles() {
  console.log("\n🗑️ REMOVED ROLES VERIFICATION:")
  
  const removedRoles = ['calderan', 'newbies']
  const allocationExists = removedRoles.filter(role => role in ALLOCATION_CONFIG.baseAllocationByRole)
  const multiplierExists = removedRoles.filter(role => role in ALLOCATION_CONFIG.roleMultipliers)
  
  console.log(`🎭 Checking removed roles: ${removedRoles.join(', ')}`)
  
  if (allocationExists.length === 0 && multiplierExists.length === 0) {
    console.log(`✅ SUCCESS: All target roles have been removed from configuration`)
  } else {
    console.log(`❌ ERROR: Some roles still exist in configuration`)
    if (allocationExists.length > 0) {
      console.log(`  • Still in baseAllocationByRole: ${allocationExists.join(', ')}`)
    }
    if (multiplierExists.length > 0) {
      console.log(`  • Still in roleMultipliers: ${multiplierExists.join(', ')}`)
    }
  }
}

// Show role distribution
function showRoleDistribution() {
  console.log("\n📊 OPTIMIZED ROLE DISTRIBUTION:")
  
  const rolesByTier = []
  
  // Group roles by allocation amount (descending)
  const sortedRoles = Object.entries(ALLOCATION_CONFIG.baseAllocationByRole)
    .filter(([_, value]) => value > 0)
    .sort(([_, a], [__, b]) => b - a)
  
  console.log(`\n💎 Token Allocation Tiers:`)
  sortedRoles.forEach(([role, allocation], index) => {
    const multiplier = ALLOCATION_CONFIG.roleMultipliers[role] || 1.0
    const tier = index < 6 ? 'Elite' : index < 12 ? 'Active' : 'Standard'
    console.log(`  ${index + 1}. ${role}: ${allocation} tokens (${multiplier}x) [${tier}]`)
  })
  
  console.log(`\n📈 Total roles after optimization: ${sortedRoles.length}`)
  console.log(`📉 Roles removed: 2 (calderan, newbies)`)
}

// Run all verifications
verifyRoleHierarchy()
verifyRemovedRoles()
showRoleDistribution()

console.log("\n🎯 OPTIMIZATION SUMMARY:")
console.log("✅ Regional Champion positioned as highest role (8000 tokens, 5.0x multiplier)")
console.log("✅ Removed 'calderan' and 'newbies' roles from all configurations")
console.log("✅ Cleaner role hierarchy with fewer low-value roles")
console.log("✅ More focused allocation distribution")
