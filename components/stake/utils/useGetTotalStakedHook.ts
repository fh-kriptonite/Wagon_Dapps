import { useState } from 'react';
import { getStakingTotalStaked } from '../../../services/service_staking';
import { getCoinPriceService } from '../../../services/service_erc20';

interface UseGetTotalStakedHookResult {
  isLoading: boolean;
  data: number | null;
  dataInUsd: number | null;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useGetTotalStakedHook = (): UseGetTotalStakedHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<number | null>(null);
  const [dataInUsd, setDataInUsd] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = parseFloat((await getStakingTotalStaked()).toString()) / 1e18;
      setData(response);

      const wagPrice = (await getCoinPriceService("WAG")).data[0].usd_price;
      const responseInUsd = response * wagPrice;
      setDataInUsd(responseInUsd);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, dataInUsd, error, fetchData };
};

export default useGetTotalStakedHook; 