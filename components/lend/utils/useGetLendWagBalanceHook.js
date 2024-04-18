import { useState } from 'react';
import { getWagLockedService } from '../../../services/service_lending';

const useGetLendWagBalanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address, poolId) => {
    setIsLoading(true);

    try {
        const response = await getWagLockedService(address, poolId);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetLendWagBalanceHook;