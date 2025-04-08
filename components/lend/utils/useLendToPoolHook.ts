import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { ethers } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

interface UseLendToPoolHookResult {
  isLoading: boolean;
  fetchData: (poolId: string, amount: bigint) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useLendToPoolHook = (): UseLendToPoolHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const particleProvider = useParticleProvider();
  
  const fetchData = async (poolId: string, amount: bigint): Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: ethers.ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      if (!particleProvider) {
        throw new Error('Particle provider is not available');
      }

      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider);
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.LENDING_ADDRESS_BNB;
      if (!contractAddress) {
        throw new Error('LENDING_ADDRESS_BNB is not defined');
      }
      const contractABI = LENDING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.lendToPool(
        poolId,
        amount
      );
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e);
      error = "Fail to approve";
    } finally {
      setIsLoading(false);
    }

    return { data, error };
  };

  return { isLoading, fetchData };
};

export default useLendToPoolHook; 