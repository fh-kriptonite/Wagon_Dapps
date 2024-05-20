import { useState } from 'react';
import { getPoolMaxSupplyService } from '../../../services/service_lending';

const useGetPoolMaxSupplyHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (poolId) => {
    setIsLoading(true);

    try {
        const response = await getPoolMaxSupplyService(poolId);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetPoolMaxSupplyHook;