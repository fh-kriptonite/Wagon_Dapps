import { useState } from 'react';
import LENDING_ABI from "../../../public/ABI/lending.json";
import { ethers } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

const useLendToPoolHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const particleProvider = useParticleProvider()
  
  const fetchData = async (poolId, amount) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider)
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.LENDING_ADDRESS_BNB;
      const contractABI = LENDING_ABI; // Your contract's ABI

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.lendToPool(
        poolId,
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

export default useLendToPoolHook;