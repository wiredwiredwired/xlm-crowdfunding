/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef, useCallback, ReactNode } from 'react';
// import './dashboard.css'; // Eski CSS dosyasını artık kullanmayacağız, Tailwind ile her şeyi yapacağız.

// Layout Components
// import { Navbar } from "@/components/layout/navbar"; // Removed as it's provided by global layout
import { FooterSection } from "@/components/layout/sections/footer"; // Footer'ı import edelim

// ShadCN UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lucide Icons
import { Wallet, TrendingUp, PlusCircle, XCircle, Info, AlertTriangle, RefreshCw, Loader2, ExternalLink, Star, Check, Copy, LogOut, CheckCircle } from 'lucide-react';

// Types
interface Campaign {
  id: string | number; 
  title: string;
  goal_amount: number;
  current_amount_raised: number;
  owner: string;
}

interface StatusMessage {
  id: string;
  message: React.ReactNode;
  type: 'success' | 'error' | 'info' | 'warning';
}

declare global {
  interface Window {
    freighterApi: any;
    freighter: any;
    StellarSdk: {
      Account: any;
      TransactionBuilder: any;
      Operation: any;
      Asset: any;
      Networks: any;
      Memo: any;
      BASE_FEE: string; 
      Keypair?: any; 
      Server?: any; 
    };
  }
}

// Define a consistent primary color, assuming it's an orange tone from the theme
const PRIMARY_COLOR_FROM = 'from-orange-500'; // Example: Can be 'from-primary' if defined in Tailwind
const PRIMARY_COLOR_TO = 'to-pink-500'; // Example: from-[#D247BF]
const GRADIENT_CLASSES = `bg-gradient-to-r ${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`;
const TEXT_GRADIENT_CLASSES = `text-transparent bg-clip-text ${GRADIENT_CLASSES}`;

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userPublicKey, setUserPublicKey] = useState('');
  const [walletBalance, setWalletBalance] = useState('Loading...');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | number | null>(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  
  const projectTitleRef = useRef<HTMLInputElement>(null);
  const fundingGoalRef = useRef<HTMLInputElement>(null);

  const STELLAR_NETWORK = 'TESTNET';
  const HORIZON_URL = 'https://horizon-testnet.stellar.org';
  const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

  const showMessage = useCallback((message: React.ReactNode, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setStatusMessages(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setStatusMessages(prev => prev.filter(msg => msg.id !== id)), type === 'error' ? 10000 : 7000);
  }, [setStatusMessages]);

  const loadCampaignsFromBlockchain = useCallback(async () => {
    setCampaignsLoading(true);
    const mockCampaigns: Campaign[] = [
      { id: "mock_cg1_dev", title: "Solar Panel Community Initiative", goal_amount: 15000, current_amount_raised: 8200, owner: "GAW3KOBSVORBVRZ7ZC5ECUUBU6KW2ON7NQP234DAC7ESOY5X3PDSZMXY"},
      { id: "alice_campaign", title: "Alice's Innovation Project", goal_amount: 5000, current_amount_raised: 1250, owner: "GAW3KOBSVORBVRZ7ZC5ECUUBU6KW2ON7NQP234DAC7ESOY5X3PDSZMXY"},
    ];
    await new Promise(resolve => setTimeout(resolve, 700)); 
    setCampaigns(mockCampaigns);
    setCampaignsLoading(false);
  }, [setCampaignsLoading, setCampaigns]);

 const checkFreighterAvailability = useCallback(() => {
    const isAvailable = typeof window.freighterApi?.getAddress === 'function';
    console.log(`Freighter check: ${isAvailable ? 'Available' : 'Not available'}`);
    return isAvailable;
  }, []);

  const loadExternalScripts = useCallback(() => {
    return new Promise<void>((resolve) => {
      console.log('Attempting to load Freighter & StellarSDK scripts...');
      const freighterScript = document.createElement('script');
      freighterScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/stellar-freighter-api/4.1.0/index.min.js';
      freighterScript.async = true;
      document.head.appendChild(freighterScript);

      const stellarScript = document.createElement('script');
      stellarScript.src = 'https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk@13.3.0/dist/stellar-sdk.min.js';
      stellarScript.async = true;
      document.head.appendChild(stellarScript);

      let scriptsProcessed = 0;
      const onScriptProcessed = () => {
        scriptsProcessed++;
        console.log(`Script processed: ${scriptsProcessed}/2`);
        if (scriptsProcessed === 2) {
          console.log('Both script tags (Freighter & StellarSDK) have been processed. Starting polling...');
          let attempts = 0;
          const maxAttempts = 20;
          const intervalId = setInterval(() => {
            attempts++;
            const freighterAPIAvailable = typeof window.freighterApi?.getAddress === 'function';
            const sdk = window.StellarSdk;
            const stellarSdkObjectPresent = typeof sdk === 'object' && sdk !== null;
            const allStellarCoreComponentsReady = stellarSdkObjectPresent && typeof sdk.TransactionBuilder === 'function' && sdk.Operation && sdk.Asset && sdk.Networks && sdk.Memo && sdk.BASE_FEE;

            if (freighterAPIAvailable && allStellarCoreComponentsReady) {
              clearInterval(intervalId);
              console.log('✅ Freighter API and Stellar SDK loaded.');
              setIsSdkReady(true);
              setIsLoading(false);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(intervalId);
              console.error('❌ Failed to load critical components.');
              setIsSdkReady(false);
              setIsLoading(false);
              resolve(); 
            }
          }, 500);
        }
      };
      freighterScript.onload = () => { console.log('✅ Freighter script onload.'); onScriptProcessed(); };
      stellarScript.onload = () => { console.log('✅ StellarSDK script onload.'); onScriptProcessed(); };
      freighterScript.onerror = (e) => { console.error('❌ Freighter script onerror:', e); onScriptProcessed(); };
      stellarScript.onerror = (e) => { console.error('❌ StellarSDK script onerror:', e); onScriptProcessed(); };
    });
  }, [setIsSdkReady, setIsLoading]);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🌟 App Initialize: Starting script loading...');
      await loadExternalScripts();
      console.log('🌟 App Initialize: Script loading process handled.');
    };
    initializeApp();
  }, [loadExternalScripts]);

  useEffect(() => {
    if (isLoading) {
      console.log('App loading (scripts)...');
      return;
    }
    if (isSdkReady) {
      console.log('✅ SDK ready. Checking wallet & loading campaigns.');
      checkFreighterAvailability(); 
      loadCampaignsFromBlockchain();
    } else {
      console.error('SDK/Freighter not loaded. Functionality limited.');
      showMessage(
        'Critical components (Wallet/Stellar SDK) failed. Please refresh or check console.',
        'error'
      );
    }
  }, [isSdkReady, isLoading, checkFreighterAvailability, loadCampaignsFromBlockchain, showMessage]);

  const connectWallet = async () => {
    if (!isSdkReady) {
      showMessage('SDK not ready. Wait or refresh.', 'error'); return;
    }
    if (!checkFreighterAvailability()) {
      showMessage('Freighter Wallet not available. Install/enable it.', 'error'); return;
    }
    try {
      showMessage('Connecting to Freighter...', 'info');
      await window.freighterApi.requestAccess();
      const publicKeyResponse = await window.freighterApi.getAddress();
      if (!publicKeyResponse) throw new Error('Failed to get public key.');
      const publicKey = typeof publicKeyResponse === 'string' 
        ? publicKeyResponse 
        : (publicKeyResponse.address || publicKeyResponse.publicKey || '');
      if (!publicKey || typeof publicKey !== 'string') {
        throw new Error('Invalid public key format.');
      }
      const networkDetails = await window.freighterApi.getNetwork(); 
      const currentNetworkString = typeof networkDetails === 'string' ? networkDetails : networkDetails?.network;
      if (!currentNetworkString || currentNetworkString.toUpperCase() !== STELLAR_NETWORK) {
        showMessage(`Wrong Network: Wallet on ${currentNetworkString || 'Unknown'}. Switch to ${STELLAR_NETWORK}.`, 'error');
        setIsWalletConnected(false); setUserPublicKey(''); return;
      }
      setUserPublicKey(publicKey);
      setIsWalletConnected(true);
      await updateWalletBalance(publicKey);
      showMessage('Wallet connected successfully.', 'success');
    } catch (error: any) {
      console.error('Wallet Connection Error:', error);
      const msg = error.message?.toLowerCase();
      if (msg?.includes('user declined')) showMessage('Connection declined.', 'warning');
      else if (msg?.includes('freighter is locked')) showMessage('Freighter locked. Unlock & retry.', 'warning');
      else showMessage(`Connection Failed: ${error.message || 'Unknown'}`, 'error');
      setIsWalletConnected(false); setUserPublicKey('');
    }
  };

  const updateWalletBalance = async (publicKey: string) => {
    if (!isSdkReady || !publicKey) {
      setWalletBalance(isSdkReady ? 'No Address' : 'SDK Init...'); return;
    }
    setWalletBalance('Fetching...');
    try {
      const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
      if (!response.ok) {
        if (response.status === 404) {
          setWalletBalance('Account Unfunded');
          showMessage('Account needs Test XLM for transactions.', 'warning'); return;
        }
        throw new Error(`Horizon HTTP ${response.status}`);
      }
      const account = await response.json();
      const xlmBalance = account.balances.find((b: { asset_type: string; }) => b.asset_type === 'native');
      setWalletBalance(xlmBalance ? `${parseFloat(xlmBalance.balance).toFixed(2)} XLM` : '0.00 XLM');
    } catch (error: any) {
      console.error('Balance Update Error:', error);
      setWalletBalance('Load Error');
      showMessage(`Balance Error: ${error.message}`, 'error');
    }
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected || !isSdkReady) { showMessage('Connect wallet & SDK ready.', 'error'); return; }
    const title = projectTitleRef.current?.value.trim();
    const goalStr = fundingGoalRef.current?.value;
    if (!title || !goalStr) { showMessage('Title and Goal required.', 'error'); return; }
    const goalAmount = parseFloat(goalStr);
    if (isNaN(goalAmount) || goalAmount <= 0) { showMessage('Valid positive goal amount.', 'error'); return; }
    try {
      showMessage('Preparing campaign TX...', 'info');
      if (!window.StellarSdk) throw new Error('Stellar SDK not found.');
      const { TransactionBuilder, Operation, Asset, Memo, Account } = window.StellarSdk;
      const accountResponse = await fetch(`${HORIZON_URL}/accounts/${userPublicKey}`);
      if (!accountResponse.ok) throw new Error(`Load creator account HTTP ${accountResponse.status}`);
      const creatorAccountData = await accountResponse.json();
      const sourceAccount = new Account(userPublicKey, creatorAccountData.sequence);
      const campaignData = { type: 'crowdfund_v1_create', title, goal: goalAmount, by: userPublicKey.substring(0,10) }; 
      const memoText = JSON.stringify(campaignData).substring(0, 28);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: window.StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(Operation.payment({ destination: userPublicKey, asset: Asset.native(), amount: '0.0000001' }))
      .addMemo(Memo.text(memoText))
      .setTimeout(180).build();
      showMessage('Sign in Freighter to create campaign...', 'info');
      const signResponse = await window.freighterApi.signTransaction(transaction.toXDR(), { 
        network: 'TESTNET', networkPassphrase: NETWORK_PASSPHRASE 
      });
      if (!signResponse) throw new Error('Signing cancelled/failed.');
      let signedXDR;
      if (typeof signResponse === 'string') signedXDR = signResponse;
      else if (signResponse && typeof signResponse === 'object') signedXDR = signResponse.signedTxXdr || signResponse.signedXDR || signResponse.xdr || signResponse.result || signResponse.data;
      if (!signedXDR || typeof signedXDR !== 'string') throw new Error('Invalid XDR from Freighter.');
      showMessage('Submitting campaign TX...', 'info');
      const submitResponse = await fetch(`${HORIZON_URL}/transactions`, {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ tx: signedXDR })
      });
      const result = await submitResponse.json();
      if (!submitResponse.ok) throw new Error(`TX Submission Failed: ${result.title || 'Horizon error'} ${result.detail || ''}` );
      const newCampaignId = 'cg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      const newCampaign: Campaign = { id: newCampaignId, title, goal_amount: goalAmount, current_amount_raised: 0, owner: userPublicKey };
      setCampaigns(prev => [newCampaign, ...prev]);
      const explorerLink = `https://stellar.expert/explorer/testnet/tx/${result.hash}`;
      console.log('TX Link (Create Campaign):', explorerLink);
      showMessage(
        <span className="text-sm">
          ✅ "{title}" created! <a href={explorerLink} target="_blank" rel="noopener noreferrer" className={`font-semibold underline hover:${PRIMARY_COLOR_TO.replace('to-','')}-400`}>View TX</a>
        </span>,
        'success'
      );
      if (projectTitleRef.current) projectTitleRef.current.value = '';
      if (fundingGoalRef.current) fundingGoalRef.current.value = '';
      await updateWalletBalance(userPublicKey);
    } catch (error: any) {
      console.error('Create Campaign Error:', error);
      showMessage(error.message?.substring(0,100) || 'Unknown error', 'error');
    }
  };

  const submitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected || !isSdkReady) { showMessage('Connect wallet & SDK ready.', 'error'); return; }
    const campaign = campaigns.find(c => c.id === selectedCampaignId);
    if (!campaign || !contributionAmount) { showMessage('Campaign/Amount missing.', 'error'); return; }
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) { showMessage('Valid positive contribution amount.', 'error'); return; }
    try {
      showMessage('Preparing contribution TX...', 'info');
      if (!window.StellarSdk) throw new Error('Stellar SDK not found.');
      const { TransactionBuilder, Operation, Asset, Memo, Account } = window.StellarSdk;
      const accountResponse = await fetch(`${HORIZON_URL}/accounts/${userPublicKey}`);
      if (!accountResponse.ok) throw new Error(`Load sender account HTTP ${accountResponse.status}`);
      const senderAccountData = await accountResponse.json();
      const sourceAccount = new Account(userPublicKey, senderAccountData.sequence);
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: window.StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(Operation.payment({ destination: campaign.owner, asset: Asset.native(), amount: amount.toString() }))
      .addMemo(Memo.text(`Donate to: ${campaign.id}`.substring(0,28)))
      .setTimeout(180).build();
      showMessage('Sign in Freighter to contribute...', 'info');
      const signResponse = await window.freighterApi.signTransaction(transaction.toXDR(), { 
        network: 'TESTNET', networkPassphrase: NETWORK_PASSPHRASE 
      });
      if (!signResponse) throw new Error('Signing cancelled/failed.');
      let signedXDR;
      if (typeof signResponse === 'string') signedXDR = signResponse;
      else if (signResponse && typeof signResponse === 'object') signedXDR = signResponse.signedTxXdr || signResponse.signedXDR || signResponse.xdr || signResponse.result || signResponse.data;
      if (!signedXDR || typeof signedXDR !== 'string') throw new Error('Invalid XDR from Freighter.');
      showMessage('Submitting contribution TX...', 'info');
      const submitResponse = await fetch(`${HORIZON_URL}/transactions`, {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ tx: signedXDR })
      });
      const result = await submitResponse.json();
      if (!submitResponse.ok) {
          let errorDetail = result.title || 'Horizon error';
          if (result.extras && result.extras.result_codes) {
            const codes = result.extras.result_codes;
            if (codes.transaction === 'tx_insufficient_balance') errorDetail = 'Insufficient XLM balance.';
            else if (codes.operations && codes.operations[0]) errorDetail = `TX failed: ${codes.operations[0]}.`;
            else if (codes.transaction) errorDetail = `TX failed: ${codes.transaction}.`;
          }
          throw new Error(`Contribution Failed: ${errorDetail}`);
      }
      setCampaigns(prev => prev.map(c => c.id === selectedCampaignId ? { ...c, current_amount_raised: c.current_amount_raised + amount } : c));
      const explorerLink = `https://stellar.expert/explorer/testnet/tx/${result.hash}`;
      console.log('TX Link (Submit Contribution):', explorerLink);
      showMessage(
        <span className="text-sm">
          ✅ {amount} XLM to "{campaign.title.substring(0,20)}..."! <a href={explorerLink} target="_blank" rel="noopener noreferrer" className={`font-semibold underline hover:${PRIMARY_COLOR_TO.replace('to-','')}-400`}>View TX</a>
        </span>,
        'success'
      );
      closeContributeModal();
      await updateWalletBalance(userPublicKey);
    } catch (error: any) {
      console.error('Contribution Error:', error);
      showMessage(error.message?.substring(0,100) || 'Unknown error', 'error');
    }
  };

  const formatAddress = (address: string) => {
    if (!address || typeof address !== 'string' || address.length < 10) return address || 'N/A';
    return `${address.substring(0,6)}...${address.substring(address.length - 4)}`;
  };
  const calculateProgress = (current: number, goal: number) => goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const openContributeModal = (campaignId: string | number) => { setSelectedCampaignId(campaignId); setShowContributeModal(true); setContributionAmount(''); };
  const closeContributeModal = () => { setShowContributeModal(false); setSelectedCampaignId(null); };

  if (isLoading && !isSdkReady) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground p-4">
        <Loader2 className={`h-16 w-16 animate-spin ${PRIMARY_COLOR_TO.replace('to-','text-')}-500 mb-6`} />
        <p className="text-2xl font-semibold mb-2">Initializing DApp...</p>
        <p className="text-md text-muted-foreground">Connecting to Stellar Network & Wallet API.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-pink-500/70 selection:text-white">
      {/* <Navbar /> */ /* Removed */}
      
      <main className="flex-grow w-full container mx-auto py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-10 md:mb-12 text-center">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-3 ${TEXT_GRADIENT_CLASSES}`}>
            DApp Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Manage your Stellar-powered crowdfunding campaigns or contribute to exciting new projects.
          </p>
        </div>

        {/* Wallet Connection Area - Integrated into main flow for better visibility if not connected */}
        {!isWalletConnected && isSdkReady && (
          <Card className="mb-16 bg-card/80 border border-border shadow-xl backdrop-blur-sm">
            <CardHeader className="items-center">
              <CardTitle className={`text-2xl font-semibold text-center flex items-center justify-center ${TEXT_GRADIENT_CLASSES}`}>
                <Wallet className="h-7 w-7 mr-3" /> Connect Your Wallet
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground pt-1">
                To create campaigns or contribute, please connect your Freighter wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Button 
                onClick={connectWallet} 
                disabled={!isSdkReady} 
                size="lg"
                className={`${GRADIENT_CLASSES} text-white font-semibold text-md px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 ease-in-out brightness-100 hover:brightness-110`}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Freighter
              </Button>
            </CardContent>
          </Card>
        )}

        {isWalletConnected && (
            <div className="mb-8 p-3 sm:p-4 bg-card/70 border border-border rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <Badge className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1.5 text-xs sm:text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1.5"/> Connected
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground font-mono bg-background/50 px-2 py-1 rounded border border-border cursor-pointer" title={userPublicKey} onClick={() => navigator.clipboard.writeText(userPublicKey).then(() => showMessage('Address copied!', 'info'))}>
                        {formatAddress(userPublicKey)} <Copy className="inline h-3 w-3 ml-1"/>
                    </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <Badge variant="outline" className="border-border text-muted-foreground px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-mono">
                        {walletBalance}
                    </Badge>
                    {/* Optional: Disconnect button or other actions */}
                </div>
            </div>
          )}

        {/* Create Campaign Section */}
        {isWalletConnected && (
          <section className="mb-12">
            <div className="bg-card/70 border border-border shadow-lg rounded-xl p-6 backdrop-blur-sm">
              <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <PlusCircle className={`h-6 w-6 mr-3 ${PRIMARY_COLOR_FROM.replace('from-','text-')}-500`} />
                  <span className={`${TEXT_GRADIENT_CLASSES}`}>Create New Campaign</span>
                </h2>
                <p className="text-muted-foreground pt-1 text-sm">
                  Launch your innovative project on the Stellar network.
                </p>
              </div>
              <form onSubmit={createCampaign} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="project-title" className="block text-sm font-medium text-muted-foreground mb-1.5">Project Title</Label>
                    <Input type="text" id="project-title" ref={projectTitleRef} required placeholder="e.g., Stellar Eco Drones" className="w-full bg-background/50 border-border placeholder-muted-foreground/70 text-foreground focus:ring-pink-500 focus:border-pink-500 rounded-md" />
                  </div>
                  <div>
                    <Label htmlFor="funding-goal" className="block text-sm font-medium text-muted-foreground mb-1.5">Funding Goal (XLM)</Label>
                    <Input type="number" id="funding-goal" ref={fundingGoalRef} min="1" step="any" required placeholder="e.g., 10000" className="w-full bg-background/50 border-border placeholder-muted-foreground/70 text-foreground focus:ring-pink-500 focus:border-pink-500 rounded-md"/>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className={`w-full sm:w-auto ${GRADIENT_CLASSES} text-white font-semibold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out brightness-100 hover:brightness-110`}
                  disabled={!isWalletConnected || !isSdkReady}
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Launch Campaign
                </Button>
              </form>
            </div>
          </section>
        )}

        {/* Active Campaigns Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className={`text-3xl sm:text-4xl font-bold flex items-center ${TEXT_GRADIENT_CLASSES}`}>
              <TrendingUp className={`h-7 sm:h-8 mr-3 ${PRIMARY_COLOR_FROM.replace('from-','text-')}-500`} />
               Active Campaigns
            </h2>
            <Button 
                onClick={loadCampaignsFromBlockchain} 
                variant="outline"
                className="border-pink-500/60 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 px-5 py-2.5 rounded-md mt-3 sm:mt-0 sm:ml-6 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-150 ease-in-out group"
                disabled={campaignsLoading || !isSdkReady}
            >
              {campaignsLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin text-pink-400" /> Refreshing...</>
              ) : (
                <><RefreshCw className="mr-2 h-4 w-4 text-pink-400 group-hover:text-pink-300 transition-colors" /> Refresh</>
              )}
            </Button>
        </div>

          {(campaignsLoading && campaigns.length === 0 && isSdkReady) && (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-card/50 border border-border rounded-xl shadow-md backdrop-blur-sm">
              <Loader2 className={`h-10 w-10 animate-spin ${PRIMARY_COLOR_TO.replace('to-','text-')}-500 mb-4`} />
              <p className="text-lg font-medium text-muted-foreground">Loading active campaigns...</p>
            </div>
          )}
          {(!isSdkReady && !isLoading) && (
            <div className="p-6 text-center bg-yellow-600/20 border border-yellow-500/40 rounded-lg shadow backdrop-blur-sm">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <p className="font-semibold text-yellow-300 text-lg">SDK Not Initialized</p>
              <p className="text-sm text-yellow-400">Campaign features are currently disabled. Please wait or refresh.</p>
            </div>
          )}
          {(isSdkReady && campaigns.length === 0 && !campaignsLoading) && (
             <div className="p-8 text-center bg-card/50 border border-border rounded-xl shadow-md backdrop-blur-sm">
              <Info className={`h-10 w-10 ${PRIMARY_COLOR_FROM.replace('from-','text-')}-500 mx-auto mb-4`} />
              <p className="font-semibold text-muted-foreground text-xl">No Active Campaigns Found</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Be the first to create one using the form above (if wallet connected)!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {isSdkReady && campaigns.map(campaign => (
              <Card key={campaign.id} className="bg-card/70 border border-border shadow-lg hover:shadow-pink-500/10 hover:border-pink-500/40 transition-all duration-300 rounded-xl flex flex-col group backdrop-blur-sm">
                <CardHeader className="pb-4 border-b border-border/70">
                  <CardTitle className="text-xl font-semibold text-foreground truncate group-hover:text-pink-400 transition-colors" title={campaign.title}>{campaign.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4 flex-grow">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-muted-foreground">Goal:</span>
                    <Badge variant="outline" className={`font-mono text-orange-400 border-orange-500/40 bg-background/40 px-2.5 py-0.5`}>
                      {campaign.goal_amount.toLocaleString()} XLM
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-muted-foreground">Raised:</span>
                    <Badge variant={campaign.current_amount_raised >= campaign.goal_amount ? "default" : "secondary"} 
                           className={`${campaign.current_amount_raised >= campaign.goal_amount ? 'bg-green-500/80 text-green-100 border border-green-500/50' : 'bg-purple-500/70 text-purple-100 border border-purple-500/50'} font-mono px-2.5 py-0.5`}>
                      {campaign.current_amount_raised.toLocaleString()} XLM
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{calculateProgress(campaign.current_amount_raised, campaign.goal_amount).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2.5 border border-border/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out 
                                    ${calculateProgress(campaign.current_amount_raised, campaign.goal_amount) >= 100 ? 'bg-green-500' : GRADIENT_CLASSES}`}
                        style={{width: `${calculateProgress(campaign.current_amount_raised, campaign.goal_amount)}%`}}
                      ></div>
                    </div>
                </div>

                  <div className="text-sm text-muted-foreground pt-3 border-t border-border/70">
                    <span className="font-medium">Owner:</span> 
                    <Badge variant="outline" className={`ml-1.5 font-mono text-xs border-border bg-background/40 px-2 py-0.5`} title={campaign.owner}>{formatAddress(campaign.owner)}</Badge>
              </div>
                </CardContent>
                <CardFooter className="p-4 bg-card/30 border-t border-border/70 backdrop-blur-sm">
                  <Button 
                    onClick={() => openContributeModal(campaign.id)} 
                    className={`w-full ${GRADIENT_CLASSES} text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 ease-in-out brightness-100 hover:brightness-110`}
                    disabled={!isWalletConnected || !isSdkReady}
                  >
                    <Check className="mr-2 h-5 w-5" /> Contribute Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {showContributeModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" 
             onClick={(e) => e.target === e.currentTarget && closeContributeModal()}>
          <Card className="w-full max-w-lg bg-card border border-border shadow-2xl rounded-xl transform transition-all duration-300 ease-in-out scale-100 opacity-100 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
              <CardTitle className={`text-2xl font-semibold flex items-center ${TEXT_GRADIENT_CLASSES}`}>
                <CheckCircle className="h-6 w-6 mr-3" /> Contribute to Project
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={closeContributeModal} className="text-muted-foreground hover:text-foreground">
                <XCircle className="h-7 w-7" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-xl font-medium text-foreground truncate" title={selectedCampaign.title}>To: "{selectedCampaign.title}"</h3>
              <div className="grid grid-cols-2 gap-4 text-sm border border-border bg-background/30 p-4 rounded-lg">
                <div>
                  <p className="text-muted-foreground mb-0.5">Goal:</p> 
                  <p className={`font-semibold text-lg text-orange-400`}>{selectedCampaign.goal_amount.toLocaleString()} XLM</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Currently Raised:</p> 
                  <p className={`font-semibold text-lg text-purple-400`}>{selectedCampaign.current_amount_raised.toLocaleString()} XLM</p>
            </div>
              </div>
              <form onSubmit={submitContribution} className="space-y-5">
                <div>
                  <Label htmlFor="contribution-amount" className="block text-sm font-medium text-muted-foreground mb-1.5">Your Contribution (XLM)</Label>
                  <Input 
                    type="number" 
                    id="contribution-amount" 
                    value={contributionAmount} 
                    onChange={(e) => setContributionAmount(e.target.value)} 
                    min="0.0000001" 
                    step="any" 
                    required 
                    placeholder="e.g., 100"
                    className="w-full bg-background/50 border-border placeholder-muted-foreground/70 text-foreground focus:ring-pink-500 focus:border-pink-500 rounded-md text-lg p-2.5"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Button 
                    type="submit" 
                    className={`w-full sm:flex-1 ${GRADIENT_CLASSES} text-white font-semibold shadow-md text-base py-3 rounded-md transform hover:scale-105 transition-all duration-150 ease-in-out brightness-100 hover:brightness-110`}
                    disabled={!isWalletConnected || !isSdkReady || !parseFloat(contributionAmount) || parseFloat(contributionAmount) <=0 }
                  >
                    <Check className="mr-2 h-5 w-5" /> Send Contribution
                  </Button>
                  <Button type="button" variant="outline" className="w-full sm:flex-1 border-border text-muted-foreground hover:bg-muted hover:text-foreground py-3 rounded-md text-base" onClick={closeContributeModal}>
                    Cancel
                  </Button>
              </div>
            </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="fixed bottom-5 right-5 space-y-3 z-[100] w-full max-w-sm sm:max-w-md">
        {statusMessages.map(msg => {
          let IconComponent = Info;
          let baseColors = "border-blue-500/70 bg-background/80 text-blue-300 backdrop-blur-md";
          let title = "Information";
          let iconColor = "text-blue-400";

          if (msg.type === 'success') {
            IconComponent = CheckCircle;
            baseColors = "border-green-500/70 bg-background/80 text-green-300 backdrop-blur-md";
            title = "Success!";
            iconColor = "text-green-400";
          } else if (msg.type === 'error') {
            IconComponent = XCircle;
            baseColors = "border-red-500/70 bg-background/80 text-red-300 backdrop-blur-md";
            title = "Error";
            iconColor = "text-red-400";
          } else if (msg.type === 'warning') {
            IconComponent = AlertTriangle;
            baseColors = "border-yellow-500/70 bg-background/80 text-yellow-300 backdrop-blur-md";
            title = "Warning";
            iconColor = "text-yellow-400";
          }

          return (
            <div 
              key={msg.id} 
              className={`flex items-start p-4 rounded-lg shadow-xl border-l-4 ${baseColors} w-full animate-in slide-in-from-bottom-5 fade-in duration-300`}
            >
              <IconComponent className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-grow">
                <p className={`font-semibold text-sm text-foreground`}>{title}</p>
                <div className={`text-sm mt-0.5 [&_a]:underline [&_a:hover]:text-pink-400`}>{msg.message}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setStatusMessages(prev => prev.filter(m => m.id !== msg.id))} className="ml-auto -mr-1 -mt-1 h-8 w-8 text-muted-foreground hover:bg-white/5 rounded-full">
                <XCircle className="h-5 w-5" />
              </Button>
          </div>
          );
        })}
      </div>

      <FooterSection />
    </div>
  );
} 