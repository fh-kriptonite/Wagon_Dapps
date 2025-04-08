import { useState } from 'react';
import { useSwitchChains } from '@particle-network/connectkit';
import { Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet, Chain } from "@particle-network/chains";

interface SwitchNetworkResult {
  data: number | null;
  error: string | null;
}

interface UseSwitchNetworkHookResult {
  isLoading: boolean;
  fetchData: (targetChainId: number) => Promise<SwitchNetworkResult>;
}

function getChain(chainId: number): Chain {
  if (chainId === 1) return Ethereum;
  if (chainId === 11155111) return EthereumSepolia;
  if (chainId === 56) return BNBChain;
  if (chainId === 97) return BNBChainTestnet;
  throw new Error('Unsupported chain ID');
}

const useSwitchNetworkHook = (): UseSwitchNetworkHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const { switchChain } = useSwitchChains();

  const fetchData = async (targetChainId: number): Promise<SwitchNetworkResult> => {
    setIsLoading(true);

    let data: number | null = null;
    let error: string | null = null;
    
    try {        
      const chain = getChain(targetChainId);
      await switchChain(chain);
      data = targetChainId;
    } catch (e) {
      error = "Failed to switch network";
    } finally {
      setIsLoading(false);
    }

    return { data, error };
  };

  return { isLoading, fetchData };
};

export default useSwitchNetworkHook; 