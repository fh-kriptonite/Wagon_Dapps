import { Button } from 'flowbite-react';
import { useState } from 'react';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import { Pool, PoolFee } from './types';
import { useAccount } from '@particle-network/connectkit';
import SellPoolDialog from './dialog/SellPoolDialog';
import ConfirmationSellPoolDialog from './dialog/ConfirmationSellPoolDialog';

interface SellPoolButtonProps {
  pool: Pool;
  poolSupply: string;
  poolId: string;
  refreshUser: () => void;
  fees: PoolFee | null;
  stableBalance: string | null;
}

export default function SellPoolButton({ pool, poolSupply, poolId, refreshUser, fees, stableBalance }: SellPoolButtonProps) {
  const { chainId } = useAccount()

  const { fetchData: switchNetwork } = useSwitchNetworkHook();

  const [isOpen, setIsOpen] = useState(false);
  const [stableNumber, setStableNumber] = useState("");
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  async function openModal() {
    // switch network
    if (chainId != pool.contract.network_id) {
      try {
        const resultSwitchNetwork = await switchNetwork(pool.contract.network_id);
        if (resultSwitchNetwork.error) {
          throw resultSwitchNetwork.error;
        }
        setIsOpen(true);
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      setIsOpen(true);
    }
  }

  function handleSell(stableNumber: string) {
    setIsOpen(false);
    setIsOpenConfirmation(true);
    setStableNumber(stableNumber);
  }

  function handleDisableSellButton() {
    if(stableBalance == null || parseFloat(stableBalance) == 0) return true;
    return false;
  }

  return (
    <div>
      <Button 
        color="dark" 
        size="sm"
        disabled={handleDisableSellButton()}
        // disabled={true}
        onClick={openModal}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:hover:bg-gray-300 disabled:cursor-not-allowed'
      >
        List for Sale
      </Button>

      <SellPoolDialog 
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        pool={pool}
        fees={fees}
        handleSell={handleSell}
        stableBalance={stableBalance}
      />

      <ConfirmationSellPoolDialog 
        poolId={poolId}
        isOpen={isOpenConfirmation}
        pool={pool}
        closeModal={() => setIsOpenConfirmation(false)}
        refreshUser={refreshUser}
        stableNumber={stableNumber}
      />
    </div>
  );
} 