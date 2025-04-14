import { useAccount } from '@particle-network/connectkit';
import { useState } from 'react';
const useChainHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { chainId } = useAccount()
  const fetchData = async () => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
        data = parseFloat(chainId);
    } catch (e) {
        console.log(e)
        error = "Fail to approve";
    } finally {
        setIsLoading(false);
    }

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useChainHook;