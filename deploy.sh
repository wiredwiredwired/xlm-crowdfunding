#!/bin/bash

#
# STELLAR CROWDFUNDING DAPP - DEPLOYMENT SCRIPT
#
# This script automates the build and deployment process for the Stellar
# crowdfunding decentralized application (DApp). It compiles the Soroban
# smart contract to WebAssembly (WASM) and provides deployment instructions.
#
# Prerequisites:
# - Rust toolchain with wasm32-unknown-unknown target
# - Soroban CLI tools
# - Cargo package manager
#
# Usage: ./deploy.sh
# 
# Author: Stellar Crowdfunding Team
# License: MIT
# Version: 1.0.0
#

# SCRIPT SETTINGS: Exit immediately if any command fails
set -e

echo "🌟 Starting Stellar Crowdfunding DApp Deployment..."

# DIRECTORY VALIDATION: Ensure script is run from correct location
if [ ! -d "contract" ]; then
    echo "❌ Error: contract directory not found. Please run this script from the project root directory."
    exit 1
fi

echo "📦 Compiling smart contract to WebAssembly..."
cd contract

# SMART CONTRACT COMPILATION: Build Soroban contract for WebAssembly target
cargo build --target wasm32-unknown-unknown --release

echo "✅ Smart contract compiled successfully!"

# WASM FILE VALIDATION: Verify that the compilation produced the expected output
if [ ! -f "target/wasm32-unknown-unknown/release/crowdfunding.wasm" ]; then
    echo "❌ Error: WASM file not found. Compilation may have failed."
    exit 1
fi

echo "📄 WASM file size information:"
ls -lh target/wasm32-unknown-unknown/release/crowdfunding.wasm

echo ""
echo "🚀 Smart Contract Deployment Instructions:"
echo ""
echo "1. Install Soroban CLI (if not already installed):"
echo "   cargo install --locked soroban-cli"
echo ""
echo "2. Create and configure Stellar account:"
echo "   soroban keys generate --global alice --network testnet"
echo "   soroban keys fund alice --network testnet"
echo ""
echo "3. Deploy the smart contract:"
echo "   soroban contract deploy \\"
echo "       --wasm target/wasm32-unknown-unknown/release/crowdfunding.wasm \\"
echo "       --source alice \\"
echo "       --network testnet"
echo ""
echo "4. Update the contract address in frontend/app/dashboard/page.tsx with the deployed contract address."
echo ""

cd ..

echo "💻 Frontend Development Server:"
echo "   cd frontend"
echo "   npm install"
echo "   npm run dev"
echo "   # Open http://localhost:3000 in your browser"
echo ""

echo "📋 Required Tools and Resources:"
echo "   - Freighter Wallet: https://freighter.app/"
echo "   - Test XLM Faucet: https://laboratory.stellar.org/account-creator"
echo ""

echo "✨ DApp is ready for deployment! Follow the instructions above to complete the process." 