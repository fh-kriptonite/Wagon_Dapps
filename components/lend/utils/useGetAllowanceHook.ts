import { useState } from 'react';
import { getErc20Allowance } from '../../../services/service_erc20';
import { base } from '@particle-network/connectkit/chains';
import { bsc } from '@particle-network/connectkit/chains';

interface UseGetAllowanceHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string, erc20Address: string, network_id: number) => Promise<bigint | null>;
}

const useGetAllowanceHook = (): UseGetAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string, erc20Address: string, network_id: number): Promise<bigint | null> => {
    setIsLoading(true);

    try {
      let lendingAddress: string | null = null;
      if(network_id == Number(process.env.BNB_CHAIN_ID)) {
        lendingAddress = process.env.LENDING_ADDRESS_BNB || null;
      } else if(network_id == Number(process.env.BASE_CHAIN_ID)) {
        lendingAddress = process.env.LENDING_ADDRESS_BASE || null;
      }
      
      if (!lendingAddress) {
        throw new Error('LENDING_ADDRESS_BNB environment variable is not defined');
      }

      const response = await getErc20Allowance(address, lendingAddress, erc20Address, network_id);
      setData(response);
      return response;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetAllowanceHook; 