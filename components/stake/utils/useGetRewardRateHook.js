import { useState } from 'react';
import { getStakingRewardRate, getStakingFinishAt } from '../../../services/service_staking';

const useGetRewardRateHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dataFinishAt, setDataFinishAt] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
        const response = await getStakingRewardRate();
        setData(parseFloat(response));

        const responseFinishAt = await getStakingFinishAt();
        setDataFinishAt(new Date(parseFloat(responseFinishAt) * 1000));
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, dataFinishAt, error, fetchData };
};

export default useGetRewardRateHook;