import { useState } from 'react';
import { useSwitchChain } from '@particle-network/connectkit';
import { Chain, mainnet, sepolia, bsc, bscTestnet } from "@particle-network/connectkit/chains";

interface UseSwitchNetworkHookResult {
  isLoading: boolean;
  fetchData: (targetChainId: number) => Promise<{
    data: number | null;
    error: string | null;
  }>;
}

function getChain(chainId: number): Chain {
  if (chainId === 1) return mainnet;
  if (chainId === 11155111) return sepolia;
  if (chainId === 56) return bsc;
  if (chainId === 97) return bscTestnet;
  throw new Error(`Unsupported chain ID: ${chainId}`);
}

const useSwitchNetworkHook = (): UseSwitchNetworkHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();

  const fetchData = async (targetChainId: number): Promise<{
    data: number | null;
    error: string | null;
  }> => {
    setIsLoading(true);

    let data: number | null = null;
    let error: string | null = null;
    
    try {     
      await switchChain({ chainId: targetChainId });
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