# 🌟 Stellar Crowdfunding DApp

A fully decentralized crowdfunding platform built on the Stellar blockchain using Soroban smart contracts. Create campaigns, contribute XLM, and track funding goals with complete transparency and blockchain security.

[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Rust](https://img.shields.io/badge/Rust-Backend-orange)](https://www.rust-lang.org)

## 🚀 **Live Demo**

- **Contract Address (Testnet):** `CDLKPA54COCVUIZWI2SCAVADLUX4ALKLFXNIFRRT4Q4C3CL2E3BF5VAE`
- **Network:** Stellar Testnet
- **Frontend:** Run locally on `http://localhost:8000`

## 📋 **Table of Contents**

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [⚙️ Prerequisites](#️-prerequisites)
- [🔧 Installation & Setup](#-installation--setup)
- [🚀 Deployment](#-deployment)
- [📖 Usage Guide](#-usage-guide)
- [📱 Frontend Features](#-frontend-features)
- [📋 Smart Contract API](#-smart-contract-api)
- [🔗 Blockchain Integration](#-blockchain-integration)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 **Features**

### **Core Functionality**
- ✅ **Create Campaigns:** Set funding goals and campaign details
- ✅ **XLM Contributions:** Send real Stellar Lumens (XLM) to campaigns
- ✅ **Real-time Tracking:** Monitor funding progress with live blockchain data
- ✅ **Campaign Management:** View all active campaigns and their status
- ✅ **Wallet Integration:** Connect with Freighter wallet for secure transactions

### **Advanced Features**
- 🔗 **Blockchain Verification:** All data verified against Stellar Horizon API
- 💾 **Persistent Storage:** LocalStorage + blockchain hybrid data management
- 🎯 **Campaign-specific Tracking:** Memo-based transaction categorization
- 📊 **Real-time Updates:** Live campaign progress updates
- 🔍 **Transaction History:** Complete audit trail of all contributions
- 📱 **Responsive Design:** Works on desktop and mobile devices

### **Security & Transparency**
- 🔐 **Non-custodial:** Users maintain full control of their funds
- 🌍 **Decentralized:** No central authority or single point of failure
- 📝 **Open Source:** All code publicly auditable
- ⛓️ **Immutable Records:** All transactions permanently recorded on blockchain

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Soroban        │    │   Stellar       │
│   (JavaScript)  │◄──►│  Smart Contract │◄──►│   Network       │
│                 │    │   (Rust)        │    │   (Testnet)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│  Freighter      │◄─────────────┘
                        │  Wallet         │
                        └─────────────────┘
```

### **Component Breakdown**

1. **Frontend Layer**
   - Vanilla JavaScript SPA
   - Responsive CSS Grid layout
   - Real-time blockchain data integration
   - Freighter wallet connectivity

2. **Smart Contract Layer**
   - Soroban-based Rust smart contracts
   - Campaign creation and management
   - Contribution tracking and validation
   - Immutable data storage

3. **Blockchain Layer**
   - Stellar Testnet for development
   - XLM native asset transactions
   - Horizon API for data retrieval
   - Memo-based transaction categorization

4. **Wallet Layer**
   - Freighter browser extension integration
   - Secure transaction signing
   - Account management
   - Network configuration

## 💻 **Tech Stack**

### **Frontend**
- **Language:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 with Grid and Flexbox
- **APIs:** Fetch API for HTTP requests
- **CDN Libraries:**
  - Stellar SDK (`stellar-sdk@12.1.0`)
  - Freighter API (`stellar-freighter-api@4.1.0`)

### **Smart Contracts**
- **Language:** Rust
- **Framework:** Soroban SDK v21.0.0
- **Features:**
  - Campaign data structures
  - Payment validation
  - Storage management
  - Event emission

### **Blockchain**
- **Network:** Stellar (Testnet)
- **Asset:** XLM (Native Stellar Lumens)
- **APIs:** Horizon REST API
- **Explorers:** 
  - [StellarChain Testnet](https://testnet.stellarchain.io)
  - [Stellar Expert Testnet](https://stellar.expert/explorer/testnet)

### **Development Tools**
- **Package Manager:** Cargo (Rust), NPM (JavaScript)
- **Testing:** Soroban test framework
- **Deployment:** Soroban CLI
- **Linting:** Rustfmt, ESLint

## ⚙️ **Prerequisites**

Before you begin, ensure you have the following installed:

### **Required Software**
```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Soroban CLI
cargo install --locked soroban-cli

# Node.js (for frontend development)
node --version  # v18+ recommended
npm --version   # v9+ recommended

# Python (for local server)
python3 --version  # v3.6+ recommended
```

### **Browser Requirements**
- **Freighter Wallet Extension:** [Install from freighter.app](https://freighter.app/)
- **Modern Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Stellar Account**
- Create a Stellar testnet account
- Fund with testnet XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

## 🔧 **Installation & Setup**

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/xlm-crowdfunding.git
cd xlm-crowdfunding
```

### **2. Smart Contract Setup**
```bash
# Navigate to contract directory
cd contract

# Build the contract
soroban contract build

# Verify build success (should create .wasm file)
ls target/wasm32-unknown-unknown/release/
```

### **3. Local Development Environment**
```bash
# Generate a new Stellar account for testing
soroban keys generate alice

# Get the public key
soroban keys address alice

# Fund the account with testnet XLM
# Visit: https://laboratory.stellar.org/#account-creator?network=test
# Paste your public key and click "Fund"
```

### **4. Deploy Smart Contract**
```bash
# Deploy to Stellar Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/crowdfunding.wasm \
  --source alice \
  --network testnet

# Note the returned contract address
```

### **5. Frontend Configuration**
```bash
# Navigate to frontend directory
cd ../frontend

# Update CONTRACT_ADDRESS in script.js with your deployed contract address
# Edit line 7 in script.js:
# const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

### **6. Start Development Server**
```bash
# Start local HTTP server
python3 -m http.server 8000

# Open browser and navigate to:
# http://localhost:8000
```

## 🚀 **Deployment**

### **Smart Contract Deployment**

The project includes an automated deployment script:

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script performs:
1. Contract compilation
2. Testnet deployment
3. Contract initialization
4. Test campaign creation
5. Sample contributions

### **Frontend Deployment**

For production deployment:

```bash
# Build optimized version (if using build tools)
npm run build

# Deploy to hosting service
# - Netlify: Drag and drop build folder
# - Vercel: Connect GitHub repository
# - GitHub Pages: Push to gh-pages branch
```

### **Production Considerations**

1. **Mainnet Deployment**
   ```bash
   # Switch to mainnet for production
   soroban network add mainnet \
     --rpc-url https://horizon.stellar.org \
     --network-passphrase "Public Global Stellar Network ; September 2015"
   ```

2. **Security Hardening**
   - Implement campaign verification
   - Add contribution limits
   - Enable emergency pause functionality
   - Audit smart contract code

3. **Performance Optimization**
   - Implement caching strategies
   - Optimize API calls
   - Add loading states
   - Implement pagination

## 📖 **Usage Guide**

### **For Contributors (Users)**

1. **Connect Wallet**
   - Install Freighter wallet extension
   - Create or import Stellar account
   - Ensure you're on Stellar Testnet
   - Click "Connect Wallet" button

2. **Browse Campaigns**
   - View all active campaigns
   - Check funding progress
   - Read campaign details
   - See contribution history

3. **Make Contributions**
   - Click "Contribute" on desired campaign
   - Enter XLM amount
   - Confirm transaction in Freighter
   - Monitor transaction on blockchain explorer

### **For Campaign Creators**

1. **Create Campaign**
   - Connect your wallet
   - Fill campaign form:
     - Project title
     - Funding goal (in XLM)
     - Campaign description
   - Submit to blockchain

2. **Monitor Progress**
   - Track real-time funding
   - View contributor addresses
   - Access transaction hashes
   - Export contribution data

### **For Developers**

1. **Interact with Contract**
   ```javascript
   // Create new campaign
   const campaignId = await contract.create_campaign(
     owner_address,
     "Campaign Title",
     1000 // Goal in XLM
   );

   // Make contribution
   await contract.contribute(
     campaignId,
     contributor_address,
     50 // Amount in XLM
   );

   // Get campaign details
   const campaign = await contract.get_campaign(campaignId);
   ```

2. **Access Real Data**
   ```javascript
   // Check real blockchain contributions
   showContributionHistory();

   // Verify against Horizon API
   checkRealBlockchainData();

   // Clear test data
   clearAllData();
   ```

## 📱 **Frontend Features**

### **User Interface Components**

1. **Campaign Grid**
   - Responsive card layout
   - Progress bars with percentages
   - Owner address display
   - Contribution buttons

2. **Wallet Integration**
   - Connection status indicator
   - Account balance display
   - Network verification
   - Transaction confirmations

3. **Contribution Modal**
   - Campaign details preview
   - Amount input validation
   - Real-time fee calculation
   - Transaction preview

4. **Status Messages**
   - Success notifications
   - Error handling
   - Loading indicators
   - Transaction links

### **Data Management**

```javascript
// LocalStorage structure
{
  "xlm_crowdfunding_campaigns": [
    {
      "id": 1,
      "title": "Campaign Name",
      "goal_amount": 1000,
      "current_amount_raised": 250,
      "base_amount": 0,
      "owner": "STELLAR_ADDRESS"
    }
  ],
  "xlm_crowdfunding_contributions": [
    {
      "campaignId": 1,
      "amount": 50,
      "txHash": "TRANSACTION_HASH",
      "timestamp": 1640995200000,
      "date": "2025-06-03T18:00:00.000Z"
    }
  ]
}
```

### **Blockchain Data Fetching**

```javascript
// Fetch campaign contributions from Horizon API
const response = await fetch(
  `https://horizon-testnet.stellar.org/accounts/${ownerAddress}/payments`
);

// Parse and categorize by campaign
const campaignContributions = {
  1: { total: 0, contributions: [] },
  2: { total: 250, contributions: [...] },
  3: { total: 0, contributions: [] }
};
```

## 📋 **Smart Contract API**

### **Data Structures**

```rust
#[derive(Clone)]
pub struct Campaign {
    pub id: u64,
    pub owner: Address,
    pub title: String,
    pub goal_amount: u64,
    pub current_amount_raised: u64,
}

pub enum DataKey {
    Campaigns,
    NextCampaignId,
}
```

### **Public Functions**

#### **create_campaign**
```rust
pub fn create_campaign(
    env: Env,
    owner: Address,
    title: String,
    goal_amount: u64,
) -> u64
```
- **Purpose:** Create a new crowdfunding campaign
- **Parameters:**
  - `owner`: Campaign creator's Stellar address
  - `title`: Campaign name/description
  - `goal_amount`: Target funding amount in stroops
- **Returns:** Campaign ID
- **Events:** Emits campaign creation event

#### **contribute**
```rust
pub fn contribute(
    env: Env,
    campaign_id: u64,
    contributor: Address,
    amount: u64,
) -> Result<(), ContractError>
```
- **Purpose:** Add contribution to specified campaign
- **Parameters:**
  - `campaign_id`: Target campaign ID
  - `contributor`: Contributor's Stellar address  
  - `amount`: Contribution amount in stroops
- **Returns:** Success or error result
- **Validation:** Checks campaign exists and amount > 0

#### **get_campaign**
```rust
pub fn get_campaign(env: Env, campaign_id: u64) -> Option<Campaign>
```
- **Purpose:** Retrieve campaign details
- **Parameters:** `campaign_id`: Campaign ID to query
- **Returns:** Campaign data or None if not found

#### **get_campaigns**
```rust
pub fn get_campaigns(env: Env) -> Vec<Campaign>
```
- **Purpose:** Get all campaigns
- **Returns:** Vector of all campaign data

#### **get_campaign_count**
```rust
pub fn get_campaign_count(env: Env) -> u64
```
- **Purpose:** Get total number of campaigns
- **Returns:** Campaign count

### **Error Handling**

```rust
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    CampaignNotFound = 1,
    InvalidAmount = 2,
    Unauthorized = 3,
}
```

## 🔗 **Blockchain Integration**

### **Transaction Flow**

1. **Campaign Creation**
   ```
   User → Frontend → Smart Contract → Stellar Network
   ↓
   Contract Storage Update → Event Emission → Frontend Update
   ```

2. **Contribution Process**
   ```
   User → Freighter Wallet → XLM Transfer → Campaign Owner
   ↓
   Memo: "Kampanya 2 için bağış" → Blockchain Record → Frontend Parsing
   ```

3. **Data Verification**
   ```
   Frontend → Horizon API → Transaction History → Memo Parsing
   ↓
   Campaign Attribution → Amount Calculation → UI Update
   ```

### **Horizon API Integration**

```javascript
// Fetch payment history
const horizonUrl = `https://horizon-testnet.stellar.org/accounts/${address}/payments`;

// Parse transactions
payments.forEach(payment => {
  if (payment.memo.includes('Kampanya')) {
    const campaignId = parseInt(payment.memo.match(/Kampanya (\d+)/)[1]);
    // Attribute to specific campaign
  }
});
```

### **Network Configuration**

```javascript
const NETWORKS = {
  TESTNET: {
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    explorer: 'https://testnet.stellarchain.io'
  },
  MAINNET: {
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    explorer: 'https://stellarchain.io'
  }
};
```

## 🧪 **Testing**

### **Smart Contract Tests**

```bash
# Run contract tests
cd contract
cargo test

# Run with output
cargo test -- --nocapture

# Test specific function
cargo test test_create_campaign
```

### **Test Coverage**

The contract includes comprehensive tests for:

- ✅ Campaign creation with valid parameters
- ✅ Campaign creation with authentication
- ✅ Contribution validation and processing  
- ✅ Campaign retrieval and listing
- ✅ Error handling for invalid inputs
- ✅ Edge cases and boundary conditions

### **Frontend Testing**

```bash
# Manual testing checklist
- [ ] Wallet connection/disconnection
- [ ] Campaign creation form validation
- [ ] Contribution modal functionality
- [ ] Real blockchain data fetching
- [ ] LocalStorage persistence
- [ ] Error message display
- [ ] Responsive design on mobile
```

### **Integration Testing**

1. **End-to-End Workflow**
   - Create campaign → Verify on blockchain
   - Make contribution → Check transaction hash
   - Refresh page → Verify data persistence

2. **Cross-Browser Testing**
   - Chrome with Freighter
   - Firefox with Freighter
   - Mobile Safari compatibility

3. **Network Testing**
   - Testnet functionality
   - Mainnet compatibility
   - Offline behavior

## 🤝 **Contributing**

We welcome contributions! Please follow these guidelines:

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Make changes:** Follow coding standards
4. **Add tests:** Ensure all tests pass
5. **Commit changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Open Pull Request:** Describe changes and testing

### **Coding Standards**

**Rust (Smart Contracts)**
```bash
# Format code
cargo fmt

# Check linting
cargo clippy

# Run tests
cargo test
```

**JavaScript (Frontend)**
```javascript
// Use modern ES6+ syntax
// Implement proper error handling
// Add comprehensive comments
// Follow consistent naming conventions
```

### **Pull Request Guidelines**

- Clear description of changes
- Reference related issues
- Include test coverage
- Update documentation
- Ensure CI passes

### **Issue Reporting**

When reporting bugs, include:
- Browser and version
- Freighter wallet version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages
- Screenshots if applicable

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🙏 **Acknowledgments**

- **Stellar Development Foundation** - For the amazing Stellar network
- **Soroban Team** - For smart contract capabilities
- **Freighter Team** - For wallet integration
- **Rust Community** - For excellent tooling
- **Open Source Contributors** - For inspiration and code

## 📞 **Support**

- **Documentation:** [Stellar Docs](https://developers.stellar.org)
- **Soroban Docs:** [Soroban Documentation](https://soroban.stellar.org)
- **Community:** [Stellar Discord](https://discord.gg/stellardev)
- **Issues:** [GitHub Issues](https://github.com/your-username/xlm-crowdfunding/issues)

---

**Built with ❤️ on the Stellar Network**

*Empowering decentralized crowdfunding for a better world.* 