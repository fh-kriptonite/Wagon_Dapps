import { useState } from 'react';
import idrxAbi from "../../../public/ABI/idrx.json";
import { ethers, sha256 } from 'ethers';
import { useGetProvider } from '@/util/getProvider';
import { base } from '@particle-network/connectkit/chains';
import { bsc } from '@particle-network/connectkit/chains';

interface UseRedeemIDRXHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (amount: string, bankName: string, accountNumber: string, chainId: number) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useRedeemIDRXHook = (): UseRedeemIDRXHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);
  
  const getProvider = useGetProvider();
  
  const fetchData = async (amount: string, bankName: string, accountNumber: string, chainId: number): Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: ethers.ContractTransactionResponse | null = null;
    let error: string | null = null;

    try {
      // Connect to Ethereum
      const provider = await getProvider();
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      let contractAddress: string | null = null;
      let decimals: number = 0;

      if(chainId === bsc.id) {
        contractAddress = process.env.ONRAMP_IDRX_ADDRESS_BSC || null;
        decimals = 0;
      } else if(chainId === base.id) {
        contractAddress = process.env.ONRAMP_IDRX_ADDRESS_BASE || null;
        decimals = 2;
      }
      const contractABI = idrxAbi;

      // Initialize contract
      if (!contractAddress || contractAddress.trim() === '') {
        throw new Error(`Contract address is undefined for chain ID ${chainId}. Please check environment variables ONRAMP_IDRX_ADDRESS_BSC and ONRAMP_IDRX_ADDRESS_BASE.`);
      }
      
      // Validate contract address format
      if (!ethers.isAddress(contractAddress)) {
        throw new Error(`Invalid contract address format: ${contractAddress}`);
      }
      
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      amount = ethers.parseUnits(amount, decimals).toString();

      const bankAccountNumber = bankName + "_" + accountNumber; // example bank account. format: {bankName}_{bankAccountNumber}
      const hashBankAccountNumber = sha256(ethers.toUtf8Bytes(bankAccountNumber)).toString();

      setIsWaitingApproval(true);
      // Call smart contract function
      const transaction = await contract.burnWithAccountNumber(
        amount, 
        hashBankAccountNumber
      );
      setIsWaitingApproval(false);
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e);
      error = "Fail to burn";
    } finally {
      setIsLoading(false);
      setIsWaitingApproval(false);
    }

    return { data, error };
  };

  return { isLoading, isWaitingApproval, fetchData };
};

export default useRedeemIDRXHook; 