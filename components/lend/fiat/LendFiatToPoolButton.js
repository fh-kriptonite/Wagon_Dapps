import { Button } from 'flowbite-react';
import { useEffect, useState } from "react";
import LendFiatToPoolDialog from './LendFiatToPoolDialog';
import LendFiatConfirmationDialog from './LendFiatConfirmationDialog';
import { useAccount } from '@particle-network/connectkit';
import axios from 'axios';

export default function LendFiatToPoolButton(props) {
  const address = useAccount();
  const pool = props.pool;

  const poolMaxSupply = props.poolMaxSupply;
  const poolSupply = props.poolSupply;

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [onrampData, setOnrampData] = useState(null);

  async function openModal() {
    setIsOpen(true)
  }

  async function getAccount() {
    setIsLoading(true);

    if (address == null) return;

    try {
        // Request Account
        const response = await axios.get(`/api/account/getAccount?wallet_address=${address}`);
        console.log(response)

        // Handle success response
        if(response.error) {
            throw response.error
        }
        setProfile(response.data.data)
    } catch (error) {
        // Handle error response
        setProfile(null);
        console.error('Error getting profile:', error);
    }

    setIsLoading(false);
}

  useEffect(()=>{
    getAccount();
  },[address])

  function handleDisableLendButton() {
    if(isLoading) return true;
    if(parseFloat(pool.collectionTermEnd) - (Date.now()/1000) < 0) return true
    if(poolSupply == poolMaxSupply) return true
    return false;
  }

  async function handleLend(data) {
    setOnrampData(data)
    setIsOpenConfirmation(true)
    setIsOpen(false)
  }

  return (
    <div>
      <Button color={"dark"} style={{width:"100%"}}
        disabled={handleDisableLendButton()}
        onClick={openModal}
      >
        Lend Your FIAT
      </Button>

      <LendFiatToPoolDialog {...props}
        isOpen={isOpen}
        closeModal={()=>{setIsOpen(false)}}
        handleLend={handleLend}
        profile={profile}
      />

      <LendFiatConfirmationDialog {...props}
        isOpen={isOpenConfirmation}
        closeModal={()=>{setIsOpenConfirmation(false)}}
        onrampData={onrampData}
        profile={profile}
      />
      
    </div>
  )
}
