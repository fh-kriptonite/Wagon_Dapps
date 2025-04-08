import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { ethers } from 'ethers';
import { useAccount, useParticleProvider } from '@particle-network/connectkit';

interface UseClaimInterestHookResult {
  isLoading: boolean;
  fetchData: (poolId: string) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useClaimInterestHook = (): UseClaimInterestHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const particleProvider = useParticleProvider();
  const address = useAccount();

  const fetchData = async (poolId: string): Promise<{
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

      if (!address) {
        throw new Error('No wallet address available');
      }

      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider as ethers.Eip1193Provider);
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
      const transaction = await contract.claimInterest(
        poolId,
        address
      );
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e);
      error = "Fail to claim";
    } finally {
      setIsLoading(false);
    }

    return { data, error };
  };

  return { isLoading, fetchData };
};

export default useClaimInterestHook; 