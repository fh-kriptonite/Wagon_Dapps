import { useState } from 'react';
import { getWagBalanceOf } from '../../../services/service_erc20';

interface UseGetWagBalanceHookResult {
  isLoading: boolean;
  data: string | null;
  error: string | null;
  fetchData: (address: string) => Promise<void>;
}

const useGetWagBalanceHook = (): UseGetWagBalanceHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getWagBalanceOf(address);
      setData(response.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetWagBalanceHook; 