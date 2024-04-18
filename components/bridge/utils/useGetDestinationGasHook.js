import { useState } from 'react';
import { tokenToUsd } from "../../../services/service_erc20.js"
import { getDestinationGasFeeService } from "../../../services/service_bridge.js"

const useGetDestinationGasHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (network2, network1, address, amount) => {
    setIsLoading(true);

    try {
        const data = await getDestinationGasFeeService(
            network2.lzEndpointId,
            network1.OFTAddress, 
            address, 
            network1.rpc,
            amount
        )
        const gasInUsd = await tokenToUsd(data, network1.priceUrl, network1.chainId)

        setData(gasInUsd);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return { isLoading, data, error, fetchData };
};

export default useGetDestinationGasHook;