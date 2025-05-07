import { useState } from 'react';
import { services } from '../../../services/service_lending';

interface UseGetDeploymentGracePeriodHookResult {
  isLoading: boolean;
  data: number | null;
  error: string | null;
  fetchData: (poolId: string, network_id: number) => Promise<number | null>;
}

const useGetDeploymentGracePeriodHook = (): UseGetDeploymentGracePeriodHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string, network_id: number): Promise<number | null> => {
    setIsLoading(true);

    try {
      const response = await services.getDeploymentGracePeriod(poolId, network_id) as bigint;
      setData(Number(response));
      return Number(response);
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