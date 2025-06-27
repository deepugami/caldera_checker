import { ethers } from 'ethers'
import { OnChainMetrics, CalderaChain } from '@/types'
import { CALDERA_CHAINS, GAS_CONVERSION_UTILS } from '@/config/caldera'

export class CalderaBlockchainService {
  private providers: Map<string, ethers.JsonRpcProvider> = new Map()

  constructor() {
    // Initialize providers for each Caldera chain with custom fetch
    CALDERA_CHAINS.forEach(chain => {    try {
      // Initialize providers for each Caldera chain with custom fetch
      const provider = new ethers.JsonRpcProvider(chain.rpcUrl, undefined, {
        staticNetwork: ethers.Network.from({
          name: chain.name,
          chainId: chain.chainId
        })
      })
      this.providers.set(chain.name, provider)
    } catch {
      // Silently handle provider initialization failures
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Provider initialization failed for ${chain.name}`)
      }
    }
    })
  }

  async validateWalletAddress(address: string): Promise<boolean> {
    try {
      return ethers.isAddress(address)
    } catch {
      return false
    }
  }

  async getOnChainMetrics(walletAddress: string): Promise<OnChainMetrics> {
    if (!this.validateWalletAddress(walletAddress)) {
      throw new Error('Invalid wallet address')
    }

    const metrics: OnChainMetrics = {
      totalTransactions: 0,
      uniqueChainsUsed: 0,
      totalBalance: '0',
      totalGasSpent: 0,
      bridgeTransactions: 0,
      swapTransactions: 0,
      stakingTransactions: 0,
      liquidityTransactions: 0,
      chainBreakdown: []
    }

    // Try to get real data first - track RPC failure rate
    const chainsToAnalyze = this.getMainnetChains()
    const totalChains = chainsToAnalyze.length
    
    const chainMetrics = await Promise.allSettled(
      chainsToAnalyze.map(chain => 
        this.callWithTimeout(this.getChainMetrics(walletAddress, chain), 8000)
      )
    )

    let totalBalanceWei = BigInt(0)
    const usedChains = new Set<string>()
    let successfulRpcs = 0
    let failedRpcs = 0

    chainMetrics.forEach((result, index) => {
      const chainName = chainsToAnalyze[index].name
      
      if (result.status === 'fulfilled' && result.value) {
        successfulRpcs++
        const rawChainMetric = result.value
        
        // Validate and cap unrealistic values
        const chainMetric = this.validateChainMetric(rawChainMetric, chainName)
        
        metrics.totalTransactions += chainMetric.transactionCount
        
        // Add balance from this chain
        const balanceWei = this.safeParseEther(chainMetric.balance)
        totalBalanceWei += balanceWei
        
        const isActive = chainMetric.transactionCount > 0
        if (isActive) {
          usedChains.add(chainName)
        }

        // Add to chain breakdown
        metrics.chainBreakdown.push({
          chainName,
          transactionCount: chainMetric.transactionCount,
          balance: chainMetric.balance,
          nativeBalance: chainMetric.nativeBalance || '0',
          nativeTokenSymbol: chainMetric.nativeTokenSymbol || 'ETH',
          isActive
        })
      } else {
        failedRpcs++
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          console.warn(`RPC unavailable for ${chainName}`)
        }
        
        // Add failed chain to breakdown with zero values
        metrics.chainBreakdown.push({
          chainName,
          transactionCount: 0,
          balance: '0',
          nativeBalance: '0',
          nativeTokenSymbol: 'ETH',
          isActive: false
        })
      }
    })

    // If ANY RPCs failed, throw an error to ensure accurate data only
    // We want to avoid showing incorrect/partial allocations to users
    if (failedRpcs > 0) {
      throw new Error(`Unable to fetch complete blockchain data from all networks. Please try again in a few minutes when network conditions improve. (${successfulRpcs}/${totalChains} networks responded)`)
    }

    metrics.totalBalance = ethers.formatEther(totalBalanceWei)
    metrics.uniqueChainsUsed = usedChains.size

    return metrics
  }

  private async getChainMetrics(walletAddress: string, chain: CalderaChain) {
    const provider = this.providers.get(chain.name)
    if (!provider) {
      console.warn(`No provider available for ${chain.name}`)
      return null
    }

    try {
      // Add timeout for individual chain calls - only get reliable data
      const [balance, transactionCount] = await Promise.all([
        this.callWithTimeout(provider.getBalance(walletAddress), 5000),
        this.callWithTimeout(provider.getTransactionCount(walletAddress), 5000)
      ])

      // Convert native token balance to ETH equivalent using new utility
      const nativeTokenSymbol = chain.nativeToken?.symbol || 'ETH'
      const nativeBalance = ethers.formatEther(balance)
      const ethEquivalentBalance = GAS_CONVERSION_UTILS.convertToEthEquivalent(
        parseFloat(nativeBalance), 
        chain.chainId
      ).toString()

      return {
        chainName: chain.name,
        balance: ethEquivalentBalance,
        nativeBalance: nativeBalance,
        nativeTokenSymbol: nativeTokenSymbol,
        transactionCount,
      }
    } catch {
      // Silently handle RPC errors (CORS/network issues are expected)
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.warn(`RPC error for ${chain.name}:`, 'Network error')
      }
      return null
    }
  }

  async testRPCConnection(chainName: string): Promise<boolean> {
    const provider = this.providers.get(chainName)
    if (!provider) return false

    try {
      await this.callWithTimeout(provider.getBlockNumber(), 3000)
      return true
    } catch {
      // Silently handle connection failures
      if (process.env.NODE_ENV === 'development') {
        console.info(`RPC connection test failed for ${chainName} (expected for CORS-restricted endpoints)`)
      }
      return false
    }
  }

  async testAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}
    
    // Test mainnet chains primarily
    const chainsToTest = this.getMainnetChains()
    
    await Promise.all(
      chainsToTest.map(async (chain) => {
        results[chain.name] = await this.testRPCConnection(chain.name)
      })
    )

    return results
  }

  /**
   * Calculate total gas spent across all chains in ETH equivalent
   * @param gasSpentByChain - Object with chain name as key and gas amount as value
   * @returns Total gas spent in ETH equivalent
   */
  calculateTotalGasInEth(gasSpentByChain: Record<string, number>): number {
    const gasSpentByChainId: Record<number, number> = {}
    
    // Convert chain names to chain IDs for gas conversion utility
    Object.entries(gasSpentByChain).forEach(([chainName, gasAmount]) => {
      const chain = CALDERA_CHAINS.find(c => c.name === chainName)
      if (chain) {
        gasSpentByChainId[chain.chainId] = gasAmount
      }
    })
    
    return GAS_CONVERSION_UTILS.calculateTotalGasInEth(gasSpentByChainId)
  }

  /**
   * Format gas amount with proper native token symbol
   * @param amount - Gas amount in native token
   * @param chainName - Chain name
   * @returns Formatted string with proper token symbol
   */
  formatGasAmount(amount: number, chainName: string): string {
    const chain = CALDERA_CHAINS.find(c => c.name === chainName)
    if (!chain) return `${amount.toFixed(6)} ETH`
    
    return GAS_CONVERSION_UTILS.formatGasAmount(amount * Math.pow(10, 18), chain.chainId)
  }

  private safeParseEther(value: string): bigint {
    try {
      // Handle empty or invalid values
      if (!value || value === '0' || parseFloat(value) === 0) {
        return BigInt(0)
      }
      return ethers.parseEther(value)
    } catch {
      // Silently handle parsing errors
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to parse ether value: ${value}`)
      }
      return BigInt(0)
    }
  }

  // Filter out testnet chains for production analysis
  private getMainnetChains(): CalderaChain[] {
    return CALDERA_CHAINS.filter(chain => !chain.isTestnet)
  }

  // Validate chain metrics to detect obviously problematic data
  private validateChainMetric(chainMetric: { 
    chainName: string; 
    balance: string; 
    nativeBalance?: string;
    nativeTokenSymbol?: string;
    transactionCount: number 
  }, chainName: string) {
    const transactionCount = chainMetric.transactionCount
    let balance = chainMetric.balance
    
    // Only cap if values are obviously unrealistic (likely testnet or error)
    const balanceNum = parseFloat(balance)
    
    // Cap balance only if it's astronomically high (likely testnet tokens)
    if (balanceNum > 1000000) { // 1M+ ETH is clearly unrealistic
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Capping unrealistic balance on ${chainName}: ${balanceNum} -> 1000`)
      }
      balance = '1000'
    }
    
    // No transaction count capping - let the scoring service handle eligibility
    // Log high values for monitoring in development only
    if (process.env.NODE_ENV === 'development') {
      if (transactionCount > 50000) { // Log when approaching our 72k limit
        console.log(`High transaction count on ${chainName}: ${transactionCount} (keeping as-is)`)
      }
      if (balanceNum > 1000) {
        console.log(`High balance on ${chainName}: ${balanceNum} ETH (keeping as-is)`)
      }
    }
    
    return {
      ...chainMetric,
      transactionCount,
      balance,
      nativeBalance: chainMetric.nativeBalance || '0',
      nativeTokenSymbol: chainMetric.nativeTokenSymbol || 'ETH'
    }
  }

  // Add timeout to prevent hanging requests
  private async callWithTimeout<T>(
    promise: Promise<T>, 
    timeoutMs: number = 10000
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      )
    ])
  }
}
