import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { ethers } from 'ethers';
import { useWeb3WalletState } from '../../general/web3WalletContext';

const useClaimInterestHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { getProviderTransaction } = useWeb3WalletState();

  const fetchData = async (poolId, amount) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(getProviderTransaction())
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.LENDING_ADDRESS_BNB;
      const contractABI = LENDING_ABI; // Your contract's ABI

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.claimInterest(
        poolId
      );
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      console.log(e)
      error = "Fail to approve";
    } finally {
      setIsLoading(false);
    }

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useClaimInterestHook;