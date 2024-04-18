import { useState } from 'react';
import { getUserTotalRewardClaimedService } from '../../../services/service_staking';

const useGetTotalEarnHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address) => {
    setIsLoading(true);

    try {
        const response = await getUserTotalRewardClaimedService(address);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetTotalEarnHook;