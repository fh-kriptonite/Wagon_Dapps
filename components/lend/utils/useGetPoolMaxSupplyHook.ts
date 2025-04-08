import { useState } from 'react';
import { services } from '../../../services/service_lending';

interface UseGetPoolMaxSupplyHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (poolId: string) => Promise<void>;
}

const useGetPoolMaxSupplyHook = (): UseGetPoolMaxSupplyHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await services.getPoolMaxSupply(poolId);
      setData(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetPoolMaxSupplyHook; 