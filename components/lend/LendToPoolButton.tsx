import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import LendToPoolDialog from './dialog/LendToPoolDialog';
import useSwitchNetworkHook from './utils/useSwitchNetworkHook';
import ConfirmationLendToPoolDialog from './dialog/ConfirmationLendToPoolDialog';
import { useParticleProvider } from '@particle-network/connectkit';
import { ethers } from 'ethers';
import { Pool, PoolFee, PoolJson } from './types';

interface LendToPoolButtonProps {
  pool: Pool;
  symbol: string;
  poolMaxSupply: string;
  poolSupply: string;
  decimal: number;
  poolJson: PoolJson;
  poolId: string;
  refreshUser: () => void;
  fees: PoolFee | null;
}

export default function LendToPoolButton({ pool, symbol, poolMaxSupply, poolSupply, decimal, poolJson, poolId, refreshUser, fees }: LendToPoolButtonProps) {
  const [chainId, setChainId] = useState<number | null>(null);
  const particleProvider = useParticleProvider();
    
  useEffect(() => {
    async function getChainId() {
      if (!particleProvider) return;
      const provider = new ethers.BrowserProvider(particleProvider as unknown as ethers.Eip1193Provider);
      const chain = await provider.getNetwork();
      setChainId(Number(chain.chainId));
    }
      
    getChainId();
  }, [particleProvider]);

  const { fetchData: switchNetwork } = useSwitchNetworkHook();

  const [isOpen, setIsOpen] = useState(false);
  const [stableNumber, setStableNumber] = useState("");
  const [wagNumber, setWagNumber] = useState("");
  const [adminFee, setAdminFee] = useState(0);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  async function openModal() {
    // switch network
    if (chainId != Number(process.env.BNB_CHAIN_ID)) {
      try {
        const resultSwitchNetwork = await switchNetwork(Number(process.env.BNB_CHAIN_ID));
        if (resultSwitchNetwork.error) {
          throw resultSwitchNetwork.error;
        }
        setChainId(resultSwitchNetwork.data);
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
    if (parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return true;
    if (poolSupply === poolMaxSupply) return true;
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
        className={`${handleDisableLendButton() ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'}`}
      >
        Lend Your Cryptocurrency
      </Button>

      <LendToPoolDialog 
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        pool={pool}
        poolJson={poolJson}
        symbol={symbol}
        fees={fees}
        decimal={decimal}
        chainId={chainId || 0}
        handleLend={handleLend}
      />

      <ConfirmationLendToPoolDialog 
        poolId={poolId}
        isOpen={isOpenConfirmation}
        pool={pool}
        poolJson={poolJson}
        symbol={symbol}
        closeModal={() => setIsOpenConfirmation(false)}
        refreshUser={refreshUser}
        decimal={decimal}
        stableNumber={stableNumber}
        adminFee={adminFee}
        wagNumber={wagNumber}
      />
    </div>
  );
} 