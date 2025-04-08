import { useState } from 'react';
import { tokenToUsd } from "../../../services/service_erc20"
import { getDestinationGasFeeService } from "../../../services/service_bridge"
import { Network } from "../types";

interface UseGetDestinationGasHookResult {
    isLoading: boolean;
    data: number | null;
    error: string | null;
    fetchData: (network2: Network, network1: Network, address: string, amount: number) => Promise<void>;
}

const useGetDestinationGasHook = (): UseGetDestinationGasHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (network2: Network, network1: Network, address: string, amount: number): Promise<void> => {
        setIsLoading(true);

        try {
            const gasData = await getDestinationGasFeeService(
                network2.lzEndpointId.toString(),
                network1.OFTAddress, 
                address, 
                network1.rpc,
                amount
            );
            const gasInUsd = await tokenToUsd(gasData, network1.priceUrl, network1.chainId);

            setData(gasInUsd);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, data, error, fetchData };
};

export default useGetDestinationGasHook; 