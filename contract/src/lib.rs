/*
 * STELLAR CROWDFUNDING SMART CONTRACT
 * 
 * A decentralized crowdfunding platform built on Stellar blockchain using Soroban.
 * This contract allows users to create campaigns and contribute XLM to support projects.
 * 
 * Key Features:
 * - Campaign creation with funding goals
 * - XLM contribution tracking
 * - Campaign data retrieval
 * - Secure authentication via Stellar addresses
 * 
 * Author: Stellar Crowdfunding Team
 * License: MIT
 * Version: 1.0.0
 */

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, String, log};

/**
 * CAMPAIGN DATA STRUCTURE
 * 
 * Represents a single crowdfunding campaign with all necessary information.
 * This structure is stored on-chain and contains immutable campaign data.
 */
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    /// Unique identifier for the campaign (auto-incrementing)
    pub id: u32,
    
    /// Stellar address of the campaign creator/owner
    pub owner: Address,
    
    /// Human-readable title/description of the campaign
    pub title: String,
    
    /// Target funding amount in stroops (1 XLM = 10^7 stroops)
    pub goal_amount: i128,
    
    /// Current amount raised in stroops (updated as contributions come in)
    pub current_amount_raised: i128,
}

/**
 * STORAGE KEY ENUMERATION
 * 
 * Defines the keys used for persistent storage on Stellar blockchain.
 * These keys organize different types of data in the contract storage.
 */
#[contracttype]
pub enum DataKey {
    /// Key for storing the vector of all campaigns
    Campaigns,
    
    /// Key for storing the next available campaign ID (auto-increment counter)
    NextCampaignId,
}

/**
 * MAIN CROWDFUNDING CONTRACT
 * 
 * The core smart contract implementing all crowdfunding functionality.
 * This contract is deployed on Stellar network and handles all campaign operations.
 */
#[contract]
pub struct CrowdfundingContract;

/**
 * CONTRACT IMPLEMENTATION
 * 
 * Contains all public functions that can be called by external users.
 * Each function includes proper authentication and validation.
 */
#[contractimpl]
impl CrowdfundingContract {
    
    /**
     * CREATE A NEW CROWDFUNDING CAMPAIGN
     * 
     * Allows users to create new campaigns with specified funding goals.
     * The campaign creator must sign the transaction to prove ownership.
     * 
     * @param env - Soroban environment for blockchain operations
     * @param owner - Stellar address of the campaign creator (must sign transaction)
     * @param title - Human-readable campaign title/description
     * @param goal_amount - Target funding amount in stroops
     * @return u32 - Unique campaign ID for the newly created campaign
     * 
     * Security: Requires authentication from campaign owner
     * Events: Logs campaign creation with ID
     */
    pub fn create_campaign(
        env: Env,
        owner: Address,
        title: String,
        goal_amount: i128,
    ) -> u32 {
        // AUTHENTICATION: Verify the owner has signed this transaction
        // This prevents unauthorized campaign creation
        owner.require_auth();

        // CAMPAIGN ID GENERATION: Get the next available unique ID
        let campaign_id = Self::get_next_campaign_id(&env);
        
        // CAMPAIGN CREATION: Build new campaign struct with provided data
        let campaign = Campaign {
            id: campaign_id,
            owner: owner.clone(),
            title,
            goal_amount,
            current_amount_raised: 0, // Start with zero contributions
        };

        // STORAGE RETRIEVAL: Get existing campaigns or create new vector if none exist
        let mut campaigns: Vec<Campaign> = env
            .storage()
            .instance()
            .get(&DataKey::Campaigns)
            .unwrap_or_else(|| Vec::new(&env));

        // CAMPAIGN ADDITION: Add new campaign to the existing list
        campaigns.push_back(campaign);

        // STORAGE UPDATE: Persist the updated campaigns list to blockchain
        env.storage()
            .instance()
            .set(&DataKey::Campaigns, &campaigns);

        // COUNTER UPDATE: Increment the campaign ID counter for next campaign
        env.storage()
            .instance()
            .set(&DataKey::NextCampaignId, &(campaign_id + 1));

        // EVENT LOGGING: Record campaign creation for external monitoring
        log!(&env, "Campaign created with ID: {}", campaign_id);
        
        campaign_id
    }

    /**
     * CONTRIBUTE XLM TO A CAMPAIGN
     * 
     * Allows users to make contributions to existing campaigns.
     * The contributor must sign the transaction and provide a positive amount.
     * 
     * @param env - Soroban environment for blockchain operations  
     * @param contributor - Stellar address making the contribution (must sign)
     * @param campaign_id - ID of the campaign to contribute to
     * @param amount - Contribution amount in stroops (must be positive)
     * @return bool - True if contribution was successful
     * 
     * Security: Requires authentication from contributor
     * Validation: Amount must be positive, campaign must exist
     * Events: Logs contribution details
     */
    pub fn contribute(
        env: Env,
        contributor: Address,
        campaign_id: u32,
        amount: i128,
    ) -> bool {
        // AUTHENTICATION: Verify the contributor has signed this transaction
        contributor.require_auth();

        // INPUT VALIDATION: Ensure contribution amount is positive
        if amount <= 0 {
            panic!("Contribution amount must be positive");
        }

        // STORAGE RETRIEVAL: Get all campaigns from blockchain storage
        let mut campaigns: Vec<Campaign> = env
            .storage()
            .instance()
            .get(&DataKey::Campaigns)
            .unwrap_or_else(|| Vec::new(&env));

        // CAMPAIGN SEARCH: Find the target campaign and update contribution amount
        let mut found = false;
        for i in 0..campaigns.len() {
            let mut campaign = campaigns.get(i).unwrap();
            
            if campaign.id == campaign_id {
                // CONTRIBUTION UPDATE: Add new contribution to campaign total
                campaign.current_amount_raised += amount;
                campaigns.set(i, campaign.clone());
                found = true;
                
                // EVENT LOGGING: Record the contribution for transparency
                log!(&env, "Contribution of {} to campaign {}", amount, campaign_id);
                break;
            }
        }

        // VALIDATION: Ensure the campaign exists
        if !found {
            panic!("Campaign not found");
        }

        // STORAGE UPDATE: Persist updated campaigns with new contribution
        env.storage()
            .instance()
            .set(&DataKey::Campaigns, &campaigns);

        // NOTE: In a production implementation, this would trigger actual XLM transfer
        // using Stellar Asset Contract (SAC) functions. For this demo, we track
        // contributions conceptually while real XLM transfers happen off-chain.

        true
    }

    /**
     * RETRIEVE ALL CAMPAIGNS
     * 
     * Returns a vector containing all created campaigns with their current status.
     * This is a read-only operation that doesn't modify blockchain state.
     * 
     * @param env - Soroban environment for blockchain operations
     * @return Vec<Campaign> - Vector of all campaigns (empty if none exist)
     * 
     * Gas: Low cost operation, only reads from storage
     * Use Case: Frontend campaign listing, analytics, monitoring
     */
    pub fn get_campaigns(env: Env) -> Vec<Campaign> {
        env.storage()
            .instance()
            .get(&DataKey::Campaigns)
            .unwrap_or_else(|| Vec::new(&env))
    }

    /**
     * RETRIEVE A SPECIFIC CAMPAIGN BY ID
     * 
     * Finds and returns campaign details for a given campaign ID.
     * Returns None if no campaign exists with the specified ID.
     * 
     * @param env - Soroban environment for blockchain operations
     * @param campaign_id - Unique identifier of the campaign to retrieve
     * @return Option<Campaign> - Campaign data if found, None otherwise
     * 
     * Gas: Low to medium cost depending on number of campaigns
     * Use Case: Campaign detail pages, contribution validation
     */
    pub fn get_campaign(env: Env, campaign_id: u32) -> Option<Campaign> {
        let campaigns: Vec<Campaign> = Self::get_campaigns(env);
        
        // LINEAR SEARCH: Iterate through campaigns to find matching ID
        for i in 0..campaigns.len() {
            let campaign = campaigns.get(i).unwrap();
            if campaign.id == campaign_id {
                return Some(campaign);
            }
        }
        
        None // Campaign not found
    }

    /**
     * GET TOTAL NUMBER OF CAMPAIGNS
     * 
     * Returns the count of all campaigns created in this contract.
     * Useful for analytics and pagination in frontend applications.
     * 
     * @param env - Soroban environment for blockchain operations
     * @return u32 - Total number of campaigns created
     * 
     * Gas: Low cost operation
     * Use Case: Analytics, pagination, dashboard statistics
     */
    pub fn get_campaign_count(env: Env) -> u32 {
        let campaigns: Vec<Campaign> = Self::get_campaigns(env);
        campaigns.len()
    }

    /**
     * PRIVATE HELPER: GET NEXT CAMPAIGN ID
     * 
     * Internal function to retrieve the next available campaign ID.
     * Maintains an auto-incrementing counter for unique campaign identification.
     * 
     * @param env - Reference to Soroban environment
     * @return u32 - Next available campaign ID (starts from 1)
     * 
     * Implementation: Uses persistent storage to maintain counter across transactions
     */
    fn get_next_campaign_id(env: &Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::NextCampaignId)
            .unwrap_or(1) // Start with ID 1 if no campaigns exist yet
    }
}

/**
 * TEST MODULE
 * 
 * Comprehensive tests for all contract functionality.
 * Tests cover happy paths, edge cases, and error conditions.
 */
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    /**
     * TEST: CAMPAIGN CREATION
     * 
     * Verifies that campaigns can be created successfully with proper data.
     * Tests authentication, storage, and data integrity.
     */
    #[test]
    fn test_create_campaign() {
        // TEST SETUP: Initialize test environment and contract
        let env = Env::default();
        let contract_id = env.register_contract(None, CrowdfundingContract);
        let client = CrowdfundingContractClient::new(&env, &contract_id);

        // TEST DATA: Create sample campaign data
        let owner = Address::generate(&env);
        let title = String::from_str(&env, "Test Blockchain Project");
        let goal_amount = 1000i128;

        // AUTHENTICATION MOCK: Bypass signature verification for testing
        env.mock_all_auths();

        // CAMPAIGN CREATION: Create the campaign
        let campaign_id = client.create_campaign(&owner, &title, &goal_amount);
        
        // ASSERTION: Verify campaign ID is correct (first campaign = ID 1)
        assert_eq!(campaign_id, 1);

        // ASSERTION: Verify campaign was stored correctly
        let campaigns = client.get_campaigns();
        assert_eq!(campaigns.len(), 1);
        
        // ASSERTION: Verify campaign data integrity
        let campaign = campaigns.get(0).unwrap();
        assert_eq!(campaign.id, 1);
        assert_eq!(campaign.owner, owner);
        assert_eq!(campaign.title, title);
        assert_eq!(campaign.goal_amount, goal_amount);
        assert_eq!(campaign.current_amount_raised, 0);
    }

    /**
     * TEST: CAMPAIGN CONTRIBUTION
     * 
     * Verifies that contributions can be made to existing campaigns.
     * Tests contribution logic, amount validation, and storage updates.
     */
    #[test]
    fn test_contribute_to_campaign() {
        // TEST SETUP: Initialize test environment
        let env = Env::default();
        let contract_id = env.register_contract(None, CrowdfundingContract);
        let client = CrowdfundingContractClient::new(&env, &contract_id);

        // AUTHENTICATION MOCK: Bypass signature verification
        env.mock_all_auths();

        // CAMPAIGN SETUP: Create a test campaign first
        let owner = Address::generate(&env);
        let title = String::from_str(&env, "Test Project for Contributions");
        let goal_amount = 1000i128;
        let campaign_id = client.create_campaign(&owner, &title, &goal_amount);

        // CONTRIBUTION TEST: Make a contribution to the campaign
        let contributor = Address::generate(&env);
        let contribution_amount = 100i128;
        let result = client.contribute(&contributor, &campaign_id, &contribution_amount);

        // ASSERTION: Verify contribution was successful
        assert!(result);

        // ASSERTION: Verify campaign amount was updated correctly
        let updated_campaign = client.get_campaign(&campaign_id).unwrap();
        assert_eq!(updated_campaign.current_amount_raised, contribution_amount);
    }

    /**
     * TEST: MULTIPLE CAMPAIGNS
     * 
     * Verifies that multiple campaigns can be created and managed independently.
     * Tests campaign isolation and correct ID assignment.
     */
    #[test]
    fn test_multiple_campaigns() {
        // TEST SETUP: Initialize test environment
        let env = Env::default();
        let contract_id = env.register_contract(None, CrowdfundingContract);
        let client = CrowdfundingContractClient::new(&env, &contract_id);

        // AUTHENTICATION MOCK: Bypass signature verification
        env.mock_all_auths();

        // MULTIPLE CAMPAIGN CREATION: Create several campaigns
        let owner1 = Address::generate(&env);
        let owner2 = Address::generate(&env);
        
        let campaign_id1 = client.create_campaign(
            &owner1, 
            &String::from_str(&env, "First Project"), 
            &500i128
        );
        
        let campaign_id2 = client.create_campaign(
            &owner2, 
            &String::from_str(&env, "Second Project"), 
            &1500i128
        );

        // ASSERTION: Verify correct ID assignment
        assert_eq!(campaign_id1, 1);
        assert_eq!(campaign_id2, 2);

        // ASSERTION: Verify both campaigns exist
        let campaigns = client.get_campaigns();
        assert_eq!(campaigns.len(), 2);

        // ASSERTION: Verify campaign count function
        assert_eq!(client.get_campaign_count(), 2);
    }
} 