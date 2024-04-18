import { useState } from 'react';
import { getWagAllowance } from '../../../services/service_erc20';

const useGetWagAllowanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address) => {
    setIsLoading(true);

    try {
        const response = await getWagAllowance(address, process.env.WAGON_STAKING_PROXY);
        setData(response);
        return response;
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetWagAllowanceHook;