import { useState } from 'react';
import { getErc20BalanceService } from '../../../services/service_erc20';

interface UseGetStableBalanceHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (chainId: number, address: string, erc20Address: string) => Promise<void>;
}

const useGetStableBalanceHook = (): UseGetStableBalanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (chainId: number, address: string, erc20Address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getErc20BalanceService(chainId, address, erc20Address);
      setData(response);
    } catch (e) {
      console.log(e);
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetStableBalanceHook; 