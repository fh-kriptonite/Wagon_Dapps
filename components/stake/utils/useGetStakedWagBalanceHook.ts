import { useState } from 'react';
import { getStakingBalance } from '../../../services/service_staking';

interface UseGetStakedWagBalanceHookResult {
  isLoading: boolean;
  data: string | null;
  error: string | null;
  fetchData: (address: string) => Promise<void>;
}

const useGetStakedWagBalanceHook = (): UseGetStakedWagBalanceHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getStakingBalance(address);
      setData(response.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetStakedWagBalanceHook; 