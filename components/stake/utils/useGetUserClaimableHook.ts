import { useState } from 'react';
import { getClaimableBalance } from '../../../services/service_staking';

interface ClaimableData {
  0: bigint;  // start time
  1: bigint;  // end time
  2: bigint;  // amount
}

interface UseGetUserClaimableHookResult {
  isLoading: boolean;
  data: ClaimableData | null;
  error: string | null;
  fetchData: (address: string) => Promise<void>;
}

const useGetUserClaimableHook = (): UseGetUserClaimableHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ClaimableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (address: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getClaimableBalance(address);
      setData(response as unknown as ClaimableData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetUserClaimableHook; 