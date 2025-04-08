import { useState } from 'react';
import { getDeploymentGracePeriodService } from '../../../services/service_lending';

interface UseGetDeploymentGracePeriodHookResult {
  isLoading: boolean;
  data: number | null;
  error: string | null;
  fetchData: (poolId: string) => Promise<number | null>;
}

const useGetDeploymentGracePeriodHook = (): UseGetDeploymentGracePeriodHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string): Promise<number | null> => {
    setIsLoading(true);

    try {
      const response = await getDeploymentGracePeriodService(poolId);
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

export default useGetDeploymentGracePeriodHook; 