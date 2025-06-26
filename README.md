# 🔥 Caldera Token Allocation Checker

![Caldera Checker](https://img.shields.io/badge/Caldera-Allocation%20Checker-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, responsive Next.js application for checking potential token allocation eligibility for Caldera's cross-chain interoperability framework. Built with TypeScript, Tailwind CSS, and ethers.js for seamless Web3 integration.

🌐 **Live Demo**: [https://caldera-checker.vercel.app](https://caldera-checker.vercel.app)

## ✨ Features

- 🎯 **Discord Role Verification** - Check your community involvement
- ⛓️ **Multi-Chain Analysis** - Analyze activity across all Caldera chains
- 🌉 **Cross-Chain Bridge Tracking** - Monitor bridge transaction history
- ⛽ **Gas Analytics** - Detailed gas spending analysis with USD conversion
- 🏦 **DeFi Scoring** - Comprehensive DeFi interaction scoring
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-Time Progress** - Live updates during analysis
- 🎨 **Modern UI** - Clean, professional design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/deepugami/caldera_checker.git
cd caldera_checker
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**:
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🌐 Supported Caldera Chains

| Chain | Network | RPC Endpoint |
|-------|---------|--------------|
| **Edgeless Mainnet** | Production | `https://edgeless-mainnet.calderachain.xyz/http` |
| **Zero Network** | Production | `https://zero-network.calderachain.xyz/http` |
| **Solo Testnet** | Testnet | `https://solo-testnet.rpc.caldera.xyz/http` |
| **Rivalz Network** | Production | `https://rivalz2.rpc.caldera.xyz/http` |

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: ethers.js
- **API Integration**: Discord API
- **Deployment**: Vercel
- **Package Manager**: npm/yarn/pnpm

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── components/          # Reusable React components
│   ├── ui/             # UI components (buttons, cards, etc.)
│   ├── Background.tsx  # Background component
│   ├── CheckerForm.tsx # Main form component
│   └── ResultsDisplay.tsx # Results display component
├── config/             # Configuration files
│   ├── caldera.ts      # Chain configurations
│   └── roles.ts        # Discord role configurations
├── lib/                # Utility functions
│   └── utils.ts        # General utilities
├── services/           # Business logic services
│   ├── analysis.ts     # Main analysis service
│   ├── blockchain.ts   # Blockchain interaction service
│   └── scoring.ts      # Scoring algorithm service
└── types/              # TypeScript type definitions
    └── index.ts        # Main type exports
```

## 🎯 How It Works

1. **Input Validation**: Enter your wallet address and select Discord roles
2. **Multi-Chain Analysis**: The app analyzes your activity across all supported Caldera chains
3. **Scoring Algorithm**: Advanced scoring based on:
   - Bridge transaction volume and frequency
   - Gas spending patterns
   - DeFi protocol interactions
   - Discord community involvement
4. **Results Display**: Get a comprehensive breakdown of your potential allocation

## 🔧 Configuration

The application uses various configuration files:

- `src/config/caldera.ts` - Chain configurations and RPC endpoints
- `src/config/roles.ts` - Discord role definitions and scoring
- `vercel.json` - Vercel deployment configuration
- `next.config.ts` - Next.js configuration

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (this repository)
2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

3. **Environment Variables** (if needed):
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an **unofficial** allocation checker created for the Caldera community. Results are estimates based on publicly available data and should not be considered as definitive allocation amounts. Always verify information through official Caldera channels.

## 👨‍💻 Created By

**[@deepugami](https://x.com/deepugami)**

---

<div align="center">
  <p>Made with ❤️ for the Caldera community</p>
  <p>Max airdrop supply: 80M tokens</p>
</div>
