import { useState } from 'react';
import { services } from '../../../services/service_lending';

export interface ActivePool extends Array<string> {
  0: string; // First element is the principal
}

interface UseGetActivePoolHookResult<T> {
  isLoading: boolean;
  data: T | null;
  error: string | null;
  fetchData: (address: string) => Promise<void>;
}

const useGetActivePoolHook = <T = ActivePool>(): UseGetActivePoolHookResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await services.getActivePool(address);
      setData(response as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetActivePoolHook; 