import { useState } from 'react';
import { useSwitchChain } from '@particle-network/connectkit';
import { mainnet, sepolia, bsc, bscTestnet } from "@particle-network/connectkit/chains";

type Chain = typeof mainnet | typeof sepolia | typeof bsc | typeof bscTestnet;

function getChain(chainId: number): Chain | undefined {
    if(chainId === 1) return mainnet;
    if(chainId === 11155111) return sepolia;
    if(chainId === 56) return bsc;
    if(chainId === 97) return bscTestnet;
    return undefined;
}

interface UseSwitchNetworkHookResult {
    isLoading: boolean;
    fetchData: (targetChainId: number) => Promise<{ data: number | null; error: string | null }>;
}

const useSwitchNetworkHook = (): UseSwitchNetworkHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { switchChainAsync } = useSwitchChain();

    const fetchData = async (targetChainId: number): Promise<{ data: number | null; error: string | null }> => {
        setIsLoading(true);

        let data = null;
        let error = null;
        
        const chain = getChain(targetChainId);

        if (!chain) {
            error = "Invalid chain ID";
            setIsLoading(false);
            return { data, error };
        }

        try {
            await switchChainAsync({ chainId: targetChainId });
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