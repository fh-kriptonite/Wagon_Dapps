import { useState } from 'react';
import { useSwitchChains } from '@particle-network/connectkit';
import { Chain, Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet } from "@particle-network/chains";

interface UseSwitchNetworkHookResult {
  isLoading: boolean;
  fetchData: (targetChainId: number) => Promise<{
    data: number | null;
    error: string | null;
  }>;
}

function getChain(chainId: number): Chain {
  if (chainId === 1) return Ethereum;
  if (chainId === 11155111) return EthereumSepolia;
  if (chainId === 56) return BNBChain;
  if (chainId === 97) return BNBChainTestnet;
  throw new Error(`Unsupported chain ID: ${chainId}`);
}

const useSwitchNetworkHook = (): UseSwitchNetworkHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { switchChain } = useSwitchChains();

  const fetchData = async (targetChainId: number): Promise<{
    data: number | null;
    error: string | null;
  }> => {
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