import { useState } from 'react';
import STAKING_ABI from "../../../public/ABI/staking.json";
import { ethers, parseEther, ContractTransactionResponse } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface UnstakeWagResult {
  data: ContractTransactionResponse | null;
  error: string | null;
}

interface UseUnstakeWagHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (amount: string) => Promise<UnstakeWagResult>;
}

const useUnstakeWagHook = (): UseUnstakeWagHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);

  const getProvider = useGetProvider();
  
  const fetchData = async (amount: string): Promise<UnstakeWagResult> => {
    setIsLoading(true);

    let data: ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      // Connect to Ethereum
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAGON_STAKING_PROXY || '';
      const contractABI = STAKING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.unstake(
        parseEther(amount).toString()
      );
      setIsWaitingApproval(false);

      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      error = "Fail to approve";
    } finally {
      setIsLoading(false);
      setIsWaitingApproval(false);
    }

    return { data, error };
  };

  return { isLoading, isWaitingApproval, fetchData };
};

export default useUnstakeWagHook; 