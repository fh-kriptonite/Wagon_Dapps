import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { ethers } from 'ethers';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import { useGetProvider } from '@/util/getProvider';
import { base } from '@particle-network/connectkit/chains';

interface UseClaimInterestHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (poolId: string, network_id: number) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useClaimInterestHook = (): UseClaimInterestHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);

  const getProvider = useGetProvider();
  const { connectedAddress: address } = useConnectedAddress();

  const fetchData = async (poolId: string, network_id: number): Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: ethers.ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      if (!address) {
        throw new Error('No wallet address available');
      }

      // Connect to Ethereum
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      let contractAddress = process.env.LENDING_ADDRESS_BNB;
      if(network_id == base.id) {
        contractAddress = process.env.LENDING_ADDRESS_BASE;
      }
      if (!contractAddress) {
        throw new Error('LENDING_ADDRESS_BNB is not defined');
      }
      const contractABI = LENDING_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.claimInterest(
        poolId,
        address
      );
      setIsWaitingApproval(false);
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e);
      error = "Fail to claim";
    } finally {
      setIsLoading(false);
      setIsWaitingApproval(false);
    }

    return { data, error };
  };

  return { isLoading, fetchData, isWaitingApproval };
};

export default useClaimInterestHook; 