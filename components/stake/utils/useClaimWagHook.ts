import { useState } from 'react';
import STAKING_ABI from "../../../public/ABI/staking.json";
import { ethers, ContractTransactionResponse } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface ClaimWagResult {
  data: ContractTransactionResponse | null;
  error: string | null;
}

interface UseClaimWagHookResult {
  isLoading: boolean;
  fetchData: () => Promise<ClaimWagResult>;
}

const useClaimWagHook = (): UseClaimWagHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const getProvider = useGetProvider();

  const fetchData = async (): Promise<ClaimWagResult> => {
    setIsLoading(true);

    let data: ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAGON_STAKING_PROXY || '';
      const contractABI = STAKING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.getReward();
      
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

export default useClaimWagHook; 