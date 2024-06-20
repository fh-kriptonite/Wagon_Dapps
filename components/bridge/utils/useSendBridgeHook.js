import { useState } from 'react';
import BRIDGE_ABI from "../../../public/ABI/bridge.json";
import { ethers, parseEther } from 'ethers';
import { getDestinationGasFeeService } from "../../../services/service_bridge.js"
import { useWeb3WalletState } from '../../general/web3WalletContext.js';

const useSendBridgeHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { getProviderTransaction } = useWeb3WalletState();
  
  const fetchData = async (network1, network2, address, amount) => {
    setIsLoading(true);

    let data = null;
    let error = null;

    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(getProviderTransaction())
      const signer = await provider.getSigner();
      
      // Contract ABI and Address
      const contractAddress = network1.OFTAddress;
      const contractABI = BRIDGE_ABI; // Your contract's ABI
      
      // Initialize contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const gas = await getDestinationGasFeeService(
        network2.lzEndpointId,
        network1.OFTAddress, 
        address, 
        network1.rpc,
        amount
      )
      
      // Call smart contract function
      const transaction = await contract.sendFrom(
        address,
        network2?.lzEndpointId,
        ethers.AbiCoder.defaultAbiCoder().encode(["address"], [address]),
        parseEther(`${amount}`).toString(),
        parseEther(`${amount}`).toString(),
        [
            address, 
            "0x0000000000000000000000000000000000000000", 
            ethers.solidityPacked(["uint16", "uint256"], [1, 200000])
        ],
        { value: ethers.parseEther(`${gas}`) }
      );
      
      // Wait for transaction confirmation
      await transaction.wait();
      data = transaction;
    } catch (e) {
      error = "Fail to bridge";
    } finally {
      setIsLoading(false);
    }

    return { data: data, error: error }
  };

  return { isLoading, fetchData };
};

export default useSendBridgeHook;