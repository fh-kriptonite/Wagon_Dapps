import { Button } from 'flowbite-react';
import { useEffect, useState } from "react";
import LendFiatToPoolDialog from './LendFiatToPoolDialog';
import LendFiatConfirmationDialog from './LendFiatConfirmationDialog';
import { useConnectedAddress } from '@/hooks/useConnectedAddress';
import axios from 'axios';
import { Pool, PoolFee } from '../types';
import { HiClock } from 'react-icons/hi2';
import { HistoryDialog } from '@/components/account/profile/tabs/HistoryDialog';
interface Profile {
  id: string;
  wallet_address: string;
  email: string;
  kyc_status: string;
  created_at: string;
  updated_at: string;
  status: number;
  full_name: string;
}

interface OnrampData {
  amount: number;
  currency: string;
  paymentUrl: string;
}

interface LendFiatToPoolButtonProps {
  pool: Pool;
  poolSupply: bigint;
  fees: PoolFee | null;
  poolId: string;
  refreshUser: () => void;
}

export default function LendFiatToPoolButton(props: LendFiatToPoolButtonProps) {
  const { connectedAddress: address } = useConnectedAddress();
  const pool = props.pool;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [onrampData, setOnrampData] = useState<OnrampData | null>(null);
  const [isOpenHistory, setIsOpenHistory] = useState<boolean>(false);
  async function openModal(): Promise<void> {
    setIsOpen(true);
  }

  async function getAccount(): Promise<void> {
    setIsLoading(true);

    if (address == null) return;

    try {
      // Request Account
      const response = await axios.get(process.env.WAGON_API_URL + `/api/accounts/wallet_address/${address}`);

      // Handle success response
      if (response.data.error) {
        throw response.data.error;
      }
      setProfile(response.data.data);
    } catch (error) {
      // Handle error response
      setProfile(null);
      console.error('Error getting profile:', error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getAccount();
  }, [address]);

  function handleDisableLendButton(): boolean {
    if (isLoading) return true;
    if (pool.collection_term_end - (Date.now() / 1000) < 0) return true;
    if (props.poolSupply === BigInt(pool.target_loan)) return true;
    return false;
  }

  async function handleLend(data: { amount: number; currency: string; paymentUrl: string }): Promise<void> {
    setOnrampData(data);
    setIsOpenConfirmation(true);
    setIsOpen(false);
  }

  async function handleShowHistory(): Promise<void> {
    setIsOpenHistory(true);
  }

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Button 
          color="dark" 
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
          disabled={handleDisableLendButton()}
          onClick={openModal}
        >
          Lend Your FIAT
        </Button>
        <Button
            color='light'
            onClick={handleShowHistory}
            className="w-full md:w-auto flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
            <HiClock className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </div>

      <LendFiatToPoolDialog
        isOpen={isOpen}
        closeModal={() => { setIsOpen(false); }}
        handleLend={handleLend}
        profile={profile}
        pool={pool}
        fees={props.fees}
        poolId={props.poolId}
      />

      <LendFiatConfirmationDialog
        isOpen={isOpenConfirmation}
        closeModal={() => { setIsOpenConfirmation(false); }}
        onrampData={onrampData}
        profile={profile}
        stableNumber={onrampData?.amount.toString() ?? ""}
      />

      <HistoryDialog
        isOpen={isOpenHistory}
        onClose={() => setIsOpenHistory(false)}
        txType="MINT"
      />
    </div>
  );
} 