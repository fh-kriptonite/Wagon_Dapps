import { useState } from 'react';
import { getStakingTotalStaked } from '../../../services/service_staking';
import { getCoinPriceService } from '../../../services/service_erc20';

const useGetTotalStakedHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dataInUsd, setDataInUsd] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
        const response = parseFloat(await getStakingTotalStaked()) / 1e18;
        setData(response);

        const wagPrice = (await getCoinPriceService("WAG")).data[0].usd_price;
        const responseInUsd = response * wagPrice;
        setDataInUsd(responseInUsd)
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, dataInUsd, error, fetchData };
};

export default useGetTotalStakedHook;