import { useState } from 'react';
import { useSwitchChains } from '@particle-network/connectkit';
import { Ethereum, EthereumSepolia, BNBChain, BNBChainTestnet } from "@particle-network/chains";

type Chain = typeof Ethereum | typeof EthereumSepolia | typeof BNBChain | typeof BNBChainTestnet;

function getChain(chainId: number): Chain | undefined {
    if(chainId === 1) return Ethereum;
    if(chainId === 11155111) return EthereumSepolia;
    if(chainId === 56) return BNBChain;
    if(chainId === 97) return BNBChainTestnet;
    return undefined;
}

interface UseSwitchNetworkHookResult {
    isLoading: boolean;
    fetchData: (targetChainId: number) => Promise<{ data: number | null; error: string | null }>;
}

const useSwitchNetworkHook = (): UseSwitchNetworkHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { switchChain } = useSwitchChains();

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