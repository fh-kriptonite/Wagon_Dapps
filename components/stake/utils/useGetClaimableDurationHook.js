import { useState } from 'react';
import { getClaimableDurationService } from '../../../services/service_staking';

const useGetClaimableDurationHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
        const response = await getClaimableDurationService();
        setData(parseFloat(response));
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetClaimableDurationHook;