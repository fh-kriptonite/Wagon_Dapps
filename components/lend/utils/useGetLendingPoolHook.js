import { useState } from 'react';
import { getPoolService } from '../../../services/service_lending';

const useGetLendingPoolHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address) => {
    setIsLoading(true);

    try {
        const response = await getPoolService(address);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetLendingPoolHook;