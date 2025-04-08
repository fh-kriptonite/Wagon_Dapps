import { Button } from 'flowbite-react';
import { useEffect, useState } from "react";
import LendFiatToPoolDialog from './LendFiatToPoolDialog';
import LendFiatConfirmationDialog from './LendFiatConfirmationDialog';
import { useAccount } from '@particle-network/connectkit';
import axios from 'axios';
import { Pool, PoolJson, PoolFee } from '../types';

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
  poolMaxSupply: bigint;
  poolSupply: bigint;
  poolJson: PoolJson;
  symbol: string;
  fees: PoolFee | null;
  poolId: string;
  refreshUser: () => void;
}

export default function LendFiatToPoolButton(props: LendFiatToPoolButtonProps) {
  const address = useAccount();
  const pool = props.pool;

  const poolMaxSupply = props.poolMaxSupply;
  const poolSupply = props.poolSupply;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [onrampData, setOnrampData] = useState<OnrampData | null>(null);

  async function openModal(): Promise<void> {
    setIsOpen(true);
  }

  async function getAccount(): Promise<void> {
    setIsLoading(true);

    if (address == null) return;

    try {
      // Request Account
      const response = await axios.get(`/api/account/getAccount?wallet_address=${address}`);

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
    if (parseFloat(pool.collectionTermEnd) - (Date.now() / 1000) < 0) return true;
    if (poolSupply === poolMaxSupply) return true;
    return false;
  }

  async function handleLend(data: { amount: number; currency: string; paymentUrl: string }): Promise<void> {
    setOnrampData(data);
    setIsOpenConfirmation(true);
    setIsOpen(false);
  }

  return (
    <div>
      <Button 
        color="dark" 
        size="sm" 
        className="w-full disabled:bg-gray-300 hover:bg-gray-600"
        disabled={handleDisableLendButton()}
        onClick={openModal}
      >
        Lend Your FIAT
      </Button>

      <LendFiatToPoolDialog
        isOpen={isOpen}
        closeModal={() => { setIsOpen(false); }}
        handleLend={handleLend}
        profile={profile}
        pool={pool}
        poolJson={props.poolJson}
        symbol={props.symbol}
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
    </div>
  );
} 