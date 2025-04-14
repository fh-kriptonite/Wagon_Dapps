import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface UseApproveAllowanceHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (amount: bigint, erc20Address: string) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useApproveAllowanceHook = (): UseApproveAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);
  
  const getProvider = useGetProvider();
  
  const fetchData = async (amount: bigint, erc20Address: string): Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: ethers.ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      const lendingAddress = process.env.LENDING_ADDRESS_BNB;
      if (!lendingAddress) {
        throw new Error('LENDING_ADDRESS_BNB is not defined');
      }

      // Connect to Ethereum
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = erc20Address;
      const contractABI = ERC20_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.approve(
        lendingAddress, 
        amount
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