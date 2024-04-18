import { useState } from 'react';
import { useSwitchNetwork } from "@web3modal/ethers/react";

const useSwitchNetworkHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { switchNetwork } = useSwitchNetwork();

  const fetchData = async (targetChainId) => {
    setIsLoading(true);

    let data = null;
    let error = null;
    
    try {        
      await switchNetwork(targetChainId);
      data = targetChainId;
    } catch (e) {
      error = "Failed to switch network";
    } finally {
      setIsLoading(false);
    }

    return{data: data, error: error};
  };

  return { isLoading, fetchData };
};

export default useSwitchNetworkHook;
