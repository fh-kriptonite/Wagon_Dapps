import { createContext, useState, useContext, useEffect } from 'react';
import { useWeb3Auth } from '@web3auth/modal-react-hooks'
import { useWalletServicesPlugin } from "@web3auth/wallet-services-plugin-react-hooks";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { Web3Auth } from '@web3auth/modal';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { getAddress, getChainId } from '../../util/web3Utility';

const Web3WalletContext = createContext();

export const Web3WalletProvider = ({ children }) => {
  const { isConnected: isConnectedWeb3Modal, address: addressWeb3Modal, chainId: chainIdWeb3Modal } = useWeb3ModalAccount();

  const [isLoading, setIsloading] = useState(true);
  const [isConnected, setIsConnected] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);

  const { initModal, provider, web3Auth, isConnected: isConnectedWeb3Auth,
    connect, authenticateUser, logout, addChain,
    switchChain, userInfo, isMFAEnabled, enableMFA,
    status, addAndSwitchChain } = useWeb3Auth();

  const { showCheckout, showWalletConnectScanner, showWalletUI, 
    plugin, isPluginConnected } = useWalletServicesPlugin();

  useEffect(()=>{
    setIsConnected(isConnectedWeb3Modal || isConnectedWeb3Auth)
  }, [])

  useEffect(()=>{
    setIsConnected(isConnectedWeb3Modal || isConnectedWeb3Auth)
    if(!isConnectedWeb3Auth) {
      setAddress(addressWeb3Modal)
      setChainId(chainIdWeb3Modal)
    }
  }, [isConnectedWeb3Modal, isConnectedWeb3Auth])

  useEffect(()=>{
    if(!isConnectedWeb3Auth) {
      setAddress(addressWeb3Modal)
    }
  }, [addressWeb3Modal])

  useEffect(()=>{
    if(!isConnectedWeb3Auth) {
      setChainId(chainIdWeb3Modal)
    }
  }, [chainIdWeb3Modal])

  // function modal account
  async function handleInit() {
    if(isConnectedWeb3Auth) {
      const address = await getAddress(provider);
      setAddress(address);
      const chainIdWeb3Auth = getChainId(provider);
      setChainId(chainIdWeb3Auth);
    } else {
      setAddress(addressWeb3Modal);
      setChainId(chainIdWeb3Modal);
    }
  }

  // initialize
  useEffect(() => {
    const init = async () => {
      try {
        setIsloading(true)
        if (web3Auth) {
          await initModal();
        }
        setIsloading(false)
      } catch (error) {
        console.error(error);
        setIsloading(false)
      }
    };
    
    init();
  }, [initModal, web3Auth]);

  useEffect(()=>{
    handleInit();
  }, [provider])

  function updateChainId(_chainId) {
    setChainId(_chainId)
  }

  function getProviderTransaction() {
    if(isConnectedWeb3Auth) {
      return provider;
    } else {
      return window.ethereum;
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <img src="/logo.png" className="h-24 animate-bounce" alt="Wagon Logo" />
    </div>
  )

  return (
    <Web3WalletContext.Provider value={{ isConnected, address, chainId, updateChainId, getProviderTransaction }}>
      {children}
    </Web3WalletContext.Provider>
  );
};

export const useWeb3WalletState = () => useContext(Web3WalletContext);
