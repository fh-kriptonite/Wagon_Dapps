import { useState } from 'react';
import { getWagAllowance } from '../../../services/service_erc20';

interface UseGetWagAllowanceHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string) => Promise<bigint | undefined>;
}

const useGetWagAllowanceHook = (): UseGetWagAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<bigint | undefined> => {
    setIsLoading(true);

    try {
      const response = await getWagAllowance(address, process.env.WAGON_STAKING_PROXY || '');
      setData(response);
      return response;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetWagAllowanceHook; 