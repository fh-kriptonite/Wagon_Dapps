import { useState } from 'react';
import { getWagTotalSupply, getWagBalanceOf } from '../../../services/service_erc20';

interface UseGetTotalCirculationHookResult {
  isLoading: boolean;
  data: number | null;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useGetTotalCirculationHook = (): UseGetTotalCirculationHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const totalSupply = parseFloat((await getWagTotalSupply()).toString()) / 1e18;
      const stakingProxy = process.env.WAGON_STAKING_PROXY;
      const teamFinanceLock = process.env.WAGON_TEAM_FINANCE_LOCK;

      if (!stakingProxy || !teamFinanceLock) {
        throw new Error('Environment variables not properly configured');
      }

      const balanceOfStakingContract = parseFloat((await getWagBalanceOf(stakingProxy)).toString()) / 1e18;
      const balanceOfTeamFinanceContract = parseFloat((await getWagBalanceOf(teamFinanceLock)).toString()) / 1e18;

      setData(totalSupply - balanceOfStakingContract - balanceOfTeamFinanceContract);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetTotalCirculationHook; 