import { useState } from 'react';
import { useSwitchChains } from '@particle-network/connectkit';

import { Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet } from "@particle-network/chains"

function getChain(chainId) {
  if(chainId == 1) return Ethereum;
  if(chainId == 11155111) return EthereumSepolia;
  if(chainId == 56) return BNBChain;
  if(chainId == 97) return BNBChainTestnet;
}

const useSwitchNetworkHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { switchChain } = useSwitchChains();

  const fetchData = async (targetChainId) => {
    setIsLoading(true);

    let data = null;
    let error = null;
    
    try {     
      const chain = getChain(targetChainId)   
      await switchChain(chain);
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
