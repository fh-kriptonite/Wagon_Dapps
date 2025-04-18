import { useState } from 'react';
import idrxAbi from "../../../public/ABI/idrx.json";
import { ethers, sha256 } from 'ethers';
import { useGetProvider } from '@/util/getProvider';

interface UseRedeemIDRXHookResult {
  isLoading: boolean;
  isWaitingApproval: boolean;
  fetchData: (amount: string, bankName: string, accountNumber: string) => Promise<{
    data: ethers.ContractTransactionResponse | null;
    error: string | null;
  }>;
}

const useRedeemIDRXHook = (): UseRedeemIDRXHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);
  
  const getProvider = useGetProvider();
  
  const fetchData = async (amount: string, bankName: string, accountNumber: string): Promise<{
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
      const contractAddress = process.env.IDRX_ADDRESS;
      const contractABI = idrxAbi;
      // Initialize contract
      if (!contractAddress) {
        throw new Error("Contract address is undefined");
      }
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

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