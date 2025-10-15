import ERC20_ABI from '../public/ABI/erc20.json';
import { ethers } from "ethers";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ALCHEMY_PROVIDER_HTTPS: string;
            PROVIDER_HTTPS_BNB: string;
            PROVIDER_HTTPS_BASE: string;
            WAG_ADDRESS: string;
            BNB_CHAIN_ID: string;
            WAGON_EXCHANGER: string;
        }
    }
}

// Memoized providers
const providers = {
    [Number(process.env.BNB_CHAIN_ID)]: new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB),
    [Number(process.env.BASE_CHAIN_ID)]: new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BASE)
};

// Memoized contracts cache
const contracts = new Map();

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const providerBnb = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const providerBase = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BASE);
const contractAddress = process.env.WAG_ADDRESS;

// Only create contract if address is valid
let wagContract: ethers.Contract | null = null;
if (contractAddress && ethers.isAddress(contractAddress)) {
    wagContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
}

async function getTokenToUsdRate(priceUrl: string, chainId: number): Promise<number> {
    try {
        const response = await fetch(priceUrl);
        const data = await response.json();
        let usdRate: number;
        if (chainId === 11155111 || chainId === 1) {
            usdRate = data.ethereum.usd;
        } else {
            usdRate = data.binancecoin.usd;
        }
        return usdRate;
    } catch (error) {
        console.error('Error fetching USD exchange rate:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
}

export const getErc20BalanceService = async (chainId: number, account: string, erc20Address: string): Promise<number> => {
    const provider = providers[chainId];
    if (!provider) throw new Error('Invalid chain ID');
    
    let contract = contracts.get(erc20Address);
    if (!contract) {
        contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);
        contracts.set(erc20Address, contract);
    }
    
    try {
        const balance = await contract.balanceOf(account);
        const decimals = await contract.decimals();
        return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (error) {
        console.error('Error getting ERC20 balance:', error);
        throw error;
    }
};

export const getErc20DecimalsService = async (web3: any, erc20Address: string): Promise<number> => {
    const erc20Contract = new web3.eth.Contract(
        ERC20_ABI,
        erc20Address
    );

    try {
        const decimals = await erc20Contract.methods
            .decimals()
            .call();
        return decimals;
    } catch (error) {
        throw error;
    }
};

export const approveErc20Service = async (web3: any, erc20Amount: string, erc20Address: string, account: string): Promise<void> => {
    const erc20Contract = new web3.eth.Contract(
        ERC20_ABI,
        erc20Address
    );

    try {
        await erc20Contract.methods
            .approve(process.env.WAGON_EXCHANGER, erc20Amount)
            .send({ from: account });
    } catch (error) {
        throw error;
    }
};

export const allowanceErc20Service = async (erc20Address: string, owner: string, spender: string, providerUrl: string): Promise<string> => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);

    try {
        const allowance = await erc20Contract.allowance(owner, spender);
        const decimals = await erc20Contract.decimals();
        return ethers.formatUnits(allowance, decimals);
    } catch (error) {
        throw error;
    }
};

export const getERC20NetworkBalanceService = async (tokenAddress: string, walletAddress: string, providerUrl: string): Promise<number> => {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
    try {
        const balance = await erc20Contract.balanceOf(walletAddress);
        const decimals = await erc20Contract.decimals();
        const adjustedBalance = ethers.formatUnits(balance, decimals);
        return parseFloat(adjustedBalance);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const tokenToUsd = async (amount: number, priceUrl: string, chainId: number): Promise<number> => {
    try {
        const tokenToUsdRate = await getTokenToUsdRate(priceUrl, chainId);
        return amount * tokenToUsdRate;
    } catch (error) {
        console.error('Error converting USD:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
};

export const getCoinPriceService = async (name: string): Promise<any> => {
    try {
        if (!process.env.WAGON_API_URL) {
            console.warn(`WAGON_API_URL environment variable is not configured, returning null for ${name} price`);
            return { data: null };
        }
        
        const url = `${process.env.WAGON_API_URL}/api/coin-prices/${name}/latest`;
        console.log(`Fetching coin price for ${name} from:`, url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Failed to fetch coin price for ${name}:`, {
                status: response.status,
                statusText: response.statusText,
                url: url
            });
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Coin price data for ${name}:`, data);
        
        // Ensure consistent response structure
        if (!data || !data.data) {
            console.warn(`Invalid response format for ${name}: missing data property`);
            return { data: null };
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching coin price for ${name}:`, {
            name: name,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        
        // Return null data instead of throwing error to prevent app crashes
        console.warn(`Returning null for ${name} price due to API error`);
        return { data: null };
    }
};

export const getWagTotalSupply = async (): Promise<bigint> => {
    try {
        if (!wagContract) {
            throw new Error("WAG contract is not initialized. Please check WAG_ADDRESS environment variable.");
        }
        return await wagContract.totalSupply();
    } catch (error) {
        throw error;
    }
};

export const getWagBalanceOf = async (address: string): Promise<bigint> => {
    try {
        if (!wagContract) {
            throw new Error("WAG contract is not initialized. Please check WAG_ADDRESS environment variable.");
        }
        return await wagContract.balanceOf(address);
    } catch (error) {
        throw error;
    }
};

export const getWagAllowance = async (address: string, spender: string): Promise<bigint> => {
    try {
        if (!wagContract) {
            throw new Error("WAG contract is not initialized. Please check WAG_ADDRESS environment variable.");
        }
        return await wagContract.allowance(address, spender);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getErc20Allowance = async (address: string, spender: string, erc20Address: string, network_id: number): Promise<any> => {
    try {
        if(network_id == Number(process.env.BNB_CHAIN_ID)) {
            const contract = new ethers.Contract(erc20Address, ERC20_ABI, providerBnb);
            return await contract.allowance(address, spender);
        } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
            const contract = new ethers.Contract(erc20Address, ERC20_ABI, providerBase);
            return await contract.allowance(address, spender);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}; 