import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

const useApproveAllowanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const particleProvider = useParticleProvider()
  
  const fetchData = async (amount, erc20Address) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider)
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = erc20Address;
      const contractABI = ERC20_ABI; // Your contract's ABI

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.approve(
        process.env.LENDING_ADDRESS_BNB, 
        amount
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

export default useApproveAllowanceHook;