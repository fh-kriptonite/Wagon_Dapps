import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers, parseEther, ContractTransactionResponse } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface ApproveAllowanceResult {
  data: ContractTransactionResponse | null;
  error: string | null;
}

interface UseApproveAllowanceHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (amount: string) => Promise<ApproveAllowanceResult>;
}

const useApproveAllowanceHook = (): UseApproveAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const getProvider = useGetProvider();

  const fetchData = async (amount: string): Promise<ApproveAllowanceResult> => {
    setIsLoading(true);

    let data: ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      // Connect to Ethereum
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAG_ADDRESS || '';
      const contractABI = ERC20_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.approve(
        process.env.WAGON_STAKING_PROXY || '', 
        parseEther(amount).toString()
      );
      setIsWaitingApproval(false);
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e);
      error = "Fail to approve";
    } finally {
      setIsLoading(false);
      setIsWaitingApproval(false);
    }

    return { data, error };
  };

  return { isLoading, isWaitingApproval, fetchData };
};

export default useApproveAllowanceHook; 