import { useState } from 'react';
import { getWagBalanceOf } from '../../../services/service_erc20';

const useGetWagBalanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address) => {
    setIsLoading(true);

    try {
        const response = await getWagBalanceOf(address);
        setData(response);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetWagBalanceHook;