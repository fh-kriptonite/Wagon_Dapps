import { useState } from 'react';
import { services } from '../../../services/service_lending';

interface UseGetLendStableBalanceHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string, poolId: string, network_id: number) => Promise<void>;
}

const useGetLendStableBalanceHook = (): UseGetLendStableBalanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string, poolId: string, network_id: number): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await services.getUserStableBalance(address, poolId, network_id);
      console.log(response);
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetLendStableBalanceHook; 