import { useState } from 'react';
import { services } from '../../../services/service_lending';
import { PoolFee } from '../types';

interface UseGetPoolFeeHookResult {
  isLoading: boolean;
  data: PoolFee | null;
  error: string | null;
  fetchData: (poolId: string) => Promise<void>;
}

const useGetPoolFeeHook = (): UseGetPoolFeeHookResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<PoolFee | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await services.getPoolFee(poolId);
      setData({
        borrowerFee: response.borrowerFee,
        adminFee: response.adminFee,
        protocolFee: response.protocolFee,
        lateFee: response.lateFee,
        lateDuration: response.lateDuration,
        gracePeriodDuration: response.gracePeriodDuration
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetPoolFeeHook; 