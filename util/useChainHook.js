import { useParticleProvider } from "@particle-network/connectkit";
import { ethers } from "ethers";
import { useState } from 'react';

const useChainHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const particleProvider = useParticleProvider();

  const fetchData = async () => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
        const provider = new ethers.BrowserProvider(particleProvider);
        const chain = await provider.getNetwork();
        data = parseFloat(chain.chainId);
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