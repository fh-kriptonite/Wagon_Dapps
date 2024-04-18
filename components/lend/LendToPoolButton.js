import { Button } from 'flowbite-react';
import { useState } from 'react';
import LendToPoolDialog from './dialog/LendToPoolDialog';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ConfirmationLendToPoolDialog from './dialog/ConfirmationLendToPoolDialog';

export default function LendToPoolButton(props) {
  const { chainId } = useWeb3ModalAccount();

  const {fetchData: switchNetwork} = useSwitchNetworkHook();

  const pool = props.pool;
  const symbol = props.symbol;

  const [isOpen, setIsOpen] = useState(false)

  const [stableNumber, setStableNumber] = useState("")
  const [wagNumber, setWagNumber] = useState("")
  const [adminFee, setAdminFee] = useState(0)
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)

  async function openModal() {
    // switch network
    if(chainId != process.env.BNB_CHAIN_ID) {
      try {
        const resultSwitchNetwork = await switchNetwork(process.env.BNB_CHAIN_ID);
        if (resultSwitchNetwork.error) {
            throw resultSwitchNetwork.error
        }
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

  return (
    <div>
      <Button color={"dark"} size={"sm"} style={{width:"100%"}}
        onClick={openModal}
      >
        Lend To Pool
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
