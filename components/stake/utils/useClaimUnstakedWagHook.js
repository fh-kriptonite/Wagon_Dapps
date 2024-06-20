import { useState } from 'react';
import STAKING_ABI from "../../../public/ABI/staking.json";
import { ethers, parseEther } from 'ethers';
import { useWeb3WalletState } from '../../general/web3WalletContext';

const useClaimUnstakedWagHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getProviderTransaction } = useWeb3WalletState();
  
  const fetchData = async () => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(getProviderTransaction())
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAGON_STAKING_PROXY;
      const contractABI = STAKING_ABI; // Your contract's ABI

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

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useClaimUnstakedWagHook;