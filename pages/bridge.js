import Disconnected from '../components/general/Disconnected';
import BridgeCard from '../components/bridge/BridgeCard';
import Head from 'next/head';
import { useAccount } from '@particle-network/connectkit';

export default function Bridge(props) {
  const account = useAccount();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Bridge | Wagon Network</title>
        </Head>
        {
            !account 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div className='h-full'>
                <BridgeCard {...props}/>
            </div>
        }
    </div>
  )
}