import { useState } from 'react';
import { PoolJson } from '../types';

interface UseGetPoolJsonHookResult<T> {
  isLoading: boolean;
  data: T | null;
  error: string | null;
  fetchData: (poolId: string) => Promise<void>;
}

const useGetPoolJsonHook = <T = PoolJson>(): UseGetPoolJsonHookResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(`/pools/${poolId}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await response.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetPoolJsonHook; 