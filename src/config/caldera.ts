import { CalderaChain } from '@/types'

export const CALDERA_CHAINS: CalderaChain[] = [
  // Gaming Rollups
  {
    name: 'B3',
    chainId: 8333,
    rpcUrl: 'https://mainnet-rpc.b3.fun/http',
    explorerUrl: 'https://explorer.b3.fun',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  {
    name: 'ApeChain',
    chainId: 33139,
    rpcUrl: 'https://apechain.calderachain.xyz/http',
    explorerUrl: 'https://apescan.io',
    isTestnet: false,
    nativeToken: {
      symbol: 'APE',
      name: 'ApeCoin',
      decimals: 18
    }
  },
  
  // Communication & Social
  {
    name: 'Towns Mainnet (River)',
    chainId: 550,
    rpcUrl: 'https://towns-mainnet.calderachain.xyz/http',
    explorerUrl: 'https://explorer.towns.com',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  
  // DeFi & Finance
  {
    name: 'Manta Pacific',
    chainId: 169,
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    explorerUrl: 'https://pacific-explorer.manta.network',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  {
    name: 'Kinto',
    chainId: 7887,
    rpcUrl: 'https://rpc.kinto-rpc.com',
    explorerUrl: 'https://explorer.kinto.xyz',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  
  // NFT & AI
  {
    name: 'AlienX',
    chainId: 10241024,
    rpcUrl: 'https://rpc.alienxchain.io/http',
    explorerUrl: 'https://explorer.alienxchain.io',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  {
    name: 'RARI Chain',
    chainId: 1380012617,
    rpcUrl: 'https://mainnet.rpc.rarichain.org/http',
    explorerUrl: 'https://mainnet.explorer.rarichain.org',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  
  // Utility & General Purpose
  {
    name: 'AppChain',
    chainId: 466,
    rpcUrl: 'https://466.rpc.thirdweb.com',
    explorerUrl: 'https://explorer.appchain.xyz',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  {
    name: 'Rivalz',
    chainId: 753,
    rpcUrl: 'https://rivalz.calderachain.xyz/http',
    explorerUrl: 'https://explorer.rivalz.com',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  },
  
  // Original Caldera chains (keeping for compatibility)
  {
    name: 'Zerion (Zero Network)',
    chainId: 543210,
    rpcUrl: process.env.ZERO_NETWORK_RPC_URL || 'https://zero-network.calderachain.xyz/http',
    explorerUrl: 'https://explorer.zero.network',
    isTestnet: false,
    nativeToken: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18
    }
  }
]

export const DEFAULT_RPC_CONFIG = {
  edgeless: 'https://edgeless-mainnet.calderachain.xyz/http',
  zeroNetwork: 'https://zero-network.calderachain.xyz/http',
  soloTestnet: 'https://solo-testnet.rpc.caldera.xyz/http'
}

// Gas token conversion configuration for proper ETH equivalent calculations
export const GAS_TOKEN_CONFIG = {
  // Native token to ETH conversion rates (for gas calculations)
  // Note: Live rates are fetched via API for production, static rates for demo consistency
  conversionRates: {
    'ETH': 1.0,     // ETH to ETH = 1:1
    'APE': 0.001,   // APE to ETH approximate rate (should be updated from API)
  },
  
  // Chains that use ETH as native token (no conversion needed)
  ethNativeChains: [8333, 550, 169, 7887, 10241024, 1380012617, 466, 753, 543210],
  
  // Chains that use non-ETH tokens (require conversion)
  nonEthChains: {
    33139: { // ApeChain
      nativeToken: 'APE',
      conversionKey: 'APE'
    }
  } as Record<number, { nativeToken: string; conversionKey: string }>,
  
  // API endpoints for live conversion rates with fallback support
  priceApiEndpoints: {
    // Primary endpoints (fastest and most reliable)
    primary: [
      {
        name: 'Binance',
        url: 'https://api.binance.com/api/v3/ticker/price?symbol=APEETH',
        parser: (data: unknown): number | undefined => {
          const parsed = data as { price?: string };
          return parsed.price ? parseFloat(parsed.price) : undefined;
        },
        timeout: 5000
      },
      {
        name: 'CryptoCompare', 
        url: 'https://min-api.cryptocompare.com/data/price?fsym=APE&tsyms=ETH',
        parser: (data: unknown): number | undefined => {
          const parsed = data as { ETH?: number };
          return parsed.ETH;
        },
        timeout: 5000
      }
    ],
    // Fallback endpoints
    fallback: [
      {
        name: 'CoinPaprika',
        url: 'https://api.coinpaprika.com/v1/tickers/ape-apecoin?quotes=ETH',
        parser: (data: unknown): number | undefined => {
          const parsed = data as { quotes?: { ETH?: { price?: number } } };
          return parsed.quotes?.ETH?.price;
        },
        timeout: 8000
      },
      {
        name: 'CoinGecko',
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=apecoin&vs_currencies=eth',
        parser: (data: unknown): number | undefined => {
          const parsed = data as { apecoin?: { eth?: number } };
          return parsed.apecoin?.eth;
        },
        timeout: 10000
      }
    ],
    // Static fallback rate (used when all APIs fail)
    staticFallback: {
      'APE': 0.00025 // Conservative rate based on recent API responses
    } as Record<string, number>
  }
}

// Target Discord roles for allocation eligibility
export const TARGET_DISCORD_ROLES = [
  'Community',
  'Builder',
  'Developer',
  'OG',
  'Early Supporter',
  'Contributor',
  'Ambassador',
  'Moderator',
  'VIP'
]

// Hybrid Multiplier-Based Allocation System Configuration
export const ALLOCATION_CONFIG = {
  // Total allocation parameters
  totalAirdropSupply: 80_000_000, // 80M tokens
  expectedEligibleWallets: 600_000, // 600k wallets
  averageAllocation: 133.33, // 80M / 600k ≈ 133 tokens per wallet
  
  // New hybrid system: Discord roles as multipliers + base allocations
  baseAllocationByRole: {
    // [T-1] Regional Champion - Highest tier (local ops legends)
    'Regional Champion': 8000, // Local ops legends running Twitter, events, vibes - HIGHEST ROLE
    
    // [T-1] Core Contributors - Legendary tier
    'OG': 6000,             // Day-one believers, still respected
    'cder-mafia': 5000,     // 2022-era server boosters, early frens
    'hero': 4800,           // Storytellers, creatives, community leaders
    'Titan': 4500,          // Technical writers, developers, contributors
    'maestro': 4200,        // Creative leads, artists, stylists, lore crafters
    
    // [T-2] Active Contributors - Reliable tier  
    'cder': 2500,           // Go-to regulars, always active, always helping
    'core': 2500,           // Builders, writers, translators, organizers
    'young-cder': 1500,     // Rising stars, early but showing energy
    
    // Twitter Activity Roles - Engagement tier
    'Twitter Degen': 1200,      // 6666 pts - high engagement
    'Twitter Champion': 800,    // 4444 pts - good engagement  
    'Twitter Supporter': 500,   // 2222 pts - decent engagement
    
    // Special Achievement Roles
    'poker TWR': 800,      // Went all in and won
    'meme-lord': 800,       // Meme dealer, chaos bringer
    
    // Discord XP Roles - Activity tier
    'tion': 600,            // Level 18+ discord activity
    'ash': 400,             // Level 9+ discord activity
    
    // No Discord Roles option
    'No Discord Roles': 0,  // For users without roles
    
    // Default for any unrecognized role
    'default': 0
  },
  
  // Role multipliers for on-chain activity (stacks with base allocation)
  roleMultipliers: {
    // [T-1] Regional Champion - Highest multiplier (5x)
    'Regional Champion': 5.0,   // HIGHEST ROLE - Local ops legends
    
    // [T-1] Core Contributors - 3.5x-4x multiplier
    'OG': 4.0,                  // Day-one believers
    'cder-mafia': 3.5,          // Early server boosters
    'hero': 3.5,                // Community leaders
    'Titan': 3.5,               // Technical contributors
    'maestro': 3.5,             // Creative leads
    
    // [T-2] Active Contributors - 2x-2.5x multiplier
    'cder': 2.5,                // Go-to regulars
    'core': 2.5,                // Builders and organizers
    'young-cder': 2.0,          // Rising stars
    
    // Twitter Activity Roles - 1.5x-2x multiplier
    'Twitter Degen': 2.0,       // High engagement
    'Twitter Champion': 1.8,    // Good engagement
    'Twitter Supporter': 1.5,   // Decent engagement
    
    // Special Achievement Roles - 2x multiplier
    'poker TWR': 2.0,           // All-in winners
    'meme-lord': 2.0,           // Chaos bringers
    
    // Discord XP Roles - 1.3x-1.5x multiplier
    'tion': 1.5,                // Level 18+ activity
    'ash': 1.3,                 // Level 9+ activity
    
    // No Discord Roles option
    'No Discord Roles': 1.0,
    
    // Default multiplier
    'default': 1.0
  },
  
  // Eligibility criteria (hard filters)
  eligibility: {
    minTransactions: 20,     // Minimum 20 transactions to be eligible
    maxTransactions: 72000,  // Maximum 72k transactions (anti-sybil protection)
    minEcosystemInteractions: 1, // Lowered from 2 to 1 chain
    minBalance: 0            // No minimum balance requirement
  },
  
  // On-chain activity scoring (reduced by 70% for more conservative allocations)
  onChainScoring: {
    // Reduced base scoring weights
    transactionWeight: 0.6,      // 0.6 points per transaction (was 2)
    bridgeWeight: 14,            // 14 points per bridge transaction (was 45)
    swapWeight: 5,               // 5 points per swap (was 15)
    stakingWeight: 12,           // 12 points per staking transaction (was 40)
    liquidityWeight: 9,          // 9 points per LP transaction (was 30)
    chainDiversityWeight: 30,    // 30 points per unique chain (was 100)
    balanceWeight: 15,           // 15 points per ETH equivalent balance (was 50)
    
    // Reduced bonus thresholds 
    powerUserBonus: {
      transactions: { threshold: 500, bonus: 30 },     // 30 bonus (was 100)
      chains: { threshold: 5, bonus: 60 },             // 60 bonus (was 200)
      balance: { threshold: 0.1, bonus: 45 }           // 45 bonus (was 150)
    }
  }
}

// Token Information
export const TOKEN_INFO = {
  ticker: 'CALDERA',
  symbol: '$CALDERA',
  maxAirdropSupply: ALLOCATION_CONFIG.totalAirdropSupply,
  decimals: 18,
  expectedEligibleWallets: ALLOCATION_CONFIG.expectedEligibleWallets,
  averageAllocation: ALLOCATION_CONFIG.averageAllocation
}

// Simplified allocation calculation parameters
export const ALLOCATION_FORMULA = {
  // Maximum allocation caps
  maxAllocation: 50000,    // 50k tokens max per wallet (anti-whale)
  
  // Multiple role handling
  multiRoleStrategy: 'best', // Use best role's base + average multiplier
  maxRolesConsidered: 3,     // Consider top 3 roles maximum
  
  // Activity bonus scaling (reduced)
  activityBonusEnabled: true,
  activityBonusMultiplier: 1.15 // Additional 15% for high activity users (was 1.5 = 50%)
}

// Gas token conversion utilities
export const GAS_CONVERSION_UTILS = {
  /**
   * Fetch live conversion rate from APIs with fallback support
   * @param token - Token symbol (e.g., 'APE')
   * @returns Promise<number> - Conversion rate to ETH
   */
  fetchLiveConversionRate: async (token: string): Promise<number> => {
    const config = GAS_TOKEN_CONFIG.priceApiEndpoints;
    
    // Try primary APIs first
    for (const api of config.primary) {
      try {
        const rate = await GAS_CONVERSION_UTILS.callPriceAPI(api);
        if (rate && rate > 0) {
          console.log(`✅ Got ${token} rate from ${api.name}: ${rate} ETH`);
          return rate;
        }
      } catch (error) {
        console.warn(`⚠️ ${api.name} failed:`, (error as Error).message);
      }
    }
    
    // Try fallback APIs
    for (const api of config.fallback) {
      try {
        const rate = await GAS_CONVERSION_UTILS.callPriceAPI(api);
        if (rate && rate > 0) {
          console.log(`✅ Got ${token} rate from ${api.name} (fallback): ${rate} ETH`);
          return rate;
        }
      } catch (error) {
        console.warn(`⚠️ ${api.name} (fallback) failed:`, (error as Error).message);
      }
    }
    
    // Use static fallback
    const staticRate = config.staticFallback[token];
    if (staticRate) {
      console.warn(`⚠️ Using static fallback rate for ${token}: ${staticRate} ETH`);
      return staticRate;
    }
    
    // Default to 1:1 if all else fails
    console.error(`❌ No conversion rate found for ${token}, using 1:1`);
    return 1.0;
  },

  /**
   * Call a price API endpoint
   * @param api - API configuration object
   * @returns Promise<number> - Price in ETH
   */
  callPriceAPI: async (api: { 
    name: string; 
    url: string; 
    parser: (data: unknown) => number | undefined; 
    timeout: number 
  }): Promise<number> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout after ${api.timeout}ms`));
      }, api.timeout);

      fetch(api.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CalderaChecker/1.0)',
          'Accept': 'application/json',
        },
      })
        .then(response => {
          clearTimeout(timeout);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const price = api.parser(data);
          if (price && !isNaN(price) && price > 0) {
            resolve(price);
          } else {
            reject(new Error('Invalid price data'));
          }
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  },

  /**
   * Convert native token amount to ETH equivalent
   * @param amount - Amount in native token
   * @param chainId - Chain ID to determine native token
   * @param conversionRates - Current conversion rates (optional, uses default if not provided)
   * @returns Amount in ETH equivalent
   */
  convertToEthEquivalent: (
    amount: number, 
    chainId: number, 
    conversionRates: Record<string, number> = GAS_TOKEN_CONFIG.conversionRates
  ): number => {
    // If chain uses ETH natively, no conversion needed
    if (GAS_TOKEN_CONFIG.ethNativeChains.includes(chainId)) {
      return amount;
    }
    
    // Get conversion info for non-ETH chains
    const chainConfig = GAS_TOKEN_CONFIG.nonEthChains[chainId];
    if (!chainConfig) {
      console.warn(`Unknown chain ID ${chainId}, assuming ETH native`);
      return amount;
    }
    
    const conversionRate = conversionRates[chainConfig.conversionKey];
    if (!conversionRate) {
      console.warn(`No conversion rate for ${chainConfig.nativeToken}, using default 1:1`);
      return amount;
    }
    
    return amount * conversionRate;
  },

  /**
   * Convert native token amount to ETH equivalent with live rates
   * @param amount - Amount in native token
   * @param chainId - Chain ID to determine native token
   * @returns Promise<number> - Amount in ETH equivalent
   */
  convertToEthEquivalentLive: async (amount: number, chainId: number): Promise<number> => {
    // If chain uses ETH natively, no conversion needed
    if (GAS_TOKEN_CONFIG.ethNativeChains.includes(chainId)) {
      return amount;
    }
    
    // Get conversion info for non-ETH chains
    const chainConfig = GAS_TOKEN_CONFIG.nonEthChains[chainId];
    if (!chainConfig) {
      console.warn(`Unknown chain ID ${chainId}, assuming ETH native`);
      return amount;
    }
    
    try {
      const liveRate = await GAS_CONVERSION_UTILS.fetchLiveConversionRate(chainConfig.nativeToken);
      return amount * liveRate;
    } catch (error) {
      console.error(`Failed to get live rate for ${chainConfig.nativeToken}:`, error);
      // Fallback to static rate
      return GAS_CONVERSION_UTILS.convertToEthEquivalent(amount, chainId);
    }
  },

  /**
   * Get native token symbol for a chain
   * @param chainId - Chain ID
   * @returns Native token symbol
   */
  getNativeTokenSymbol: (chainId: number): string => {
    if (GAS_TOKEN_CONFIG.ethNativeChains.includes(chainId)) {
      return 'ETH';
    }
    
    const chainConfig = GAS_TOKEN_CONFIG.nonEthChains[chainId];
    return chainConfig?.nativeToken || 'ETH';
  },

  /**
   * Format gas amount with proper units
   * @param amount - Amount in wei or smallest unit
   * @param chainId - Chain ID
   * @param decimals - Token decimals (default 18)
   * @returns Formatted string with token symbol
   */
  formatGasAmount: (amount: number, chainId: number, decimals: number = 18): string => {
    const tokenSymbol = GAS_CONVERSION_UTILS.getNativeTokenSymbol(chainId);
    const formattedAmount = (amount / Math.pow(10, decimals)).toFixed(6);
    return `${formattedAmount} ${tokenSymbol}`;
  },

  /**
   * Calculate total gas spent across all chains in ETH equivalent
   * @param gasSpentByChain - Object with chainId as key and gas amount as value
   * @param conversionRates - Current conversion rates
   * @returns Total gas spent in ETH equivalent
   */
  calculateTotalGasInEth: (
    gasSpentByChain: Record<number, number>,
    conversionRates: Record<string, number> = GAS_TOKEN_CONFIG.conversionRates
  ): number => {
    return Object.entries(gasSpentByChain).reduce((total, [chainId, gasAmount]) => {
      const ethEquivalent = GAS_CONVERSION_UTILS.convertToEthEquivalent(
        gasAmount, 
        parseInt(chainId), 
        conversionRates
      );
      return total + ethEquivalent;
    }, 0);
  },

  /**
   * Calculate total gas spent across all chains with live rates
   * @param gasSpentByChain - Object with chainId as key and gas amount as value
   * @returns Promise<number> - Total gas spent in ETH equivalent
   */
  calculateTotalGasInEthLive: async (gasSpentByChain: Record<number, number>): Promise<number> => {
    let total = 0;
    
    for (const [chainId, gasAmount] of Object.entries(gasSpentByChain)) {
      const ethEquivalent = await GAS_CONVERSION_UTILS.convertToEthEquivalentLive(
        gasAmount, 
        parseInt(chainId)
      );
      total += ethEquivalent;
    }
    
    return total;
  }
}
