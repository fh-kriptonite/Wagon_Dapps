import { useState } from 'react';

interface PoolJson {
  name: string;
  sub_name: string;
  image: string;
  properties: {
    principal: number;
    APY: number;
    term: string;
    currency: string;
    rating: number;
    type: string;
  };
}

interface UseGetOffchainPoolJsonHookResult {
  isLoading: boolean;
  data: PoolJson | null;
  error: string | null;
  fetchData: (poolId: string) => Promise<void>;
}

const useGetOffchainPoolJsonHook = (): UseGetOffchainPoolJsonHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PoolJson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (poolId: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(`/pools-offchain/${poolId.replace('off-', '')}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await response.json();
      setData(json);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetOffchainPoolJsonHook; 