import { useState } from 'react';
import { allowanceErc20Service } from "../../../services/service_erc20.js"

const useCheckAllowanceHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchData = async (network, address) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      const allowance = await allowanceErc20Service(network.wagAddress, address, network.OFTAddress, network.rpc);
      data = allowance;
    } catch (e) {
      error = "Fail to get allowance";
    } finally {
      setIsLoading(false);
    }

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useCheckAllowanceHook;