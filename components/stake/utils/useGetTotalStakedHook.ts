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
    setError(null); // Clear previous errors

    try {
      const response = parseFloat((await getStakingTotalStaked()).toString()) / 1e18;
      setData(response);

      const wagPriceData = await getCoinPriceService("WAG");
      // Handle both possible data structures: data[0].usd_price or data.usd_price
      const wagPrice = Array.isArray(wagPriceData.data) 
        ? wagPriceData.data[0]?.usd_price 
        : wagPriceData.data?.usd_price;
      
      if (wagPrice) {
        const responseInUsd = response * wagPrice;
        setDataInUsd(responseInUsd);
      } else {
        console.warn('WAG price not available, USD conversion skipped');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred while fetching data';
      setError(errorMessage);
      console.error('Error in useGetTotalStakedHook:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, dataInUsd, error, fetchData };
};

export default useGetTotalStakedHook; 