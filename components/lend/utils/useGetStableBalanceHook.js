import { useState } from 'react';
import { getErc20BalanceService } from '../../../services/service_erc20';

const useGetStableBalanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(0);
  const [error, setError] = useState(null);

  const fetchData = async (chainId, address, erc20Address) => {
    setIsLoading(true);

    try {
        const response = await getErc20BalanceService(chainId, address, erc20Address);
        setData(response);
    } catch (e) {
        console.log(e)
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetStableBalanceHook;