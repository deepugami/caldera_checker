import { OnChainMetrics, AllocationResult, DiscordRole } from '@/types'
import { ALLOCATION_CONFIG, TOKEN_INFO, ALLOCATION_FORMULA } from '@/config/caldera'

export class ScoringService {
  /**
   * Calculate exact token allocation using hybrid multiplier system
   */
  calculateAllocation(discordRoles: DiscordRole[], onChainMetrics: OnChainMetrics): AllocationResult {
    // First check basic eligibility
    const eligibility = this.checkEligibility(onChainMetrics, discordRoles)
    
    if (!eligibility.eligible) {
      return {
        tokenAmount: 0,
        normalizedScore: 0,
        percentileRank: 0,
        isEligible: false,
        reason: eligibility.reason,
        breakdown: {
          discordScore: 0,
          onChainScore: 0,
          discordWeight: 0,
          onChainWeight: 0,
          baseAllocation: 0,
          scoreMultiplier: 0,
          bonusMultiplier: 1
        }
      }
    }

    // Get best role and calculate base allocation
    const bestRole = this.getBestRole(discordRoles)
    const baseAllocation = (ALLOCATION_CONFIG.baseAllocationByRole as Record<string, number>)[bestRole] || ALLOCATION_CONFIG.baseAllocationByRole.default
    
    // Calculate on-chain activity score
    const onChainScore = this.calculateOnChainScore(onChainMetrics)
    
    // Get role multiplier (average if multiple roles)
    const roleMultiplier = this.getRoleMultiplier(discordRoles)
    
    // Calculate multiplied on-chain bonus
    const onChainBonus = onChainScore * roleMultiplier
    
    // Calculate activity bonus for high-activity users
    const activityBonus = this.calculateActivityBonus(onChainMetrics, onChainScore)
    
    // Final token calculation
    const rawTokenAmount = baseAllocation + onChainBonus + activityBonus
    const tokenAmount = Math.min(Math.round(rawTokenAmount), ALLOCATION_FORMULA.maxAllocation)
    
    // Calculate normalized score for display (0-100 scale)
    const normalizedScore = Math.min((tokenAmount / 1000) * 10, 100) // Rough conversion for display
    
    // Calculate percentile rank (mock - would be calculated against all users in production)
    const percentileRank = this.calculatePercentileRank(tokenAmount)
    
    return {
      tokenAmount,
      normalizedScore: Math.round(normalizedScore * 100) / 100,
      percentileRank,
      isEligible: true,
      breakdown: {
        discordScore: baseAllocation,
        onChainScore: Math.round(onChainScore),
        discordWeight: Math.round(roleMultiplier * 100) / 100,
        onChainWeight: Math.round(onChainBonus),
        baseAllocation: baseAllocation,
        scoreMultiplier: Math.round(roleMultiplier * 100) / 100,
        bonusMultiplier: Math.round(activityBonus)
      }
    }
  }

  /**
   * Get the best (highest value) role from user's roles
   */
  private getBestRole(roles: DiscordRole[]): string {
    if (!roles || roles.length === 0) return 'default'
    
    const { baseAllocationByRole } = ALLOCATION_CONFIG
    let bestRole = 'default'
    let bestValue = 0
    
    for (const role of roles) {
      const value = (baseAllocationByRole as Record<string, number>)[role.name] || baseAllocationByRole.default
      if (value > bestValue) {
        bestValue = value
        bestRole = role.name
      }
    }
    
    return bestRole
  }

  /**
   * Get enhanced role multiplier for user's roles (rewards multiple roles)
   */
  private getRoleMultiplier(roles: DiscordRole[]): number {
    if (!roles || roles.length === 0) return 1.0
    
    const { roleMultipliers } = ALLOCATION_CONFIG
    const { maxRolesConsidered } = ALLOCATION_FORMULA
    
    // Get multipliers for all roles, sort by highest, take top N
    const multipliers = roles
      .map(role => (roleMultipliers as Record<string, number>)[role.name] || roleMultipliers.default)
      .sort((a, b) => b - a)
      .slice(0, maxRolesConsidered)
    
    if (multipliers.length === 1) {
      return multipliers[0]
    }
    
    // For multiple roles: Use best multiplier + bonus for additional roles
    const bestMultiplier = multipliers[0]
    const additionalRolesBonus = multipliers.slice(1).reduce((bonus, mult) => {
      // Each additional role adds 20% of its multiplier value as bonus
      return bonus + (mult * 0.9)
    }, 0)
    
    return bestMultiplier + additionalRolesBonus
  }

  /**
   * Calculate on-chain activity score (raw points)
   */
  calculateOnChainScore(metrics: OnChainMetrics): number {
    const {
      totalTransactions,
      bridgeTransactions = 0,
      swapTransactions = 0,
      stakingTransactions = 0,
      liquidityTransactions = 0,
      uniqueChainsUsed
    } = metrics
    
    const scoring = ALLOCATION_CONFIG.onChainScoring
    let score = 0
    
    // Basic activity scoring
    score += totalTransactions * scoring.transactionWeight
    score += bridgeTransactions * scoring.bridgeWeight
    score += swapTransactions * scoring.swapWeight
    score += stakingTransactions * scoring.stakingWeight
    score += liquidityTransactions * scoring.liquidityWeight
    score += uniqueChainsUsed * scoring.chainDiversityWeight
    
    // Balance contribution
    const totalBalance = parseFloat(metrics.totalBalance)
    score += totalBalance * scoring.balanceWeight
    
    // Power user bonuses
    const { powerUserBonus } = scoring
    if (totalTransactions >= powerUserBonus.transactions.threshold) {
      score += powerUserBonus.transactions.bonus
    }
    if (uniqueChainsUsed >= powerUserBonus.chains.threshold) {
      score += powerUserBonus.chains.bonus
    }
    if (totalBalance >= powerUserBonus.balance.threshold) {
      score += powerUserBonus.balance.bonus
    }
    
    return Math.max(score, 0)
  }

  /**
   * Calculate activity bonus for exceptional users
   */
  private calculateActivityBonus(metrics: OnChainMetrics, onChainScore: number): number {
    if (!ALLOCATION_FORMULA.activityBonusEnabled) return 0
    
    const { totalTransactions, uniqueChainsUsed } = metrics
    const totalBalance = parseFloat(metrics.totalBalance)
    
    // Criteria for activity bonus (top-tier users)
    const isHighActivity = totalTransactions >= 200  // Raised from 50 to 200 given new 20 min requirement
    const isMultiChain = uniqueChainsUsed >= 5  
    const hasSignificantBalance = totalBalance >= 0.05
    
    if (isHighActivity && isMultiChain && hasSignificantBalance) {
      return onChainScore * (ALLOCATION_FORMULA.activityBonusMultiplier - 1)
    }
    
    return 0
  }

  /**
   * Calculate percentile rank based on token amount
   */
  private calculatePercentileRank(tokenAmount: number): number {
    // Mock percentile calculation - in production would compare against all users
    if (tokenAmount >= 20000) return 99      // Elite tier
    if (tokenAmount >= 10000) return 95      // Exceptional tier
    if (tokenAmount >= 5000) return 85       // Advanced tier
    if (tokenAmount >= 2000) return 70       // Active tier
    if (tokenAmount >= 500) return 50        // Standard tier
    return 25                                // Basic tier
  }

  /**
   * Check eligibility based on relaxed anti-sybil criteria
   */
  checkEligibility(metrics: OnChainMetrics, discordRoles?: DiscordRole[]): { eligible: boolean; reason?: string } {
    const { eligibility } = ALLOCATION_CONFIG
    
    // Too many transactions suggests bot activity
    if (metrics.totalTransactions > eligibility.maxTransactions) {
      return { 
        eligible: false, 
        reason: `Excessive transaction count (${metrics.totalTransactions} > ${eligibility.maxTransactions})` 
      }
    }
    
    // Check if user has Discord roles with base allocation
    const bestRole = discordRoles ? this.getBestRole(discordRoles) : 'default'
    const baseAllocation = (ALLOCATION_CONFIG.baseAllocationByRole as Record<string, number>)[bestRole] || ALLOCATION_CONFIG.baseAllocationByRole.default
    const hasDiscordAllocation = baseAllocation > 0
    
    // Too few transactions - but allow Discord-only allocations
    if (metrics.totalTransactions < eligibility.minTransactions) {
      if (!hasDiscordAllocation) {
        return { 
          eligible: false, 
          reason: `Insufficient activity: ${metrics.totalTransactions} transactions (min: ${eligibility.minTransactions}) and no Discord roles` 
        }
      }
      // User has Discord roles with allocation - eligible for Discord-only allocation
    }
    
    // Must have interacted with at least 1 chain (relaxed from 2) - but only if no Discord allocation
    if (metrics.uniqueChainsUsed < eligibility.minEcosystemInteractions && !hasDiscordAllocation) {
      return { 
        eligible: false, 
        reason: `No ecosystem interaction detected and no Discord roles` 
      }
    }
    
    return { eligible: true }
  }

  /**
   * Generate summary statistics for the allocation
   */
  generateAllocationSummary(result: AllocationResult): string {
    if (!result.isEligible) {
      return `❌ Ineligible: ${result.reason}`
    }
    
    const { tokenAmount, percentileRank } = result
    const formattedAmount = tokenAmount.toLocaleString()
    
    let tier = 'Standard'
    if (percentileRank >= 99) tier = 'Elite'
    else if (percentileRank >= 95) tier = 'Exceptional'
    else if (percentileRank >= 85) tier = 'Advanced'
    else if (percentileRank >= 70) tier = 'Active'
    
    return `✅ ${tier} User: ${formattedAmount} ${TOKEN_INFO.symbol} (Top ${100 - percentileRank}%)`
  }

  /**
   * Generate detailed reasons for allocation
   */
  generateEligibilityReasons(
    metrics: OnChainMetrics, 
    discordRoles: DiscordRole[],
    result: AllocationResult
  ): string[] {
    const reasons: string[] = []

    // Check for ineligibility first
    if (!result.isEligible) {
      reasons.push(`❌ Ineligible: ${result.reason}`)
      return reasons
    }

    // Discord role contribution (base allocation)
    const bestRole = this.getBestRole(discordRoles)
    const baseAllocation = (ALLOCATION_CONFIG.baseAllocationByRole as Record<string, number>)[bestRole] || ALLOCATION_CONFIG.baseAllocationByRole.default
    reasons.push(`Best Role: ${bestRole} (${baseAllocation.toLocaleString()} tokens)`)
    
    if (discordRoles.length > 1) {
      const roleMultiplier = this.getRoleMultiplier(discordRoles)
      reasons.push(`Role Multiplier: ${roleMultiplier.toFixed(1)}x (from ${discordRoles.length} roles)`)
    }

    // On-chain activity contribution
    const onChainScore = result.breakdown.onChainWeight
    if (onChainScore > 0) {
      reasons.push(`On-Chain Activity: ${metrics.totalTransactions} txs across ${metrics.uniqueChainsUsed} chains`)
    }
    
    // Activity bonus
    if (result.breakdown.bonusMultiplier > 0) {
      reasons.push(`Activity Bonus: +${result.breakdown.bonusMultiplier.toLocaleString()} tokens (high activity user)`)
    }

    // Balance contribution
    const totalBalance = parseFloat(metrics.totalBalance)
    if (totalBalance > 0.01) {
      reasons.push(`Balance Contribution: ${totalBalance.toFixed(4)} ETH across chains`)
    }

    // Final allocation
    reasons.push(`Total Allocation: ${result.tokenAmount.toLocaleString()} ${TOKEN_INFO.symbol}`)

    return reasons
  }

  /**
   * Generate warnings for improving allocation
   */
  generateWarnings(metrics: OnChainMetrics, discordRoles: DiscordRole[]): string[] {
    const warnings: string[] = []
    
    if (!discordRoles || discordRoles.length === 0) {
      warnings.push('⚠️ No Discord roles detected - you may be missing significant base allocation')
    }
    
    if (metrics.totalTransactions < 10) {
      warnings.push('⚠️ Low transaction count - more activity will unlock role multiplier bonuses')
    }
    
    if (metrics.uniqueChainsUsed < 3) {
      warnings.push('⚠️ Try using more Caldera ecosystem chains for additional bonuses')
    }
    
    const totalBalance = parseFloat(metrics.totalBalance)
    if (totalBalance < 0.01) {
      warnings.push('⚠️ Higher balance contributes to allocation calculation')
    }

    if (metrics.bridgeTransactions === 0) {
      warnings.push('⚠️ Bridge activity between chains provides significant bonuses')
    }

    return warnings
  }
}
