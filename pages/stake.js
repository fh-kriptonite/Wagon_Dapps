import StakeComponent from '../components/stake/index';
import Disconnected from '../components/general/Disconnected';
import Head from 'next/head';
import { checkConnected } from '../util/web3Utility';

export default function Stake(props) {
  const isConnected = checkConnected();

  return (
    <div className='container mx-auto px-4 md:px-10 h-full'>
        <Head>
          <title>Stake | Wagon Network</title>
        </Head>
        {
            !isConnected 
            ? <div className='h-full'>
                <Disconnected {...props}/>
              </div>
            : <div>
                <StakeComponent {...props}/>
            </div>
        }
    </div>
  )
}