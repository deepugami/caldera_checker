import { UserAnalysis } from '@/types'
import { CalderaBlockchainService } from './blockchain'
import { ScoringService } from './scoring'
import { DISCORD_ROLES } from '@/config/roles'

export interface AnalysisProgress {
  step: string
  progress: number
  message: string
}

export class CalderaAnalysisService {
  private blockchainService: CalderaBlockchainService
  private scoringService: ScoringService

  constructor() {
    this.blockchainService = new CalderaBlockchainService()
    this.scoringService = new ScoringService()
  }

  async analyzeUser(
    walletAddress: string,
    selectedRoles: string[],
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<UserAnalysis> {
    // Validate wallet address
    if (!await this.blockchainService.validateWalletAddress(walletAddress)) {
      throw new Error('Invalid wallet address format')
    }

    try {
      // Step 1: Fetch on-chain metrics
      onProgress?.({
        step: 'blockchain',
        progress: 50,
        message: 'Analyzing on-chain activity...'
      })

      const onChainMetrics = await this.blockchainService.getOnChainMetrics(walletAddress)

      // Step 2: Calculate final allocation
      onProgress?.({
        step: 'scoring',
        progress: 75,
        message: 'Calculating token allocation...'
      })

      // Convert selected roles to DiscordRole objects
      const discordRoles = selectedRoles.map(roleId => {
        // Find the role by ID from the DISCORD_ROLES config
        const roleConfig = DISCORD_ROLES.find(r => r.id === roleId)
        return {
          id: roleId,
          name: roleConfig?.name || roleId, // Use the proper name from config
          points: roleConfig?.points || 0
        }
      })

      const allocationResult = this.scoringService.calculateAllocation(discordRoles, onChainMetrics)

      // Step 3: Compile results
      onProgress?.({
        step: 'complete',
        progress: 100,
        message: 'Analysis complete!'
      })

      const eligibilityReasons = this.scoringService.generateEligibilityReasons(
        onChainMetrics,
        discordRoles,
        allocationResult
      )
      const warnings = this.scoringService.generateWarnings(onChainMetrics, discordRoles)

      return {
        walletAddress,
        selectedRoles,
        onChainMetrics,
        allocationResult,
        eligibilityReasons,
        warnings: warnings.length > 0 ? warnings : undefined
      }
    } catch (error) {
      console.error('Analysis error:', error)
      
      // Check if it's an RPC failure rate error
      if (error instanceof Error && error.message.includes('RPC_FAILURE_RATE_HIGH')) {
        throw new Error('NETWORK_ISSUES: Multiple RPC endpoints are currently unavailable. Please try again in a few minutes.')
      }
      
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async testConnections(): Promise<{
    blockchain: Record<string, boolean>
  }> {
    const blockchainResults = await this.blockchainService.testAllConnections()

    return {
      blockchain: blockchainResults
    }
  }

  // Quick validation method for form inputs
  validateInputs(walletAddress: string, selectedRoles: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!walletAddress.trim()) {
      errors.push('Wallet address is required')
    } else if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Invalid wallet address format')
    }

    if (selectedRoles.length === 0) {
      errors.push('Please select at least one role')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
