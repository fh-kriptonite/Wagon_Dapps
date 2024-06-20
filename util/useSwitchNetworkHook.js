import { useState } from 'react';
import { useSwitchNetwork } from "@web3modal/ethers/react";
import { useWeb3Auth } from '@web3auth/modal-react-hooks';
import { getChainConfigById } from './chainCofigs';
import { useWeb3WalletState } from '../components/general/web3WalletContext';

const useSwitchNetworkHook = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { switchNetwork } = useSwitchNetwork();
  const { addAndSwitchChain, isConnected: isConnectedWeb3Auth } = useWeb3Auth();
  const { updateChainId } = useWeb3WalletState();

  const switchChain = async (currentChainId, targetChainId) => {
    setIsLoading(true);

    let data = null;
    let error = null;
    
    try {
      if(currentChainId != targetChainId) {
        if(isConnectedWeb3Auth) {
          const chainCofig = getChainConfigById(targetChainId);
          await addAndSwitchChain(chainCofig);
        } else {
          await switchNetwork(parseInt(targetChainId));
        }
        updateChainId(targetChainId);
        data = targetChainId;
      }
    } catch (e) {
      console.log(e)
      error = "Failed to switch network";
    } finally {
      setIsLoading(false);
    }

    return{data: data, error: error};
  }

  return { isLoading, switchChain };
};

export default useSwitchNetworkHook;
