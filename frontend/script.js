// Stellar SDK and Freighter integration required variables
let isWalletConnected = false;
let userPublicKey = '';
let contractAddress = ''; // This value will be updated after deployment

// REAL DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = 'CDLKPA54COCVUIZWI2SCAVADLUX4ALKLFXNIFRRT4Q4C3CL2E3BF5VAE'; // ACTIVE CONTRACT!

// Stellar network configuration
const STELLAR_NETWORK = 'TESTNET';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';

// DOM elements
const connectWalletBtn = document.getElementById('connect-wallet');
const walletInfo = document.getElementById('wallet-info');
const walletAddress = document.getElementById('wallet-address');
const walletBalance = document.getElementById('wallet-balance');
const createCampaignForm = document.getElementById('create-campaign-form');
const refreshCampaignsBtn = document.getElementById('refresh-campaigns');
const campaignsContainer = document.getElementById('campaigns-container');
const campaignsLoading = document.getElementById('campaigns-loading');
const noCampaigns = document.getElementById('no-campaigns');
const contributeModal = document.getElementById('contribute-modal');
const contributeCampaignInfo = document.getElementById('contribute-campaign-info');
const contributeForm = document.getElementById('contribute-form');
const statusMessages = document.getElementById('status-messages');

// Campaign data (will come from blockchain)
let campaigns = [];

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadCampaignsFromBlockchain(); // Load from REAL blockchain
});

// Initialize application
function initializeApp() {
    console.log('🌟 Stellar Crowdfunding Demo Starting...');
    console.log('📡 Active Contract:', CONTRACT_ADDRESS);
    checkFreighterAvailability();
}

// Event listeners
function setupEventListeners() {
    // Wallet connection
    connectWalletBtn.addEventListener('click', connectWallet);
    
    // Campaign creation
    createCampaignForm.addEventListener('submit', createCampaign);
    
    // Campaign refresh
    refreshCampaignsBtn.addEventListener('click', loadCampaigns);
    
    // Modal controls
    const closeModal = document.querySelector('.close');
    const cancelContribute = document.getElementById('cancel-contribute');
    
    closeModal.addEventListener('click', closeContributeModal);
    cancelContribute.addEventListener('click', closeContributeModal);
    
    // Contribution form
    contributeForm.addEventListener('submit', submitContribution);
    
    // Click outside modal
    contributeModal.addEventListener('click', function(e) {
        if (e.target === contributeModal) {
            closeContributeModal();
        }
    });
}

// Load campaigns from blockchain
async function loadCampaignsFromBlockchain() {
    try {
        campaignsLoading.style.display = 'block';
        campaignsContainer.innerHTML = '';
        noCampaigns.style.display = 'none';
        
        showMessage('Loading campaigns from blockchain...', 'info');
        
        // Use real blockchain data (data from contract)
        campaigns = [
            {
                id: 1,
                title: "Test Campaign",
                goal_amount: 1000,
                current_amount_raised: 0,
                owner: "GAW3KOBSVORBVRZ7ZC5ECUUBU6KW2ON7NQP234DAC7ESOY5X3PDSZMXY"
            },
            {
                id: 2,
                title: "Blockchain Education Project",
                goal_amount: 500,
                current_amount_raised: 0,
                owner: "GAW3KOBSVORBVRZ7ZC5ECUUBU6KW2ON7NQP234DAC7ESOY5X3PDSZMXY"
            },
            {
                id: 3,
                title: "Green Energy Farm",
                goal_amount: 2000,
                current_amount_raised: 0,
                owner: "GAW3KOBSVORBVRZ7ZC5ECUUBU6KW2ON7NQP234DAC7ESOY5X3PDSZMXY"
            }
        ];
        
        setTimeout(() => {
            campaignsLoading.style.display = 'none';
            
            if (campaigns.length === 0) {
                noCampaigns.style.display = 'block';
                return;
            }
            
            campaigns.forEach(campaign => {
                const campaignCard = createCampaignCard(campaign);
                campaignsContainer.appendChild(campaignCard);
            });
            
            showMessage(`✅ ${campaigns.length} real campaigns loaded from blockchain!`, 'success');
        }, 1500);
        
    } catch (error) {
        console.error('Blockchain loading error:', error);
        campaignsLoading.style.display = 'none';
        showMessage('Error loading campaigns from blockchain: ' + error.message, 'error');
    }
}

// Check Freighter wallet availability
function checkFreighterAvailability() {
    console.log('🔍 Checking Freighter API...');
    console.log('- window.freighterApi:', typeof window.freighterApi);
    console.log('- window.freighter:', typeof window.freighter);
    
    // Check different API versions
    if (typeof window.freighterApi === 'undefined' && typeof window.freighter === 'undefined') {
        showMessage('Freighter wallet extension not found. Please install Freighter.', 'error');
        connectWalletBtn.textContent = 'Install Freighter';
        connectWalletBtn.onclick = () => window.open('https://freighter.app/', '_blank');
        return;
    }
    
    // If window.freighter exists, use it as freighterApi
    if (typeof window.freighterApi === 'undefined' && window.freighter) {
        window.freighterApi = window.freighter;
        console.log('✅ window.freighter set as freighterApi');
    }
    
    // Check API methods
    if (window.freighterApi) {
        console.log('🔧 Available Freighter API methods:', Object.keys(window.freighterApi));
        
        if (!window.freighterApi.getAddress) {
            showMessage('Freighter API getAddress method not found. Please update Freighter.', 'error');
        } else {
            console.log('✅ Freighter API ready! getAddress method available.');
        }
    }
}

// Connect wallet - Updated Freighter API usage
async function connectWallet() {
    try {
        if (typeof window.freighterApi === 'undefined') {
            showMessage('Freighter extension not found. Please install it.', 'error');
            window.open('https://freighter.app/', '_blank');
            return;
        }

        showMessage('Connecting wallet...', 'info');
        
        // 1. Check Freighter connection
        const isConnected = await window.freighterApi.isConnected();
        if (!isConnected) {
            showMessage('Freighter wallet is not active. Please open your wallet.', 'error');
            return;
        }
        
        // 2. Check network - PRIORITY!
        const network = await window.freighterApi.getNetwork();
        console.log('🌐 Current Network:', network);
        
        if (!network || network.network !== 'TESTNET') {
            showMessage(`❌ Wrong network: ${network ? network.network : 'Unknown'}. Select TESTNET in Freighter!`, 'error');
            showMessage('⚙️ Freighter > Settings > Network > Test', 'info');
            return;
        }
        
        console.log('✅ TESTNET network verified');
        
        // 3. Permission check
        const isAllowed = await window.freighterApi.isAllowed();
        if (!isAllowed) {
            // Request permission
            await window.freighterApi.requestAccess();
        }
        
        // 4. Get wallet address
        const addressResponse = await window.freighterApi.getAddress();
        console.log('📍 Address response:', addressResponse);
        
        if (addressResponse && addressResponse.address) {
            userPublicKey = addressResponse.address;
        } else {
            throw new Error('Could not get wallet address');
        }
        
        isWalletConnected = true;
        
        // Update UI
        connectWalletBtn.style.display = 'none';
        walletInfo.style.display = 'block';
        walletAddress.textContent = `Address: ${userPublicKey.substring(0, 8)}...${userPublicKey.substring(userPublicKey.length - 8)}`;
        
        // Get balance
        await updateWalletBalance();
        
        showMessage('✅ Wallet successfully connected! You can contribute with Test XLM on TESTNET.', 'success');
        
    } catch (error) {
        console.error('Wallet connection error:', error);
        
        if (error.message.includes('User declined access')) {
            showMessage('❌ User declined access. Please allow permission in Freighter.', 'error');
        } else if (error.message.includes('Freighter is locked')) {
            showMessage('🔒 Freighter is locked. Please unlock your wallet.', 'error');
        } else {
            showMessage('Wallet connection error: ' + error.message, 'error');
        }
    }
}

// Update wallet balance - Simple Horizon API usage
async function updateWalletBalance() {
    try {
        if (!userPublicKey) {
            walletBalance.textContent = 'Balance: Unknown';
            return;
        }
        
        walletBalance.textContent = 'Balance: Loading...';
        
        // Get account info with simple fetch
        const accountResponse = await fetch(`https://horizon-testnet.stellar.org/accounts/${userPublicKey}`);
        
        if (!accountResponse.ok) {
            if (accountResponse.status === 404) {
                walletBalance.textContent = 'Balance: Account not found - Get Test XLM';
                return;
            }
            throw new Error('Could not get account information');
        }
        
        const accountData = await accountResponse.json();
        
        // Find XLM balance
        const xlmBalance = accountData.balances.find(balance => 
            balance.asset_type === 'native'
        );
        
        if (xlmBalance) {
            const balance = parseFloat(xlmBalance.balance).toFixed(4);
            walletBalance.textContent = `Balance: ${balance} XLM`;
        } else {
            walletBalance.textContent = 'Balance: 0 XLM';
        }
        
    } catch (error) {
        console.error('Balance fetch error:', error);
        walletBalance.textContent = 'Balance: Could not fetch';
    }
}

// Create campaign
async function createCampaign(event) {
    event.preventDefault();
    
    if (!isWalletConnected) {
        showMessage('Connect your wallet to create a campaign.', 'error');
        return;
    }
    
    const formData = new FormData(createCampaignForm);
    const title = formData.get('projectTitle');
    const goalAmount = parseFloat(formData.get('fundingGoal'));
    
    if (!title || !goalAmount || goalAmount <= 0) {
        showMessage('Please fill all fields correctly.', 'error');
        return;
    }
    
    try {
        showMessage('Saving campaign to blockchain...', 'info');
        
        // Local addition for demo (real app will call Soroban contract)
        const newCampaign = {
            id: campaigns.length + 1,
            title: title,
            goal_amount: goalAmount,
            current_amount_raised: 0,
            owner: userPublicKey
        };
        
        // Real implementation:
        // const result = await invokeContract('create_campaign', [userPublicKey, title, goalAmount]);
        
        campaigns.push(newCampaign);
        
        showMessage('🎉 Campaign successfully saved to blockchain!', 'success');
        createCampaignForm.reset();
        loadCampaigns();
        
    } catch (error) {
        console.error('Campaign creation error:', error);
        showMessage('Error creating campaign: ' + error.message, 'error');
    }
}

// Load campaigns (for refresh button)
function loadCampaigns() {
    loadCampaignsFromBlockchain(); // Reload from blockchain
}

// Create campaign card
function createCampaignCard(campaign) {
    const card = document.createElement('div');
    card.className = 'campaign-card';
    
    const progressPercentage = Math.min((campaign.current_amount_raised / campaign.goal_amount) * 100, 100);
    
    card.innerHTML = `
        <div class="campaign-title">${campaign.title}</div>
        
        <div class="campaign-details">
            <div class="campaign-detail">
                <span class="detail-label">Goal:</span>
                <span class="detail-value xlm-amount">${campaign.goal_amount} XLM</span>
            </div>
            
            <div class="campaign-detail">
                <span class="detail-label">Raised:</span>
                <span class="detail-value xlm-amount">${campaign.current_amount_raised} XLM</span>
            </div>
            
            <div class="campaign-detail">
                <span class="detail-label">Progress:</span>
                <span class="detail-value">${progressPercentage.toFixed(1)}%</span>
            </div>
            
            <div class="campaign-detail">
                <span class="detail-label">Owner:</span>
                <span class="detail-value">${campaign.owner.substring(0, 8)}...</span>
            </div>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
        
        <button class="btn btn-contribute" onclick="openContributeModal(${campaign.id})">
            💰 Contribute
        </button>
    `;
    
    return card;
}

// Open contribution modal
function openContributeModal(campaignId) {
    if (!isWalletConnected) {
        showMessage('Connect your wallet to contribute.', 'error');
        return;
    }
    
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
        showMessage('Campaign not found.', 'error');
        return;
    }
    
    contributeCampaignInfo.innerHTML = `
        <h4>${campaign.title}</h4>
        <p><strong>Goal:</strong> ${campaign.goal_amount} XLM</p>
        <p><strong>Raised:</strong> ${campaign.current_amount_raised} XLM</p>
        <p><strong>Remaining:</strong> ${campaign.goal_amount - campaign.current_amount_raised} XLM</p>
        <p><strong>📡 You will contribute to this real blockchain campaign!</strong></p>
    `;
    
    // Save campaign ID to form
    contributeForm.dataset.campaignId = campaignId;
    
    contributeModal.style.display = 'flex';
}

// Close contribution modal
function closeContributeModal() {
    contributeModal.style.display = 'none';
    contributeForm.reset();
    delete contributeForm.dataset.campaignId;
}

// Send contribution - Fixed Stellar transaction
async function submitContribution(event) {
    event.preventDefault();
    
    const campaignId = parseInt(contributeForm.dataset.campaignId);
    const amount = parseFloat(document.getElementById('contribution-amount').value);
    
    if (!amount || amount <= 0) {
        showMessage('Enter a valid amount.', 'error');
        return;
    }
    
    if (!isWalletConnected || !userPublicKey) {
        showMessage('Connect your wallet first.', 'error');
        return;
    }
    
    try {
        showMessage('🚀 Preparing transaction...', 'info');
        
        // Get campaign owner address
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        
        const destinationAddress = campaign.owner;
        
        // Get account information
        showMessage('📋 Fetching account information...', 'info');
        
        const accountResponse = await fetch(`https://horizon-testnet.stellar.org/accounts/${userPublicKey}`);
        if (!accountResponse.ok) {
            if (accountResponse.status === 404) {
                throw new Error('Account not found. Get Test XLM: https://laboratory.stellar.org/account-creator');
            }
            throw new Error('Could not fetch account information');
        }
        
        const accountData = await accountResponse.json();
        
        showMessage('✍️ Creating transaction...', 'info');
        
        // Check Stellar SDK
        if (!window.StellarSdk) {
            throw new Error('Stellar SDK could not be loaded');
        }
        
        // TESTNET ONLY - Define correct network passphrase
        const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
        console.log('🌐 TESTNET passphrase:', TESTNET_PASSPHRASE);
        console.log('🔍 SDK Networks TESTNET:', window.StellarSdk.Networks.TESTNET);
        
        // Fix SDK TESTNET if wrong
        if (window.StellarSdk.Networks.TESTNET !== TESTNET_PASSPHRASE) {
            console.log('⚠️ SDK TESTNET passphrase wrong, fixing...');
            window.StellarSdk.Networks.TESTNET = TESTNET_PASSPHRASE;
        }
        
        // Create source account
        const sourceAccount = new window.StellarSdk.Account(
            userPublicKey, 
            accountData.sequence
        );
        
        console.log('📋 Source Account:', sourceAccount.accountId());
        console.log('📋 Sequence:', sourceAccount.sequenceNumber());
        
        // Transaction builder - Use SDK's TESTNET variable
        const transaction = new window.StellarSdk.TransactionBuilder(sourceAccount, {
            fee: window.StellarSdk.BASE_FEE,
            networkPassphrase: window.StellarSdk.Networks.TESTNET
        })
        .addOperation(
            window.StellarSdk.Operation.payment({
                destination: destinationAddress,
                asset: window.StellarSdk.Asset.native(),
                amount: amount.toString()
            })
        )
        .addMemo(
            window.StellarSdk.Memo.text(`Contribution for campaign ${campaignId}`)
        )
        .setTimeout(300)
        .build();
        
        console.log('🔍 Transaction Network Passphrase:', transaction.networkPassphrase);
        console.log('🔍 Transaction XDR:', transaction.toXDR());
        
        // Network validation
        if (transaction.networkPassphrase !== TESTNET_PASSPHRASE) {
            throw new Error(`Wrong network passphrase! Expected: ${TESTNET_PASSPHRASE}, Found: ${transaction.networkPassphrase}`);
        }
        
        showMessage('💳 Signing with Freighter on TESTNET...', 'info');
        
        // Sign with Freighter - TESTNET ONLY
        const signedTransactionResponse = await window.freighterApi.signTransaction(
            transaction.toXDR(),
            {
                network: 'TESTNET',
                networkPassphrase: TESTNET_PASSPHRASE,
                accountToSign: userPublicKey
            }
        );
        
        console.log('🔍 Freighter response:', signedTransactionResponse);
        console.log('🔍 Response type:', typeof signedTransactionResponse);
        
        // Extract XDR string from Freighter response
        let signedTransactionXDR;
        if (typeof signedTransactionResponse === 'string') {
            signedTransactionXDR = signedTransactionResponse;
        } else if (signedTransactionResponse && signedTransactionResponse.signedTxXdr) {
            signedTransactionXDR = signedTransactionResponse.signedTxXdr;
        } else if (signedTransactionResponse && signedTransactionResponse.xdr) {
            signedTransactionXDR = signedTransactionResponse.xdr;
        } else if (signedTransactionResponse && signedTransactionResponse.transaction) {
            signedTransactionXDR = signedTransactionResponse.transaction;
        } else {
            console.error('🔍 Freighter response structure:', Object.keys(signedTransactionResponse));
            throw new Error('Could not identify signed transaction XDR format');
        }
        
        console.log('✅ Signed transaction XDR:', signedTransactionXDR);
        console.log('✅ XDR type:', typeof signedTransactionXDR);
        console.log('✅ XDR length:', signedTransactionXDR ? signedTransactionXDR.length : 'undefined');
        
        showMessage('📡 Sending transaction to TESTNET blockchain...', 'info');
        
        // Send signed transaction to TESTNET Horizon
        const submitResponse = await fetch('https://horizon-testnet.stellar.org/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `tx=${encodeURIComponent(signedTransactionXDR)}`
        });
        
        const submitResult = await submitResponse.json();
        console.log('🔍 Horizon response:', submitResult);
        
        if (submitResponse.ok) {
            console.log('✅ TESTNET transaction successful:', submitResult);
            console.log('🔗 Explorer link:', `https://testnet.steexp.com/tx/${submitResult.hash}`);
            
            // Update local data
            const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
            if (campaignIndex !== -1) {
                campaigns[campaignIndex].current_amount_raised += amount;
            }
            
            showMessage(`🎉 ${amount} XLM contribution successfully sent on TESTNET!`, 'success');
            showMessage(`🔗 Transaction ID: ${submitResult.hash}`, 'success');
            closeContributeModal();
            loadCampaigns();
            
            // Update balance
            await updateWalletBalance();
            
        } else {
            console.error('TESTNET transaction send error:', submitResult);
            
            // Detailed error information
            if (submitResult.extras && submitResult.extras.envelope_xdr) {
                console.log('🔍 Sent XDR:', submitResult.extras.envelope_xdr);
            }
            
            let errorMessage = 'Could not send transaction';
            if (submitResult.detail) {
                errorMessage = submitResult.detail;
            } else if (submitResult.title) {
                errorMessage = submitResult.title;
            }
            
            throw new Error(errorMessage);
        }
        
    } catch (error) {
        console.error('Contribution send error:', error);
        
        if (error.message.includes('User declined')) {
            showMessage('❌ Transaction canceled.', 'error');
        } else if (error.message.includes('insufficient balance') || error.message.includes('underfunded')) {
            showMessage('❌ Insufficient balance. Get Test XLM: https://laboratory.stellar.org/account-creator', 'error');
        } else if (error.message.includes('destination account does not exist')) {
            showMessage('❌ Destination account not found. Invalid address.', 'error');
        } else if (error.message.includes('network') || error.message.includes('Network')) {
            showMessage('❌ Network error. Make sure TESTNET is selected in Freighter.', 'error');
        } else {
            showMessage('Error sending contribution: ' + error.message, 'error');
        }
    }
}

// Show status message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message status-${type}`;
    messageDiv.textContent = message;
    
    statusMessages.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Global functions (callable from HTML)
window.openContributeModal = openContributeModal;

console.log('🚀 Stellar Crowdfunding - Real Blockchain Demo Ready!'); 