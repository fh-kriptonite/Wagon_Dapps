import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import LendToPoolDialog from './dialog/LendToPoolDialog';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ConfirmationLendToPoolDialog from './dialog/ConfirmationLendToPoolDialog';
import { useParticleProvider } from '@particle-network/connectkit';
import { ethers } from 'ethers';

export default function LendToPoolButton(props) {
  const [chainId, setChainId] = useState(null);
  const particleProvider = useParticleProvider();
    
  useEffect(()=>{
      async function getChainId() {
          const provider = new ethers.BrowserProvider(particleProvider);
          const chain = await provider.getNetwork()
          setChainId(parseFloat(chain.chainId));
      }
      
      getChainId();
  }, [])

  const {fetchData: switchNetwork} = useSwitchNetworkHook();

  const pool = props.pool;
  const symbol = props.symbol;

  const [isOpen, setIsOpen] = useState(false)

  const [stableNumber, setStableNumber] = useState("")
  const [wagNumber, setWagNumber] = useState("")
  const [adminFee, setAdminFee] = useState(0)
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)

  const poolMaxSupply = props.poolMaxSupply;
  const poolSupply = props.poolSupply;

  async function openModal() {
    // switch network
    if(chainId != process.env.BNB_CHAIN_ID) {
      try {
        const resultSwitchNetwork = await switchNetwork(process.env.BNB_CHAIN_ID);
        if (resultSwitchNetwork.error) {
            throw resultSwitchNetwork.error
        }
        setChainId(resultSwitchNetwork.data)
        setIsOpen(true)
      } catch (error) {
        console.log(error)
        return
      }
    } else {
      setIsOpen(true)
    }
  }

  function handleLend(stableNumber, wagNumber, adminFee) {
    setIsOpen(false);
    setIsOpenConfirmation(true);
    setStableNumber(stableNumber)
    setWagNumber(wagNumber)
    setAdminFee(adminFee)
  }

  function handleDisableLendButton() {
    if(parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return true
    if(poolSupply == poolMaxSupply) return true
    return false;
  }

  function showWagPair() {
    if(pool) return false;
    if(pool.stabletoPairRate == 0) return false

    return true;
  }

  return (
    <div>
      <Button color={"dark"} size={"sm"} style={{width:"100%"}}
        disabled={handleDisableLendButton()}
        onClick={openModal}
      >
        Lend Your Cryptocurrency
      </Button>

      <div className='flex justify-between mt-2'>
        <div>
          <p 
            onClick={()=>{window.open(`https://pancakeswap.finance/swap?outputCurrency=${pool.lendingCurrency}`, `buy${symbol}`);}}
            className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
          >
            Do you need more {symbol}?
          </p>
        </div>

        <div>
          {
            showWagPair() &&
            <p 
              onClick={()=>{window.open(`https://pancakeswap.finance/swap?inputCurrency=${pool.lendingCurrency}&outputCurrency=${pool.pairingCurrency}`, "buyWAG");}}
              className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
            >
              Do you need more WAG?
            </p>
          }
        </div>
      </div>

      <LendToPoolDialog {...props} 
        isOpen={isOpen} 
        closeModal={()=>{setIsOpen(false)}}
        handleLend={handleLend}
        chainId={chainId}
      />

      <ConfirmationLendToPoolDialog {...props} 
        isOpen={isOpenConfirmation} 
        closeModal={()=>{setIsOpenConfirmation(false)}}
        stableNumber={stableNumber}
        wagNumber={wagNumber}
        adminFee={adminFee}
      />
    </div>
  )
}
