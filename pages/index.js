import Disconnected from '../components/general/Disconnected';
import AccountComponent from '../components/account';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import Head from 'next/head';

export default function Home(props) {
  const { isConnected } = useWeb3ModalAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
      <Head>
        <title>Account | Wagon Network</title>
      </Head>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <AccountComponent {...props}/>
            </div>
        }
    </div>
  )
}