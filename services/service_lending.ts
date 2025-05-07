import { ethers } from "ethers";
import lendingAbi from "../public/ABI/lending.json";
import erc1155Abi from "../public/ABI/lendingErc1155.json";
import erc20Abi from "../public/ABI/erc20.json";
import { Pool, UserPool } from "@/components/lend/types";
import { base, bsc } from "viem/chains";

interface PoolFee {
  [key: string]: any;
}

interface PoolActivity {
  [key: string]: any;
}

interface UserBalance {
  tvlIdr: number;
}

interface ApiResponse<T> {
  data: T;
}

// Environment validation
const requiredEnvVars = {
  PROVIDER_HTTPS_BNB: process.env.PROVIDER_HTTPS_BNB,
  LENDING_ADDRESS_BNB: process.env.LENDING_ADDRESS_BNB,
  ERC1155_ADDRESS_BNB: process.env.ERC1155_ADDRESS_BNB
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) throw new Error(`${key} environment variable is not defined`);
});

// Contract initialization
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const contract = new ethers.Contract(process.env.LENDING_ADDRESS_BNB!, lendingAbi, provider);
const contract1155 = new ethers.Contract(process.env.ERC1155_ADDRESS_BNB!, erc1155Abi, provider);

const provider_base = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BASE);
const contract_base = new ethers.Contract(process.env.LENDING_ADDRESS_BASE!, lendingAbi, provider_base);
const contract1155_base = new ethers.Contract(process.env.ERC1155_ADDRESS_BASE!, erc1155Abi, provider_base);

// Helper function for API calls
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}

// Contract Functions
const contractFunctions = {
  // ERC1155 Functions
  get1155Balance: async (address: string, poolId: string): Promise<bigint> => 
    await contract1155.balanceOf(address, poolId),

  // Lending Functions
  getWagLocked: async (address: string, poolId: string): Promise<bigint> => 
    await contract.wagLocked(poolId, address),

  getPoolDetail: async (poolId: number): Promise<Pool> => 
    await contract.pools(poolId),

  getPoolFees: async (poolId: number): Promise<PoolFee> => 
    await contract.fees(poolId),

  getUserInterest: async (address: string, poolId: string): Promise<bigint> => {
    const paymentFrequency = (await contract.pools(poolId)).paymentFrequency;
    const balance = await contract.getInterestAmountShare(poolId, address);
    return BigInt(balance) * BigInt(paymentFrequency);
  },

  getTotalValueLocked: async (address: string): Promise<bigint> => 
    await contract.totalValueLocked(address),

  getTotalLoanOrigination: async (address: string): Promise<bigint> => 
    await contract.totalLoanOrigination(address),

  getCurrentLoansOutstanding: async (address: string): Promise<bigint> => 
    await contract.currentLoansOutstanding(address),

  getLatestInterestClaimed: async (address: string, poolId: string): Promise<bigint> => 
    await contract.latestInterestClaimed(poolId, address),

  getInterestAmountShare: async (address: string, poolId: string): Promise<bigint> => 
    await contract.getInterestAmountShare(poolId, address),

  getClaimableInterestAmount: async (address: string, poolId: string): Promise<bigint> => 
    await contract.getClaimableInterestAmount(poolId, address),

  // Stablecoin Functions
  getStableDecimals: async (currencyAddress: string): Promise<number> => {
    const currencyContract = new ethers.Contract(currencyAddress, erc20Abi, provider);
    return await currencyContract.decimals();
  },

  getStableSymbol: async (currencyAddress: string): Promise<string> => {
    const currencyContract = new ethers.Contract(currencyAddress, erc20Abi, provider);
    return await currencyContract.symbol();
  }
};

// Service Functions
export const services = {
  // Pool Services
  getPool: async (poolId: number): Promise<Pool> => {
    try {
      return await contractFunctions.getPoolDetail(poolId);
    } catch (error) {
      console.error('Error in getPool:', error);
      throw error;
    }
  },

  getActivePool: async (poolId: number, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contract.activePools(poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract_base.activePools(poolId);
      }
    } catch (error) {
      console.error('Error in getActivePool:', error);
      throw error;
    }
  },

  getPoolFee: async (poolId: number, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contractFunctions.getPoolFees(poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract_base.getPoolFees(poolId);
      }
    } catch (error) {
      console.error('Error in getPoolFee:', error);
      throw error;
    }
  },

  getPoolMaxSupply: async (poolId: number, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contract1155.tokenMaxSupply(poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract1155_base.tokenMaxSupply(poolId);
      }
    } catch (error) {
      console.error('Error in getPoolMaxSupply:', error);
      throw error;
    }
  },

  getPoolSupply: async (poolId: number, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contract1155.tokenSupply(poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract1155_base.tokenSupply(poolId);
      }
    } catch (error) {
      console.error('Error in getPoolSupply:', error);
      throw error;
    }
  },

  // User Services
  getUserStableBalance: async (address: string, poolId: string, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contractFunctions.get1155Balance(address, poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract1155_base.balanceOf(address, poolId);
      }
    } catch (error) {
      console.error('Error in getUserStableBalance:', error);
      throw error;
    }
  },

  getWagLocked: async (address: string, poolId: string, network_id: number): Promise<any> => {
    try {
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        return await contractFunctions.getWagLocked(address, poolId);
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        return await contract1155_base.balanceOf(address, poolId);
      }
    } catch (error) {
      console.error('Error in getWagLocked:', error);
      throw error;
    }
  },

  getInterestAmountShare: async (address: string, poolId: string): Promise<bigint> => {
    try {
      return await contractFunctions.getInterestAmountShare(address, poolId);
    } catch (error) {
      console.error('Error in getInterestAmountShare:', error);
      throw error;
    }
  },

  getLatestInterestClaimed: async (address: string, poolId: string): Promise<bigint> => {
    try {
      return await contractFunctions.getLatestInterestClaimed(address, poolId);
    } catch (error) {
      console.error('Error in getLatestInterestClaimed:', error);
      throw error;
    }
  },

  // API Services
  getPools: async (status: string): Promise<Pool[]> => {
    try {
      const response = await fetchApi(process.env.WAGON_API_URL + '/api/pools/?status=' + status);
      return response.data as Pool[];
    } catch (error) {
      console.error('Error in getPools:', error);
      throw error;
    }
  },

  getPoolActivities: async (poolId: number): Promise<PoolActivity[]> => {
    try {
      const response = await fetchApi<PoolActivity[]>(process.env.WAGON_API_URL + '/api/pools/activities/' + poolId);
      return response.data;
    } catch (error) {
      console.error('Error in getPoolActivities:', error);
      throw error;
    }
  },

  getUserPools: async (address: string): Promise<UserPool[]> => {
    try {
      const response = await fetchApi(process.env.WAGON_API_URL + '/api/pools/lending-balances/' + address);
      return response.data as UserPool[];
    } catch (error) {
      console.error('Error in getUserPools:', error);
      throw error;
    }
  },

  getUserTvlBalances: async (userPools: UserPool[]): Promise<UserBalance> => {
    try {
      let tvlIDR = 0;

      userPools.map((userPool) => {
        tvlIDR += Number(userPool.balance) / 10 ** userPool.pool.lending_contract.decimals;
      })
      
      return {
        tvlIdr: tvlIDR
      }
    } catch (error) {
      console.error('Error in getUserTvlBalances:', error);
      throw error;
    }
  },

  // Offchain Services
  getOffchainShipmentsPool: async (poolId: string): Promise<any> => {
    try {
      const response = await fetchApi<any>(`/api/lending/getShipmentsPool/?pool_id=${poolId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getOffchainShipmentsPool:', error);
      throw error;
    }
  },

  getOffchainAssetsPool: async (poolId: string): Promise<any> => {
    try {
      const response = await fetchApi<any>(`/api/lending/getAssetsPool/?pool_id=${poolId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getOffchainAssetsPool:', error);
      throw error;
    }
  },

  getInterestAmountShareService : async (address: string, poolId: string, network_id: number) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(network_id == Number(process.env.BNB_CHAIN_ID)) {
              let response = await contract.getInterestAmountShare(poolId, address);
              resolve(response);
            } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
              let response = await contract_base.getInterestAmountShare(poolId, address);
              resolve(response);
            }
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    })
  },

  getLatestInterestClaimedService : async (address: string, poolId: string, network_id: number) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(network_id == Number(process.env.BNB_CHAIN_ID)) {
              let response = await contract.latestInterestClaimed(poolId, address);
              resolve(response);
            } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
              let response = await contract_base.latestInterestClaimed(poolId, address);
              resolve(response);
            }
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    })
  },

  getDeploymentGracePeriod : async (poolId: string, network_id: number) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(network_id == Number(process.env.BNB_CHAIN_ID)) {
              let response = await contract.deploymentGracePeriodDurations(poolId);
              resolve(response);
            } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
              let response = await contract_base.deploymentGracePeriodDurations(poolId);
              resolve(response);
            }
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    })
  }
}; 