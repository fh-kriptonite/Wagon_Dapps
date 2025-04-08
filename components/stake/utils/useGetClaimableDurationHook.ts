import { useState } from 'react';
import { getClaimableDurationService } from '../../../services/service_staking';

interface UseGetClaimableDurationHookResult {
  isLoading: boolean;
  data: number | null;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useGetClaimableDurationHook = (): UseGetClaimableDurationHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getClaimableDurationService();
      setData(Number(response));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetClaimableDurationHook; 