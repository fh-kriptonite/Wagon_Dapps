import { useState } from 'react';
import { getLatestInterestClaimedService } from '../../../services/service_lending';

const useGetLatestInterestClaimedHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (address, poolId) => {
    setIsLoading(true);

    try {
        const response = await getLatestInterestClaimedService(address, poolId);
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

export default useGetLatestInterestClaimedHook;