export interface CalderaChain {
  name: string
  chainId: number
  rpcUrl: string
  explorerUrl?: string
  isTestnet?: boolean
  nativeToken?: {
    symbol: string
    name: string
    decimals: number
  }
}

export interface DiscordRole {
  id: string
  name: string
  points: number
  description?: string
}

export interface UserAnalysis {
  walletAddress: string
  selectedRoles: string[]
  onChainMetrics: OnChainMetrics
  allocationResult: AllocationResult
  eligibilityReasons: string[]
  warnings?: string[]
}

export interface CalderaRPCConfig {
  edgeless: string
  zeroNetwork: string
  soloTestnet: string
}

export interface CheckerFormData {
  walletAddress: string
  selectedRoles: string[]
}

export interface ChainMetric {
  chainName: string
  transactionCount: number
  balance: string // ETH equivalent balance
  nativeBalance?: string // Original native token balance
  nativeTokenSymbol?: string // Symbol of the native token (ETH, APE, etc.)
  isActive: boolean
}

export interface OnChainMetrics {
  totalTransactions: number
  uniqueChainsUsed: number
  totalBalance: string // Combined balance across all chains in ETH
  totalGasSpent: number // Total gas spent across all chains
  bridgeTransactions: number // Cross-chain bridge transactions
  swapTransactions: number // DEX swap transactions
  stakingTransactions: number // Staking-related transactions
  liquidityTransactions: number // Liquidity provision transactions
  chainBreakdown: ChainMetric[] // Detailed breakdown per chain
}

export interface AllocationResult {
  tokenAmount: number // Exact token allocation
  normalizedScore: number // Final weighted score (0-100)
  percentileRank: number // User's percentile ranking (0-99)
  isEligible: boolean
  reason?: string // Reason for ineligibility
  breakdown: {
    discordScore: number // Raw Discord score (0-100)
    onChainScore: number // Raw on-chain score (0-100)
    discordWeight: number // Weighted Discord contribution
    onChainWeight: number // Weighted on-chain contribution
    baseAllocation: number // Base token amount
    scoreMultiplier: number // Score-based multiplier
    bonusMultiplier: number // Percentile-based bonus
  }
}

export interface AllocationScore {
  discordScore: number
  onChainScore: number
  totalScore: number
  normalizedScore: number // Score normalized between 0-1000
  tokenAllocation: number // Exact token amount
  tier: 'Ineligible' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  percentile: number // User's percentile ranking (0-100)
  isEligible: boolean
  eligibilityReasons: string[]
}
