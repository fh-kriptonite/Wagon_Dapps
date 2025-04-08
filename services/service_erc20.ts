import ERC20_ABI from '../public/ABI/erc20.json';
import { ethers } from "ethers";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ALCHEMY_PROVIDER_HTTPS: string;
            PROVIDER_HTTPS_BNB: string;
            WAG_ADDRESS: string;
            BNB_CHAIN_ID: string;
            WAGON_EXCHANGER: string;
        }
    }
}

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER_HTTPS);
const providerBnb = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const contractAddress = process.env.WAG_ADDRESS;
const wagContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

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

export const getErc20BalanceService = async (chainId: number, account: string, erc20Address: string): Promise<bigint> => {
    let providerUrl = process.env.ALCHEMY_PROVIDER_HTTPS;
    if (chainId === Number(process.env.BNB_CHAIN_ID)) {
        providerUrl = process.env.PROVIDER_HTTPS_BNB;
    }

    const provider = new ethers.JsonRpcProvider(providerUrl);
    const erc20Contract = new ethers.Contract(erc20Address, ERC20_ABI, provider);
    
    try {
        const balance = await erc20Contract.balanceOf(account);
        return balance;
    } catch (error) {
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
        const response = await fetch('../../api/cache/getCoinPrice/?name=' + name);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        throw error;
    }
};

export const getWagTotalSupply = async (): Promise<bigint> => {
    try {
        return await wagContract.totalSupply();
    } catch (error) {
        throw error;
    }
};

export const getWagBalanceOf = async (address: string): Promise<bigint> => {
    try {
        return await wagContract.balanceOf(address);
    } catch (error) {
        throw error;
    }
};

export const getWagAllowance = async (address: string, spender: string): Promise<bigint> => {
    try {
        return await wagContract.allowance(address, spender);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getErc20Allowance = async (address: string, spender: string, erc20Address: string): Promise<bigint> => {
    try {
        const contract = new ethers.Contract(erc20Address, ERC20_ABI, providerBnb);
        return await contract.allowance(address, spender);
    } catch (error) {
        console.log(error);
        throw error;
    }
}; 