import { Button } from 'flowbite-react';
import { useState } from 'react';
import LendToPoolDialog from './dialog/LendToPoolDialog';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ConfirmationLendToPoolDialog from './dialog/ConfirmationLendToPoolDialog';
import { Pool, PoolFee } from './types';
import { useAccount } from '@particle-network/connectkit';
interface LendToPoolButtonProps {
  pool: Pool;
  poolSupply: string;
  poolId: string;
  refreshUser: () => void;
  fees: PoolFee | null;
}

export default function LendToPoolButton({ pool, poolSupply, poolId, refreshUser, fees }: LendToPoolButtonProps) {
  const { chainId } = useAccount()

  const { fetchData: switchNetwork } = useSwitchNetworkHook();

  const [isOpen, setIsOpen] = useState(false);
  const [stableNumber, setStableNumber] = useState("");
  const [wagNumber, setWagNumber] = useState("");
  const [adminFee, setAdminFee] = useState(0);
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

  function handleLend(stableNumber: string, wagNumber: string, adminFee: number) {
    setIsOpen(false);
    setIsOpenConfirmation(true);
    setStableNumber(stableNumber);
    setWagNumber(wagNumber);
    setAdminFee(adminFee);
  }

  function handleDisableLendButton(): boolean {
    if (pool.collection_term_end - (Date.now()/1000) < 0) return true;
    if (poolSupply === pool.target_loan) return true;
    return false;
  }

  return (
    <div>
      <Button 
        color="dark" 
        size="sm" 
        style={{width:"100%"}}
        disabled={handleDisableLendButton()}
        onClick={openModal}
        className={`${handleDisableLendButton() ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
      >
        Lend Your Cryptocurrency
      </Button>

      <LendToPoolDialog 
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        pool={pool}
        fees={fees}
        handleLend={handleLend}
      />

      <ConfirmationLendToPoolDialog 
        poolId={poolId}
        isOpen={isOpenConfirmation}
        pool={pool}
        closeModal={() => setIsOpenConfirmation(false)}
        refreshUser={refreshUser}
        stableNumber={stableNumber}
        adminFee={adminFee}
        wagNumber={wagNumber}
      />
    </div>
  );
} 