import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { Eip1193Provider, ethers } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface UseLendToPoolHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (poolId: string, amount: bigint) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useLendToPoolHook = (): UseLendToPoolHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);
  const getProvider = useGetProvider();
  
  const fetchData = async (poolId: string, amount: bigint): Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: ethers.ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.LENDING_ADDRESS_BNB;
      if (!contractAddress) {
        throw new Error('LENDING_ADDRESS_BNB is not defined');
      }
      const contractABI = LENDING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.lendToPool(
        poolId,
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

export default useLendToPoolHook; 