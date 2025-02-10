import { useState } from 'react';
import { getDeploymentGracePeriodService } from '../../../services/service_lending';

const useGetDeploymentGracePeriodHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (poolId) => {
    setIsLoading(true);

    try {
        const response = await getDeploymentGracePeriodService(poolId);
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

export default useGetDeploymentGracePeriodHook;