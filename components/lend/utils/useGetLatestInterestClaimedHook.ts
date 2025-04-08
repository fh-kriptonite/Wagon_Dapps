import { useState } from 'react';
import { getLatestInterestClaimedService } from '../../../services/service_lending';

interface UseGetLatestInterestClaimedHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string, poolId: string) => Promise<bigint | null>;
}

const useGetLatestInterestClaimedHook = (): UseGetLatestInterestClaimedHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string, poolId: string): Promise<bigint | null> => {
    setIsLoading(true);

    try {
      const response = await getLatestInterestClaimedService(address, poolId);
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

export default useGetLatestInterestClaimedHook; 