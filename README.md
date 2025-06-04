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
- **Framework:** Next.js (React)
- **Language:** TypeScript, JavaScript (ES6+)
- **Styling:** Tailwind CSS, ShadCN/UI
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **APIs:** Fetch API for HTTP requests
- **Wallet Integration:** Freighter API
- **Core Libraries (via CDN/NPM):**
  - Stellar SDK (`@stellar/stellar-sdk@13.3.0`)
  - Freighter API (`stellar-freighter-api@4.1.0`)
  - Lucide React (for icons)

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
- **Package Manager:** Cargo (Rust), NPM or Yarn (JavaScript/TypeScript for Next.js)
- **Testing:** Soroban test framework, (Consider Jest/React Testing Library for frontend)
- **Deployment:** Soroban CLI, Vercel/Netlify (for Next.js)
- **Linting:** Rustfmt, ESLint, Prettier

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
node --version  # v18+ recommended (check your Next.js version compatibility)
npm --version   # v9+ recommended (or yarn)

# Python (Optional: only if you have Python-specific backend scripts, not for Next.js dev server)
# python3 --version
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
git clone https://github.com/wiredwiredwired/xlm-crowdfunding.git # Replace with your actual repository URL
cd xlm-crowdfunding
```

### **2. Smart Contract Setup**
```bash
# Navigate to contract directory (e.g., ./contract)
cd contract

# Build the contract
soroban contract build
```

### **3. Frontend Setup**
```bash
# Navigate to frontend directory (e.g., ./frontend)
cd ../frontend # Assuming it's a sibling to the 'contract' directory

# Install dependencies
npm install # or yarn install

# Environment Variables
# Create a .env.local file in the frontend directory.
# Add your deployed smart contract address and other relevant details:
# NEXT_PUBLIC_CONTRACT_ID='YOUR_DEPLOYED_CONTRACT_ID_FROM_STEP_4'
# NEXT_PUBLIC_STELLAR_NETWORK='TESTNET'
# NEXT_PUBLIC_HORIZON_URL='https://horizon-testnet.stellar.org'
# NEXT_PUBLIC_NETWORK_PASSPHRASE='Test SDF Network ; September 2015'

# The frontend application (e.g., dashboard page) should be configured
# to use these environment variables.
```

### **4. Deploy Smart Contract (Example)**
If you haven't deployed your smart contract yet, or need to redeploy:
```bash
# (Ensure you are in the 'contract' directory)
# Example deployment command (adjust --source as needed):
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/crowdfunding.wasm \
  --source alice \ # Ensure 'alice' identity is configured and funded
  --network testnet

# After deployment, copy the new Contract ID.
# Update NEXT_PUBLIC_CONTRACT_ID in frontend/.env.local with this new ID.
```

### **5. Frontend Configuration**
Ensure your frontend code (especially `frontend/app/dashboard/page.tsx` or similar configuration files)
is set up to read the `NEXT_PUBLIC_CONTRACT_ID` and other environment variables.
The Stellar SDK, network passphrase, and Horizon URL are also critical and might be sourced from these env vars.

```javascript
// Example of how contract ID might be used in the frontend:
// const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
```

### **6. Start Development Server**
```bash
# Navigate to your frontend directory (e.g., ./frontend):
npm run dev # or yarn dev

# Your Next.js app should now be running, typically on http://localhost:3000
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

For production deployment of your Next.js frontend:

```bash
# Navigate to your frontend directory
cd frontend

# Build optimized version
npm run build # or yarn build

# Deploy to hosting service
# - Vercel (Recommended for Next.js): Connect GitHub repository
# - Netlify: Connect GitHub repository and configure Next.js build settings
# - AWS Amplify, Google Cloud Run, Azure Static Web Apps, etc.
# - Self-hosting with Node.js server
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
The frontend is built with Next.js and utilizes ShadCN/UI components and Tailwind CSS for a modern, responsive user experience.

1.  **Dashboard:** Main view for creating and viewing crowdfunding campaigns.
    *   Dynamic campaign cards displaying progress, goal, and owner.
    *   Responsive grid layout.
2.  **Wallet Integration:**
    *   Seamless connection with Freighter wallet.
    *   Display of connection status, user public key, and XLM balance.
    *   Network validation to ensure connection to the correct Stellar network (Testnet/Mainnet).
3.  **Campaign Creation:**
    *   Form for users to define new campaign titles and funding goals.
    *   Utilizes ShadCN Input and Button components.
4.  **Contribution Modal:**
    *   Interactive modal for making contributions to campaigns.
    *   Input for specifying XLM amount.
5.  **Status Notifications:**
    *   Real-time messages for success, errors, and informational updates.
    *   Transaction links to Stellar explorers.
6.  **Theming:** Includes dark/light mode toggle.
7.  **Iconography:** Uses Lucide React for clear visual icons.

### **Data Management**
# - Stellar SDK (`stellar-sdk@12.1.0`) // Outdated, updated above
# - Freighter API (`stellar-freighter-api@4.1.0`) // Correct, kept above
# Update CONTRACT_ADDRESS in your frontend configuration
# For Next.js, this is typically managed via environment variables (e.g., .env.local)
# Example: NEXT_PUBLIC_CONTRACT_ADDRESS='YOUR_DEPLOYED_CONTRACT_ADDRESS'
# Or directly in a configuration file / component state.
# Make sure your frontend code (e.g., dashboard/page.tsx) reads this value.

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

**Built with ❤️ on the Stellar Network & Next.js**

*Empowering decentralized crowdfunding for a better world.* 
