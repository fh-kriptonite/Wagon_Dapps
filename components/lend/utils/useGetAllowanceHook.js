import { useState } from 'react';
import { getErc20Allowance } from '../../../services/service_erc20';

const useGetAllowanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address, erc20Address) => {
    setIsLoading(true);

    try {
        const response = await getErc20Allowance(address, process.env.LENDING_ADDRESS_BNB, erc20Address);
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

export default useGetAllowanceHook;