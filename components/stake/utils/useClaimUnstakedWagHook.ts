import { useState } from 'react';
import STAKING_ABI from "../../../public/ABI/staking.json";
import { ethers, ContractTransactionResponse } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

interface ClaimUnstakedWagResult {
  data: ContractTransactionResponse | null;
  error: string | null;
}

interface UseClaimUnstakedWagHookResult {
  isLoading: boolean;
  fetchData: () => Promise<ClaimUnstakedWagResult>;
}

const useClaimUnstakedWagHook = (): UseClaimUnstakedWagHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const particleProvider = useParticleProvider();

  const fetchData = async (): Promise<ClaimUnstakedWagResult> => {
    setIsLoading(true);

    let data: ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      if (!particleProvider) {
        throw new Error('No provider available');
      }

      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider as unknown as ethers.Eip1193Provider);
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAGON_STAKING_PROXY || '';
      const contractABI = STAKING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.withdraw();
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      error = "Fail to approve";
    } finally {
      setIsLoading(false);
    }

    return { data, error };
  };

  return { isLoading, fetchData };
};

export default useClaimUnstakedWagHook; 