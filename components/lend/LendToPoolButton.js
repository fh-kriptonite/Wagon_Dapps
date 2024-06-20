import { Button } from 'flowbite-react';
import { useState } from 'react';
import LendToPoolDialog from './dialog/LendToPoolDialog';
import ConfirmationLendToPoolDialog from './dialog/ConfirmationLendToPoolDialog';
import { useWeb3WalletState } from '../general/web3WalletContext';
import useSwitchNetworkHook from "../../util/useSwitchNetworkHook"

export default function LendToPoolButton(props) {
  const { chainId } = useWeb3WalletState();

  const { isLoading: isLoadingSwitchNetwork, switchChain } = useSwitchNetworkHook();
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
    try {
      const resultSwitchNetwork = await switchChain(chainId, process.env.BNB_CHAIN_ID)
      if (resultSwitchNetwork.error) {
        throw resultSwitchNetwork.error
      }
    } catch (error) {
      console.log(error)
      return
    }
    
    setIsOpen(true)
  }

  function handleLend(stableNumber, wagNumber, adminFee) {
    setIsOpen(false);
    setIsOpenConfirmation(true);
    setStableNumber(stableNumber)
    setWagNumber(wagNumber)
    setAdminFee(adminFee)
  }

  function handleDisableLendButton() {
    if(isLoadingSwitchNetwork) return true
    if(parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return true
    if(poolSupply == poolMaxSupply) return true
    return false;
  }

  function handleLendButtonString() {
    if(isLoadingSwitchNetwork) return "Loading..."
    if(poolSupply == poolMaxSupply) return "Pool Fullfilled"
    if(parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return "Pool Collection Time Ended"
    return "Lend To Pool";
  }

  return (
    <div>
      <Button color={"dark"} size={"sm"} style={{width:"100%"}}
        disabled={handleDisableLendButton()}
        onClick={openModal}
      >
        {handleLendButtonString()}
      </Button>

      <div className='flex justify-between mt-2'>
        <p 
          onClick={()=>{window.open(`https://pancakeswap.finance/swap?outputCurrency=${pool.lendingCurrency}`, "buyIDRT");}}
          className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
        >
          Do you need more {symbol}?
        </p>

        <p 
          onClick={()=>{window.open(`https://pancakeswap.finance/swap?inputCurrency=${pool.lendingCurrency}&outputCurrency=${pool.pairingCurrency}`, "buyWAG");}}
          className="text-sm text-blue-500 hover:text-blue-800 hover:cursor-pointer w-fit"
        >
          Do you need more WAG?
        </p>
      </div>

      <LendToPoolDialog {...props} 
        isOpen={isOpen} 
        closeModal={()=>{setIsOpen(false)}}
        handleLend={handleLend}
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
