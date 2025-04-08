import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

interface UseApproveAllowanceHookResult {
  isLoading: boolean;
  fetchData: (amount: bigint, erc20Address: string) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useApproveAllowanceHook = (): UseApproveAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const particleProvider = useParticleProvider();
  
  const fetchData = async (amount: bigint, erc20Address: string): Promise<{
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

      const lendingAddress = process.env.LENDING_ADDRESS_BNB;
      if (!lendingAddress) {
        throw new Error('LENDING_ADDRESS_BNB is not defined');
      }

      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider);
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = erc20Address;
      const contractABI = ERC20_ABI;

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.approve(
        lendingAddress, 
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

export default useApproveAllowanceHook; 