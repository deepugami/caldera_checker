# Copilot Instructions for Caldera Token Allocation Checker

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript application that creates a token allocation checker for Caldera's cross-chain interoperability framework. The application verifies Discord roles and analyzes on-chain metrics to determine potential token allocation eligibility.

## Key Technologies
- **Frontend**: Next.js 15+ with TypeScript, Tailwind CSS, App Router
- **Blockchain**: ethers.js for Web3 interactions with Caldera RPC endpoints
- **APIs**: Discord API for role verification
- **Styling**: Tailwind CSS with modern UI components

## Architecture Guidelines
- Use App Router structure with src/ directory
- Implement server actions for API calls when possible
- Follow TypeScript best practices with proper type definitions
- Use environment variables for sensitive data (Discord tokens, RPC URLs)
- Implement proper error handling and loading states

## Caldera-Specific Context
- **RPC Endpoints**: Use Caldera's public RPC endpoints for blockchain data
  - Edgeless Mainnet: https://edgeless-mainnet.calderachain.xyz/http
  - Zero Network: https://zero-network.calderachain.xyz/http
  - Solo Testnet: https://solo-testnet.rpc.caldera.xyz/http
- **Criteria Focus**: Discord role verification and on-chain metrics (bridge activity, gas spending, DeFi interactions)
- **Cross-chain**: Handle multiple Caldera chains and their respective activities

## Code Style
- Use functional components with React hooks
- Implement responsive design with mobile-first approach
- Use TypeScript interfaces for all data structures
- Follow ESLint configuration for code quality
- Implement proper loading and error states for async operations

## Security Considerations
- Never expose private keys or sensitive API tokens
- Validate all user inputs (wallet addresses, Discord usernames)
- Use environment variables for configuration
- Implement rate limiting for API calls where appropriate
