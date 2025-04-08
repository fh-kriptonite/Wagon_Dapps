import { ethers } from "ethers";
import lendingAbi from "../public/ABI/lending.json";
import erc1155Abi from "../public/ABI/lendingErc1155.json";
import erc20Abi from "../public/ABI/erc20.json";

// Interfaces
export interface Pool {
  status: string;
  collectionTermEnd: string;
  [key: string]: any;
}

interface PoolFee {
  [key: string]: any;
}

interface PoolActivity {
  [key: string]: any;
}

interface UserPool {
  [key: string]: any;
}

interface UserBalance {
  tvlWag: number;
  tvlIdrt: number;
  interestIdrt: number;
}

interface ApiResponse<T> {
  data: T;
}

// Environment validation
const requiredEnvVars = {
  PROVIDER_HTTPS_BNB: process.env.PROVIDER_HTTPS_BNB,
  LENDING_ADDRESS_BNB: process.env.LENDING_ADDRESS_BNB,
  ERC1155_ADDRESS_BNB: process.env.ERC1155_ADDRESS_BNB,
  BNB_STABLE_COIN_ADDRESS_1: process.env.BNB_STABLE_COIN_ADDRESS_1
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) throw new Error(`${key} environment variable is not defined`);
});

// Contract initialization
const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_HTTPS_BNB);
const contract = new ethers.Contract(process.env.LENDING_ADDRESS_BNB!, lendingAbi, provider);
const contract1155 = new ethers.Contract(process.env.ERC1155_ADDRESS_BNB!, erc1155Abi, provider);

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

  getPoolDetail: async (poolId: string): Promise<Pool> => 
    await contract.pools(poolId),

  getPoolFees: async (poolId: string): Promise<PoolFee> => 
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
  getPool: async (poolId: string): Promise<Pool> => {
    try {
      return await contractFunctions.getPoolDetail(poolId);
    } catch (error) {
      console.error('Error in getPool:', error);
      throw error;
    }
  },

  getActivePool: async (poolId: string): Promise<Pool> => {
    try {
      return await contract.activePools(poolId);
    } catch (error) {
      console.error('Error in getActivePool:', error);
      throw error;
    }
  },

  getPoolFee: async (poolId: string): Promise<PoolFee> => {
    try {
      return await contractFunctions.getPoolFees(poolId);
    } catch (error) {
      console.error('Error in getPoolFee:', error);
      throw error;
    }
  },

  getPoolMaxSupply: async (poolId: string): Promise<bigint> => {
    try {
      return await contract1155.tokenMaxSupply(poolId);
    } catch (error) {
      console.error('Error in getPoolMaxSupply:', error);
      throw error;
    }
  },

  getPoolSupply: async (poolId: string): Promise<bigint> => {
    try {
      return await contract1155.tokenSupply(poolId);
    } catch (error) {
      console.error('Error in getPoolSupply:', error);
      throw error;
    }
  },

  // User Services
  getUserStableBalance: async (address: string, poolId: string): Promise<bigint> => {
    try {
      return await contractFunctions.get1155Balance(address, poolId);
    } catch (error) {
      console.error('Error in getUserStableBalance:', error);
      throw error;
    }
  },

  getWagLocked: async (address: string, poolId: string): Promise<bigint> => {
    try {
      return await contractFunctions.getWagLocked(address, poolId);
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
      const response = await fetchApi<Pool[]>(`/api/lending/?id=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error in getPools:', error);
      throw error;
    }
  },

  getPoolActivities: async (poolId: string, network: string): Promise<PoolActivity[]> => {
    try {
      const response = await fetchApi<PoolActivity[]>(`/api/lending/getActivities/?id=${poolId}&network=${network}`);
      return response.data;
    } catch (error) {
      console.error('Error in getPoolActivities:', error);
      throw error;
    }
  },

  getUserPools: async (address: string): Promise<UserPool[]> => {
    try {
      const response = await fetchApi<UserPool[]>(`/api/lending/getUsersPools/?address=${address}`);
      return response.data;
    } catch (error) {
      console.error('Error in getUserPools:', error);
      throw error;
    }
  },

  // Overview Services
  getLendingOverview: async () => {
    try {
      const stableAddress = process.env.BNB_STABLE_COIN_ADDRESS_1!;
      const [tvlIdrt, totalLoanOriginationIdrt, currentLoansOutstandingIdrt] = await Promise.all([
        contractFunctions.getTotalValueLocked(stableAddress),
        contractFunctions.getTotalLoanOrigination(stableAddress),
        contractFunctions.getCurrentLoansOutstanding(stableAddress)
      ]);

      return {
        tvl: tvlIdrt,
        totalLoanOrigination: totalLoanOriginationIdrt,
        currentLoansOutstanding: currentLoansOutstandingIdrt
      };
    } catch (error) {
      console.error('Error in getLendingOverview:', error);
      throw error;
    }
  },

  getUserBalances: async (pools: Pool[], address: string): Promise<UserBalance> => {
    try {
      const balances = await Promise.all(
        pools.map(async (pool) => {
          const [wagLocked, stableBalance, interestAmount] = await Promise.all([
            contractFunctions.getWagLocked(address, pool.id),
            contractFunctions.get1155Balance(address, pool.id),
            contractFunctions.getInterestAmountShare(address, pool.id)
          ]);

          return {
            wagLocked: Number(wagLocked) / 1e18,
            stableBalance: Number(stableBalance) / 1e18,
            interestAmount: Number(interestAmount) / 1e18
          };
        })
      );

      return balances.reduce((acc, curr) => ({
        tvlWag: acc.tvlWag + curr.wagLocked,
        tvlIdrt: acc.tvlIdrt + curr.stableBalance,
        interestIdrt: acc.interestIdrt + curr.interestAmount
      }), { tvlWag: 0, tvlIdrt: 0, interestIdrt: 0 });
    } catch (error) {
      console.error('Error in getUserBalances:', error);
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
  }
}; 