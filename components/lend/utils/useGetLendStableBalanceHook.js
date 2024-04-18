import { useState } from 'react';
import { getUserStableBalanceService } from '../../../services/service_lending';

const useGetLendStableBalanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address, poolId) => {
    setIsLoading(true);

    try {
        const response = await getUserStableBalanceService(address, poolId);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetLendStableBalanceHook;