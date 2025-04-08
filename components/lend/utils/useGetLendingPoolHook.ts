import { useState } from 'react';
import { services } from '../../../services/service_lending';
import { Pool } from '../types';

interface UseGetLendingPoolHookResult<T> {
  isLoading: boolean;
  data: T | null;
  error: string | null;
  fetchData: (address: string) => Promise<void>;
}

const useGetLendingPoolHook = <T = Pool>(): UseGetLendingPoolHookResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await services.getPool(address);
      setData(response as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetLendingPoolHook; 