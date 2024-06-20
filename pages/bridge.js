import Disconnected from '../components/general/Disconnected';
import BridgeCard from '../components/bridge/BridgeCard';
import Head from 'next/head';
import { checkConnected } from '../util/web3Utility';

export default function Bridge(props) {
  const isConnected = checkConnected();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Bridge | Wagon Network</title>
        </Head>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <BridgeCard {...props}/>
            </div>
        }
    </div>
  )
}