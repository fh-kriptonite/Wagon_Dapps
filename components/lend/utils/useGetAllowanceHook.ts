import { useState } from 'react';
import { getErc20Allowance } from '../../../services/service_erc20';

interface UseGetAllowanceHookResult {
  isLoading: boolean;
  data: bigint | null;
  error: string | null;
  fetchData: (address: string, erc20Address: string) => Promise<bigint | null>;
}

const useGetAllowanceHook = (): UseGetAllowanceHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string, erc20Address: string): Promise<bigint | null> => {
    setIsLoading(true);

    try {
      const lendingAddress = process.env.LENDING_ADDRESS_BNB;
      if (!lendingAddress) {
        throw new Error('LENDING_ADDRESS_BNB environment variable is not defined');
      }
      const response = await getErc20Allowance(address, lendingAddress, erc20Address);
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

export default useGetAllowanceHook; 