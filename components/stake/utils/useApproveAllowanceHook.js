import { useState } from 'react';
import ERC20_ABI from "../../../public/ABI/erc20.json";
import { ethers, parseEther } from 'ethers';
import { useParticleProvider } from '@particle-network/connectkit';

const useApproveAllowanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const particleProvider = useParticleProvider()

  const fetchData = async (amount) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(particleProvider)
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = process.env.WAG_ADDRESS;
      const contractABI = ERC20_ABI; // Your contract's ABI

      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call smart contract function
      const transaction = await contract.approve(
        process.env.WAGON_STAKING_PROXY, 
        parseEther(`${amount}`).toString()
      );
      
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

export default useApproveAllowanceHook;