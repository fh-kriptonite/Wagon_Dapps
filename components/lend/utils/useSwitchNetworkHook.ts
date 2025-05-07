import { useState } from 'react';
import { useSwitchChain } from '@particle-network/connectkit';

interface UseSwitchNetworkHookResult {
  isLoading: boolean;
  fetchData: (targetChainId: number) => Promise<{
    data: number | null;
    error: string | null;
  }>;
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