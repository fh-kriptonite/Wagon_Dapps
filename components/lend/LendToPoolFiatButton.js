import { Button } from 'flowbite-react';
import { useState } from 'react';
import LendToPoolFiatDialog from './dialog/LendToPoolFiatDialog';
import ConfirmationLendToPoolFiatDialog from './dialog/ConfirmationLendToPoolFiatDialog';

export default function LendToPoolFiatButton(props) {
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
    if(parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return true
    if(poolSupply == poolMaxSupply) return true
    return false;
  }

  return (
    <div>
      <Button color={"dark"} size={"sm"} style={{width:"100%"}}
        // disabled={handleDisableLendButton()}
        onClick={openModal}
      >
        Lend To Pool with FIAT
      </Button>

      <LendToPoolFiatDialog {...props} 
        isOpen={isOpen} 
        closeModal={()=>{setIsOpen(false)}}
        handleLend={handleLend}
      />

      <ConfirmationLendToPoolFiatDialog {...props} 
        isOpen={isOpenConfirmation} 
        closeModal={()=>{setIsOpenConfirmation(false)}}
        stableNumber={stableNumber}
        wagNumber={wagNumber}
        adminFee={adminFee}
      />
    </div>
  )
}
