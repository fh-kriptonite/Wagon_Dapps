import { useState } from 'react';
import { allowanceErc20Service } from "../../../services/service_erc20"
import { Network } from "../types";

interface UseCheckAllowanceHookResult {
    isLoading: boolean;
    fetchData: (network: Network, address: string) => Promise<{ data: string | null; error: string | null }>;
}

const useCheckAllowanceHook = (): UseCheckAllowanceHookResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const fetchData = async (network: Network, address: string): Promise<{ data: string | null; error: string | null }> => {
        setIsLoading(true);

        let data = null;
        let error = null;

        try {
            data = await allowanceErc20Service(network.wagAddress, address, network.OFTAddress, network.rpc);
        } catch (e) {
            error = "Fail to get allowance";
        } finally {
            setIsLoading(false);
        }

        return { data, error };
    };

    return { isLoading, fetchData };
};

export default useCheckAllowanceHook; 