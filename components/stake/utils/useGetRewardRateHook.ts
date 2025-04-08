import { useState } from 'react';
import { getStakingRewardRate, getStakingFinishAt } from '../../../services/service_staking';

interface UseGetRewardRateHookResult {
  isLoading: boolean;
  data: number | null;
  dataFinishAt: Date | null;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useGetRewardRateHook = (): UseGetRewardRateHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<number | null>(null);
  const [dataFinishAt, setDataFinishAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await getStakingRewardRate();
      setData(parseFloat(response));

      const responseFinishAt = await getStakingFinishAt();
      setDataFinishAt(new Date(parseFloat(responseFinishAt) * 1000));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, dataFinishAt, error, fetchData };
};

export default useGetRewardRateHook; 