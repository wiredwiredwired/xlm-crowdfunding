# 🌟 Stellar Crowdfunding DApp (XLM Crowdfunding)

[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Typed-blue)](https://www.typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-Smart%20Contracts-orange)](https://www.rust-lang.org)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Developed by [@byigitt](https://github.com/byigitt) & [@phun333](https://github.com/phun333) from [@wiredwiredwired](https://github.com/wiredwiredwired)**  
> **Modern, decentralized crowdfunding platform built on Stellar blockchain with Soroban smart contracts.**

## 🚀 **Quick Start**

- **Contract (Testnet)**: `CDLKPA54COCVUIZWI2SCAVADLUX4ALKLFXNIFRRT4Q4C3CL2E3BF5VAE`
- **Network**: Stellar Testnet
- **Demo**: Run locally after setup

## ✨ **Features**

### Core Functionality
- ✅ **Campaign Creation** - Create crowdfunding campaigns with XLM goals
- ✅ **Real XLM Contributions** - Native Stellar Lumens transactions
- ✅ **Live Tracking** - Real-time funding progress via blockchain
- ✅ **Wallet Integration** - Freighter wallet connectivity
- ✅ **Theme Support** - Dark/light mode with responsive design

### Security & Transparency
- 🔗 **Blockchain Verified** - All data on Stellar network
- 🔐 **Non-custodial** - Users control their funds
- 📊 **Real-time Updates** - Live campaign monitoring
- 🌍 **Decentralized** - No central authority

## 💻 **Tech Stack**

### Frontend (Next.js)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS + ShadCN/UI** - Modern styling
- **React Hook Form + Zod** - Form management

### Smart Contracts (Rust)
- **Soroban SDK 21.0.0** - Stellar smart contracts
- **Rust 2021** - Systems programming
- **WebAssembly** - Contract deployment

### Blockchain
- **Stellar Testnet** - Blockchain platform
- **Freighter Wallet** - Browser extension
- **Horizon API** - Blockchain data access

## 📁 **Project Structure**

```
xlm-crowdfunding/
├── 📂 frontend/              # Next.js Application
│   ├── 📂 app/               # App Router (pages)
│   │   ├── dashboard/        # Main DApp interface
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── 📂 components/        # React components
│   │   ├── ui/               # ShadCN/UI components
│   │   └── layout/           # Layout & sections
│   └── 📂 public/            # Static assets
├── 📂 contract/              # Soroban Smart Contracts
│   ├── src/lib.rs            # Main contract
│   └── Cargo.toml            # Rust config
├── deploy.sh                 # Deployment script
└── README.md                 # This file
```

## ⚙️ **Prerequisites**

### Required Software
```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install --locked soroban-cli

# Node.js 18+
node --version  # v18+
npm --version   # v9+
```

### Browser Setup
- **Freighter Wallet**: [Install from freighter.app](https://freighter.app/)
- **Stellar Testnet Account**: [Get testnet XLM](https://laboratory.stellar.org/#account-creator?network=test)

## 🔧 **Installation & Setup**

### 1. Clone Repository
```bash
git clone https://github.com/wiredwiredwired/xlm-crowdfunding.git
cd xlm-crowdfunding
```

### 2. Smart Contract Setup
```bash
cd contract
soroban contract build
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
echo 'NEXT_PUBLIC_CONTRACT_ID="your_contract_id"
NEXT_PUBLIC_STELLAR_NETWORK="TESTNET"
NEXT_PUBLIC_HORIZON_URL="https://horizon-testnet.stellar.org"
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"' > .env.local

# Start development server
npm run dev
```

### 4. Access Application
Open [http://localhost:3000](http://localhost:3000)

## 🚀 **Deployment**

### Automated Deployment
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment
```bash
# Deploy contract
cd contract
soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/crowdfunding.wasm \
    --source alice \
    --network testnet

# Deploy frontend
cd ../frontend
npm run build
vercel  # or netlify deploy --prod
```

## 📖 **Usage Guide**

### Wallet Connection
1. Install [Freighter Wallet](https://freighter.app/)
2. Create Stellar testnet account
3. Fund with [testnet XLM](https://laboratory.stellar.org/#account-creator?network=test)
4. Connect wallet in DApp

### Campaign Management
```typescript
// Create campaign
const campaign = {
  title: "My Project",
  goalAmount: 1000, // XLM
};

// Contribute to campaign
const contribution = {
  campaignId: "campaign_123",
  amount: 50, // XLM
};
```

## 📋 **Smart Contract API**

### Data Structures
```rust
pub struct Campaign {
    pub id: u32,
    pub owner: Address,
    pub title: String,
    pub goal_amount: i128,
    pub current_amount_raised: i128,
}
```

### Functions
```rust
// Create new campaign
pub fn create_campaign(env: Env, owner: Address, title: String, goal_amount: i128) -> u32

// Contribute to campaign
pub fn contribute(env: Env, contributor: Address, campaign_id: u32, amount: i128) -> bool

// Get all campaigns
pub fn get_campaigns(env: Env) -> Vec<Campaign>

// Get specific campaign
pub fn get_campaign(env: Env, campaign_id: u32) -> Option<Campaign>
```

## 🧪 **Testing**

### Smart Contract Tests
```bash
cd contract
cargo test
```

### Frontend Tests (Optional)
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm test
```

## 🔒 **Security Features**

- **Authentication**: All transactions require address signature
- **Input Validation**: Comprehensive validation on all inputs
- **Non-custodial**: Users control their private keys
- **Audit Trail**: Complete transaction logging
- **Network Verification**: Testnet safety

## 🤝 **Contributing**

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies and follow setup guide
4. Make changes and test thoroughly
5. Submit pull request

### Development Standards
- Follow ESLint/Prettier for frontend
- Use Rust clippy for smart contracts
- Add tests for new functionality
- Update documentation

### Commit Convention
```bash
feat(scope): add new feature
fix(scope): fix bug
docs: update documentation
style: format code
test: add tests
```

## 🔗 **Links & Resources**

### Documentation
- [Stellar Documentation](https://developers.stellar.org)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Tools
- [Stellar Laboratory](https://laboratory.stellar.org) - Transaction testing
- [StellarExpert](https://stellar.expert) - Blockchain explorer
- [Freighter Wallet](https://freighter.app) - Browser wallet

### Community
- [GitHub Issues](https://github.com/wiredwiredwired/xlm-crowdfunding/issues) - Bug reports & features
- [Stellar Discord](https://discord.gg/stellar) - Developer community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/stellar) - Q&A

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 **Acknowledgments**

Built with:
- [Stellar](https://stellar.org) - Blockchain platform
- [Soroban](https://soroban.stellar.org) - Smart contracts
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [ShadCN/UI](https://ui.shadcn.com) - UI components

---

<div align="center">

**🚀 Ready to build the future of crowdfunding?**

[![Get Started](https://img.shields.io/badge/Get%20Started-blue?style=for-the-badge&logo=stellar)](https://developers.stellar.org/docs/build/smart-contracts/getting-started)
[![Star Project](https://img.shields.io/badge/⭐%20Star-yellow?style=for-the-badge&logo=github)](https://github.com/wiredwiredwired/xlm-crowdfunding)

*Built with ❤️ for the Stellar Community*

</div> 
