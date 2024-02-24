// Import necessary modules
const { ethers } = require('ethers');
const lendingAbi = require('../public/ABI/lending.json')
const erc20Abi = require('../public/ABI/erc20.json')
const { 
    createLendingPoolService, 
    createLendingLendService, 
    createLendingBorrowService,
    createLendingRepaymentService,
    createLendingClaimInterestService,
    updatePoolService
 } = require('./db_lending_services')

// Run the Next.js service
const startService = () => {
    console.log('Starting listener service...');

    // Set up Ethereum provider (e.g., Infura)
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);

    // Set up smart contract address and ABI
    const contractAddress = process.env.LENDING_ADDRESS_BNB;
    const contractABI = lendingAbi;

    // Initialize contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Create an ethers.js interface from the ABI
    const iface = new ethers.utils.Interface(contractABI);

    // Subscribe to the event
    contract.on('PoolCreated', async (...args) => {
        console.log("PoolCreated event: ", args)
        try {
            const event = args[2];
            createLendingPoolService(
                parseFloat(event.args.id), 
                event.args.lendingCurrency, 
                process.env.BNB_CHAIN_NAME, 
                event.blockNumber, 
                event.transactionHash);
        } catch (error) {
            console.error('Error processing event:', error);
        }
    });

    contract.on('Lend', async (...args) => {
        try {
            console.log("Lend event: ", args)
            const event = args[4];
            createLendingLendService(
                parseFloat(event.args.poolId), 
                event.args.lender, 
                (event.args.amount).toString(), 
                (event.args.pairingAmount).toString(), 
                event.blockNumber, 
                event.transactionHash, 
                process.env.BNB_CHAIN_NAME
            )

        } catch (error) {
            console.error('Error processing event:', error);
        }
    });

    contract.on('Borrow', async (...args) => {
        try {
            console.log("Borrow event: ", args)
            const event = args[3];
            
            createLendingBorrowService(
                parseFloat(event.args.poolId), 
                event.args.borrower, 
                (event.args.amount).toString(), 
                event.blockNumber, 
                event.transactionHash, 
                process.env.BNB_CHAIN_NAME
            )
            
            updatePoolService(
                parseFloat(event.args.poolId), 
                2, 
                process.env.BNB_CHAIN_NAME
            )
        } catch (error) {
            console.error('Error processing event:', error);
        }
    });

    contract.on('Repayment', async (...args) => {
        try {
            console.log("Repayment event: ", args)
            const event = args[3];
            createLendingRepaymentService(
                parseFloat(event.args.poolId), 
                event.args.borrower, 
                (event.args.amount).toString(), 
                event.blockNumber, 
                event.transactionHash, 
                process.env.BNB_CHAIN_NAME
            )
        } catch (error) {
            console.error('Error processing event:', error);
        }
    });

    contract.on('ClaimInterest', async (...args) => {
        try {
            console.log("ClaimInterest event: ", args)
            const event = args[4];
            createLendingClaimInterestService(
                parseFloat(event.args.poolId), 
                event.args.lender, 
                (event.args.amountInterest).toString(), 
                (event.args.amountPrincipal).toString(), 
                event.blockNumber, 
                event.transactionHash, 
                process.env.BNB_CHAIN_NAME
            );

            if(parseFloat(event.args.amountPrincipal) > 0) {
                updatePoolService(
                    parseFloat(event.args.poolId), 
                    3,
                    process.env.BNB_CHAIN_NAME
                )
            }
        } catch (error) {
            console.error('Error processing event:', error);
        }
    });
};

module.exports = { startService };