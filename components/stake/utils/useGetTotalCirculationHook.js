import { useState } from 'react';
import { getWagTotalSupply, getWagBalanceOf } from '../../../services/service_erc20';

const useGetTotalCirculationHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
        const totalSupply = parseFloat(await getWagTotalSupply()) / 1e18;
        const balanceOfStakingContract = parseFloat(await getWagBalanceOf(process.env.WAGON_STAKING_PROXY)) / 1e18;
        const balanceOfTeamFinanceContract = parseFloat(await getWagBalanceOf(process.env.WAGON_TEAM_FINANCE_LOCK)) / 1e18;

        setData(totalSupply - balanceOfStakingContract - balanceOfTeamFinanceContract);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetTotalCirculationHook;