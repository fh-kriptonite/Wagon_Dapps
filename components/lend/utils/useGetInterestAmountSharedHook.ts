import { useState } from 'react';
import { getInterestAmountShareService } from '../../../services/service_lending';

interface UseGetInterestAmountSharedHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string, poolId: string) => Promise<bigint | null>;
}

const useGetInterestAmountSharedHook = (): UseGetInterestAmountSharedHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string, poolId: string): Promise<bigint | null> => {
    setIsLoading(true);

    try {
      const response = await getInterestAmountShareService(address, poolId);
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

export default useGetInterestAmountSharedHook; 