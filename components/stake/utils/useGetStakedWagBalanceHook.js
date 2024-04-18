import { useState } from 'react';
import { getStakingBalance } from '../../../services/service_staking';

const useGetStakedWagBalanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address) => {
    setIsLoading(true);

    try {
        const response = await getStakingBalance(address);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetStakedWagBalanceHook;